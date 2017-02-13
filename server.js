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


// use res.render to load up an ejs view file

// old index page 
//app.get('/', function(req, res) {
//    res.render('pages/index');
//});

//standard middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();




// index page
/*
app.get('/', function(req, res) {


    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
    var tagline = "Any code of your own that you haven't looked at for six or more months might as well have been written by someone else.";
	var somethingelse = "THIS IS ANOTHER VARIABLE";//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

    res.render('pages/index', {
        drinks: drinks,
        tagline: tagline,
		somethingelse: somethingelse//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    });
*/





app.get('/',function(req,res){

    var drinks = [
        { name: 'Bloody Mary', drunkness: 3 },
        { name: 'Martini', drunkness: 5 },
        { name: 'Scotch', drunkness: 10 }
    ];
 var tagline = "Any code of your own that you haven't looked at for six or more months might as w";
        var somethingelse = "THIS IS ANOTHER VARIABLE";//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!






  //res.send('Hello World');
  session
    .run('MATCH(n:Movie) RETURN n LIMIT 100')
    .then(function(result){
        var movieArr =[];
          result.records.forEach(function(record){
            movieArr.push({
              id: record._fields[0].identity.low,
              title: record._fields[0].properties.title,
              year: record._fields[0].properties.year

            });
            //console.log(record._fields[0].properties);
          });
          res.render('pages/index',{
        drinks: drinks,
        tagline: tagline,
        somethingelse: somethingelse,
	 movies: movieArr
          });
        })


    .catch(function(err){
      console.log(err);
    });
});//end of app.get


app.post('/movie/add',function(req,res){
  var title = req.body.title;
  var year = req.body.year;


  session
    .run('CREATE(n:Movie {title:{titleParam},year:{yearParam}}) RETURN n.title', {titleParam:title,yearParam:year})
    .then(function(result){
      res.redirect('/');
      session.close();
    })
    .catch(function(err){
      console.log(err);
    });

      res.redirect('/');
});//end of app post





// about page 
app.get('/about', function(req, res) {
    res.render('pages/about');
});


// more page 
app.get('/more', function(req, res) {
    res.render('pages/more');
});


//Listen on port 8080.
app.listen(8080);
console.log('8080 is the magic port');
