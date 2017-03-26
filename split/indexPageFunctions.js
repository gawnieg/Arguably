


var getAllTopics = function(session) {
  return session.run('MATCH (n:Opinion) RETURN DISTINCT n.topic LIMIT 100');
}

var generateTopicArray = function(result) {
  var topicArray =[];
  result.records.forEach(function(record){
      topicArray.push({
        topic: record._fields[0]
        });
      });
  return topicArray;
}

module.exports.getAllTopics = getAllTopics;
module.exports.generateTopicArray = generateTopicArray;
