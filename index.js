'use strict';

const express = require('express');
const fs = require('fs');
var _ = require('lodash');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.get('/original',  (req, res) => {
    
     fs.readFile('input.csv', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        //var csvObject = csvToObjectArray(data);
    
        res.send(data);
    });
});
app.get('/',  (req, res) => {
    
     fs.readFile('input.csv', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }

        var csvObject = csvToObjectArray(data);
    
        res.send(csvObject);
    });
});


function csvToObjectArray(csvString) {
    var csvRowArray    = csvString.split(/\n/);
    var headerCellArray = trimQuotes(csvRowArray.shift().split(','));
    var heads = [];
    while(headerCellArray.length){
        heads.push(headerCellArray.shift().split(" "));
    }
   // console.log(heads);
    var objectArray = [];
    var rows = [];
    while (csvRowArray.length) {
        var rowCellArray = trimQuotes(csvRowArray.shift().split(','));
     //   rows.push(rowCellArray);
        var rowObject    = _.zipObject(heads, rowCellArray);
        objectArray.push(rowObject);
    }
    while(objectArray.length){

        var obj = objectArray.shift()
        console.log(obj)
        var ob = [{
            "fullname":obj.fullname,
            "eid":obj.eid,
            "address":[{
                "type":"email",
                "tags":[
                    "Student"
                ],
                "address":obj["email Student"]
            }]
        }]
        rows.push(ob)
    }


    return rows;
}

function trimQuotes(stringArray) {
    for (var i = 0; i < stringArray.length; i++) {
        stringArray[i] = _.trim(stringArray[i], '"');
    }
    return stringArray;
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);