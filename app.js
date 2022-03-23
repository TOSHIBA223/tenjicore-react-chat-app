const fs = require('fs')
const express = require('express')
const http = require('http')
var cors = require('cors')
const app = express()
const multer = require('multer');
const bodyParser = require('body-parser')
const path = require("path")
// const session = require('express-session')
// const Router = require("./router");
var server = http.createServer(app);
var io = require('socket.io')(server);

app.use(cors())
app.use(bodyParser.json())
// if(process.env.NODE_ENV === 'production'){
// 	app.use(express.static(__dirname+"/build"))
// 	app.get("*", (req, res, next) => {
// 		res.sendFile(path.join(__dirname+"/build/index.html"))
// 	})
// }
app.use(express.static(__dirname+"/build"))
// app.use(session({secret: 'secretkey123'}))

app.get("*", (req, res, next) => {
	res.sendFile(path.join(__dirname+"/build/index.html"))
})
// app.use("/api",Router);
app.set('port', (process.env.PORT || 5000))

connections = {}
messages = {}
aspects = []
timeOnline = {}
RoomMembers = []
require("./router")(app);

io.on('connection', function(socket){
	socket.on('join-call', (path, username, aspect, img_url, role) => {
		// console.log(img_url)
		if(connections[path] === undefined){
			connections[path] = []
		}
		connections[path].push(socket.id);
		var m = [];
		m = RoomMembers.filter(item=>item.socketId === socket.id);
		if(m.length === 0) {
			RoomMembers.push({socketId: socket.id, name: username, path: path, aspect: aspect, img_url: img_url, role : role});
		}
		timeOnline[socket.id] = new Date();

		for(let a = 0; a < connections[path].length; ++a){
			io.to(connections[path][a]).emit("user-joined", socket.id, connections[path], username, RoomMembers.filter(item=>item.path === path), img_url, role);
		}
		if(messages[path] !== undefined){
			for(let a = 0; a < messages[path].length; ++a){
				io.to(socket.id).emit("chat-message", messages[path][a]['data'], messages[path][a]['sender'], messages[path][a]['username'], messages[path][a]['chat_id'], messages[path][a]['tchat']);
			}
		}
		io.to(socket.id).emit('parents', RoomMembers.filter(item=>item.path === path && item.socketId !== socket.id));
		// console.log(path, 'Join path', connections[path], 'JOIN CALL', connections)
	});

	socket.on('signal', (toId, message) => {
		io.to(toId).emit('signal', socket.id, message);
	});

	// socket.on("message", function(data){
	// 	io.sockets.emit("broadcast-message", socket.id, data);
	// })

	socket.on('shareScreenStart', function(data) {
		var me = RoomMembers.filter(item=>item.socketId === socket.id);
		me[0]['img_url']  = data['img_url']
		var receiver = RoomMembers.filter(item=>item.socketId !== socket.id && item.path === data['url']);
		for(var i = 0 ; i < receiver.length ; i++) {
			io.to(receiver[i]['socketId']).emit("shareScreenStart", data)
		}
	})

	socket.on('shareScreenStop', function(data) {
		var me = RoomMembers.filter(item=>item.socketId === socket.id);
		me[0]['img_url']  = data['img_url']
		var receiver = RoomMembers.filter(item=>item.socketId !== socket.id && item.path === data['url']);
		for(var i = 0 ; i < receiver.length ; i++) {
			io.to(receiver[i]['socketId']).emit("shareScreenStop", data)
		}
	})

	socket.on('chat-message', function(data, username, tchat, chat_id) {
		var key;
		var ok = false
		for (const [k, v] of Object.entries(connections)) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k
					ok = true
				}
			}
		}

		if(ok === true){
			if(messages[key] === undefined){
				messages[key] = []
			}
			messages[key].push({ "data": data,"sender": socket.id, 'username' : username, 'chat_id': chat_id, 'tchat': tchat})
			// console.log("message", key, data)

			for(let a = 0; a < connections[key].length; ++a){
				io.to(connections[key][a]).emit("chat-message", data, socket.id, username, chat_id, tchat);
			}
		}
	})

	socket.on('nameChanged', function(data) {
		var me = RoomMembers.filter(item=>item.socketId === socket.id);
		me[0]['name']  = data['changedName']
		var senders = RoomMembers.filter(item=>item.socketId !== socket.id && item.path === data['url']);
		// console.log(senders)
		for(var i = 0 ; i < senders.length ; i++) {
			io.to(senders[i]['socketId']).emit("nameChanged", data)
		}
	})
	
	socket.on('imgchanged', function(data) {
		var me = RoomMembers.filter(item=>item.socketId === socket.id);
		me[0]['img_url']  = data['img_url']
		var senders = RoomMembers.filter(item=>item.socketId !== socket.id && item.path === data['url']);
		// console.log(senders)
		for(var i = 0 ; i < senders.length ; i++) {
			io.to(senders[i]['socketId']).emit("imgchanged", data)
		}
	})

	socket.on('disconnect', function() {
		RoomMembers = RoomMembers.filter(item=>item.socketId === socket.id);
		var diffTime = Math.abs(timeOnline[socket.id] - new Date());
		var key;
		for (const [k, v] of JSON.parse(JSON.stringify(Object.entries(connections)))) {
			for(let a = 0; a < v.length; ++a){
				if(v[a] === socket.id){
					key = k

					for(let a = 0; a < connections[key].length; ++a){
						io.to(connections[key][a]).emit("user-left", socket.id);
					}
			
					var index = connections[key].indexOf(socket.id);
					connections[key].splice(index, 1 );

					// console.log(key, socket.id, Math.ceil(diffTime / 1000));

					if(connections[key].length === 0){
						delete connections[key]
					}
				}
			}
		}
	})
});


server.listen(app.get('port'), () => {
	// console.log("listening on", app.get('port'))
})