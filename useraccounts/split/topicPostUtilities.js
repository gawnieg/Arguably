var addArgument = function (session_db, argumentText, topicParam) {
  return session_db.run('CREATE(n:Opinion {argumenttext:{argumenttextParam},topic:{topicParam},isReply:0, time:timestamp()}) RETURN n.argumenttext',
   {argumenttextParam:argumentText,topicParam:topicParam}
 )
}

module.exports.addArgument = addArgument;
