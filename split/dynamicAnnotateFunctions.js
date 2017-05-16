//returns two nodes to annotate from the topic "annotateTopicName"
var getTwoNodesSpecificTopic = function(session,annotateTopicName) {
  return session.run('MATCH (node1:Opinion {topic: \"'+annotateTopicName+'\"}) OPTIONAL MATCH (node1)-[r:ATTACKS|SUPPORTS|UNRELATED]-(node2:Opinion) WITH node1, count(r) as rels RETURN node1, rand() AS r ORDER BY rels, r ASC LIMIT 2');
}


module.exports.getTwoNodesSpecificTopic = getTwoNodesSpecificTopic;
