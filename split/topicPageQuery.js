//returns every comment within a certain topic (given by nameForTopic)
var getAllNodesInTopic = function(session,nameForTopic) {
    return session.run("MATCH (a:Opinion) WHERE a.topic = \"" + nameForTopic + "\" OPTIONAL MATCH ((a) <- [r:REPLY] - (b:Opinion)) WITH a,collect(b) AS replies ORDER BY a.time RETURN a,replies");
}


module.exports.getAllNodesInTopic = getAllNodesInTopic;
