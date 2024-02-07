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
    console.log("Inside wordaudio")
    async function convertTextToMp3(){
        const phenotics = decodeURI(req.params.word)
        const ssml = `<speak><phoneme alphabet="ipa" ph= "`+ phenotics + `">Pro</phoneme></speak>`;
        const request = {
            input : {ssml},
            voice : {languageCode : 'en-US',ssmlGender : 'NEUTRAL'},
            audioConfig : {audioEncoding : 'MP3'}
        }
        const[response] = await client.synthesizeSpeech(request)
        const writeFile = util.promisify(fs.writeFile)
        await writeFile("Output_audio/output.mp3",response.audioContent,'binary')
        console.log("Text to speech is done.")
        var path = require('path')
        console.log(path)
        res.sendFile(path.resolve('Output_audio/output.mp3'))
    }
    convertTextToMp3()
})

module.exports = router