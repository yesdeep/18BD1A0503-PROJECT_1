var express = require("express");
var app = express();

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbname = "testing";

let db

MongoClient.connect(url,(err,client)=>
{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`Connected Databse : ${url}`);
    console.log(`DataBase : ${dbname}`);
    app.get('/',function(req,res)
    {
        db.collection("f1").find().toArray().then(function(result)
            {
                    console.log(result);
                    res.send(result);
            });
    });
    
    app.listen(3001);
});