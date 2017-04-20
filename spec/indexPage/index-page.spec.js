
var utils = require("../../split/indexPageFunctions")
var getAllTopics = utils.getAllTopics;
var generateTopicArray = utils.generateTopicArray;



var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();




//Testing the database query that returns a distinct list of topics
//in the app.get for the topic selection page. Does the query once,
//adds one new topic (but two new nodes) and checks that the number
//of topics returned only increases by 1 (and not 2).
describe("DistinctGetTopicByName test", function() {
  var initialLength;
   beforeEach(function(done) {
     //Delete any existing nodes from the test topic first (shouldn't be any around but you never know).
     Promise.all([session.run('MATCH(node:Opinion {argumenttext:"I am for testing",topic:"TESTING123"})DELETE node'),
      ,session.run('MATCH(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING123"})DELETE node')])
     .then(done)
   });
   afterEach(function(done) {
     //Delete test node from database.
	    Promise.all([session.run('MATCH(node:Opinion {argumenttext:"I am for testing",topic:"TESTING123"})DELETE node'),
       ,session.run('MATCH(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING123"})DELETE node')])
      .then(done)//then(function() {console.log("IS THIS RUNNING?"); done()})
   });

  it("Compares length of distinct list before and after adds", function(done) {
	//Run the function
  var returnLength;
  getAllTopics(session).then(function (result) {
    returnLength = result.records.length;
  })
  .then(function () {
    Promise.all(
      [
      session.run('CREATE(node:Opinion {argumenttext:"I am for testing",topic:"TESTING123"})')
      , session.run('CREATE(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING123"})')
    ]
    )
  .then(function () {
    getAllTopics(session).then(function (result) {
      expect(result.records.length).toBe(returnLength + 1);
      done();
    })

      })
    });
  });
});




//Testing the generateTopicArray function used to build an array from
//neo4j query results in the app.get for the topic selection page.
//Mimics a result output from a neo4j query, calls the generateTopicArray
//function on it and checks the output.
describe("Build TopicArray test", function() {
  var a;
  var testResult = {};
  testResult.records=[];
  var singleRecord = {
    _fields : [
      {
          singleRecordTopic: "Some Topic"
      }
    ]
  };
  testResult.records.push(singleRecord)
  it("take a result set and return an array", function() {
    a = generateTopicArray(testResult)

    //expect(a[0].id).toBe(1);
    //expect(a[0].argumenttext).toBe("blah");
    expect(a[0].topic.singleRecordTopic).toBe("Some Topic");
  });
});
