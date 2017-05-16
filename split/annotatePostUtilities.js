//database query to add the relationship given by boxselection between nodes id1 and id2 
var addRelationship = function(session,boxselection,id1,id2) {
  return session.run("MATCH (node1) WHERE id(node1) = "+id1+"  MATCH  (node2) WHERE id(node2) = "+id2+" CREATE (node1)-[relname:"+boxselection+"]->(node2)");
}


module.exports.addRelationship = addRelationship;
