const express = require('express')
const cors = require('cors');
const axios = require('axios')
const app = express()
app.use(cors());
const util = require('util')
const fs = require('fs')
const request = require('request')
const path = require('path')
const TextToIPA = require('text-to-ipa');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const textToSpeech = require('@google-cloud/text-to-speech')
require('dotenv').config()
const client = new textToSpeech.TextToSpeechClient()
let count = 0;

function logWord(word, wordFound, meaning = [null, null]) {
    let data = JSON.stringify({
        "selector": {
            "_id": `word_logs:${word}`
        }
    });

    let selectConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary/_find',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
        },
        data: data
    };

    var d = new Date();
    var currentDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();

    let insertConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
        },
        data: {
            "_id": `word_logs:${word}`,
            "word": word,
            "type": "word_logs",
            "wordFound": wordFound,
            "date": currentDate,
            "pos": meaning[0],
            "meaning": meaning[1],
            "trendingWord": false,
            "count": 1,
        }
    };


    console.log('word logs function')
    axios.request(selectConfig)
        .then((response) => {
            let count = 1
            if (response.data.docs[0]) {
                insertConfig.data['_id'] = response.data.docs[0]._id
                insertConfig.data['_rev'] = response.data.docs[0]._rev
                if (response.data.docs[0].date == currentDate)
                    insertConfig.data.count = response.data.docs[0].count + 1
            }

            axios.request(insertConfig)
                .then((response) => {
                    console.log('inserted word log ', JSON.stringify(insertConfig))
                    console.log((response.data));
                })
                .catch((error) => {
                    console.log(error);
                });

        })
        .catch((error) => {
            console.log(error);
        });


};




function createGoogleAudio(responseToReact, word, languageCode = 'en-US') {
    var outerResponse = responseToReact
    var text = word
    var languageCode = languageCode;
    var ssmlVoice = 'MALE';

    const filePath = path.resolve('google_audios', `${text}_${languageCode}.mp3`);

    console.log(filePath);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.log("creating a new audio file");
            convertTextToMp3(text, languageCode, ssmlVoice)

        } else {
            console.log("the audio file already exists");
        }
      });


    async function convertTextToMp3(word, languageCode, ssmlVoice) {
        const text = word
        const googlerequest = {
            input: { text: text },
            voice: { languageCode: languageCode, ssmlGender: ssmlVoice },
            audioConfig: { audioEncoding: 'MP3' }
        }
        const [response] = await client.synthesizeSpeech(googlerequest)
        const writeFile = util.promisify(fs.writeFile)
        await writeFile('google_Audios/' + text + '_' + languageCode+ ".mp3", response.audioContent, 'binary')
        var path = require('path')
        var options = {
            'method': 'POST',
            'url': 'https://us-east-1.aws.data.mongodb-api.com/app/dictionary-eokle/endpoint/addGoogleAudio',
            'headers': {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "word": word,
                "googleAudioLink": path.resolve('google_Audios/' + text + '.mp3')
            })

        };
        request(options, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body);
        });

    }
}

