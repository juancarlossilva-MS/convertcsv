'use strict';

const express = require('express');
const fs = require('fs');

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
        
        console.log(data[0]);
        res.send(data);
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);