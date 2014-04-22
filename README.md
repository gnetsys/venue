# venue

A node.js module to create a web radio.

This will list every single file (subdirectories included) in a folder and will play them randomly while avoiding to repeat a particular song.

## Dependencies

* express: 4.0.x
* walk: 2.3.x
* socket.io: "0.9.x
* colors: 0.6.x

## Installation

`npm install venue`

## Usage

First and foremost create a `server.js` file and import venue

````javascript
var fm = require("venue");
````

Then, to launch the most basic form of web radio just write

````javascript
fm.launch();
````

But if you want to customize every detail of the app, you can do so in this manner

````javascript
fm.launch({
	title:	"VenueFM",
	 path:	"/usr/me/music",
	  res:	"/usr/me/docs",
	  css:	__dirname + "/stylesheet.css",
	 port:	8080,
});
````

Every paramerer is optionnal. As soon as you see the line 
'info  - Server started, listening on port ...', the server is ready

## Styling

When first launching venue, without any CSS file attached, this will be the look:

![Default CSS](http://i.imgur.com/RVx3fvz.png)

Yes, it's not that great, but it was intended to be very flexible, and as such, with a single CSS file and two jpegs dropped into the resource folder, here's a better result:

![Custom CSS](http://i.imgur.com/lISsNay.png)

For any curious person, [here's the CSS](https://gist.github.com/Saming/11176723). It will also help anyone which wants to understand what is possible and how to do it faster.

## Issues

As of v0.1, venue is intended for a unique user only, however it will more or less work with multiple users.

* If a new user connects, the current song will be discarded and a new one will be pushed to all users.
* Every user has access to pause and forwward controls
