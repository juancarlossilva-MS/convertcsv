'use strict';

const express = require('express');
const fs = require('fs');
var _ = require('lodash');
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();

app.get('/',  (req, res) => {
    
     fs.readFile('input.csv', 'utf8', function (err,data) {
        if (err) {
            return console.log(err);
        }
        var arrayJsonRetorno = []
        var csvObject = csvToObjectArray(data);

        while(csvObject.length){
            var actual = csvObject.shift();
            for(var x=0;x<csvObject.length;x++){
                if(actual.eid == csvObject[x].eid){
                    var arrayToMerge = csvObject[x];
                    csvObject.splice(x,1);
                                    
                    _.mapKeys(actual,function(val,key){
              
                        if(key == "groups" || key == "address"){
                            actual[key] = _.union(val,arrayToMerge[key])
                            
                        }
                    })
         
                }
            }
        
            arrayJsonRetorno.push(actual);
        }
        var json = JSON.stringify(arrayJsonRetorno)
        fs.writeFile('output.json', json, 'utf8',function(err) {
            if (err) throw err;
            console.log('complete');
            res.send( "<h1>Arquivo convertido com sucesso!</h1>" );
            }
        );
    });
});


function csvToObjectArray(csvString) {
    var csvRowArray    = csvString.split(/\r\n/);
    if(csvRowArray.length == 1){
        csvRowArray = csvString.split(/\n/);
    }

    var headerCellArray = trimQuotes(csvRowArray.shift().split(','));

    var rows = [];
    while (csvRowArray.length) {
        var rowCellArray = trimQuotes(csvRowArray.shift().split('"'));

        if(rowCellArray[0].length == 0) continue; // trata possiveis linhas vazias

        var ret = [];

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
            var div = trimQuotes(rowCellArray[l].split(','))
       
            ret = _.concat(ret,_.slice(div,0,div.length-1))
        }
     

        var ob = {}
        var address = [];
        var groups = [];
        for(var n=0;n<headerCellArray.length;n++){
            var h = headerCellArray[n].split(" ");
         
                if(h.length > 1){
                    var tags = [];
                    if(ret[n] == "") continue; 
                    var qtdAddress = ret[n].split("/");
                    if(h[0] == "phone"){
                        
                        try{
                            var phone = phoneUtil.parse(ret[n],"BR");
                            if(!phoneUtil.isValidNumberForRegion(phone, 'BR')){
                                continue;
                            }

                        }catch(e){
                        
                            continue;
                        }
                      
                    }
                    
                    for(var j=1;j<h.length;j++){
                       tags.push(h[j]);
                    }
                    for(var u=0;u<qtdAddress.length;u++){
                        if(h[0] == "email"){
                            qtdAddress[u] = qtdAddress[u].split(" ")[0];
                        }
                        address.push({
                                        "type":h[0],
                                        "tags":tags,
                                        "address":qtdAddress[u]
                                    });            
                    }

                   
                }else{
                    switch(h[0]){
                        case "group":
                            if(ret[n] !== ""){
                                var gs = ret[n].split("/")
                                for(var p=0;p<gs.length;p++){
                                    var gs2 = gs[p].split(",");
                                    for(var s=0;s<gs2.length;s++){
                                        groups.push(_.trim(gs2[s]))
                                    }
                                }
                            }else{
                                continue;
                            }
                        break;
                        case "invisible" :
                            if(ret[n]){
                                ob = _.merge(ob,{ [ h[0] ] :true })
                            }else{
                                ob = _.merge(ob,{ [ h[0] ] : false })
                            }
                        break;
                        case "see_all" :
                            if(ret[n]){
                                ob = _.merge(ob,{ [ h[0] ] :true })
                            }else{
                                ob = _.merge(ob,{ [ h[0] ] : false })
                            }
                        break;
                        default:
                            ob = _.merge(ob,{ [ h[0] ] : ret[n] })
                        break;
                    }
                    
                }
                
        }
        ob = _.merge(ob,{"address":address});
        ob = _.merge(ob,{"groups":groups});
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