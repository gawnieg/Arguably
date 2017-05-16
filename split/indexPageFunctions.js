//returns all distinct topics in the database for the index page
var getAllTopics = function(session) {
  return session.run('MATCH (n:Opinion) RETURN DISTINCT n.topic LIMIT 100');
}

//creates an array of topics from the result of getAllTopics
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
