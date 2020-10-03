const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

let server = require('./server');
let config = require('./config');
let middleware = require('./middleware');
let response = require('express');

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://127.0.0.1:27017";
const dbname = "HM";

let db
MongoClient.connect(url,(err,client)=>
{
    if(err) return console.log(err);
    db=client.db(dbname);
    console.log(`Connected Databse : ${url}`);
    console.log(`database : ${dbname}`  );
    app.listen(3000);
});



//getting all details of hospital

app.get('/hospitaldetails',middleware.checkToken , function(req,res){
    console.log("Loading data from Hospital Collection");
    db.collection('hospital').find().toArray()
    .then(result => res.json(result));
 
})

//getting all details of ventilators

app.get('/ventilatordetails',middleware.checkToken,function(req,res){
    console.log("Loading data from Ventilator Collection");
    db.collection('ventilator').find().toArray()
    .then(result => res.json(result));
 
})

//searching ventilator by status

app.post('/searchventilatorbystatus',middleware.checkToken , (req,res) => {
    var status = req.body.status;
    console.log(status);
    //available,in-maintenance,occupied
    db.collection('ventilator').
    find({"status":status}).toArray().then(result => res.json(result));
})


//searching ventilator by hospital name

app.post('/searchventilatorbyhospitalname',middleware.checkToken , (req,res) => {
    var hn = req.body.name;
    console.log(hn);
    var ventilatordetails = db.collection('ventilator').
    find({"name":RegExp(hn , 'i')}).toArray().then(result => res.json(result));
})

//searching hospital by name

app.post('/searchhospitalbyname',middleware.checkToken , (req,res) => {
    var hn = req.body.name;
    console.log(hn);
    var hospitaldetails = db.collection('hospital').
    find({"name":RegExp(hn , 'i')}).toArray().then(result => res.json(result));
})


//update ventilator status 

app.put('/updateventilatordetails',middleware.checkToken,(req,res)=>{
    var ventid = {ventilatorId : req.body.ventilatorId};
    console.log(ventid);
    var newvalues = {$set : {status : req.body.status}};

    db.collection('ventilator').updateOne(ventid,newvalues,function(err,result)
    {
        res.json('1 document updated');
        if(err) throw err;
    });
})

//addding ventilator

app.post('/addventilatorbyuser',middleware.checkToken,(req,res)=>{
    var hId = req.body.hId;
    var ventilatorId = req.body.ventilatorId;
    var status = req.body.status;
    var name = req.body.name;

    var item = {
        hId:hId,ventilatorId:ventilatorId,status:status,name:name
    };

    db.collection('ventilator').insertOne(item , function(err,result)
    {
        res.json("Item inserted");
    });
});

//deleting ventilator by ventilator id 

app.delete('/deleteventilatorbyventilatorid',middleware.checkToken,(req,res)=>{
    var vid = req.body.ventilatorId;

    db.collection('ventilator').deleteOne({ventilatorId : vid},function(err,result)
    {
        res.json("object Deleted");
    });
})