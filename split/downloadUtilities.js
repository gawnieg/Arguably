var downloadQuery = function(session) {
  return session.run('MATCH (n:Opinion) OPTIONAL MATCH (n) <-[r:ATTACKS|SUPPORTS|UNRELATED]- (b:Opinion) RETURN DISTINCT ID(n) as id, n.argumenttext as argument, n.topic AS nTopic, COLLECT(Type(r)) as type, b.argumenttext as reply, ID(b) as replyID, b.topic AS bTopic ORDER BY id');
}

var downloadQueryTopic = function(session, topicName) {
	//console.log(topicName);
	  return session.run("MATCH (n:Opinion) WHERE n.topic = \"" + topicName + 
	  "\" OPTIONAL MATCH (n) <-[r:ATTACKS|SUPPORTS|UNRELATED]- (b:Opinion) WHERE b.topic = \"" + topicName +
	  "\"RETURN DISTINCT ID(n) as id, n.argumenttext as argument, n.topic AS nTopic, COLLECT(Type(r)) as type, b.argumenttext as reply, ID(b) as replyID, b.topic AS bTopic ORDER BY id");

}

var getDownloadArray = function(result, DownloadAllArray, replyArray) {

  	    //if the first argument has a reply, push to reply array
  	    if (result.records[0]._fields[4] != null) {
  		var stats = getMode(result.records[0]);
  		replyArray.push({
  		    relatedNode: result.records[0]._fields[4],
  		    relatedNodeID: result.records[0]._fields[5].low,
			relatedNodeTopic: result.records[0]._fields[6],
			allRelations: {
					Unrelated: stats[2][0],
					Attacks: stats[2][1],
					Supports: stats[2][2]
				},
  		    majorityRelation: stats[0],
  		    agreement: stats[1]
  		});
  	    }

  	    for (j = 1; j < result.records.length; j++){

  		//get stats (mode and agreement)
  		stats = getMode(result.records[j]);
  		//if the argument has the same id as the previous
  		if (result.records[j]._fields[0].low == result.records[j - 1]._fields[0].low) {
  		    //if it has replies add to the reply array for that argument
  		    if (result.records[j]._fields[4] != null) {
  			replyArray.push({
  			    relatedNode: result.records[j]._fields[4],
  			    relatedNodeID: result.records[j]._fields[5].low,
				relatedNodeTopic: result.records[j]._fields[6],
				allRelations: {
					Unrelated: stats[2][0],
					Attacks: stats[2][1],
					Supports: stats[2][2]
				},
  			    majorityRelation: stats[0],
  			    agreement: stats[1]
  			});
  		    }
  		} else {
  		    //push to data array
  		    DownloadAllArray.push({
				argument: result.records[j-1]._fields[1],
				id: result.records[j-1]._fields[0].low,
				topic: result.records[j-1]._fields[2],
				relatedNodes: replyArray
            });
  		    //reset reply array and then add the reply for the current argument
  		    replyArray = [];
  		    if (result.records[j]._fields[4] != null) {
  			replyArray.push({
  			    relatedNode: result.records[j]._fields[4],
  			    relatedNodeID: result.records[j]._fields[5].low,
				relatedNodeTopic: result.records[j]._fields[6],
				allRelations: {
					Unrelated: stats[2][0],
					Attacks: stats[2][1],
					Supports: stats[2][2]
				},
  			    majorityRelation: stats[0],
  			    agreement: stats[1]
  			});
  		    }
  		}

              }
  	    //push last argument to data array
  	    DownloadAllArray.push({
			argument: result.records[result.records.length-1]._fields[1],
			id: result.records[result.records.length-1]._fields[0].low,
			topic: result.records[result.records.length-1]._fields[2],
			relatedNodes: replyArray
        });


}

function getMode(record) {
    //console.log(record);
    var length = record._fields[3].length,
	unrelatedCount = 0,
	supportsCount = 0,
	attacksCount = 0;
    for (i = 0; i < length; i++) {
		if (record._fields[3][i] == "UNRELATED") {
			unrelatedCount++;
		} else if (record._fields[3][i] == "ATTACKS") {
			attacksCount++;
		} else {
			supportsCount++;
		}

    }
    var sum = unrelatedCount + attacksCount + supportsCount;
    //console.log(attacksCount + " " + supportsCount + " " + unrelatedCount);

    if (unrelatedCount >= supportsCount && unrelatedCount >= attacksCount) {
		return ["UNRELATED",unrelatedCount/sum, [unrelatedCount, attacksCount, supportsCount]];

    } else if (supportsCount >= attacksCount && supportsCount >= unrelatedCount) {
		return ["SUPPORTS",supportsCount/sum, [unrelatedCount, attacksCount, supportsCount]];

    } else {
		return ["ATTACKS",attacksCount/sum, [unrelatedCount, attacksCount, supportsCount]];
    }


}

module.exports.getDownloadArray = getDownloadArray;
module.exports.downloadQuery = downloadQuery;
module.exports.getMode = getMode;
module.exports.downloadQueryTopic = downloadQueryTopic;
