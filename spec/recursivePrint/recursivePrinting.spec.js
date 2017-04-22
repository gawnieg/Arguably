
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












//The first test just tests the function's output when a mock
//query result of a single node result is input.
describe("Build TopicArray test", function() {
  var a;
  var testResult = {};
  testResult.records=[];
  var printedArr = [],
      topicArr = [];

  var recordOne = {
    _fields : [
      {
        identity: {
          low : 1
        },
        properties:{
          argumenttext: "IAmArgInput",
          topic: "topic",
          isReply: 0
        }
      }, []

    ]
  };

  testResult.records.push(recordOne)


  it("take a single-record result set and return an array", function() {

  recursivePrint(testResult.records, 0, printedArr, topicArr)
    expect(topicArr[0].argumenttext).toBe("IAmArgInput");
  });
});



//The second test gives a mock query result containing
//a reply and duplicate stored "out of order" as input
//and checks that the function outputs a correctly
//"flattened" array.
//Covers additional branches of recursivePrint
describe("Build TopicArray test", function() {
  var a;
  var testResult = {};
  testResult.records=[];
  var printedArr = [],
      topicArr = [];

  var recordOne = {
    _fields : [
      {
        identity: {
          low : 1
        },
        properties:{
          argumenttext: "I am the first argument",
          topic: "topicInput",
          isReply: 0
        }
      },
      [

        //first argument's record/reference to another argument
        //that appears elsewhere in the database and is a reply to it.
        {
              identity: {
                low : 3
              },
              properties:{
                argumenttext: "I am a reply to the first argument",
                topic: "topicInput",
                isReply: 1
              }
            }

      ]

    ]
  };
  var recordTwo = {
    _fields : [
      {
        identity: {
          low : 2
        },
        properties:{
          argumenttext: "I am a second argument",
          topic: "topicInput",
          isReply: 0
        }
      }, []

    ]
  };
  var recordThree = {
    _fields : [
      {
        identity: {
          low : 3
        },
        properties:{
          argumenttext: "I am a reply to the first argument",
          topic: "topicInput",
          isReply: 1
        }
      }, []

    ]
  };

  testResult.records.push(recordOne)
  testResult.records.push(recordTwo)
  testResult.records.push(recordThree)


  it("take a result set and returns a flattened array", function() {

  recursivePrint(testResult.records, 0, printedArr, topicArr)



    expect(topicArr[0].argumenttext).toBe("I am the first argument");
    expect(topicArr[1].argumenttext).toBe("I am a reply to the first argument");
    expect(topicArr[2].argumenttext).toBe("I am a second argument");
  });
});





//This test executes the branch for the case of "incorrect reply records"
//in the findIndex function.
describe("Build TopicArray test", function() {
  var a;
  var testResult = {};
  testResult.records=[];
  var printedArr = [],
      topicArr = [];

  var recordOne = {
    _fields : [
      {
        identity: {
          low : 1
        },
        properties:{
          argumenttext: "I am the first argument",
          topic: "topicInput",
          isReply: 0
        }
      },
      [

        //first argument's record/reference to another argument
        //that appears elsewhere in the database and is a reply to it.
        {
              identity: {
                low : 3
              },
              properties:{
                argumenttext: "I am a reply to the first argument",
                topic: "topicInput",
                isReply: 1
              }
            }

      ]

    ]
  };
  var recordTwo = {
    _fields : [
      {
        identity: {
          low : 2
        },
        properties:{
          argumenttext: "I am a second argument",
          topic: "topicInput",
          isReply: 0
        }
      }, []

    ]
  };
  var recordThree = {
    _fields : [
      {
        identity: {
          low : 3
        },
        properties:{
          argumenttext: "I am a reply to the first argument",
          topic: "topicInput",
          isReply: 1
        }
      }, []

    ]
  };

  testResult.records.push(recordOne)
  testResult.records.push(recordTwo)
  testResult.records.push(recordThree)


  it("runs findIndex looking for a nonexistent node", function() {

  var findIndResult = findIndex(testResult.records,4)

    expect(findIndResult).toBe(-1)
  });
});



describe("Build TopicArray test", function() {
  var a;
  var testResult = {};
  testResult.records=[];
  var printedArr = [],
      topicArr = [];

  var recordOne = {
    _fields : [
      {
        identity: {
          low : 1
        },
        properties:{
          argumenttext: "I am the first argument",
          topic: "topicInput",
          isReply: 0
        }
      },
      [

        //first argument's record/reference to another argument
        //that appears elsewhere in the database and is a reply to it.
        {
              identity: {
                low : 3
              },
              properties:{
                argumenttext: "I am a reply to the first argument",
                topic: "topicInput",
                isReply: 1
              }
            }

      ]

    ]
  };
  var recordTwo = {
    _fields : [
      {
        identity: {
          low : 2
        },
        properties:{
          argumenttext: "I am a second argument",
          topic: "topicInput",
          isReply: 0
        }
      }, []

    ]
  };
  var recordThree = {
    _fields : [
      {
        identity: {
          low : 3
        },
        properties:{
          argumenttext: "I am a reply to the first argument",
          topic: "topicInput",
          isReply: 1
        }
      }, []

    ]
  };

  testResult.records.push(recordOne)
  testResult.records.push(recordTwo)
  testResult.records.push(recordThree)


  it("runs findIndex looking for a nonexistent node", function() {

  var findIndResult = findIndex(testResult.records,3)

    expect(findIndResult).toBe(2)
  });
});
































// console.log(result.records[2]._fields[1]);     This is where the





// var recordOne = {
//   _fields : [
//     {
//       identity: {
//         low : 1
//       },
//       properties:{
//         argumenttext: "blah",
//         topic: "topic"
//       }
//     }
//   ]
// };
// var recordTwo = {
//   _fields : [
//     {
//       identity: {
//         low : 2
//       },
//       properties:{
//         argumenttext: "blah2",
//         topic: "topic2"
//       }
//     }
//   ]
// };









        // {
        //   _fields : [
        //     {
        //       identity: {
        //         low : 3
        //       },
        //       properties:{
        //         argumenttext: "IAmArgInput3",
        //         topic: "topicInput",
        //         isReply: 1
        //       }
        //     }, []
        //
        //   ]
        // }