function handleDictionaryData(word, response, body, languageCode, ipa) {
    const responseToReact = { "word": word, "meanings": [] };
    map = {
        "intj": "interjection", "adj": "adjective", "adv": "adverb", "prep": "preposition",
        "pron": "pronoun", "conj": "conjunction", "det": "determiner"
    }
    for (const pos of body.usage) {
        const meaning = {};
        // part of speech added to response
        meaning.pos = map[pos.pos.toLowerCase()] || pos.pos;
        meaning.definitions = [];

        // meanings added to response
        for (const definition of pos.definitions.slice(0, 5)) {
            const def = {};
            def.meaning = definition.definition.gloss;
            def.source = "Wiktionary";
            if (definition.examples[0] && definition.examples[0].text) {
                def.usage = definition.examples[0].text;
            }
            meaning.definitions.push(def);
        }

        // audio data added to response
        let audio = {};
        if (pos.audio && pos.audio[0] && pos.audio[0].audioLink) {
            audio.audioLink = pos.audio[0].audioLink;
            audio.source = "Wiktionary";
            meaning.audio = audio;
        }

        responseToReact.meanings.push(meaning);
    }
    // TODO: functionize solr req and response to remove redundancy
    let config = {
        method: 'get',
        url: 'http://35.223.110.79:8983/solr/mycol1/query?q=text:' + word + '&rows=1000'
    }
    axios(config)
        .then(solrResponse => {
            if (solrResponse.data.response.numFound > 0) {
                // To return first few examples fetched from solr:
                // responseToReact.generalExamples = solrResponse.data.response.docs.slice(0, 5).map(({ text }) => text[0])

                // Find few random docs fetched from solr
                documentMap = new Map();
                for (record of solrResponse.data.response.docs) {
                    if (!documentMap.has(record.text[0])) {
                        const pattern = /\b[A-Z]{3,}\b|\d{1,2}\/\d{1,2}\/\d{1,2}/; 
                        if (record.text[0].toLowerCase().includes("published by") ||
                            record.text[0].toLowerCase().includes("www") ||
                            record.text[0].toLowerCase().includes("com")||
                            record.text[0].toLowerCase().includes("201")||
                            record.text[0].toLowerCase().includes("photo") ||
                            pattern.test(record.text[0])) {
                            continue
                        }
                        documentMap.set(record.text[0], record.source[0])
                    }
                }

                let docs = Array.from(documentMap.keys());

                const numDocs = docs.length;
                const numRandomDocs = Math.min(numDocs, 100);
                const randomIndices = new Set();

                while (randomIndices.size < numRandomDocs) {
                    randomIndices.add(Math.floor(Math.random() * numDocs));
                }
                const randomDocs = [...randomIndices].map(index => docs[index]);
                generalExamples = randomDocs.filter(i => i.replace(/ *\([^)]*\) */g, "").length > 40);
                x = []
                for (i of generalExamples) {
                    if (i.replace(/ *\([^)]*\) */g, "").includes(word)) {
                        x.push({
                            "text": i.replace(/ *\([^)]*\) */g, "").replace(/['!"#$%&\\'()\*+;<=>”“@\[\\\]\^_`{|}~']/g, ""),
                            "source": documentMap.get(i)
                        })
                    }

                }
                responseToReact.generalExamples = x
            }
        })
        .finally(() => {
            createGoogleAudio(body, word, languageCode)
            posMeaning = [responseToReact.meanings[0].pos, responseToReact.meanings[0].definitions[0].meaning];
            logWord(word, true, posMeaning)
            responseToReact.ipa = ipa
            response.send(responseToReact)
        })
}

function handleDictionaryAPI(word, response, languageCode, ipa) {
    const config = {
        method: 'get',
        url: 'https://api.dictionaryapi.dev/api/v2/entries/en/' + word
    };

    axios(config)
        .then(APIResponse => {
            if (APIResponse.status != 200 || APIResponse.data.length == 0) {
                console.log('Erroneous status code' + APIResponse.status)
                console.log('Entire API response:')
                console.log(APIResponse)
                // logWord(word, false)
                return handleDictionaryError("Word meaning not found", response, word)
            }

            // TODO : sort meanings with most number of definitions to determine importance?
            const responseToReact = { "word": word, "meanings": [] };
            for (let word of APIResponse.data) {
                for (let meaning of word.meanings) {
                    let resMeaning = {}
                    resMeaning.pos = meaning.partOfSpeech
                    resMeaning.definitions = []

                    for (let definition of meaning.definitions.slice(0, 5)) {
                        let resDefinition = {}
                        resDefinition.meaning = definition.definition
                        resDefinition.usage = definition.example
                        resDefinition.source = "apidictionary.dev"
                        resDefinition.license = word.license
                        resMeaning.definitions.push(resDefinition)
                    }

                    if (word.phonetics.length != 0) {
                        phoneticData = word.phonetics.find(p => p.audio && p.audio.length > 0);
                        if (phoneticData) {
                            resMeaning.audio = {}
                            resMeaning.audio.audioLink = phoneticData.audio
                            resMeaning.audio.source = phoneticData.sourceUrl || ""
                        }
                    }

                    responseToReact.meanings.push(resMeaning)
                }
            }

            let config = {
                method: 'get',
                url: 'http://35.223.110.79:8983/solr/mycol1/query?q=text:' + word + '&rows=1000'
            }

            axios(config)
                .then(solrResponse => {
                    if (solrResponse.data.response.numFound > 0) {
                        // To return first few examples fetched from solr:
                        // responseToReact.generalExamples = solrResponse.data.response.docs.slice(0, 5).map(({ text }) => text[0])

                        // Find few random docs fetched from solr
                        documentMap = new Map();
                        for (record of solrResponse.data.response.docs) {
                            if (!documentMap.has(record.text[0])) {
                                if (record.text[0].toLowerCase().includes("published by")) {
                                    continue
                                }
                                documentMap.set(record.text[0], record.source[0])
                            }
                        }

                        let docs = Array.from(documentMap.keys());

                        const numDocs = docs.length;
                        const numRandomDocs = Math.min(numDocs, 100);
                        const randomIndices = new Set();

                        while (randomIndices.size < numRandomDocs) {
                            randomIndices.add(Math.floor(Math.random() * numDocs));
                        }
                        const randomDocs = [...randomIndices].map(index => docs[index]);
                        generalExamples = randomDocs.filter(i => i.replace(/ *\([^)]*\) */g, "").length > 40);
                        x = []
                        for (i of generalExamples) {
                            if (i.replace(/ *\([^)]*\) */g, "").includes(word)) {
                                x.push({
                                    "text": i.replace(/ *\([^)]*\) */g, "").replace(/['!"#$%&\\'()\*+,\-:;<=>”“?@\[\\\]\^_`{|}~']/g, ""),
                                    "source": documentMap.get(i)
                                })
                            }

                        }
                        if (x.length != 0) {
                            responseToReact.generalExamples = x
                        }
                    }
                })
                .finally(() => {
                    createGoogleAudio(responseToReact, word, languageCode)
                    posMeaning = [responseToReact.meanings[0].pos, responseToReact.meanings[0].definitions[0].meaning];
                    logWord(word, true, posMeaning)
                    responseToReact.ipa = ipa
                    response.send(responseToReact)
                })
        })
        .catch(error => {
            // logWord(word, false)
            handleDictionaryError(error, response, word);
        });
}

