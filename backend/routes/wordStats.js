const router = require('express').Router();
var request = require('request');
const axios = require('axios');
const fs = require('fs')


router.get('/trendingword', (_, response) => {

    // var options = {
    //     'method': 'GET',
    //     'url': 'https://us-east-1.aws.data.mongodb-api.com/app/dictionary-eokle/endpoint/getTrendingWords',
    //     'headers': {
    //     },
    //     'json': true
    // };
    // request(options, function (error, res) {
    //     if (error){
    //         console.log(error)
    //     }

    //     if (res.body && res.body[0]) {
    //         trendingWords = {}
    //         // response.send({ "trendingWords": res.body.map(a => a.word) })
    //         for (i of res.body) {
    //             trendingWords[i.word] = i.meaning
    //         }
    //         response.send(trendingWords)
    //     }
    //     else {
    //         response.send({
    //             "online": "available on or performed using the internet or other computer network",
    //             "dictionary": "a book or electronic resource that lists the words of a language"
    //         })
    //     }
    // });

    let data = JSON.stringify({
        "selector": {
            "wordFound": true
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary/_partition/word_logs/_find',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
        },
        data: data
    };

    axios.request(config)
        .then((DBResponse) => {
            trendingWords = {}
            // console.log((DBResponse.data.docs));
            DBResponse.data.docs.sort((a, b) => b.count - a.count);
            wordMeaningList = DBResponse.data.docs.map(doc => ([doc.word, doc.meaning]))

            for (pair of wordMeaningList) {
                trendingWords[pair[0]] = pair[1]
            }

            response.send(trendingWords)
        })
        .catch((error) => {
            response.send({
                "online": "available on or performed using the internet or other computer network",
                "dictionary": "a book or electronic resource that lists the words of a language"
            })
            console.log(error)
        });
});

router.get('/wordoftheday', (_, response) => {

    var d = new Date();
    var currentDate = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
    let data = JSON.stringify({
        "selector": {
            'type': 'word_logs',
            "wordFound": true,
            "date": currentDate,
            "trendingWord": true
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary/_partition/word_logs/_find',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
        },
        data: data
    };
    console.log(JSON.stringify(config))
    axios.request(config)
        .then((DBResponse) => {
            console.log(DBResponse.data)
            response.send({
                "word": DBResponse.data.docs[0].word,
                "meaning": DBResponse.data.docs[0].meaning,
                "pos": DBResponse.data.docs[0].pos
            })
        })
        .catch((error) => {
            response.send({ "word": "dictionary", "meaning": "a book or electronic resource that lists the words of a language (typically in alphabetical order) and gives their meaning, or gives the equivalent words in a different language, often also providing information about pronunciation, origin, and usage", "pos": "noun" })
            console.log(error)
        });



})

router.post('/addNewWord', (request, response) => {

    // word = request.body.word
    // let data = JSON.stringify({
    //     "word": word
    // });

    // let config = {
    //     method: 'post',
    //     url: 'https://us-east-1.aws.data.mongodb-api.com/app/dictionary-eokle/endpoint/addNewWord',
    //     headers: {
    //         'Content-Type': 'application/json'
    //     },
    //     data: data
    // };

    // axios.request(config)
    //     .then((response) => {
    //         console.log(JSON.stringify(response.data));
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });
    word = request.body.word
    console.log('requested word is ', word)
    data = JSON.stringify({
        "selector": {
            "_id":`review_words:${word}`,
            "word": word,
            "type": "review_words"
        }
    });

    selectConfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary/_find',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
        },
        data: data
    };

    axios.request(selectConfig)
        .then(result => {
            let data = {
                "_id":`review_words:${word}`,
                'type': 'review_words',
                "word": word,
                "state": "New",
                "count": 1
            }
            console.log(result.data.docs)
            if (result.data.docs[0]) {
                data.count = result.data.docs[0].count + 1
                data.state = result.data.docs[0].state
                data._id = result.data.docs[0]._id
                data._rev = result.data.docs[0]._rev

                if (data.state == 'Rejected') {
                    console.log('word will not be added as it is rejected once')
                }
            }

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
                },
                data: data
            };

            axios.request(config)
                .then((DBResponse) => {
                    console.log('added word to review_words with config ', JSON.stringify(config))
                    // console.log(DBResponse.data)
                    response.status(200).send('ok')
                })
                .catch((error) => {
                    console.log(error);
                });
        })
})


