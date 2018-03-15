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
var cors = require('cors')
var nano = require('nano')('http://ezrides-database:5984');

// Express
var app = express();
app.use(cors());
var ez = nano.use('ez-rides');


var routarr = ['Lopez Mateos', 'Av La Calma', 'Av Guadalupe', 'Av Naciones Unidas', 'La Minerva'];
var i = 1;
timer = 0;

function intervalFunct(){
  nano.db.get('ez-rides',function(err,req){
    if(err){
        console.log(err.message);
        nano.db.create('ez-rides', function(req,res){
          if(res){
            for(var a =1; a<= routarr.length;a++){
              ez.insert({_id: String(a), route:routarr[a-1]}, function(err,body){
                if(!err){

                } else {
                  // console.log(err);
                }
              });
            }
            //Created
            clearInterval(timer);
          } else {
            console.log("no se creo la base de datos", req);
            //Failed
          }
        });
      } else {
        console.log ("Database exists");
        for(var a =1; a<=routarr.length;a++) {
          ez.insert({_id: String(a),route:routarr[a]}, function(err,body) {
            if(!err){
            } else {

            }
          });
        }
      clearInterval(timer);
    }
  })
}

timer = setInterval(intervalFunct, 1000);

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
  const MOCKED_REQUEST = {
    "destinations": [
      {
        "name": "Lopez Mateos",
        "id": "2hfhd76f4hds"
      },
      {
        "name": "Av La Calma",
        "id": "ATF8j4978j34"
      },{
        "name": "Av Guadalupe",
        "id": "ATF8j4978j34"
      },
      {
        "name": "Av Naciones Unidas",
        "id": "ATF8j4978j34"
      },
      {
        "name": "La Minerva",
        "id": "ATF8j4978j34"
      }
    ]
  };

  res.send (MOCKED_REQUEST);
});

app.get('/request/:id',function(req,res){
  //res.send ({ title: 'Request by ID'});
  var id = req.params.id;
  ez.get(id, function(err,body){
    if(err){
      res.send({title:'Error', error: err.message});
    } else {
      res.send(body);
    }
  });
});

app.get('/buttoninfo/:id',function(req,res){
  res.send ({ title: 'Button Info'});
});

app.get('/active',function(req,res){
  const MOCKED_REQUEST = {
    "destinations": [
      {
        "name": "Lopez Mateos",
        "id": "2hfhd76f4hds"
      },
      {
        "name": "La Minerva",
        "id": "ATF8j4978j34"
      }
    ]
  };

  res.send (MOCKED_REQUEST);
});

module.exports = app;
