dawan
=====

[![Dependency Status](https://david-dm.org/insanity54/dawan.png)](https://david-dm.org/insanity54/dawan)

A work in progress of a web service which provides a method for multi-wan routers to use DDNS, regardless of whether or not the router firmware provides DDNS support.


Installation
------------

Dwane server installation

1. Install redis (//redis.io/download)
2. $ npm install && npm start

Dwane user

4. Open a web browser and point it to http://[@todo dwane server address]
5. Create an account & login
6. Go to administrative control panel
7. Follow the guide to configure WAN ports and build client configuration. In this step, users tell Dwane how many WAN ports their routers have. For each WAN port, users map a specific, Dwane-provided TCP port to each. For example, the user tells Dwane that their router has three WAN ports. Dwane gives the user 10 TCP ports to choose from, 7270-7280. Using the web interface, the user maps WAN port 1 to TCP port 7272, WAN port 2 to TCP port 7275, and WAN port 3 to TCP port 7270.
8. Configure your multi-WAN router to use the WAN port configuration you just made. Do this by associating outgoing TCP traffic on port 7272 to WAN port 1, TCP traffic on port 7275 to WAN port 2, and outgoing TCP traffic on port 7270 to WAN port 3.
9. Download client (your choice of optware or shell script), and install on either your router, or a *nix computer.




Work-in-progress task list
--------------------------

- [ ] web GUI for user account creation, configuration, and management
- [ ] client application which runs in user's LAN, sends IP address updates to server
- [ ] server (backend) functionality which accepts IP address updates from user's client, stores it in a db.