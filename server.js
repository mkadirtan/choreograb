const express = require('express');
/*const Mongo = require('mongodb');
const MongoClient = Mongo.MongoClient;

const MUUID = require('uuid-mongodb');*/

const app = express();
const port = 3000;

app.use(express.static('./dist'));
app.use(express.json());

app.listen(port, ()=>{
    console.log("Listening on :", port);
});
/*
console.log("v1", MUUID.v1().toString());
console.log("v4", MUUID.v4());
console.log("Mongo", Mongo.ObjectID());
console.log("Mongo Passed", Mongo.ObjectID("123456789012"))

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
*/
/*MongoClient.connect(url,config, (err, client)=>{
    if(err) throw err;
    const db = client.db("testDB").collection("testCollection").insertOne({_id: Mongo.ObjectID(uuid()), test2: "new uuid"});
    client.close();
});*/


const dbName = 'SceneInformation';

app.get('/', (req,res)=>{
    res.sendFile(__dirname + './dist/index.html');
});

app.get('/helloWorld', (req,res)=>{
    res.send("wtf is gentleman");
});

app.post('/addData', (req, res)=>{
    MongoClient.connect(url, config, (err, client)=>{
        if(err) throw err;
        const db = client.db("testDB");
        if (!db.testCollection) db.createCollection("testCollection");
        db.collection("testCollection").insertOne(req.body);
    });
    res.send("success");
});

app.post('/updateSceneInformation', (req, res)=>{
    MongoClient.connect(url, config, (err, client)=>{
        const db = client.db(dbName);
        const collection = db.collection("Generic");
        collection.find({}).toArray((err, documents)=>{
            if (err) throw err;
            res.send(documents[0].test);
        });
    });
});


app.post('/retrieveSceneInformation', (req, res)=>{
        MongoClient.connect(url, config, (err, client)=>{
        const db = client.db(req.body.dbName);
        const collection = db.collection(req.body.collection);
        let q_id = new Mongo.ObjectID("5c47be42d3344233a4825126");
        let result = collection.find({}).toArray().then(
            resolution => {
                res.send(resolution[0]);
            }
        )
    });
});
