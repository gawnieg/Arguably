
var utils = require("../../split/downloadUtilities")
var downloadQuery = utils.downloadQuery;
var getDownloadArray = utils.getDownloadArray;
var getMode = utils.getMode;


var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();


//1st test for pushing results of a downloadquery to an array.
//Simple result with only one "node".
describe("Build downloadArray test", function() {
  // var a;
  var testResult = {};
  testResult.records=[];
  var downloadArray = [],
      replyArray = [];


  var simpleDownloadQueryRecord = {
    _fields : [1, "a test argument", [], null, null]
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
describe("Build downloadArray test", function() {
  // var a;
  var testResult = {};
  testResult.records=[];
  var downloadArray = [],
      replyArray = [];


  var simpleDownloadQueryRecord = {
    _fields : [{low: 1, high:0}, "a test argument", ["UNRELATED"], "a test reply", {low:2, high:0}]
  };

  var simpleDownloadQueryRecord2 = {
    _fields : [{low:1, high:0}, "a test argument", ["SUPPORTS","ATTACKS"], "another test reply", {low:3, high:0}]
  };

  var simpleDownloadQueryRecord3 = {
    _fields : [{low:2, high:0}, "a test reply", [], null, null]
  };

  var simpleDownloadQueryRecord4 = {
    _fields : [{low:3, high:0}, "another test reply", [], null, null]
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
    expect(downloadArray[0].replies[0].reply).toBe("a test reply");
    expect(downloadArray[0].replies[0].relation).toBe("UNRELATED");
    expect(downloadArray[0].replies[0].replyID).toBe(2);
    expect(downloadArray[0].replies[1].reply).toBe("another test reply");
    expect(downloadArray[0].replies[1].relation).toBe("SUPPORTS");
    expect(downloadArray[0].replies[1].replyID).toBe(3);
  });
});



//third test for pushing results of a downloadquery to an array.
//slightly different input and result to execute different branches
describe("Build downloadArray test", function() {
  // var a;
  var testResult = {};
  testResult.records=[];
  var downloadArray = [],
      replyArray = [];


  var simpleDownloadQueryRecord = {
    _fields : [{low: 1, high:0}, "a test argument", ["UNRELATED"], "a test reply", {low:3, high:0}]
  };

  var simpleDownloadQueryRecord2 = {
    _fields : [{low:2, high:0}, "another test argument", ["ATTACKS","ATTACKS"], "another test reply", {low:4, high:0}]
  };

  var simpleDownloadQueryRecord3 = {
    _fields : [{low:3, high:0}, "a test reply", [], null, null]
  };

  var simpleDownloadQueryRecord4 = {
    _fields : [{low:4, high:0}, "another test reply", [], null, null]
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
    expect(downloadArray[0].replies[0].reply).toBe("a test reply");
    expect(downloadArray[0].replies[0].relation).toBe("UNRELATED");
    expect(downloadArray[0].replies[0].replyID).toBe(3);
    expect(downloadArray[1].argument).toBe("another test argument");
    expect(downloadArray[1].replies[0].reply).toBe("another test reply");
    expect(downloadArray[1].replies[0].relation).toBe("ATTACKS");
    expect(downloadArray[1].replies[0].replyID).toBe(4);

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
    _fields : [{low:2, high:0}, "another test argument", ["ATTACKS","ATTACKS"], "another test reply", {low:4, high:0}]
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
