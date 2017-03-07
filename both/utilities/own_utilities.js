/**
 * Returns the user role
 * @param  {string} userId id of user
 * @return {string}        role of user
 */
this.getUserRole = function(userId) {
	return Users.findOne({_id: userId}).roles[0];
}


/**
 * Returns the user account name
 * @param  {string} userId id of user
 * @return {string}        users account name
 */
this.getUserName = function(userId) {
	return Users.findOne({_id: userId}).profile.name;
}

this.convertCamelCaseToUnderscore = function(string) {
	return string.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "_" + y.toLowerCase()}).replace(/^_/, "");
}