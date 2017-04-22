// testS
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


//INSIDE +'s: SECTION FOR "DECLARING" PAGES. ++++++++++++++++++++++++++++++++++++++++++++++++++++++

//Dynamic topic page creation - james

//var globalMostRecentTopic = "not configured";
app.get('/topicspage/:name', function(req, res){

    session
        .run("MATCH (a:Opinion) WHERE a.topic = \"" + decodeURIComponent(req.params.name) +  "\" OPTIONAL MATCH ((a) <- [r:REPLY] - (b:Opinion)) WITH a,collect(b) AS replies ORDER BY a.time RETURN a,replies")


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
app.get('/annotate',function(req,res){


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
app.get('/annotate_topic/:name', function(req, res){

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

//Contact page ------------------------------------------------------------------
app.get('/contact_us', function(req, res) {
    res.render('pages/contact_us');
});
//End of contact page section ---------------------------------------------------




//SECTION FOR DOWNLOAD ALL BUTTON ON HOMEPAGE
app.get('/download_all',function(req,res){
    //declare array for all data and a separate one for replies
    var DownloadAllArray=[];
    var replyArray = [];
    session
        .run('MATCH (n:Opinion) OPTIONAL MATCH (n) <-[r:ATTACKS|SUPPORTS|UNRELATED]- (b:Opinion) RETURN DISTINCT ID(n) as id, n.argumenttext as argument, COLLECT(Type(r)) as type, b.argumenttext as reply, ID(b) as replyID ORDER BY id')
        .then(function(result){



	    //if the first argument has a reply, push to reply array
	    if (result.records[0]._fields[3] != null) {
		var stats = getMode(result.records[0]);
		replyArray.push({
		    reply: result.records[0]._fields[3],
		    replyID: result.records[0]._fields[4].low,
		    relation: stats[0],
		    agreement: stats[1]
		});
	    }

	    for (j = 1; j < result.records.length; j++){

		//get stats (mode and agreement)
		stats = getMode(result.records[j]);
		//if the argument has the same id as the previous
		if (result.records[j]._fields[0].low == result.records[j - 1]._fields[0].low) {
		    //if it has replies add to the reply array for that argument
		    if (result.records[j]._fields[3] != null) {
			replyArray.push({
			    reply: result.records[j]._fields[3],
			    replyID: result.records[j]._fields[4].low,
			    relation: stats[0],
			    agreement: stats[1]
			});
		    }
		} else {
		    //push to data array
		    DownloadAllArray.push({
			argument: result.records[j-1]._fields[1],
			id: result.records[j-1]._fields[0].low,
			replies: replyArray
                    });
		    //reset reply array and then add the reply for the current argument
		    replyArray = [];
		    if (result.records[j]._fields[3] != null) {
			replyArray.push({
			    reply: result.records[j]._fields[3],
			    replyID: result.records[j]._fields[4].low,
			    relation: stats[0],
			    agreement: stats[1]
			});
		    }
		}

            }
	    //push last argument to data array
	    DownloadAllArray.push({
		argument: result.records[result.records.length-1]._fields[1],
		id: result.records[result.records.length-1]._fields[0].low,
		replies: replyArray
            });


	    var obj = {"records": DownloadAllArray};
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


function getMode(record) {
    //console.log(record);
    var length = record._fields[2].length,
	unrelatedCount = 0,
	supportsCount = 0,
	attacksCount = 0;
    for (i = 0; i < length; i++) {
	if (record._fields[2][i] == "UNRELATED") {
	    unrelatedCount++;
	} else if (record._fields[2][i] == "ATTACKS") {
	    attacksCount++;
	} else {
	    supportsCount++;
	}

    }
    var sum = unrelatedCount + attacksCount + supportsCount;
    //console.log(attacksCount + " " + supportsCount + " " + unrelatedCount);

    if (unrelatedCount >= supportsCount && unrelatedCount >= attacksCount) {
	return ["UNRELATED",unrelatedCount/sum];

    } else if (supportsCount >= attacksCount && supportsCount >= unrelatedCount) {
	return ["SUPPORTS",supportsCount/sum];

    } else {
	return ["ATTACKS",attacksCount/sum];
    }


}

//Doesn't actually seem to work - talk 2 da krew!!
function fleissKappa(records) {
    var n = sum(records),
	k = records.length, // number of categories an opinion can be categorised as
	prop = 0,
	agreeExtent = 0;
    //console.log(n + " " + k);
    for (i = 0; i < k; i++) {
	var tempProp = parseInt(records[i]._fields[1]);
	prop += (tempProp * tempProp)/(n*n);
	agreeExtent += (tempProp) * (tempProp);
    }
    //console.log(prop);
    agreeExtent = (agreeExtent - n)/(n*(n-1));
    //console.log(agreeExtent);
    var kappa = (agreeExtent - prop)/(1-prop);

    return kappa;
}





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
app.post('/opinion/addArgToTopic',function(req,res){
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
app.listen(8080);
console.log('Site accessible on 8080');
