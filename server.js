const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

app.use(express.static('./dist'));
app.listen(port, ()=>{
    console.log("Listening on :", port);
});

//const url = 'mongodb://mkadirtan:10241025@localhost:27017?authMechanism=SCRAM-SHA-1&authSource=db';
const url = 'mongodb://localhost:27017';
const config =
    {
    useNewUrlParser: true,
    appname: "local choreograb test app",
    auth: {
        user: "mkadirtan",
        password: "10241025",
    },
    authMechanism: "SCRAM-SHA-1"
    };
const dbName = 'SceneInformation';

app.get('/', (req,res)=>{
    res.sendFile(__dirname + '/dist/index.html');
});

app.post('/sceneInfo', (req, res)=>{
    MongoClient.connect(url, config, (err, client)=>{
        const db = client.db(dbName);
        const collection = db.collection("Generic");
        collection.find({}).toArray((err, documents)=>{
            if (err) throw err;
            res.send(documents[0].test);
        });
    });
});

