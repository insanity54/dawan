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
- [ ] server (backend) functionality which accepts IP address updates from user's client, stores it in a db.