var socket = io.connect(),
	player = document.getElementById("player");

var title;

socket.on('handshake', function (data) {
	console.log("connected");
	title = data.title;
	document.title = data.title;
	document.getElementsByTagName("h1")[0].innerHTML = data.title;
	finishLoading();
	socket.emit('handshake', { });
});

socket.on('pop', function (data) {
	console.log("Received new music: " + data.path);

	var songTitle = data.path.replace("/", "").replace(/\//g, ' &mdash; ').split(".mp3")[0].split(".ogg")[0].split(".wav")[0]

	document.title = songTitle + " at " + title;
	document.getElementById("title").innerHTML = songTitle;

	player.src = data.path;
});

socket.on('error', function (data) {
	console.log("[error] " + (data || 'Unknown error'));

	alert("There has been an error with the server, maybe it's down?");
});

var state = false;

function pause() {
	if(state) {
		document.getElementById("pause").innerHTML = "play";
		player.pause();
	} else {
		document.getElementById("pause").innerHTML = "pause";
		player.play();
	}

	state = ! state;
}

function next() {
	document.getElementById("pause").innerHTML = "pause";
	console.log("Sending order to change music");
	socket.emit('next', { });

	state = true;
}

function finishLoading() {
	document.getElementById("content").style.display = "block";
	document.getElementById("loading").style.display = "none";

	state = true;
}

window.onload = function() {
	document.getElementById("next").onclick = next;
	document.getElementById("pause").onclick = pause;
	player.addEventListener('loadedmetadata', player.play, false);
	player.addEventListener("ended", next, false);
}
