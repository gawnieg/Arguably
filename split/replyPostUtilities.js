//adds a node to the database that is a reply to another node (initialArg) along with a
//relationship between them given by relType
var addReplyNode = function (session,initialArg,replyText,topic,initialID,relType) {
    return session.run("MATCH (initNode: Opinion {argumenttext:{initialArgParam}, topic:{topicParam}}) WHERE ID(initNode) = {initialIDParam} CREATE \
                      (initNode) <- [r:REPLY] - (newNode: Opinion {argumenttext:{replyTextParam}, topic: \
                      {topicParam},isReply: initNode.isReply + 1, time:timestamp()}) CREATE (initNode) <- [rel: " + relType + " ] - (newNode)",
   	                  {initialArgParam: initialArg, replyTextParam: replyText, topicParam: topic, initialIDParam: initialID})
}

module.exports.addReplyNode = addReplyNode;
