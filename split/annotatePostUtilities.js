var addRelationship = function(session,boxselection,id1,id2) {
  console.log(id1 + " " + id2 + " " + boxselection);
  return session.run("MATCH (node1) WHERE id(node1) = "+id1+"  MATCH  (node2) WHERE id(node2) = "+id2+" CREATE (node1)-[relname:"+boxselection+"]->(node2)");
}


module.exports.addRelationship = addRelationship;
