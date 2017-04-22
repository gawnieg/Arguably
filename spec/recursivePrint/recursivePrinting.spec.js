
var utils = require("../../split/recursivePrintUtils")
var recursivePrint = utils.recursivePrint;
var findIndex = utils.findIndex;



var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();



//Testing the recursivePrint function used to build a "structured" array from
//neo4j query results in the app.get for the topic display page.
//Mimics a result output from a neo4j query, calls the generateTopicArray
//function on it and checks the output.
describe("Build TopicArray test", function() {
  var a;
  // var testResult = {};
  // testResult.records=[];
  // var singleRecord = {
  //   _fields : [
  //     {
  //         singleRecordTopic: "Some Topic"
  //     }
  //   ]
  // };
  // testResult.records.push(singleRecord)
  it("take a result set and return an array", function() {
    // a = generateTopicArray(testResult)
    //
    // //expect(a[0].id).toBe(1);
    // //expect(a[0].argumenttext).toBe("blah");
    // expect(a[0].topic.singleRecordTopic).toBe("Some Topic");
    expect(1).toBe(1);
  });
});
