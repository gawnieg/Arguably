// testS
// server.js
// load the things we need
var graphenedbURL = process.env.GRAPHENEDB_BOLT_URL||'bolt://hobby-cmmcbflhoeaggbkemgjdphpl.dbs.graphenedb.com:24786';
var graphenedbUser = process.env.GRAPHENEDB_BOLT_USER||'app68637605-SiF9LC';
var graphenedbPass = process.env.GRAPHENEDB_BOLT_PASSWORD||'b.xP9txs0iJHbd.hWoV5mFVKkVlR2SH';
var port = process.env.PORT || 8080;

//This is to bring express - app is the express object which links us to express
var express = require('express'); // - express is the module name
var app = express(); // this is the express app which gives us access to ex[presses' functionality
//express() fires the express function giving us access

var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var session1      = require('express-session');
var configDB = require('./config/database.js');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var neo4j = require('neo4j-driver').v1;

mongoose.connect(configDB.url); // connect to our databas
 require('./config/passport')(passport);


// set the view engine to ejs - now by default it will look for views in the view folder
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname,'views'));

//standard middleware
app.use(logger('dev'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,'public')));

// required for passport
app.use(session1({ secret: 'aodhganIsAHerokuGod' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


//Neo4j Driver
//var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var driver = neo4j.driver(graphenedbURL, neo4j.auth.basic(graphenedbUser, graphenedbPass));
var session = driver.session();

var d3 = require('d3');



// Importing code from other files
const utils = require("./split/indexPageFunctions")
// Make functions from imported file's code available within this file
const getAllTopics = utils.getAllTopics;
const generateTopicArray = utils.generateTopicArray;


const topicPostUtils = require('./split/topicPostUtilities');
const addArgument = topicPostUtils.addArgument;


const staticAnnotateUtils = require('./split/staticAnnotateFunctions');
const getTwoNodesAnyTopic = staticAnnotateUtils.getTwoNodesAnyTopic;
const makeTwoNodesArrayStatic = staticAnnotateUtils.makeTwoNodesArrayStatic;


const dynamicAnnotateUtils = require('./split/dynamicAnnotateFunctions');
const getTwoNodesSpecificTopic = dynamicAnnotateUtils.getTwoNodesSpecificTopic;
const makeTwoNodesArrayDynamic = dynamicAnnotateUtils.makeTwoNodesArrayDynamic;


const annotatePostUtils = require('./split/annotatePostUtilities');
const addRelationship = annotatePostUtils.addRelationship;

const recursivePrintUtils = require('./split/recursivePrintUtils');
const recursivePrint = recursivePrintUtils.recursivePrint;

const replyPostUtilities = require('./split/replyPostUtilities');
const addReplyNode = replyPostUtilities.addReplyNode;

const topicPageQuery = require('./split/topicPageQuery');
const getAllNodesInTopic = topicPageQuery.getAllNodesInTopic;

const downloadUtilities = require('./split/downloadUtilities');
const downloadQueryTopic = downloadUtilities.downloadQueryTopic;
const getDownloadArray = downloadUtilities.getDownloadArray;
const downloadQuery = downloadUtilities.downloadQuery;

const searchUtilities = require('./split/searchUtilities');
const getSearchResults = searchUtilities.getSearchResults;
const getSearchArray = searchUtilities.getSearchArray;

//INSIDE +'s: SECTION FOR "DECLARING" PAGES. ++++++++++++++++++++++++++++++++++++++++++++++++++++++


app.post('/login', passport.authenticate('local-login', {
    successRedirect : '/main', // redirect to the secure profile section
    failureRedirect : '/login', // redirect back to the signup page if there is an error
    failureFlash : true // allow flash messages
}));
app.get('/login', function(req, res) {

    // render the page and pass in any flash data if it exists
    res.render('pages/login.ejs', { message: req.flash('loginMessage') });
});
app.get('/signup', function(req, res) {

     // render the page and pass in any flash data if it exists
     res.render('pages/signup.ejs', { message: req.flash('signupMessage') });
 });

 app.post('/signup', passport.authenticate('local-signup', {
     successRedirect : '/main', // redirect to the secure profile section
     failureRedirect : '/signup', // redirect back to the signup page if there is an error
     failureFlash : true // allow flash messages
 }));

 app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}


//Dynamic topic page creation - james

//var globalMostRecentTopic = "not configured";
app.get('/topicspage/:name', function(req, res){

    var nameForTopic = decodeURIComponent(req.params.name);
    getAllNodesInTopic(session, nameForTopic)



	.then(function(result){
            //var topicArray =[];
	    var topicArray =[],
		testArr = [],
		printedArr = [];

	    recursivePrint(result.records, 0, printedArr, topicArray);

            res.render('pages/topicspage',{
                which_topic: decodeURIComponent(req.params.name),
                topics: topicArray
            });
        })

	.catch(function(err){
	    console.log(err);
	});


});





// Annotate page (ALL TOPICS) ------------------------------------------------------------------
app.get('/annotate',isLoggedIn,function(req,res){


  getTwoNodesAnyTopic(session)


  .then(makeTwoNodesArrayStatic)


  .then(function(annotateArray) {
      res.render('pages/annotate', {twoopinions: annotateArray});
  })


	.catch(function(err){
	   console.log(err);
	});


});


// FACTORED OUT FUNCTIONS



// End of annotate page (ALL TOPICS) section ---------------------------------------------------





// Dynamic annotate page creation
app.get('/annotate_topic/:name', isLoggedIn, function(req, res){

  var nameForAnnotateTopic = decodeURIComponent(req.params.name);


  getTwoNodesSpecificTopic(session, nameForAnnotateTopic)


  //.then(makeTwoNodesArrayDynamic)
  .then(makeTwoNodesArrayStatic)


  .then(function(annotateArrayTwo) {
      res.render('pages/annotate_topic', {which_topic: nameForAnnotateTopic, twoopinions: annotateArrayTwo});
  })


	.catch(function(err){
	   console.log(err);
	});


});


// FACTORED OUT FUNCTIONS

// Dynamic annotate page creation - END



// index page -----------------------------------------------------------------
app.get('/index',function(req,res){

  getAllTopics(session).then(generateTopicArray).then(function(topicArray) {
	session.close();
	res.render('pages/index',{
	    topics: topicArray
	})
    })
	.catch(function(err){
	    console.log(err);
	});
});
// End of index page section ----------------------------------

//Main page ------------------------------------------------------------------
app.get('/', function(req, res) {
    res.render('pages/main');
});
//End of about page section ---------------------------------------------------

//Data page ------------------------------------------------------------------
app.get('/data_page', function(req, res) {
    res.render('pages/data_page');
});
//End of about page section ---------------------------------------------------

//Main page ------------------------------------------------------------------
app.get('/main', function(req, res) {
    res.render('pages/main');
});
//End of about page section ---------------------------------------------------

//Easter_egg page ------------------------------------------------------------------
app.get('/easter_egg', function(req, res) {
    res.render('pages/easter_egg');
});
//End of about page section ---------------------------------------------------

//graphical_view page ------------------------------------------------------------------
app.get('/graphical_view', function(req, res) {
    res.render('pages/graphical_view');
});
//End of about page section ---------------------------------------------------

//Contact page ------------------------------------------------------------------
app.get('/contact_us', function(req, res) {
    res.render('pages/contact_us');
});
//End of contact page section ---------------------------------------------------



//SECTION FOR DOWNLOAD ALL BUTTON ON HOMEPAGE
app.get('/download_all',isLoggedIn,function(req,res){
    //declare array for all data and a separate one for replies
    var DownloadAllArray=[];
    var replyArray = [];


    downloadQuery(session)

        .then(function(result){
            var obj;
            console.log(result.records.length)
            if (result.records.length == 0) {
                obj = {"records": []};
            } else {
                getDownloadArray(result,DownloadAllArray,replyArray);
                obj = {"records": DownloadAllArray};
            }

            var json = JSON.stringify(obj, null, 4);//prep the data, this is essential
            var filename = 'all_data.json';
            var mimetype = 'application/json';
            res.setHeader('Content-Type', mimetype);
            res.setHeader('Content-disposition','attachment; filename='+filename);
            res.send( json );//send the file to the client
        })

        .catch(function(err){
            console.log(err);
        });

});
//end of download all ----------------------------------------------



//topic specific download buttons
app.get('/downloadTopic/:name',isLoggedIn,function(req,res){

    //declare array for all data and a separate one for replies
    var DownloadAllArray=[];
    var replyArray = [];
    var topicName = decodeURIComponent(req.params.name);

    downloadQueryTopic(session, topicName)

        .then(function(result){
            getDownloadArray(result,DownloadAllArray,replyArray);


            var obj = {"records": DownloadAllArray};
            var json = JSON.stringify(obj, null, 4);//prep the data, this is essential
            var filename = 'data.json';
            var mimetype = 'application/json';
            res.setHeader('Content-Type', mimetype);
            res.setHeader('Content-disposition','attachment; filename='+filename);
            res.send( json );//send the file to the client
        })

        .catch(function(err){
            console.log(err);
        });

});

app.get('/search_results/:name', function(req,res){
    var searchRequest = decodeURIComponent(req.params.name);
    console.log(searchRequest);
    getSearchResults(session,searchRequest).then(getSearchArray)
    .then(function(searchArray){
        res.render('pages/search_results', {
          searchRequest: searchRequest,
          searchArray: searchArray
        });
    })
    .catch(function(err){
  	    console.log(err);
  	});

})

//end of topic specific download ----------------------------------------------

app.post('/search', function(req,res){
    //var searchResultArray = [];
    var searchRequest = req.body.request;



        //var searchArray = [];
        res.redirect('/search_results/' + encodeURIComponent(searchRequest));
        //session.close();

        //res.redirect('/index');
    //})

    //.catch(function(err){
    //  console.log(err);
    //})

})

// THIS MUST REMAIN THE LAST APP>GET & APP>USE PAGE ///

// app.use(function(req, res, next){
//     res.status(404).render('pages/404_error_template', {title: "Sorry, page not found"});
// });




//SECTION FOR "DECLARING" PAGES NOW OVER. ++++++++++++++++++++++++++++++++++++++


//INSIDE $'s: SECTION FOR HTTP POST ACTIONS TO BE CALLED FROM PAGES. $$$$$$$$$$$$$$$$$

//HTTP POST FOR ADDING AN OPINION FROM INDEX PAGE ------------------------------------
app.post('/opinion/add',isLoggedIn, function(req,res){
    var argumenttext = req.body.argumenttext;
    var topic = req.body.topic;


  addArgument(session, argumenttext, topic)


	.then(function(result){
    	session.close();
	    res.redirect('/index');
	})


	.catch(function(err){
	    console.log(err);
	});


});
//END OF HTTP POST ADD OPINION SECTION ------------------------------------------



//HTTP POST FOR ADDING AN OPINION TO A PARTICULAR TOPIC PAGE  ------------------------------------
app.post('/opinion/addArgToTopic',isLoggedIn,function(req,res){
    var argumenttext = req.body.argumenttext;
    var topic = decodeURIComponent(req.body.Topic);


  addArgument(session, argumenttext, topic)


	.then(function(result){
	    session.close();
	    res.redirect('/topicspage/' + encodeURIComponent(topic));
	})


	.catch(function(err){
	    console.log(err);
	});


});
//END OF HTTP POST FOR ADDING AN OPINION TO A PARTICULAR TOPIC PAGE  ------------------------------------



//HTTP POST FOR ADDING A RELATIONSHIP FROM ANNOTATE PAGE ------------------------
app.post('/opinion/addrelationship/:id1/:id2',function(req,res){
    var boxselection = req.body.select;
    var id1 = req.params.id1;
    var id2 = req.params.id2;


  addRelationship(session,boxselection,id1,id2)


	.then(function(result){
    	session.close();
	    res.redirect('/annotate');

	})


	.catch(function(err){
	    console.log(err);
	});

    //REDIRECTS LIKE THIS ARE WRONG - CAUSING ERRORS IN CONSOLE LOG. JUST HAVE THE ONE ABOVE IN .THEN
    //res.redirect('/annotate');
});
//END OF HTTP POST ADD RELATIONSHIP SECTION -----------------------------------



//HTTP POST FOR ADDING A RELATIONSHIP FROM ANNOTATE BY TOPIC PAGE ------------------------
app.post('/opinion/addrelationship_byopinion/:topic/:id1/:id2',function(req,res){
    var boxselection = req.body.select;
    var id1 = req.params.id1;
    var id2 = req.params.id2;

    var topic = encodeURIComponent(req.params.topic);
    console.log("topic in server: " + topic);

    addRelationship(session,boxselection,id1,id2)


	.then(function(result){
    	session.close();
	    res.redirect('/annotate_topic/' + topic);
	})


	.catch(function(err){
	    console.log(err);
	});

});
//END OF HTTP POST ADD RELATIONSHIP BY TOPIC SECTION -----------------------------------



//HTTP POST FOR ADDING A REPLY ON A TOPIC PAGE ------------------------
app.post('/opinion/addReply', function(req,res) {
    var replyText = req.body.reply;
    var topic = decodeURIComponent(req.body.Topic);
    var initialArg = decodeURIComponent(req.body.initialArg);
    var initialID = require('neo4j-driver').v1.int(req.body.id);
    var relType = req.body.relType;

  addReplyNode(session,initialArg,replyText,topic,initialID,relType)

	.then(function(result){
	    res.redirect('/topicspage/' + encodeURIComponent(topic));
	    session.close();
	})
	.catch(function(err){
	    console.log(err);
	});




    console.log(req.body);


});
//END OF HTTP POST FOR ADDING A REPLY ON A TOPIC PAGE ------------------------



//SECTION FOR HTTP POSTS NOW OVER. $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$






//Listen on port 8080 (make site accessible!).
app.listen(port);
console.log('Site accessible on 8080');








// //Doesn't actually seem to work - talk 2 da krew!!
// function fleissKappa(records) {
//     var n = sum(records),
// 	k = records.length, // number of categories an opinion can be categorised as
// 	prop = 0,
// 	agreeExtent = 0;
//     //console.log(n + " " + k);
//     for (i = 0; i < k; i++) {
// 	var tempProp = parseInt(records[i]._fields[1]);
// 	prop += (tempProp * tempProp)/(n*n);
// 	agreeExtent += (tempProp) * (tempProp);
//     }
//     //console.log(prop);
//     agreeExtent = (agreeExtent - n)/(n*(n-1));
//     //console.log(agreeExtent);
//     var kappa = (agreeExtent - prop)/(1-prop);
//
//     return kappa;
// }
