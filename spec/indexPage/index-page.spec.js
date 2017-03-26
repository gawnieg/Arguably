
var utils = require("../../split/indexPageFunctions")
var getAllTopics = utils.getAllTopics;
var generateTopicArray = utils.generateTopicArray;

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();


describe("GetTopicByName test", function() {
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

  it("take a session and return a result", function(done) {
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
