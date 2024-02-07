 const FormatPos = (word) =>{
    var posDictionary = {};
    var defList = [];
    var audioList = [];

    word['usage'].forEach(element => {
        element['pos'] in posDictionary ? posDictionary[element['pos']]=posDictionary[element['pos']] : posDictionary[element['pos']] = []
        element['definitions'].slice(0,4).forEach(item => {
            posDictionary[element['pos']].push(item['definition']['gloss']);
            item['examples'].slice(0,2).forEach(example =>{ defList.push(example['text']);})
        });
        element['audio'].forEach( item => {
        audioList.push(item['audioLink']);
        });
    });
    return [posDictionary,defList,audioList];

};

export default FormatPos