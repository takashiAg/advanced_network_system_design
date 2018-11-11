const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

let database;
let last_detect = new Date();

MongoClient.connect('mongodb://localhost:27017', (err, client) => {
    if (err)
        throw err
    console.log("Connected successfully to server")
    database = client.db("ANSD");
})


let loop = () => {
    console.log("find")
    let d = null;
    database.collection('documents').find({
        date: {$gte: new Date(new Date() - 60000)},
        count: {$gte: 5},
    }).toArray((error, documents) => {
        for (var document of documents) {
            console.log(document.count);
            d = document.date;
        }
        if (d == null)
            return
        last_detect = d
    });
    console.log(last_detect)
}
setInterval(loop, 100)