function handleDictionaryError(error, response, word) {
    console.error(error);
    response.status(500).send('Word meaning not found');
    // logWord(word, false)
}

app.post('/', (request, response) => {
    console.log("post method hit")
    const word = request.body.word;
    const languageCode = request.body.languageCode;
    console.log(word, languageCode);
    // let config = {
    //     method: 'get',
    //     url: 'https://us-east-1.aws.data.mongodb-api.com/app/dictionary-eokle/endpoint/getData',
    //     headers: {
    //         'apiKey': 'uIb0LAUBMoAaPQT0vrvtZd7CCgGWw7W821WzrycbiwVrv3UuK3p6vY1pssCh3jb6'
    //     },
    //     params: {
    //         word: word,
    //         languageCode: languageCode
    //     }
    // };
    ipaObject = TextToIPA.lookup(word)
    ipa = ""
    if (ipaObject.error != 'undefined') {
        ipa = ipaObject.text.split(' ')[0]
    }
    let data = JSON.stringify({
        "selector": {
            "_id": `word_data:${word}`
        }
    });

    config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary/_find',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
        },
        data: data
    };
    axios(config)
        .then(mongoResponse => {
            if (!mongoResponse.data.docs[0]) {
                console.log('not found in database. fallback to API')
                handleDictionaryAPI(word, response, languageCode, ipa)
            }
            else {
                // console.log('found in mongoDB')
                console.log('found in cloudant db')
                // console.log((mongoResponse.data.docs[0]))
                // console.log(mongoResponse.data.docs[0])
                handleDictionaryData(word, response, mongoResponse.data.docs[0], languageCode, ipa);
            }
        })
        .catch(error => {
            console.log(error)
            handleDictionaryAPI(word, response, languageCode, ipa)
        });

    const date = new Date();
    const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const filename = `${dateString}.txt`;
    try {
        const fileData = fs.readFileSync(filename, 'utf8');
        count = parseInt(fileData);
    } catch (err) { }
    count++;

    fs.writeFileSync(filename, count.toString());
});

app.get("/api/:word", (req, response) => {
    let word = req.params.word
    let url = "https://api.dictionaryapi.dev/api/v2/entries/en/" + word
    let htmlstring = "<html> <body> <h1>Word: " + word + "</h1>"
    request(url, { json: true }, (err, res, body) => {
        if (err) return console.log(err)

        if (res.statusCode != 200) {
            return response.send("word meaning not found")
        }

        for (let word of body) {
            for (p of word.phonetics) {
                if (p.audio && p.audio != "") {
                    htmlstring += '<audio controls> <source src="' + p.audio + '" type="audio/mp3"></audio>'
                    break
                }
            }

            for (let meaning of word.meanings) {
                htmlstring = htmlstring.concat('<h3>Part of speech: ' + meaning.partOfSpeech + '</h3>')
                htmlstring = htmlstring.concat('<p>Definitions:' + '</p><ul>')
                for (let definition of meaning.definitions.slice(0, 3)) {
                    htmlstring = htmlstring.concat('<li>' + definition.definition + '</li>')
                }
                htmlstring += "</ul>"
            }
        }
        response.send(htmlstring + "<body><html>")
    })
})

app.get("/logindetails", (req, response) => {
    // var options = {
    //     'method': 'GET',
    //     'url': 'https://us-east-1.aws.data.mongodb-api.com/app/dictionary-eokle/endpoint/getLoginDetails',
    //     'headers': {
    //     },
    //     'json': true
    // };
    // request(options, function (error, res) {
    //     if (error) throw new Error(error);
    //     console.log(res.body);
    //     response.send({"username" : res.username , "password" : res.password})
    // });
    const userlogin = {
        username: 'admin',
        password: 'adminpass'
    };
    response.json(userlogin)
})

const fetchWordLocalRouter = require('./routes/fetchWordLocal');
const wordStatsRouter = require('./routes/wordStats');

app.use('/mongo', fetchWordLocalRouter);
app.use('/getword', wordStatsRouter)
app.listen(3001, () => {
    console.log("Node server running on port 3001")
})