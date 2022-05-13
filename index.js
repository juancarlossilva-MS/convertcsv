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

//falta o merge entre eids iguais
//falta tratar as barras /

function csvToObjectArray(csvString) {
    var csvRowArray    = csvString.split(/\n/);
    var headerCellArray = trimQuotes(csvRowArray.shift().split(','));
    var heads = [];
   
    for(var k=0; k<headerCellArray.length;k++){
        heads.push(h)
      
    }
   // console.log(heads);
    var objectArray = [];
    var rows = [];
    while (csvRowArray.length) {
        var rowCellArray = trimQuotes(csvRowArray.shift().split('"'));

        if(rowCellArray[0].length == 0) continue;
        var ret = [];
        var ret2 = [];
        for(var l=0;l<rowCellArray.length;l++){
            if(rowCellArray.length == 1){
                ret =   _.concat(ret,rowCellArray[l].split(','))
                continue;
            }
            if(l == 1){
               ret = _.concat(ret,rowCellArray[l]);
                continue;
            }
            if(l+1 == rowCellArray.length && l !== 0 ){
                
                ret = _.concat(ret,_.slice(rowCellArray[l].split(','),1))
                continue;
            }
            var div = rowCellArray[l].split(',')
            console.log(_.slice(div,0,div.length-1));
            ret = _.concat(ret,_.slice(div,0,div.length-1))
        }
      /*  for(var x=0;x<ret.length;x++){
            console.log(ret)
            console.log(ret[x])
           ret2.push( ret[x][0].split(','))
        }*/
//        console.log(ret)
        var ob = {}
        var address = [];
        var groups = [];
        for(var n=0;n<headerCellArray.length;n++){
            var h = headerCellArray[n].split(" ");
            console.log(h);
               
                if(h.length > 1){
                    var tags = [];
                    for(var j=1;j<h.length;j++){
                        console.log(h)
                        console.log(h[j])
                       tags.push(h[j]);
                    }
                    address.push({
                                    "type":h[0],
                                    "tags":tags,
                                    "address":ret[n]
                                }
                             );            
                }else{
                    if(h[0] == "group"){
                        groups.push(ret[n])
                    }else{
                        ob = _.merge(ob,{ [ h[0] ] : ret[n] })
                    }
                }
                
        }
        ob = _.merge(ob,{"address":address});
        ob = _.merge(ob,{"group":groups});
        rows.push(ob)
        
    }
    return rows;
    /*
    while(objectArray.length){

        var obj = objectArray.shift()
        var ob = {}
        var address = [];
        var groups = [];
        for(var i=0;i<heads.length;i++){
            if(heads[i].length > 1){
                var tags = [];
                for(var j=1;j<heads[i].length;j++){
                   tags.push(heads[i][j]);
                }
                address.push({
                                "type":heads[i][0],
                                "tags":tags,
                                "address":obj[heads[i]]
                            }
                         );            
            }else{
                if(heads[i] == "group"){
                    groups.push(obj[heads[i]])
                }else{
                    ob = _.merge(ob,{ [ heads[i][heads[i].length-1] ] : obj[heads[i]] })
                }
            
        }
        
    }
    ob = _.merge(ob,{"address":address});
    ob = _.merge(ob,{"group":groups});

        /*var ob = [{
            "fullname":obj.fullname,
            "eid":obj.eid,
            "address":[{
                "type":"email",
                "tags":[
                    "Student"
                ],
                "address":obj["email,Student"]
            }]
        }]
        rows.push(ob)
    }


    return rows;*/
}

function trimQuotes(stringArray) {
    for (var i = 0; i < stringArray.length; i++) {
        stringArray[i] = _.trim(stringArray[i], '"');
    }
    return stringArray;
}

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);