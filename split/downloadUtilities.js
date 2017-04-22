var downloadQuery = function(session) {
  return session.run('MATCH (n:Opinion) OPTIONAL MATCH (n) <-[r:ATTACKS|SUPPORTS|UNRELATED]- (b:Opinion) RETURN DISTINCT ID(n) as id, n.argumenttext as argument, COLLECT(Type(r)) as type, b.argumenttext as reply, ID(b) as replyID ORDER BY id');
}


var getDownloadArray = function(result, DownloadAllArray, replyArray) {

        //console.log(result.records[0]._fields[0]);//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  	    //if the first argument has a reply, push to reply array
  	    if (result.records[0]._fields[3] != null) {
  		var stats = getMode(result.records[0]);
  		replyArray.push({
  		    relatedNode: result.records[0]._fields[3],
  		    relatedNodeID: result.records[0]._fields[4].low,
  		    relation: stats[0],
  		    agreement: stats[1]
  		});
  	    }

  	    for (j = 1; j < result.records.length; j++){

  		//get stats (mode and agreement)
  		stats = getMode(result.records[j]);
  		//if the argument has the same id as the previous
  		if (result.records[j]._fields[0].low == result.records[j - 1]._fields[0].low) {
  		    //if it has replies add to the reply array for that argument
  		    if (result.records[j]._fields[3] != null) {
  			replyArray.push({
  			    relatedNode: result.records[j]._fields[3],
  			    relatedNodeID: result.records[j]._fields[4].low,
  			    relation: stats[0],
  			    agreement: stats[1]
  			});
  		    }
  		} else {
  		    //push to data array
  		    DownloadAllArray.push({
  			argument: result.records[j-1]._fields[1],
  			id: result.records[j-1]._fields[0].low,
  			relatedNodes: replyArray
                      });
  		    //reset reply array and then add the reply for the current argument
  		    replyArray = [];
  		    if (result.records[j]._fields[3] != null) {
  			replyArray.push({
  			    relatedNode: result.records[j]._fields[3],
  			    relatedNodeID: result.records[j]._fields[4].low,
  			    relation: stats[0],
  			    agreement: stats[1]
  			});
  		    }
  		}

              }
  	    //push last argument to data array
  	    DownloadAllArray.push({
  		argument: result.records[result.records.length-1]._fields[1],
  		id: result.records[result.records.length-1]._fields[0].low,
  		relatedNodes: replyArray
              });




}

function getMode(record) {
    //console.log(record);
    var length = record._fields[2].length,
	unrelatedCount = 0,
	supportsCount = 0,
	attacksCount = 0;
    for (i = 0; i < length; i++) {
	if (record._fields[2][i] == "UNRELATED") {
	    unrelatedCount++;
	} else if (record._fields[2][i] == "ATTACKS") {
	    attacksCount++;
	} else {
	    supportsCount++;
	}

    }
    var sum = unrelatedCount + attacksCount + supportsCount;
    //console.log(attacksCount + " " + supportsCount + " " + unrelatedCount);

    if (unrelatedCount >= supportsCount && unrelatedCount >= attacksCount) {
	return ["UNRELATED",unrelatedCount/sum];

    } else if (supportsCount >= attacksCount && supportsCount >= unrelatedCount) {
	return ["SUPPORTS",supportsCount/sum];

    } else {
	return ["ATTACKS",attacksCount/sum];
    }


}

module.exports.getDownloadArray = getDownloadArray;
module.exports.downloadQuery = downloadQuery;
module.exports.getMode = getMode;
