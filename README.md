dawan
=====

[![Greenkeeper badge](https://badges.greenkeeper.io/insanity54/dawan.svg)](https://greenkeeper.io/)

A work in progress of a web service which provides a method for multi-wan routers to use DDNS, regardless of whether or not the router firmware provides DDNS support.


Installation
------------

1. Install redis (//redis.io/download)
2. $ npm install
3. $ npm start


Work-in-progress task list
--------------------------

- [ ] web GUI for user account creation, configuration, and management
- [ ] client application which runs in user's LAN, sends IP address updates to server
  - [ ] Google chrome plugin
    - [x] Basic GUI
    - [x] Basic update interval timer
    - [ ] Authentication
- [ ] server (backend) functionality which accepts IP address updates from user's client, stores it in a db.
  - [ ] Add *n*th user with *uid* to redis
    - generate uid (openssl rand -hex 5) => *uid*
    - add uid generator version to end of uid. *uid* = *uid* + '-0'
    - INCR user/index => *n*
    - SET user/*uid*/number *n*
  - [ ] Add new machine *n* to redis and associate with user *u*
    - INCR machine/index => *n*
    - SET machine/*n*/owner *u*
    - SADD user/*u*/machines *n*
  - [ ] Network aliases (subdomains) for users
    - [ ] Create new alias in db
      - Create alias *a* belonging to user id *u* and map alias to updater client *c* IP
        - SISMEMBER alias/alls *a* => ?    If true, ERROR!!! (alias already exists)
        - SET alias/*a*/owner *u*
	- SET alias/*a*/map *c*
	- SADD alias/alls *a*
    - [ ] Get alias owner from db
    - [ ] Update alias owner or forward
    - [ ] Delete alias
  - [x] Store recent history of machine IP addresses reported by the dwane client.
    - Add received IP address *a* for machine *m* to the recent history.
      - *e* = (new Date).getTime();  // e is epoch
      - ZADD machine/*m*/ip/recentz *e* *a*
      - Clear IP address updates older than admin configured value!
  - [x] Store lifetime history of all different IP addresses reported by the dwane client. This is for a screen with a table that shows, "All IP addresses received from this host: x, y, z", "first seen: xx, yy, zz"
    - Store IP address *a* from machine *m* to the lifetime history
      - ZSCORE machine/*m*/ip/lifetimez *a* => *s*  // has this IP address been reported before? returns the member's score which is epoch of when IP address was first seen. If it's new, *s* == nil.
      - if ( *s* == nil )   // this is the first time the machine has reported this IP address.
        - *e* = (new Date).getTime();  // e is epoch
        - ZADD machine/*m*/ip/lifetimez *e* *a*
  - [ ] Create temporary account for new user. Temp user can register later using a server generated key.
  - [ ] Users have configured update interval, which are overriden if user configures update intervals for individual clients.
    - set client/*cid*/config/updateInterval 300000
    - set user/*uid*/config/updateInterval 300000
  - [ ] Server must validate client's update request.
    - [ ] Server must not allow client to update more often than it's configured uptateInterval
    - [ ] Server must authenticate client
  - [ ] DNS server for the subdomains
    - [ ] Respond to iterative queries with one of these four possible responses
      - The answer to the query accompanied by any CNAME records (aliases) that may be useful. The response will indicate that the data is cached. (since we can't guarantee the user's IP is updated)
      - An error indicating the domain or host does not exist (NXDOMAIN). This response may also contain CNAME records that pointed to the non-existing host.
      - A temporary error indication, for instance, can't access other DNS's due to network error etc...
      - A referral: we received a query to a zone that isn't dwane.co
  - [ ] User and Admin Control Panel
    - [ ] Authentication
    - [ ] Account creation
    - [ ] display of lifetime IP updates
    - [ ] display of recent IP updates
    



Attribution
-----------

DNS Concepts from zytrax.com http://www.zytrax.com/books/dns/ch2/#iterative (CC-BY-NC 4.0 License)

Dashboard Bootstrap Template from http://www.bootply.com/download/85861 (MIT License)

