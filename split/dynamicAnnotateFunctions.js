var getTwoNodesSpecificTopic = function(session,annotateTopicName) {
  return session.run('MATCH (node1:Opinion {topic: \"'+annotateTopicName+'\"}) OPTIONAL MATCH (node1)-[r]-(node2:Opinion) WITH node1, count(r) as rels RETURN node1 ORDER BY rels ASC LIMIT 2');
}


var makeTwoNodesArrayDynamic = function(result) {

  var annotateArrayTwo =[];

  result.records.forEach(function(record){
      annotateArrayTwo.push({
          id: record._fields[0].identity.low,
          argumenttext: record._fields[0].properties.argumenttext,
          topic: record._fields[0].properties.topic
          });
        });

    return annotateArrayTwo;
}




module.exports.getTwoNodesSpecificTopic = getTwoNodesSpecificTopic;
module.exports.makeTwoNodesArrayDynamic = makeTwoNodesArrayDynamic;
