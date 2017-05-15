var getTwoNodesAnyTopic = function(session) {
  return session.run('MATCH (node1:Opinion) OPTIONAL MATCH (node1)-[r:ATTACKS|SUPPORTS|UNRELATED]-(node2:Opinion) WITH node1, count(r) as rels RETURN node1, rand() AS r ORDER BY rels,r ASC LIMIT 2');
}


var makeTwoNodesArrayStatic = function(result) {

  var annotateArray =[];

  result.records.forEach(function(record){
      annotateArray.push({
          id: record._fields[0].identity.low,
          argumenttext: record._fields[0].properties.argumenttext,
          topic: record._fields[0].properties.topic
          });
        });

    return annotateArray;
}




module.exports.getTwoNodesAnyTopic = getTwoNodesAnyTopic;
module.exports.makeTwoNodesArrayStatic = makeTwoNodesArrayStatic;
