// server.js
// load the things we need
var express = require('express');
var app = express();

var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;


// set the view engine to ejs
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



// index page -----------------------------------------------------------------
app.get('/',function(req,res){

 var tagline = "Any code of your own that you haven't looked at for six or more months might as w";
        var somethingelse = "THIS IS ANOTHER VARIABLE";


  //res.send('Hello World');
  session
    .run('MATCH(n:Opinion) RETURN n LIMIT 100')
    .then(function(result){
        var movieArr =[];
          result.records.forEach(function(record){
            movieArr.push({
              id: record._fields[0].identity.low,
              title: record._fields[0].properties.argumenttext,
              year: record._fields[0].properties.topic

            });
            //console.log(record._fields[0].properties);
          });
          res.render('pages/index',{
        tagline: tagline,
        somethingelse: somethingelse,
	 movies: movieArr
          });
        })


    .catch(function(err){
      console.log(err);
    });
});//end of app.get
// End of index page section --------------------------------------------------




//About page ------------------------------------------------------------------
app.get('/about', function(req, res) {
    res.render('pages/about');
});
//End of about page section ---------------------------------------------------



var movieArrformore =[];//NOW GLOBAL!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// more page ------------------------------------------------------------------
app.get('/more',function(req,res){

 var tagline = "Any code of your own that you haven't looked at for six or more months might as w";
        var somethingelse = "THIS IS ANOTHER VARIABLE";


  //res.send(stuff...........);
  session
    //.run('MATCH(n:Movie) RETURN n LIMIT 100')
      //.run('MATCH (node1:Opinion)-[:SUPPORTS]-(node2:Opinion) WITH node1,count(node2) as rels RETURN node1 ORDER BY rels ASC LIMIT 2')
	  .run('MATCH (node1:Opinion)-[]-(node2:Opinion) WITH node1,count(node2) as rels RETURN node1 ORDER BY rels ASC LIMIT 2')

    .then(function(result){
        //var movieArrformore =[];
        movieArrformore =[];//NOW GLOBAL!!!!!!!!!!!!!!!!!!!!!!
          result.records.forEach(function(record){
            movieArrformore.push({
              id: record._fields[0].identity.low,
              title: record._fields[0].properties.argumenttext,
              year: record._fields[0].properties.topic

            });
            //console.log(record._fields[0].properties);
          });
          res.render('pages/more',{
        tagline: tagline,
        somethingelse: somethingelse,
	      movies: movieArrformore
          });
        })


    .catch(function(err){
      console.log(err);
    });
});//end of app.get
// End of more page section ---------------------------------------------------





//HTTP POST FOR ADDING A MOVIE ------------------------------------------------
app.post('/opinion/add',function(req,res){
  var argumenttext = req.body.argumenttext;
  var topic = req.body.topic;

  session
    .run('CREATE(n:Opinion {argumenttext:{argumenttextParam},topic:{topicParam}}) RETURN n.title', {argumenttextParam:argumenttext,topicParam:topic})
    .then(function(result){
      res.redirect('/');
      session.close();
    })
    .catch(function(err){
      console.log(err);
    });

      res.redirect('/');
});//end of app post
//END OF HTTP POST ADD MOVIE SECTION ------------------------------------------



//HTTP POST FOR ADDING A RELATIONSHIP -----------------------------------------
app.post('/opinion/addrelationship',function(req,res){
  var boxselection = req.body.select; //Name from annotate (more) page form
  //var somemovies = req.body.movies

  session
      //.run('MATCH (node1:Opinion)-[]-(node2:Opinion) WITH node1, count(node2) as rels CREATE (node1)-[relname:ARELATIONFROMTHESITE]->(node2) RETURN node1 ORDER BY rels ASC LIMIT 1')//,  {selectparam:boxselection})
      //.run('MATCH (node1:Opinion)-[]-(node2:Opinion) WITH node1, count(node2) as rels CREATE (node1)-[relname:'+boxselection+']->(node2) RETURN node1 ORDER BY rels ASC LIMIT 1')
      .run('MATCH (node1:Opinion {argumenttext:{argumenttextParam1}}) MATCH (node2:Opinion {argumenttext:{argumenttextParam2}}) CREATE (node1)-[relname:'+boxselection+']->(node2)', {argumenttextParam1:movieArrformore[0].title,argumenttextParam2:movieArrformore[1].title})

    .then(function(result){
      res.redirect('/more');
      session.close();
    })
    .catch(function(err){
      console.log(err);
    });

    //FOR DEBUG
    console.log(movieArrformore[0].title); //!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

      res.redirect('/more');
});//end of app post
//END OF HTTP POST ADD RELATIONSHIP SECTION -----------------------------------








//Listen on port 8080.
app.listen(8080);
console.log('8080 is the magic port');
