const express = require('express');
const hbs = require('hbs');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const os = require('os');
const _ = require('lodash');
const yargs = require('yargs');
const fs = require('fs');
const port = 3100;

const notes = require('./notes.js');

const argv = yargs.argv;

console.log(argv);

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use((req, res, next) => {
	var now = new Date().toString();
	var log = `${now}: ${req.method} ${req.url}`;

	console.log(log);
	fs.appendFile('server.log', log + '\n');
	next();
});

app.use((req, res, next) => {
	res.render('maintenance.hbs');
});

app.use(express.static(__dirname + '/public'));

hbs.registerHelper('getCurrentYear', () => {
	return new Date().getUTCFullYear()
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

app.get(['/','/index'], function (req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/test', (req, res) => {
	res.send({
		name: 'Paolo',
		likes: [
			'Sport',
			'Music'
		]
	});
});

app.get('/home', (req, res) => {
	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to my website'
	})
})

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page'
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Unable to handle request'
	});
});

http.listen(port, function(){
	console.log('listening on *:'+port);

	var command = process.argv[2];

	if(command === 'add'){
		var note = notes.addNote(argv.title, argv.body);
		if(note){
			console.log("Note created");
			console.log("--");
			console.log("Title: " + note.title);
			console.log("Title: " + note.body);
		}
		else {
			console.log("Note title taken");
		}
	}
	else if(command === 'list'){
		notes.getAll();
	}
	else if(command === 'read'){
		notes.getNote(argv.title);
	}
	else if (command === 'remove'){
		notes.removeNote(argv.title);
	}
	else {
		console.log('Command not recognized')
	}
});

const fileEsterno = require('./fileEsterno');

io.on('connection', function(socket){
	console.log('user connected');
	socket.emit('allafine', { hello: 'world' });
	socket.on('delpalo', function (data) {
 		console.log(data.altro);
	});

	fileEsterno.metodoEsterno();
});