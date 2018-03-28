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
var cors = require ('cors');
var nano = require('nano')('http://ezrides-database:5984');
var prom = require('nano-promises');
var db = prom(nano).db.use('ez-rides');


// Express
var app = express();
app.use(cors());
var ez = nano.use('ez-rides');
var timer = 0;

var routarr = ['Lopez Mateos', 'Av La Calma', 'Av Guadalupe', 'Av Naciones Unidas', 'La Minerva'];
var i = 1;
var routes_cache = undefined;

var requested_routes = {
  destinations: [
    {
      name: "Lopez Mateos",
      id: "1",
      ttl: 5
    }, {
      name: "Av La Calma",
      id: "2",
      ttl: 10
    }
  ]
};

timer = 0;

function intervalFunct(){
  ez.get('ez-rides',function(err,req){
    if(err) {
        console.log(err.message);
        nano.db.create('ez-rides', function(req,res){
          if(res){
            for(var a =1; a<= routarr.length;a++){
              db.insert({_id: String(a), route:routarr[a-1]}, function(err,body){
                if(!err){
                } else {
                  console.log(err);
                }
              });
            }
            //Created
            clearInterval(timer);
          } else {
            //Failed
          }
        });
        } else {
          for(var a =1; a<=routarr.length;a++){
            ez.insert({_id: String(a),route:routarr[a-1]}, function(err,body){
              if(!err){
                  } else {
          }
          clearInterval(timer);
        });
      }
    }
  });
}

const loadRoutesFromDB = () => {
  if (routes_cache != undefined) {
    return;
  }

  db.list({startkey:'1'}).then (([body, headers]) => {
    let requests = body.rows.map(doc => db.get(doc.id));

    Promise.all (requests).then((results) => {
      routes_cache = results.map ((result) => {
        return { "name": result[0].route, "id":result[0]._id  }
      });
    });
  })
};

const decrementTTL = () => {
  requested_routes.destinations = requested_routes.destinations.map (destination => {
    destination.ttl--;
    return destination;
  }).filter (destination => destination.ttl > 0);
};

timer = setInterval(intervalFunct, 1000);
setInterval(decrementTTL, 1000);

app.use(function(req, res, next) {
  res.setHeader("Cache-Control", "no-cache must-revalidate");
  next();
});

app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', function(req, res, next) {
  res.send ({ title: 'Express' });
});

/// Returns the list of all available destinations
app.get('/request', function(req, res) {
  loadRoutesFromDB ();
  res.send (routes_cache);
});

app.get('/request/:id',function(req,res){
  loadRoutesFromDB ();

  //res.send ({ title: 'Request by ID'});
  var id = req.params.id;

    for (let a = 0; a < requested_routes.destinations.length;a++){
      if(id == requested_routes.destinations[a].id){
        requested_routes.destinations[a].ttl=30
        return res.send({});
      }
    }
    res.send(routes_cache)
    for(let a=0; a < routes_cache.destinations.length; a++){
      if(id == routes_cache.destinations[a].id) {
        requested_routes.destinations.push ({
          name: routes_cache.destinations[a].route,
          id:  routes_cache.destinations[a].id,
          ttl: 30
        });
      }
    }
    return res.send({});
});

app.get('/buttoninfo/:id',function(req,res){
  res.send ({ title: 'Button Info'});
});

app.get('/active',function(req,res){
  res.send (requested_routes);
});

module.exports = app;