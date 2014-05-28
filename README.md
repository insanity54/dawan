dawan
=====

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
  - [ ] Add new user *n* to redis with client id *x*
    - generate cid (openssl rand -hex 5) => *x* + '-0'
    - INCR user/index => *n*
    - SET user/*n*/id *x*
    - SET client/*x* *n*
  - [ ] Add new machine *n* to redis and associate with user *u*
    - INCR machine/index => *n*
    - SET machine/*n*/owner *u*
    - SADD user/*u*/machines *n*
  - [ ] Network aliases (subdomains) for users
    - [ ] Create new alias in db
      - Create alias *a* belonging to user id *u* and set alias forward to updater client IP *c*
        - SET alias/*a*/owner *u*
	- SET alias/*a*/forward *c*
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
