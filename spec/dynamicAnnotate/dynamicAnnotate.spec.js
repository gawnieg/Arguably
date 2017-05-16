var dynAnnotateUtils = require("../../split/dynamicAnnotateFunctions")
var getTwoNodesSpecificTopic = dynAnnotateUtils.getTwoNodesSpecificTopic;


var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();



//Testing the database query that returns two nodes from a specific topic.
describe("getTwoNodesSpecificTopic test", function() {


   beforeEach(function(done) {
     //Delete any existing nodes from the relevant test topic first (shouldn't be any around but you never know).
     Promise.all([session.run('MATCH(node:Opinion {argumenttext:"I am for testing",topic:"TESTING126"})DELETE node'),
      ,session.run('MATCH(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING126"})DELETE node')])
     .then(done)
   });
   afterEach(function(done) {
     //Delete test nodes from database.
	    Promise.all([session.run('MATCH(node:Opinion {argumenttext:"I am for testing",topic:"TESTING126"})DELETE node'),
       ,session.run('MATCH(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING126"})DELETE node')])
      .then(done)
   });



  it("Runs the query function and checks result length", function(done) {

      //Create at least two nodes in a specific testing topic
      //for the query to find.
      Promise.all(
        [
        session.run('CREATE(node:Opinion {argumenttext:"I am for testing",topic:"TESTING126"})')
        , session.run('CREATE(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING126"})')
      ]
      )
      //Run the function
      .then(function () {
        getTwoNodesSpecificTopic(session,"TESTING126").then(function (result) {
        expect(result.records.length).toBe(2);
        done();
      })
    });



  });
});
