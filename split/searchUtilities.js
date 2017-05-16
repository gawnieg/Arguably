//returns all topics from database that include searchRequest (case insensitve)
var getSearchResults = function(session, searchRequest) {
    return session.run("MATCH (n:Opinion) WHERE n.topic =~ \"(?i).*" + searchRequest + ".*\" RETURN DISTINCT n.topic LIMIT 100");

}

//creates an array from the topics returned from getSearchResults
var getSearchArray = function(result) {
  var searchArray =[];
  for(i = 0; i < result.records.length; i++){
      searchArray.push({
        topic: result.records[i]._fields[0]
        });
  }
  return searchArray;
}

module.exports.getSearchResults = getSearchResults;
module.exports.getSearchArray = getSearchArray;
