var utils = require("../../split/topicPageQuery")
var getAllNodesInTopic = utils.getAllNodesInTopic;


var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();


//Testing the database query that returns two nodes from a specific topic.
describe("getAllNodesInTopic test", function() {


   beforeEach(function(done) {
     //Delete any existing nodes from the relevant test topic first (shouldn't be any around but you never know).
     Promise.all([session.run('MATCH(node:Opinion {argumenttext:"I am for testing",topic:"TESTING131"})DELETE node'),
      ,session.run('MATCH(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING131"})DELETE node')])
     .then(done)
   });
   afterEach(function(done) {
     //Delete test nodes from database.
	    Promise.all([session.run('MATCH(node:Opinion {argumenttext:"I am for testing",topic:"TESTING131"})DELETE node'),
       ,session.run('MATCH(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING131"})DELETE node')])
      .then(done)//then(function() {console.log("IS THIS RUNNING?"); done()})
   });



  it("Runs the query function and checks result length", function(done) {

      //Create at least two nodes in a specific testing topic
      //for the query to find.
      Promise.all(
        [
        session.run('CREATE(node:Opinion {argumenttext:"I am for testing",topic:"TESTING131"})')
        , session.run('CREATE(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING131"})')
      ]
      )
      //Run the function
      .then(function () {
        getAllNodesInTopic(session,"TESTING131").then(function (result) {
        expect(result.records.length).toBe(2);
        done();
      })
    });



  });
});
