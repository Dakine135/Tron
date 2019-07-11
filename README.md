# FrameRate

Snake/Tron/Whatever

### Installing

need to install nodejs recommended https://nodejs.org/en/ then

```
npm install express socketio node-gameloop -g nodemon mongodb
```

## Running

In terminal/command navigate to Tron directory. Start node server with

```
mongod --dbpath=Path/to/data/
nodemon FrameRate.js
```
It will automatically detect code changes and refresh the node server.
Clients will still need to be refreshed.
Clients can connect at

```
localhost:3033
```

## Deployment

Hosted at welbornhome.duckdns.org on Unbunut 17 Sever running pm2 node package manager proxied through nginx

## Built With

* JavaScript
* Nodejs
* MongoDB
* P5 js

## Authors

* **Tyler Barton**
* **Dustin Welborn**


See also the list of [contributors](https://github.com/Tweasy65/Tron/graphs/contributors) who participated in this project.
