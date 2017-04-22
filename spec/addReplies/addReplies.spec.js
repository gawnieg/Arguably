const replyPostUtilities = require('../../split/replyPostUtilities');

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();





//Testing the function used to add replies on a topic page. Runs
//the function with a Testing input then checks the database to see
//if the appropriate node has been created.
describe("AddArgument test", function () {


  // beforeEach(function(done) {
  //   //Delete any existing nodes from the test topic first (shouldn't be any around but you never know).
  //   Promise.all([session.run('MATCH(node:Opinion {topic:"TESTING124"})DELETE node'),
  //    ,session.run('MATCH(node:Opinion {topic:"TESTING124"})DELETE node')])
  //   .then(done)
  // });
  afterEach(function(done) {
  //   //Delete test nodes from database.
      Promise.all([session.run('MATCH(node:Opinion {argumenttext:"I am for testing reply adding",topic:"TESTING127"}) DELETE node'),
       ,session.run('MATCH(node:Opinion {argumenttext:"I am an initial node for testing reply adding",topic:"TESTING127"}) DELETE node')])
      .then(done)//then(function() {console.log("IS THIS RUNNING?"); done()})
  });


  it("add a new node and reply node", function () {
    var testingInitNodeID;


    session.run('CREATE(n:Opinion {argumenttext:\"I am an initial node for testing reply adding\",topic:\"TESTING127\",isReply:0, time:timestamp()}) RETURN n')

    //.then(function() {
    .then(function(result) {
      //run function to add reply to test node
      //console.log(result);
      testingInitNodeID = result.records[0]._fields[0].identity.low;
      //console.log(testingInitNodeID);
      replyPostUtilities.addReplyNode(session, "I am an initial node for testing reply adding", "I am for testing reply adding", "TESTING127", testingInitNodeID, "UNRELATED")

      //console.log("stuff still happening")

    .then(function () {

//Put in function that checks if we have added to DB


      session.run('MATCH(node:Opinion {argumenttext:"I am for testing reply adding",topic:"TESTING127"}) RETURN node')
      .then(function (result) {

        //expect(result.records.length).toBe(2);
        //console.log(result.records[0].properties.argumenttext);
        //expect(result.records[0].properties.argumenttext).toBe("2");

        console.log(result.records.length)
        expect(result.records.length).toEqual(1);
        console.log(result.records[0]._fields[0].properties.argumenttext);
        expect(result.records[0]._fields[0].properties.argumenttext).toBe("I am for testing reply adding 222");

        //session.run('MATCH(node:Opinion {argumenttext:"I am for testing argument adding",topic:"TESTING124"})DELETE node')

              //session.run('MATCH(node:Opinion {argumenttext:"I am for testing reply adding",topic:"TESTING127"}) MATCH(node2:Opinion {argumenttext:"I am an initial node for testing reply adding",topic:"TESTING127"}) DELETE node, node2')

              done();   //Async callback for beforeeach and aftereach - they're screwed up right now so just using line above.
        })

      })
    })
    })
})
