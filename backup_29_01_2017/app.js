var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;


var app = express();

// view engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine','ejs');

//standard middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();


//set home page message
app.get('/',function(req,res){
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
          res.render('index',{
            movies: movieArr
          });
        })



          //second session to get actors
          /*
          session
            .run('MATCH(n:Actor) RETURN n LIMIT 25')
            .then(function(result2){
              var actorArr = [];
              result2.records.forEach(function(record){
                actorArr.push({
                  id: record._fields[0].identity.low,
                  name: record._fields[0].properties.name
                  });
              });
              res.render('index',{
                movies: movieArr,
                actors: actorArr
              });
            })
            .catch(function(err){
              console.log(err);
            });

    })// end of .then()

    */
    .catch(function(err){
      console.log(err);
    });


});


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




app.listen(3636);
console.log('Server started on port 3000');

module.exports=app;
