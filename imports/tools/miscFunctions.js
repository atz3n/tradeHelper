

/**
 * Calculates the percentage difference between two values
 * @param  {string} checkVal value to be checked
 * @param  {string} baseVal  basic value
 * @return {string}          calculated percentage differnce
 */
percentage = function(checkVal, baseVal) {
	return ((checkVal - baseVal) / baseVal) * 100;
}



/**
 * Returns an ObjectId embedded with a given datetime
 * Accepts both Date object and string input
 * @param  {string/Date()} 	  timestamp to be converted
 * @return {string}           objectId to compare with MongoDB id's
 */
function objectIdWithTimestamp(timestamp) {
    // Convert string date to Date object (otherwise assume timestamp is a date)
    if (typeof(timestamp) == 'string') {
        timestamp = new Date(timestamp);
    }

    // Convert date object to hex seconds since Unix epoch
    var hexSeconds = Math.floor(timestamp/1000).toString(16);

    // Create an ObjectId with that hex timestamp
    var constructedObjectId = ObjectId(hexSeconds + "0000000000000000");

    return constructedObjectId;
}
// db.mycollection.find({ _id: { $gt: objectIdWithTimestamp('1980/05/25') } });