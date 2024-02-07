const router = require('express').Router();
var request = require('request');
const util = require('util')
const fs = require('fs')
const textToSpeech = require('@google-cloud/text-to-speech')
require('dotenv').config()

const client = new textToSpeech.TextToSpeechClient()
const url = process.env.MONGO_URI; //MONGO_URI must be defined in the .env file


const { MongoClient } = require('mongodb');
const { Readable } = require('stream');
var assert = require('assert');

async function uploadFileToGridFS(filePath,word) {
  const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
  try {
    await client.connect();
    const db = client.db('mydb');
    const bucket = new MongoClient.GridFSBucket(db);
    const readableStream = new Readable({
      read() {
        this.push(fs.readFileSync(filePath));
        this.push(null);
      }
    });
    const uploadStream = bucket.openUploadStream(filePath, {
        metadata: {
          text: word
        }
      });
    readableStream.pipe(uploadStream);
    return new Promise((resolve, reject) => {
      uploadStream.on('finish', resolve);
      uploadStream.on('error', reject);
    });
  } finally {
    await client.close();
  }
}

// router.get('/audio/:word',(req,res)=>{
//     console.log("inside audio request")
//     var text = req.params.word
//     var languageCode = 'hi-in' //need to get it from the frontend post req
//     var ssmlVoice = 'FEMALE'    //need to capture it from frontend post req
//     if(true){
//         //search in MOngoDb
//     }
//     else{
//         async function convertTextToMp3(){
//             const text = req.params.word 
//             const request = {
//                 input : {text : text},
//                 voice : {languageCode : languageCode, ssmlGender : ssmlVoice},
//                 audioConfig : {audioEncoding : 'MP3'}
//             }
//             const[response] = await client.synthesizeSpeech(request)
//             const writeFile = util.promisify(fs.writeFile)
//             await writeFile(text+".mp3",response.audioContent,'binary')
//             console.log("Text to speech is done.")
//             var path = require('path')
//             res.setHeader('Content-Type', 'application/json')
//             var finalOutput = path.resolve(text+'.mp3')
//             console.log(finalOutput)
//             await uploadFileToGridFS(finalOutput, text);
//             res.status(200).json({source : finalOutput})
//         }
//     convertTextToMp3()
//     }
// })
router.get('/audio/:word',(req,res)=>{
  var text = req.params.word
  var languageCode = req.query.lang;
  console.log("langauge code is : ",languageCode)
  console.log(req.params.word)
  console.log("inside audio request")
  console.log()
  var path = require('path')
  var fullpath = path.resolve('google_Audios/'+text+'_'+languageCode+'.mp3')
  console.log(fullpath);
  if(fullpath){
    res.sendFile(fullpath)
  }
  else{
    console.log("Audio file not found")
    res.statusCode(404).error("file not found")
  }
})

router.route('/:word').get((req, res) => {
    var options = {
        'method': 'GET',
        'url': 'https://us-east-1.aws.data.mongodb-api.com/app/dictionary-eokle/endpoint/getData?word='+req.params.word,
        'headers': {
          'apiKey': 'uIb0LAUBMoAaPQT0vrvtZd7CCgGWw7W821WzrycbiwVrv3UuK3p6vY1pssCh3jb6'
        }
    };
    request(options, function (error, response) {
        console.log("google audio found : ",response.hasOwnProperty('GoogleAudio'))
        var outerResponse = response
        if(outerResponse.hasOwnProperty('GoogleAudio')){
            res.send(response)
        }
        else{
            var text = req.params.word
            var languageCode = 'hi-in';
            var ssmlVoice = 'FEMALE'; 
            async function convertTextToMp3(){
                const text = req.params.word 
                const request = {
                    input : {text : text},
                    voice : {languageCode : languageCode, ssmlGender : ssmlVoice},
                    audioConfig : {audioEncoding : 'MP3'}
                }
                const[response] = await client.synthesizeSpeech(request)
                const writeFile = util.promisify(fs.writeFile)
                await writeFile('google_Audios/'+ text +".mp3",response.audioContent,'binary')
                console.log("Text to speech is done.")
                var path = require('path')
                outerResponse['GoogleAudio'] = path.resolve('google_Audios/'+text+'.mp3')
                //make a post request of the response to the

            }
            convertTextToMp3()
        }
        res.send(response)
    });
});


module.exports = router;