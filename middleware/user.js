var db = require('./db.js');


function getAliasOwner(req, res, next) {
    console.log('::getAliasOwner');
    var alias = req.params.alias;
    if (!alias) res.send('could not retrieve alias from buffer', 500);

    db.getAliasOwner(alias, function(err, owner) {
	if (err) next(err);
	if (owner) { req.dwane.owner = owner; next(); }
	res.send('no owner of specified alias');
    });
}

/**
 * getAliasMap
 *
 * Finds the owner (cid) of the alias req.dwane.alias
 */
function getAliasMap(req, res, next) {
    console.log('::getAliasMap');
    var alias = req.params.alias;
    if (!alias) res.send('could not retrieve alias from buffer', 500);
    
    db.getAliasMap(alias, function(err, cid) {
	if (err) res.send('problem with database getting alias map');
	console.log('alias map: ' + cid);
	if (cid) { req.dwane.cid = cid; return next(); }
	res.send('could not get map of alias: ' + alias);
    });
}

function getReqAlias(req, res, next) {
    console.log('::getReqAlias');
    var alias = req.params.alias;
    
    if (alias) {
        // an alias was in the request.

        // if alias is in the format 'alias.dwane.co' (sent to us by nginx)
        // then we discard the 'dwane.co'
        var match = alias.match(/[^.]+/);
        if (match) alias = match[0];

	if (!req.dwane) req.dwane = {};
	req.dwane.alias = alias;
	return next();
    }
    res.send('didn\'t receive Alias in request');
}

function getReqUid(req, res, next) {
    console.log('::getReqUid');
    var uid = req.params.uid;
    if (uid) {
	if (!req.dwane) req.dwane = {};
	req.dwane.uid = uid;
	return next();
    }
    res.send('didn\'t receive UID in request');
}

function validateUid(req, res, next) {
    console.log('::validateUid');
    if (/[a-fA-F0-9]{10}-\d/.test(req.dwane.uid)) {
	return next();
    }
    res.send('invalid uid: ' + req.dwane.uid, 400);
}

function validateUser(req, res, next) {
    console.log('::validateuser');
    // @todo some authentication here would be nice

    var uid = req.dwane.uid;

    db.getUser(uid, function(err, number) {
	if (err) res.send('database error 2385');
	if (number) next();
    });
}



module.exports = {
    getAliasOwner: getAliasOwner,
    getAliasMap: getAliasMap,
    getReqAlias: getReqAlias,
    getReqUid: getReqUid,
    validateUid: validateUid,
    validateUser: validateUser
};
    
