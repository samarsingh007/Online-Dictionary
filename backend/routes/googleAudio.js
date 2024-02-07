const util = require('util')
const fs = require('fs')
const express = require('express')
const { SsmlBuilder} = require('ssml-builder')

const textToSpeech = require('@google-cloud/text-to-speech')

require('dotenv').config()

const router = express.Router()

const client = new textToSpeech.TextToSpeechClient()

router.get('/',(req,res)=>{
    res.json({mssg : 'Inside the workouts.js file get method'})
})


router.get('/:word',(req,res)=>{
    var text = req.params.word
    var languageCode = 'hi-in' //need to get it from the frontend post req
    var ssmlVoice = 'FEMALE'    //need to capture it from frontend post req
    async function convertTextToMp3(){
        const text = req.params.word 
        const request = {
            input : {text : text},
            voice : {languageCode : languageCode, ssmlGender : ssmlVoice},
            audioConfig : {audioEncoding : 'MP3'}
        }
        const[response] = await client.synthesizeSpeech(request)
        const writeFile = util.promisify(fs.writeFile)
        await writeFile("Output_audio/output.mp3",response.audioContent,'binary')
        console.log("Text to speech is done.")
        var path = require('path')
        res.sendFile(path.resolve('Output_audio/output.mp3'))
    }
    convertTextToMp3()
})

router.post('/',(req,res)=>{
    res.json({mssg : 'This is a post req'})
})

router.delete('/:word',(req,res)=>{
    res.json({mssg : 'This is a delete req'})
})

router.patch('/:id',(req,res)=>{
    res.json({mssg : 'This is a update req'})
})


module.exports = router