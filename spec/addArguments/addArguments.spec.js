const postUtilities = require('../../split/topicPostUtilities');

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();






describe("Boo", function () {




  // beforeEach(function(done) {
  //   //Delete any existing nodes from the test topic first (shouldn't be any around but you never know).
  //   Promise.all([session.run('MATCH(node:Opinion {topic:"TESTING124"})DELETE node'),
  //    ,session.run('MATCH(node:Opinion {topic:"TESTING124"})DELETE node')])
  //   .then(done)
  // });
  // afterEach(function(done) {
  //   //Delete test node from database.
  //    Promise.all([session.run('MATCH(node:Opinion {topic:"TESTING124"})DELETE node'),
  //     ,session.run('MATCH(node:Opinion {argumenttext:"topic:"TESTING124"})DELETE node')])
  //    .then(done)//then(function() {console.log("IS THIS RUNNING?"); done()})
  // });




  it("add a new argument", function () {
    postUtilities.addArgument(session, "I am for testing argument adding", "TESTING124")
    .then(function () {

//Put in function that checks if we have added to DB
      session.run('MATCH(node:Opinion {argumenttext:"I am for testing argument adding",topic:"TESTING124"}) RETURN node')
      .then(function (result) {
        //expect(result.records.length).toBe(2);
        //console.log(result.records[0].properties.argumenttext);
        //expect(result.records[0].properties.argumenttext).toBe("2");

        expect(result.records.length).toEqual(1);
        console.log(result.records[0]._fields[0].properties.argumenttext);
        expect(result.records[0]._fields[0].properties.argumenttext).toBe("I am for testing argument adding");

        //session.run('MATCH(node:Opinion {argumenttext:"I am for testing argument adding",topic:"TESTING124"})DELETE node')

              session.run('MATCH(node:Opinion {argumenttext:"I am for testing argument adding",topic:"TESTING124"}) DELETE node')
              //done();   //Async callback for beforeeach and aftereach - they're screwed up right now so just using line above.
        })
      })
    })
})
