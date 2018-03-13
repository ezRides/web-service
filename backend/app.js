// Modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var stemmer = require('porter-stemmer').stemmer;
var async = require('async');
var http = require('http');
var nano = require('nano')('http://172.18.0.3:5984');

// Express
var app = express();


function intervalFunct(){
  nano.db.get('ez-rides',function(err,req){
    if(err){
        console.log(err.message);
        nano.db.create('ez-rides', function(req,res){
          if(res){
            //Created
            console.log("Se creo la base de datos");
            clearInterval();
          } else {
            console.log("no se creo la base de datos");
            //Failed
          }
        });
                  
        }
    })
}

setInterval(intervalFunct, 1000);

app.use(function(req, res, next) {
    res.setHeader("Cache-Control", "no-cache must-revalidate");
    next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function(req, res, next) {
  res.send ({ title: 'Express' });
});

app.get('/request', function(req, res) {
  res.send ({ title: 'Request'});
});
app.get('/request/:id',function(req,res){
  res.send ({ title: 'Request by ID'});
});

app.get('/buttoninfo/:id',function(req,res){
  res.send ({ title: 'Button Info'});
});

app.get('/active',function(req,res){
  res.send ({ title: 'Active Destinations'});
});

module.exports = app;
