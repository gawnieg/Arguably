const postUtilities = require('../../split/topicPostUtilities');

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();



//Testing the function used to add arguments of new topics
//from the topic selection page. Runs the function with a Testing
//input then checks the database to see if the appropriate node
//has been created.
describe("AddArgument test", function () {


  it("add a new argument", function () {
    postUtilities.addArgument(session, "I am for testing argument adding", "TESTING124")
    .then(function () {

       //Put in function that checks if we have added to DB
      session.run('MATCH(node:Opinion {argumenttext:"I am for testing argument adding",topic:"TESTING124"}) RETURN node')
      .then(function (result) {

        expect(result.records.length).toEqual(1);
        expect(result.records[0]._fields[0].properties.argumenttext).toBe("I am for testing argument adding");

        session.run('MATCH(node:Opinion {argumenttext:"I am for testing argument adding",topic:"TESTING124"}) DELETE node')
         //done();   //Async callback for beforeeach and aftereach
        })
      })
    })
})
