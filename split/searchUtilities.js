var getSearchResults = function(session, searchRequest) {
    //console.log("HELLO ");
    console.log("MATCH (n:Opinion) WHERE n.topic =~ \"(?i).*" + searchRequest + ".*\" RETURN DISTINCT n.topic LIMIT 100");
    return session.run("MATCH (n:Opinion) WHERE n.topic =~ \"(?i).*" + searchRequest + ".*\" RETURN DISTINCT n.topic LIMIT 100");
    //return session.run('MATCH (n:Opinion) RETURN DISTINCT n.topic LIMIT 100');
}

var getSearchArray = function(result) {
  console.log(result.records);
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
