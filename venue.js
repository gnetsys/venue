// requirements
var express	= require('express'),
	app		= express(),
	server	= require('http').createServer(app),
	io		= require('socket.io').listen(server),
	walk	= require('walk'),
	colors	= require('colors');

// reduce logging
io.set('log level', 1);

function venue(data) {
	console.log("   info  - ".cyan + "venue started");

	var that = this;

	if(data !== undefined) {
		this.title	= (data.title === undefined ? "VenueFM" : data.title);
		this.path	= (data.path === undefined ? __dirname + "/music" : data.path);
		this.port	= (data.port === undefined ? 80 : data.port);
		this.res	= (data.res === undefined ? __dirname : data.res);
		this.css	= (data.css === undefined ? (__dirname + '/default.css') : ( data.res !== undefined ? data.res + "/" : "" ) + data.css);
	}

	this.can	= [];
	this.cant	= [];

	this.current = -1;

	this.launch = function() {
		console.log("   info  - ".cyan + "Started to find files in directory '" + this.path + "'");

		that.walker = walk.walk(this.path, { followLinks: false });

		that.walker.on('file', function(root, stat, next) {
			var crap = stat.name.split("."),
				type = crap[crap.length - 1];

			if(type === "mp3" || type === "ogg" || type === "wav")
				that.can.push(root.replace(that.path, "") + "/" + stat.name);

			next();
		});

		that.walker.on('end', function() {
			console.log("   ok    - ".green + "Found the following number of files: " + that.can.length);	

			app.use( express.static(that.path) );

			app.use('/resource', express.static(that.res));

			app.get('/', function (req, res) {
				res.sendfile(__dirname + '/index.html');
			});

			app.get('/venue/client.js', function (req, res) {
				res.sendfile(__dirname + '/client.js');
			});

			app.get('/venue/style.css', function (req, res) {
				res.sendfile(that.css);
			});

			server.listen(that.port);

			console.log("   info  - ".cyan + "Server started, listening on port " + that.port);

			io.sockets.on('connection', function(socket){
				socket.emit('handshake', {
					title: that.title
				});

				socket.on('handshake', function(socket){
					that.nextMusic();
				});

				socket.on('next', function(socket) {
					that.nextMusic();
				});
			});
		});
	};

	this.nextMusic = function() {
		var old = that.can.splice(that.current, 1);

		if(that.can.length === 0) {
			that.can = that.cant;

			that.current = that.can.length;

			that.can.push(old);
			that.cant = [];
		} else {
			that.cant.push(old);

			that.current = Math.floor(Math.random() * that.can.length);
		}

		console.log("   info  - ".cyan + "Broadcasting " + that.can[that.current].split(-1)[0]);

		io.sockets.emit('pop', { path: that.can[that.current] });
	}
}

exports.launch = function(data) {
	var v = new venue(data)
	v.launch();
};
