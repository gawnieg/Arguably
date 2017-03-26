var addArgument = function (session, argumentText, topicParam) {
  return session.run('CREATE(n:Opinion {argumenttext:{argumenttextParam},topic:{topicParam},isReply:0, time:timestamp()}) RETURN n.argumenttext',
   {argumenttextParam:argumentText,topicParam:topicParam}
 )
}

module.exports.addArgument = addArgument;
