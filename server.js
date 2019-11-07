const express = require('express');
const app = express();
const port = 4000;


app.use(express.static( __dirname + '/dist'));
app.use(express.static( __dirname + '/node_modules'));
app.get('/', (req, res)=> {
    res.setHeader("Content-Type", "text/html");
    res.sendFile(__dirname + '/dist/app.html')
});

app.listen(port, ()=>{
    console.log("Listening on :", port);
});

