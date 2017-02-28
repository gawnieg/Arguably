// server.js
// load the things we need

//This is to bring express - app is the express object which links us to express
var express = require('express'); // - express is the module name
var app = express(); // this is the express app which gives us access to ex[presses' functionality
                    //express() fires the express function giving us access

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;

// set the view engine to ejs - now by default it will look for views in the view folder
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

//standard middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

//Neo4j Driver
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();


//INSIDE +'s: SECTION FOR "DECLARING" PAGES. ++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Dynamic page creation - james

  app.get('/topicspage/:name', function(req, res){
    // 'MATCH (n:Opinion) WHERE Opinion.topic = ' + req.params.name + 'RETURN n'
    res.render('topicspage', {which_topic: req.params.name.replace(/_+/g, " ")});

    session
      .run('MATCH (n:Opinion) WHERE Opinion.topic = ' + req.params.name.replace(/_+/g, " ") + 'RETURN n')
      .then(function(result){
          var topicArray =[];
            result.records.forEach(function(record){
              topicArray.push({
                topic: record._fields[0]
              });

            });
            res.render('topicspage',{
                which_topic: req.params.name.replace(/_+/g, " "),
                topics: topicArray
            });
          })

    .catch(function(err){
      console.log(err);
    });







    });

// Dynamic page creation - james

// index page -----------------------------------------------------------------
  app.get('/',function(req,res){

    session
      .run('MATCH(n:Opinion) RETURN DISTINCT n.topic LIMIT 100')
      .then(function(result){
          var topicArray =[];
            result.records.forEach(function(record){
              topicArray.push({
                topic: record._fields[0]
              });

            });
            res.render('pages/index',{
  	        topics: topicArray
            });
          })

    .catch(function(err){
      console.log(err);
    });
});
// End of index page section ----------------------------------

//About page ------------------------------------------------------------------
app.get('/about_us', function(req, res) {
    res.render('pages/about_us');
});
//End of about page section ---------------------------------------------------

//Contact page ------------------------------------------------------------------
app.get('/contact_us', function(req, res) {
    res.render('pages/contact_us');
});
//End of contact page section ---------------------------------------------------

//Topic page ------------------------------------------------------------------
app.get('/topic', function(req, res) {
    res.render('pages/topic');
});
//End of Topic page section ---------------------------------------------------

// Annotate page ------------------------------------------------------------------
var annotateArray =[];//Globally declared to be accesible to a function lower down.
app.get('/annotate',function(req,res){

// var tagline = "Any code of your own that you haven't looked at for six or more months might as w";
// var somethingelse = "THIS IS ANOTHER VARIABLE";

  session
	  .run('MATCH (node1:Opinion)-[]-(node2:Opinion) WITH node1,count(node2) as rels RETURN node1 ORDER BY rels ASC LIMIT 2')

    .then(function(result){
        //var annotateArray =[]; //If don't want it to be global.
        annotateArray =[];
          result.records.forEach(function(record){
            annotateArray.push({
              id: record._fields[0].identity.low,
              argumenttext: record._fields[0].properties.argumenttext,
              topic: record._fields[0].properties.topic

            });

          });
          res.render('pages/annotate',{
        //tagline: tagline,
        //somethingelse: somethingelse,
	      twoopinions: annotateArray
          });
        })


    .catch(function(err){
      console.log(err);
    });
});
// End of more page section ---------------------------------------------------

// THIS MUST REMAIN THE LAST APP>GET & APP>USE PAGE ///

// app.use(function(req, res, next){
//     res.status(404).render('pages/404_error_template', {title: "Sorry, page not found"});
// });

//SECTION FOR "DECLARING" PAGES NOW OVER. ++++++++++++++++++++++++++++++++++++++





//INSIDE $'s: SECTION FOR HTTP POST ACTIONS TO BE CALLED FROM PAGES. $$$$$$$$$$$$$$$$$

//HTTP POST FOR ADDING AN OPINION FROM INDEX PAGE ------------------------------------
app.post('/opinion/add',function(req,res){
  var argumenttext = req.body.argumenttext;
  var topic = req.body.topic;

  session
    .run('CREATE(n:Opinion {argumenttext:{argumenttextParam},topic:{topicParam}}) RETURN n.argumenttext', {argumenttextParam:argumenttext,topicParam:topic})
    .then(function(result){
      res.redirect('/');
      session.close();
    })
    .catch(function(err){
      console.log(err);
    });

      res.redirect('/');
});
//END OF HTTP POST ADD OPINION SECTION ------------------------------------------


//HTTP POST FOR ADDING A RELATIONSHIP FROM ANNOTATE PAGE ------------------------
app.post('/opinion/addrelationship',function(req,res){
  var boxselection = req.body.select;


  session
      .run('MATCH (node1:Opinion {argumenttext:{argumenttextParam1}}) MATCH (node2:Opinion {argumenttext:{argumenttextParam2}}) CREATE (node1)-[relname:'+boxselection+']->(node2)', {argumenttextParam1:annotateArray[0].argumenttext,argumenttextParam2:annotateArray[1].argumenttext})

    .then(function(result){
      res.redirect('/annotate');
      session.close();
    })
    .catch(function(err){
      console.log(err);
    });

      res.redirect('/annotate');
});
//END OF HTTP POST ADD RELATIONSHIP SECTION -----------------------------------

//SECTION FOR HTTP POSTS NOW OVER. $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$





//Listen on port 8080 (make site accessible!).
app.listen(8080);
console.log('8080 is the magic port');
