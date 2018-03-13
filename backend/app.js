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
var nano = require('nano')('http://172.19.0.4:5984');

// Express
var app = express();
var ez = nano.use('ez-rides');

function intervalFunct(){
  nano.db.get('ez-rides',function(err,req){
    if(err){
        console.log(err.message);
        nano.db.create('ez-rides', function(req,res){
          if(res){
            //Created
            //console.log("Se creo la base de datos");
            ez.insert({_id:'1', route: 'Lopez Mateos'},function(err,body){
              if(err){
                console.log(body);
              }
            });
            ez.insert({_id:'2', route: 'Av La Calma'},function(err,body){
              if(err){
                console.log(body);
              }
            });
            ez.insert({_id:'3', route: 'Av.Guadalupe'},function(err,body){
              if(err){
                console.log(body);
              }
            });
            ez.insert({_id:'4', route: 'Av.Naciones Unidas'},function(err,body){
              if(err){
                console.log(body);
              }
            });
            clearInterval();
          } else {
            console.log("no se creo la base de datos");
            //Failed
          }
        });
                  
        } else{

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
  //res.send ({ title: 'Request by ID'});
  var id = req.params.id;
  ez.get(id, function(err,body){
      if(err){
        console.log(body);
      }else{
          res.send(body); 
        }
      
  });
});

app.get('/buttoninfo/:id',function(req,res){
  res.send ({ title: 'Button Info'});
});

app.get('/active',function(req,res){
  res.send ({ title: 'Active Destinations'});
});

module.exports = app;
