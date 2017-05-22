var d3 = require('d3');

function getArgumentText(object){
  //console.log(object);
  var output = {"nodes": [],
                "links": []};
  var numOfArguments = object.records.length;
  for(num = 0; num < numOfArguments; num++){
    console.log(object.records[num].argument + num);
    output.nodes[num] = {"name" : object.records[num].argument, "id" : num};
  }

  var linkNum = 0;
  for(arg = 0; arg < numOfArguments; arg++){
    if(object.records[arg].relatedNodes[0] != null){
      for(replyNum = 0; replyNum < object.records[arg].relatedNodes.length; replyNum++){
        var sourceId;
        var agreement;
        for(count = 0; count < numOfArguments; count++){
          if(object.records[count].argument == object.records[arg].relatedNodes[replyNum].relatedNode){
            sourceId = count;
            agreement = object.records[arg].relatedNodes[replyNum].agreement * 2;
          }
        }
        var targetId = arg;

        output.links[linkNum] = {"source": sourceId ,"target": targetId ,"weight": agreement}
        linkNum++;
      }
    }
  }

  return output;
}



module.exports.getArgumentText = getArgumentText;
