var statAnnotateUtils = require("../../split/staticAnnotateFunctions")
var getTwoNodesAnyTopic = statAnnotateUtils.getTwoNodesAnyTopic;
var makeTwoNodesArrayStatic = statAnnotateUtils.makeTwoNodesArrayStatic;

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();



//Testing the function that builds an array for use in page rendering
//in the app.get for the annotate (all topics) page. Mimics a result
//output from a neo4j query, calls the makeTwoNodesArrayStatic function
//on it and checks the output.
describe("Build Two Node Result Array Test", function() {
  var builtResult;
  var testTwoNodeArr = {};
  testTwoNodeArr.records=[];

  //Simulate two neo4j nodes to test the array build.
  var recordOne = {
    _fields : [
      {
        identity: {
          low : 1
        },
        properties:{
          argumenttext: "blah",
          topic: "topic"
        }
      }
    ]
  };
  var recordTwo = {
    _fields : [
      {
        identity: {
          low : 2
        },
        properties:{
          argumenttext: "blah2",
          topic: "topic2"
        }
      }
    ]
  };
  //Push the nodes to an array (similar to how they'd be returned
  //from a query!)
  testTwoNodeArr.records.push(recordOne)
  testTwoNodeArr.records.push(recordTwo)

  it("take a result set and return an array", function() {
	//Run the function
    builtResult = makeTwoNodesArrayStatic(testTwoNodeArr)

	//Test the results
    expect(builtResult[0].id).toBe(1);
    expect(builtResult[0].argumenttext).toBe("blah");
    expect(builtResult[0].topic).toBe("topic");
    expect(builtResult[1].id).toBe(2);
    expect(builtResult[1].argumenttext).toBe("blah2");
    expect(builtResult[1].topic).toBe("topic2");
  });
});





//Testing the database query that returns two nodes from any topic.
describe("getTwoNodesAnyTopic test", function() {


   beforeEach(function(done) {
     //Delete any existing nodes from the relevant test topic first (shouldn't be any around but you never know).
     Promise.all([session.run('MATCH(node:Opinion {argumenttext:"I am for testing",topic:"TESTING125"})DELETE node'),
      ,session.run('MATCH(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING125"})DELETE node')])
     .then(done)
   });
   afterEach(function(done) {
     //Delete test nodes from database.
	    Promise.all([session.run('MATCH(node:Opinion {argumenttext:"I am for testing",topic:"TESTING125"})DELETE node'),
       ,session.run('MATCH(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING125"})DELETE node')])
      .then(done)
   });



  it("Runs the query function and checks result length", function(done) {

      //Create at least two nodes in a testing topic so we know that
      //there are some for the query to find.
      Promise.all(
        [
        session.run('CREATE(node:Opinion {argumenttext:"I am for testing",topic:"TESTING125"})')
        , session.run('CREATE(node:Opinion {argumenttext:"I am also for testing",topic:"TESTING125"})')
      ]
      )
      //Run the function
      .then(function () {
        getTwoNodesAnyTopic(session).then(function (result) {
        expect(result.records.length).toBe(2);
        done();
      })
    });


  });
});
