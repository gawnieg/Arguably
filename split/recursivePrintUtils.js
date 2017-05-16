//recursive depth first search to display comments on a topics page
var recursivePrint = function(records, index, printedArr, topicArr) {

    //return if index is out of bounds
    if (index >= records.length) {
	       return;
    }
    if (printedArr.indexOf(records[index]._fields[0].identity.low) > -1) {
	    recursivePrint(records,index+1,printedArr,topicArr);
	    return;
    }
    //return if it's already been "printed"
    if (printedArr.length >= records.length) {
	    return;
    }


    printedArr.push(records[index]._fields[0].identity.low);
    topicArr.push({
        id: records[index]._fields[0].identity.low,
        argumenttext: records[index]._fields[0].properties.argumenttext,
        topic: records[index]._fields[0].properties.topic,
	    isReply: records[index]._fields[0].properties.isReply
    });

    //if node has replies
    if (records[index]._fields[1].length > 0) {
    	var i;
    	for (i = records[index]._fields[1].length - 1; i >= 0 ; i--) {
    	    //find index of each reply
    	    var replyIndex = findIndex(records, records[index]._fields[1][i].identity.low);
    	    if (replyIndex >= 0) {
        		//print reply
        		recursivePrint(records, replyIndex, printedArr, topicArr);
    	    }
    	}
    }

    if (records[index]._fields[0].properties.isReply > 0){
	    return;
    }

    //else go to next place in array
    else recursivePrint(records,index+1,printedArr,topicArr);
}

//finds the index of a reply within the array return from the database query
var findIndex = function(records, item) {
    var i;
    for (i = 0; i < records.length; i++) {
    	if (records[i]._fields[0].identity.low == item) {
    	    return i;
    	}
    }
    return -1;
}

module.exports.recursivePrint = recursivePrint;
module.exports.findIndex = findIndex;
