var recursivePrint = function(records, index, printedArr, topicArr) {
//    console.log(records.length);
//    console.log("printed array length: " + printedArr.length);
    //console.log("index: " + index);
    //return if index is out of bounds
    if (index >= records.length) {
	return;
    }
    if (printedArr.indexOf(records[index]._fields[0].identity.low) > -1) {
	recursivePrint(records,index+1,printedArr,topicArr);
	return;
    }
    if (printedArr.length >= records.length) {
	return;
    }


    //return if it's already been "printed"

    //console.log("pushing " + index);
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
	    //console.log("ReplyIndex: " + replyIndex);
	    if (replyIndex >= 0) {
		//print reply
		recursivePrint(records, replyIndex, printedArr, topicArr);
	    }
	}
    }
    //else go to next place in array
    if (records[index]._fields[0].properties.isReply > 0){
	return;
    }

    else recursivePrint(records,index+1,printedArr,topicArr);


}


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
