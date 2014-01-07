var redis = require('redis');

var rclient = redis.createClient(null, null, {"retry_max_delay": "180000"});

/**
 *  create
 *
 *  Connects to the redis db, adds user data
 *
 *  @param user     user object containing username, email
 *  @callback done  called when user account info has been created in db
 */
function create(user, done) {
    // id does not exist in db, so add it to the db
    var id = 'twitter.' + user.id;
    var args = [ 'users', 0, id ];
    rclient.ZADD(args, function(err, response) {
        if (err) throw err;

        // successfully added id to the db. Add account info to db
        console.log('added ' + response + ' items');
        var args = [
            'user/' + id + '/account',
            'name', user.name,
            'email', user.email,
            'password', user.password,
            'plan', '1'
        ];

        rclient.hmset(args, function(err, response) {
            if (err) throw err;

            // successfully added account info to db.
            done(null, 0);

        });
    });
}

/**
 *  findById
 *
 *  Connects to the redis database, retrieves user data using specified user id
 *
 *  @param id       the user's ID number
 *  @callback done  called when done finding user. (err, user)
 *                  If user was found, user is populated with info from db, else null
 */
function findById(id, done) {
    
    console.log('findById method here. id is: ' + id);
    rclient.hgetall('user/' + id + '/account', function(err, reply) {
        if (err) done(err, null); // if there was an error with redis, callback with error

        if (reply) {
            // redis replied with something
            console.log('findById method here. REDIS: reply received: ');
            console.dir(reply);
            done(null, reply);

	} else {
            // we didn't get a reply, that means the user doesn't exist.
            console.log('findById method here. didn\'t get a reply from redis. (likely means user doesn\'t exist)');
            done(null, null);
	}
    });
}


/**
 *  findTwitter
 *
 *  Displays whether or not the specified twitter user ID exists in the db
 *
 *  @param id       twitter id number with 'twitter.' prepended
 *  @callback done  called when done determining existence. (err, found)
 *                  found = 1 if exists, else 0
 */
function findTwitter(id, done) {
    findById('twitter.' + id, function(err, user) {
        if (err) done(err, null);
        done(null, user);
    });
}

/**
 *  addAccount
 *
 *  Utlity function. Adds user account info to database
 *
 *  @param id       the user's ID number
 *  @param 
 *  @callback done  called when done finding user. (err, user)
 */
function addAccount(callback) {

}

/**
 *  findOrCreate
 *
 *  Connects to the redis database, retrieves user data using specified user id.
 *  If user does not exist in db, it is created.
 *
 *  @param id       the user's ID number
 *  @callback done  called when done finding user. (err, user)
 */
function findOrCreate(user, callback) {

    findById(id, function(err, callback) {
        if (err) {

	}
    });
}



    //    user.findOrCreate = function(id, fn) {
    // finds the specified user id.
    // if specified user id doesn't exit, create the user

//    console.log('user module here. my find or create method was called.');

//    var rclient = redis.createClient(null, null, {"retry_max_delay": "180000"});    

//    rclient.get('user/' + id, function(err, reply) {
//        if (err) { console.log('rclient eror: ' + err); }
////         if (reply) {
//             console.log('findOrCreate method here. REDIS: reply received: ');
// //          console.dir(reply.toString());
//             callback(null, reply.toString());

// 	} else {
//             // @todo if we didn't get a reply, that means the user doesn't exist. we need to create the user entry in the db
//             console.log('findOrCreate method here. didn\'t get a reply from redis.');
//             callback(null, 'terd'); // @todo this line is a test. delete or modify
// 	}
//     });
// }
    




//    app.get('/api/user/get', function (req, res) {
//        res.send(findOrCreate('234', function(err, usr) {
//            if (err) throw err;
//            console.log('eh im usering: ' + usr.toString());
//            return usr;
//        }));
//    });  



//console.log('at some point im being called');


module.exports = {
    findTwitter: findTwitter,
    findOrCreate: findOrCreate,
    findById: findById,
    create: create
};









// DATABASE
//
// account plans:
//   0: free
//   1: pro
//
// idea: users have a 'version' configuration, where they can choose the version of dawan that they use
//
// 'wans' is the number of WAN ports the user has on their router
// 'update.time' is an array of time in milliseconds that the user's client will contact the master server.
//     Each array element is for the user's different WANs. ie each WAN has it's own update interval.


// user registered account locally. Create new user in db
//
//     $id = 'local.' + <INCR next.user.id>
//
//     ZADD users 0 local.$id
//     HSET user/id/account name john email john@example.com password rosebud plan 1
//     HSET user/$id/config wans 2 update.time '3000 6000'


// user logged in for the first time via twitter
//
//    $id = 'twitter.' + <twitter id>
//
//    ZADD users 0 $id
//    HSET user/$id/account name <twitter account name> email 0 password 0 plan 1
//    HSET user/$id/config wans 2 update.time '3000 6000'


// user logged in for the first time via google
//
//    $id = <google id>
//
//    ZADD users 0 $id
//    HSET user/$id/account name <google account name> email 0 password 0 plan 1
//    HSET user/$id/config wans 2 update.time '3000 6000'







// see if user 54 is in db
// SISMEMBER users 54

// user/$id 


// SET users:$id id
// SET users:$id:account:name 'george henry'
// SET users:$id:account:email george@example.com
// SET users:$id:account:password rosebud
// SET users:$id:account:type 1
// SET users:$id:config:wans 1
// SET users:$id:config:update.time '3000 6000'

// if id exists
//     pull user keys from db

// else user does not exist
//     create user

// if id exists



        
        
//     pull user keys from db

// else user does not exist
//     create user



// client.set("skey", "hello worldy", redis.print);
// //client.hset("hkey", "hashtest 1", "someval", redis.print);
// client.mset(["test keys 1", "test val 1", "test keys 2", "test val 2"], function (err, res) {});
// client.hset(["hkey", "hashtestt 2", "some other valuee"], redis.print);
// client.hkeys("hkey", function(err, replies) {
//     console.log(replies.length + " replies: ");

//     replies.forEach(function (reply, i) {
//         console.log("    " + i + ": " + reply);
//     });
//     client.quit();
// });






    // client.set("users", users, function(err, result) {
    // client.get("users", function(err, result) {
       // console.dir(result);                                                                                                                 
    //  });
    // });
    //};