router.get('/getstatistics', (_, response) => {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://us-east-1.aws.data.mongodb-api.com/app/dictionary-eokle/endpoint/getStatistics',
        headers: {}
    };

    axios.request(config)
        .then((res) => {
            const date = new Date();
            const dateString = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
            const filename = `${dateString}.txt`;
            try {
                const requestsToday = fs.readFileSync(filename, "utf-8").trim();
                if (!requestsToday) {
                    requestsToday = 0
                }
                res.data[0]["meanings searched today"] = requestsToday
                console.log(JSON.stringify(res.data));
            } catch (err) { }
            response.send(res.data[0])
        })
        .catch((error) => {
            console.log(error);
        });


})

router.get('/getNewWords', (req, response) => {
    // let config = {
    //     method: 'get',
    //     maxBodyLength: Infinity,
    //     url: 'https://us-east-1.aws.data.mongodb-api.com/app/dictionary-eokle/endpoint/getNewWords?requestedState=' + req.query.requestedState,
    //     headers: {}
    // };
    // axios.request(config)
    //     .then((res) => {
    //         response.send(res.data)
    //     })
    //     .catch((error) => {
    //         console.log(error);
    //     });



    let data = JSON.stringify({
        "selector": {
            "state": req.query.requestedState
        }
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary/_partition/review_words/_find',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
        },
        data: data
    };

    axios.request(config)
        .then((DBResponse) => {
            // console.log(DBResponse)
            // array = DBResponse.data.docs.map(doc => doc.word)

            res = []
            for (i of DBResponse.data.docs) {
                res.push({ "word": i.word, "meaning": i.meaning || "", "count": i.count })
            }
            // console.log(res)
            response.send(res)

        })
        .catch((error) => {
            console.log(error);
        });
})
// https://us-east-1.aws.data.mongodb-api.com/app/dictionary-eokle/endpoint/getNewWords?requestedState=New
router.post('/adminWord', (request, response) => {
    console.log('word', request.body.word)
    console.log('state ', request.body.state)
    word = request.body.word

    data = JSON.stringify({
        "selector": {
            "_id":`review_words:${word}`,
            'type': 'review_words',
            'word': word
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

    axios.request(config)
        .then((DBResponse) => {
            data = DBResponse.data.docs[0]

            if (request.body.state == 'reject') {
                data.state = "Rejected"
                // data.count = data.count + 1
                // review_words update the word to rejected
                // 
            }
            else if (request.body.state == 'accept') {
                data.state = "Accepted"
                // data.count = data.count + 1
                promise = getFirstDefinition(word)
                promise
                    .then(res => {
                        console.log(res)
                        data.meaning = res
                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
                            },
                            data: data
                        }

                        axios.request(config)
                            .then((response) => {
                                console.log('review_words is modified with config ', JSON.stringify(config))
                                console.log((response.data));
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    })
                    .catch(err => { console.log(err) })
                // .then(result => {
                //     console.log(result)
                //     data.meaning = result

                // })
                // .catch(error=>{
                //     data.meaning = ""
                //     console.log(error)
                // })
            }
            else {
                data.state = "Added"
                // data.count = data.count + 1
                if (request.body.hasOwnProperty('manualAccept') && request.body.manualAccept == 'true') {
                    data.manualAccept = request.body.manualAccept

                    let insertConfig = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
                        },

                        data: {
                            _id :`review_words:${word}`,
                            word: word,
                            type: "word_data",
                            usage: [{
                                pos: "general",
                                definitions: [{
                                    definition: {
                                        gloss: request.body.meaning,
                                        source: "Online Dictionary"
                                    },
                                    examples: [request.body.example]
                                }],
                                etymology_text: "",
                                etymology_number: 0,
                                audio: []
                            }],
                            manualAccept: request.body.manualAccept,
                        }
                    }

                    console.log(JSON.stringify(config))
                    axios.request(insertConfig)
                        .then((response) => {
                            console.log(JSON.stringify(response.data));
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                }
                else {
                    getWordData(word)
                        .then(result => {
                            result.type = 'word_data'
                            result._id = `word_data:${word}`
                            let config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary',
                                headers: {
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
                                },
                                data: result
                            }

                            axios.request(config)
                                .then(result => {
                                    console.log(result)
                                })
                                .catch(error => {
                                    console.log('error while posting added word data to dictionary', error)
                                })
                        })
                        .catch(err => {
                            console.log("error in fetching meaning from getworddata function", err)
                        })
                }
            }


            // modify review_words state
            if (data.state != "Accepted") {
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://apikey-v2-1n8q2t2364bw148ftwzc0j6a0n65l047vmdasejkgczn:0768e70486e28d354c46b345c0cdb5f3@dec4d4f2-acae-428a-be32-ddb04da38212-bluemix.cloudantnosqldb.appdomain.cloud/onlinedictionary',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Basic YXBpa2V5LXYyLTFuOHEydDIzNjRidzE0OGZ0d3pjMGo2YTBuNjVsMDQ3dm1kYXNlamtnY3puOjA3NjhlNzA0ODZlMjhkMzU0YzQ2YjM0NWMwY2RiNWYz'
                    },
                    data: data
                }

                axios.request(config)
                    .then((response) => {
                        console.log('review_words is modified with config ', JSON.stringify(config))
                        console.log((response.data));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            }
        })

        .catch((error) => {
            console.log(error);
        });

})

async function getWordData(word) {
    function cleanString(str) {
        str = str.replace(/(<([^>]+)>)/gi, "");

        // Remove all special characters except , . ! " ( )
        str = str.replace(/[^\w\s,.!"()\u201C\u201D\u2018\u2019]/gi, "");

        return str;// remove leading/trailing white spaces
    }



    const urli = `https://en.wiktionary.org/api/rest_v1/page/definition/${word}`;

    const result = await axios.get(urli);
    // The response body is a BSON.Binary object. Parse it and return.

    let final = "";
    let posDict = {};
    let wordData = {};
    wordData.word = word;
    wordData.usage = [];

    const data = result.data

    data.en.forEach((object) => {
        let posData = {};

        if (!(object.partOfSpeech in posDict)) { posDict[object.partOfSpeech] = 0; }
        posData.pos = object.partOfSpeech;
        posData.etymology_text = "";
        posData.etymology_number = posDict[object.partOfSpeech] + 1;
        posData.definitions = [];
        posData.audio = [];
        posData.source = "Wiktionary";
        if ("definitions" in object) {
            object.definitions.forEach((def) => {
                defData = {}
                if ("definition" in def) {
                    glossData = {};
                    glossData.gloss = cleanString(def.definition);
                    glossData.source = "Wiktionary";
                    defData.definition = glossData;
                }
                defData.examples = [];
                if ("parsedExamples" in def) {

                    def.parsedExamples.forEach((exampleObject) => {
                        exmpData = {};
                        exmpData.text = cleanString(exampleObject.example);
                        exmpData.type = "example";
                        exmpData.source = "Wiktionary";
                        defData.examples.push(exmpData);

                    })

                }
                posData.definitions.push(defData);

            })
            wordData.usage.push(posData);

        }
    });






    return wordData;



}


async function getFirstDefinition(word) {

    function cleanString(str) {
        str = str.replace(/(<([^>]+)>)/gi, "");

        // Remove all special characters except , . ! " ( )
        str = str.replace(/[^\w\s,.!"()\u201C\u201D\u2018\u2019]/gi, "");

        return str;// remove leading/trailing white spaces
    }



    const urli = `https://en.wiktionary.org/api/rest_v1/page/definition/${word}`;

    // const result = await context.http.get({ url: urli });
    // config = {
    //     method: 'get',
    //     url: urli
    // }

    try {
        result = await axios.get(urli);
    }
    catch {
        return ""
    }
    // axios(config).then(result => {
    let final = "";

    const data = (result.data);


    if ("en" in data) {
        data.en.slice(0, 1).forEach((object) => {
            if ("definitions" in object) {
                object.definitions.forEach((def) => {
                    if ("definition" in def) {
                        final = def.definition;


                    }


                })
            }
        });


    }


    // setTimeout(() => {
    return cleanString(final);
    // }, 1000);
    // console.log(cleanString(final))

    // }).catch(error => {
    //     console.log(error)
    // })
    // The response body is a BSON.Binary object. Parse it and return.








}

module.exports = router;