
var utils = require("../../split/downloadUtilities")
var downloadQuery = utils.downloadQuery;
var getDownloadArray = utils.getDownloadArray;
var getMode = utils.getMode;


var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();


//1st test for pushing results of a downloadquery to an array.
//Simple result with only one "node".
describe("Build downloadArray test 1", function() {
  // var a;
  var testResult = {};
  testResult.records=[];
  var downloadArray = [],
      replyArray = [];


  var simpleDownloadQueryRecord = {
    _fields : [1, "a test argument", "a test topic", [], null, null]
  };

   testResult.records.push(simpleDownloadQueryRecord)


  it("take a result set and return an array", function() {
    getDownloadArray(testResult, downloadArray, replyArray);
    //console.log(downloadArray);
    //expect(a[0].id).toBe(1);
    //expect(a[0].argumenttext).toBe("blah");
    expect(downloadArray[0].argument).toBe("a test argument");
  });
});



//Second test for pushing results of a downloadquery to an array.
//More complex result.
describe("Build downloadArray test 2", function() {
  // var a;
  var testResult = {};
  testResult.records=[];
  var downloadArray = [],
      replyArray = [];


  var simpleDownloadQueryRecord = {
    _fields : [{low: 1, high:0}, "a test argument", "a test topic", ["UNRELATED"], "a test reply", {low:2, high:0}, "a test topic"]
  };

  var simpleDownloadQueryRecord2 = {
    _fields : [{low:1, high:0}, "a test argument", "a test topic", ["SUPPORTS","ATTACKS"], "another test reply", {low:3, high:0}, "a test topic"]
  };

  var simpleDownloadQueryRecord3 = {
    _fields : [2, "a test reply", "a test topic", [], null, null]
  };

  var simpleDownloadQueryRecord4 = {
    _fields : [{low:3, high:0}, "another test reply", "a test topic", [], null, null]
  };

  testResult.records.push(simpleDownloadQueryRecord);
  testResult.records.push(simpleDownloadQueryRecord2);
  testResult.records.push(simpleDownloadQueryRecord3);
  testResult.records.push(simpleDownloadQueryRecord4);

  it("take a result set and return an array", function() {
    getDownloadArray(testResult, downloadArray, replyArray);
    console.log(downloadArray[0]);
    //expect(a[0].id).toBe(1);
    //expect(a[0].argumenttext).toBe("blah");
    expect(downloadArray[0].argument).toBe("a test argument");
    expect(downloadArray[0].relatedNodes[0].relatedNode).toBe("a test reply");
    expect(downloadArray[0].relatedNodes[0].majorityRelation).toBe("UNRELATED");
    expect(downloadArray[0].relatedNodes[0].relatedNodeID).toBe(2);
    expect(downloadArray[0].relatedNodes[1].relatedNode).toBe("another test reply");
    expect(downloadArray[0].relatedNodes[1].majorityRelation).toBe("SUPPORTS");
    expect(downloadArray[0].relatedNodes[1].relatedNodeID).toBe(3);
  });
});



//third test for pushing results of a downloadquery to an array.
//slightly different input and result to execute different branches
describe("Build downloadArray test 3", function() {
  // var a;
  var testResult = {};
  testResult.records=[];
  var downloadArray = [],
      replyArray = [];


  var simpleDownloadQueryRecord = {
    _fields : [{low: 1, high:0}, "a test argument", "a test topic", ["UNRELATED"], "a test reply", {low:3, high:0}, "a test topic"]
  };

  var simpleDownloadQueryRecord2 = {
    _fields : [{low:2, high:0}, "another test argument", "a test topic", ["ATTACKS","ATTACKS"], "another test reply", {low:4, high:0}, "a test topic"]
  };

  var simpleDownloadQueryRecord3 = {
    _fields : [{low:3, high:0}, "a test reply", "a test topic", [], null, null]
  };

  var simpleDownloadQueryRecord4 = {
    _fields : [{low:4, high:0}, "another test reply", "a test topic", [], null, null]
  };

  testResult.records.push(simpleDownloadQueryRecord);
  testResult.records.push(simpleDownloadQueryRecord2);
  testResult.records.push(simpleDownloadQueryRecord3);
  testResult.records.push(simpleDownloadQueryRecord4);

  it("take a result set and return an array", function() {
    getDownloadArray(testResult, downloadArray, replyArray);
    //console.log(downloadArray);
    //expect(a[0].id).toBe(1);
    //expect(a[0].argumenttext).toBe("blah");
    expect(downloadArray[0].argument).toBe("a test argument");
    expect(downloadArray[0].relatedNodes[0].relatedNode).toBe("a test reply");
    expect(downloadArray[0].relatedNodes[0].majorityRelation).toBe("UNRELATED");
    expect(downloadArray[0].relatedNodes[0].relatedNodeID).toBe(3);
    expect(downloadArray[1].argument).toBe("another test argument");
    expect(downloadArray[1].relatedNodes[0].relatedNode).toBe("another test reply");
    expect(downloadArray[1].relatedNodes[0].majorityRelation).toBe("ATTACKS");
    expect(downloadArray[1].relatedNodes[0].relatedNodeID).toBe(4);

  });
});





//Separate test just for getMode to isolate/pinpoint any potential errors
describe("getMode test", function() {
  // var a;
  // var testResult = {};
  // testResult.records=[];
  // var downloadArray = [],
  //     replyArray = [];


  var simpleDownloadQueryRecord = {
    _fields : [{low:2, high:0}, "another test argument", "a test topic", ["ATTACKS","ATTACKS"], "another test reply",{low:4, high:0}, "a test topic", ]
  };


  // testResult.records.push(simpleDownloadQueryRecord);
  // testResult.records.push(simpleDownloadQueryRecord2);
  // testResult.records.push(simpleDownloadQueryRecord3);
  // testResult.records.push(simpleDownloadQueryRecord4);

  it("take a record and return the mode", function() {
    var result1 = getMode(simpleDownloadQueryRecord);

    expect(result1[0]).toBe("ATTACKS");
    expect(result1[1]).toBe(1);

  });
});
