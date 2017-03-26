const postUtilities = require('../../split/postUtilities');

var neo4j = require('neo4j-driver').v1;
var driver = neo4j.driver('bolt://localhost',neo4j.auth.basic('neo4j','goats'));
var session = driver.session();

describe("Boo", function () {

  //Need a beforeeach and aftereach that do the deletes
  //before and after. The test below will add and check.

  it("add a new argument", function () {
    postUtilities.addArgument(session, "REEEEEEE", "Not normies")
    .then(function () {
//Put in function that checks if we have added to DB
      done()
      })
    })
})
