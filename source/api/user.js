var redis = require('redis');



function findOrCreate(id, callback) {
    //    user.findOrCreate = function(id, fn) {
    // finds the specified user id. if specified user id doesn't exit, create the user

    var rclient = redis.createClient(null, null, {"retry_max_delay": "180000"});    

    rclient.get('user/' + id, function(err, reply) {
        if (err) console.log('err: ' + err);// throw err;
        if (reply) {
//		console.log('REDIS: reply received: ');
//		console.dir(reply.toString());
                callback(null, reply.toString());
	}
    });
}
    


//    app.get('/api/user/get', function (req, res) {
//        res.send(findOrCreate('234', function(err, usr) {
//            if (err) throw err;
//            console.log('eh im usering: ' + usr.toString());
//            return usr;
//        }));
//    });  



//console.log('at some point im being called');




module.exports = {
    findOrCreate: findOrCreate
};









// DATABASE
//
// account_types:
//   0: free
//   1: premium
//
// idea: users have a 'version' configuration, where they can choose the version of dawan that they use
//
// 'wans' is the number of WAN ports the user has on their router
// 'update_time' is an array of time in milliseconds that the user's client will contact the master server.
//     Each array element is for the user's different WANs. ie each WAN has it's own update interval.



// id = INCR next.users.id

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

