import React, { Component } from 'react';
import io from 'socket.io-client';
// import faker from "faker";
import $ from 'jquery'
import IconButton from '@material-ui/core/IconButton';
// import Badge from '@material-ui/core/Badge';
import { Button, } from "reactstrap";
import { Input, } from "@material-ui/core";
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import CallEndIcon from '@material-ui/icons/CallEnd';
import ChatIcon from '@material-ui/icons/Chat';
import SideBar from "./UserSidebar";
import axios from 'axios'

import { message } from 'antd';
import 'antd/dist/antd.css';
import Translator from './Translator'
import { Row } from 'reactstrap';
import Modal from 'react-bootstrap/Modal'
import 'bootstrap/dist/css/bootstrap.css';
import "./css/Sidebar.css";
import "./css/Video.css";
import "./css/UserSidebar.css";
import "./css/Home.css"

import { Icon } from '@iconify/react';
import editIcon from '@iconify/icons-whh/edit';

import { server_url,server_url2 } from './config/config'

var connections = {}
const peerConnectionConfig = {
	'iceServers': [
		// { 'urls': 'stun:stun.services.mozilla.com' },
		{ 'urls': 'stun:stun.l.google.com:19302' },
	]
}
var socket = null
var socketId = null

var elms = 0

class Video extends Component {
	constructor(props) {
		super(props)

		this.localVideoref = React.createRef()

		this.videoAvailable = false
		this.audioAvailable = false

		this.video = false
		this.audio = false
		this.screen = false

		this.state = {
			video: false,
			audio: false,
			screen: false,
			showModal: false,
			screenAvailable: false,
			messages: [],
			message: "",
			newmessages: 0,
			askForUsername: true,
			img_url: "",
			editName: false,
			// username: faker.internet.userName(),
			username: localStorage.getItem('name'),
			style:"menu",
			menuStatus:"open",
			status:'',
			videoStyle: {
				margin: 0, 
				padding: 0,
			},
			title: '公共ルーム',
			members: [],
			footerStyle: { 
				backgroundColor: "whitesmoke", 
				color: "whitesmoke", 
				textAlign: "center" ,
			},
			othersStyle: {
				width: "0px",
				background: "transparent",
				height: "800px",
				overflow: "auto"
			},
			CopyLinkUrl : { paddingTop: "20px" },
			Flexwidth: window.innerWidth*0.35 + 'px',
			// Flexwidth1: window.innerWidth*0.65 + 'px',
			Vwidth : window.innerWidth*0.65,
			// Vheight : window.innerWidth*0.65*3/4,
			myvideostyle:{
				borderStyle: "solid",
				borderColor: "#bdbdbd",
				margin: "10px",
				objectFit: "fill",
				height: '100%',
				justifyContent: 'center',
    			textAlign: 'center'
				// height: window.innerWidth*0.65 * 3 / 4,
			},
			mysocketId:'',
			nowOpponent:'public',
			aspect:'',
			otheraspects: [],
			badgeNum : 0,
			role: "0",
		}
		connections = {}

		this.addMessage = this.addMessage.bind(this)
		this.toogleSidebar = this.toogleSidebar.bind(this)
		this.editName = this.editName.bind(this)
		this.uploadImage = this.uploadImage.bind(this)
	}

	UNSAFE_componentWillMount(){
		if(localStorage.getItem('email') === null) {
			message.error("You have to Sign in")
			localStorage.setItem('justurl', window.location.href)
			setTimeout(function(){
				window.location.href = server_url2
			}, 500)
		} else {
			this.setState({badgeNum: 2})
			var w = window.screen.width;
			var h = window.screen.height;
			var r = this.gcd (w, h);
			this.setState({
				aspect: w/r+':'+h/r,
				img_url: localStorage.getItem('img'),
				username: localStorage.getItem('name'),
				role: localStorage.getItem('role'),
			});
			if(localStorage.getItem('role') > 0) {
				this.getPermissions()
			}
		}
	}

	toogleSidebar() {
		document.querySelector(".bm-burger-button button").click()
		switch(this.state.menuStatus)
		{
			case "open":
				this.setState({
					menuStatus:"close",
					style:"menu active",
					videoStyle: {
						margin: 0, padding: 0, width: '65%' , position: 'fixed', left: '0%',
					},
					footerStyle : { backgroundColor: "whitesmoke", color: "whitesmoke", textAlign: "center" , paddingRight: this.state.Flexwidth },
					CopyLinkUrl: { paddingTop: "20px", paddingRight: this.state.Flexwidth }
				});
				break;
			case "close":
				this.setState({
					menuStatus:"open",
					style:"menu",
					videoStyle: { margin: 0, padding: 0, },
					footerStyle : { backgroundColor: "whitesmoke", color: "whitesmoke", textAlign: "center" },
					CopyLinkUrl: { paddingTop: "20px",}
				});
				break;
			default:
				this.setState({
					menuStatus:"open",
					style:"menu"
				});
		}        
	}
	
	// member click
	memberC(member) {
		$('.menu-item').css("backgroundColor", "transparent")
		for(var i = 0 ; i < $('.menu-item').length ; i++) {
			if($($('.menu-item')[i]).text() === member['name']) {
				$($('.menu-item')[i]).css({"backgroundColor" : "#dfe5f2", "border-radius" : "10px", border: "#9dc0ea 1px solid", padding: "2px"})
			} else {
				$($('.menu-item')[i]).css({border: "none"})
			}
		}
		this.setState({
			title: member['name'],
			nowOpponent: member['socketId']
		})
	}

	getPermissions = async () => {
		await navigator.mediaDevices.getUserMedia({ video: true })
			.then((stream) => {
				this.videoAvailable = true
				this.video = true
			})
			.catch((e) => {
				this.videoAvailable = false
			})

		await navigator.mediaDevices.getUserMedia({ audio: true })
			.then((stream) => {
				this.audioAvailable = true
				this.audio = true
			})
			.catch((e) => {
				this.audioAvailable = false
			})

		if (navigator.mediaDevices.getDisplayMedia) {
			this.setState({
				screenAvailable: true,
			})
		} else {
			this.setState({
				screenAvailable: false,
			})
		}

		if (this.videoAvailable || this.audioAvailable) {
			navigator.mediaDevices.getUserMedia({ video: this.videoAvailable, audio: this.audioAvailable })
				.then((stream) => {
					window.localStream = stream
					this.localVideoref.current.srcObject = stream
				})
				.then((stream) => { })
				.catch((e) => console.log(e))
		}
	}

	getMedia = () => {
		this.setState({
			video: this.video,
			audio: this.audio,
			screen: this.screen
		}, () => {
			this.getUserMedia()
			this.connectToSocketServer()
		})
	}

	getUserMedia = () => {
		if(this.state.role > 0) {
			if ((this.state.video && this.videoAvailable) || (this.state.audio && this.audioAvailable)) {
				navigator.mediaDevices.getUserMedia({ video: this.state.video, audio: this.state.audio })
					.then(this.getUserMediaSuccess)
					.then((stream) => { })
					.catch((e) => console.log(e))
			} else {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch (e) {
	
				}
			}
		}
	}

	getUserMediaSuccess = (stream) => {
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch (e) {
			console.log(e)
		}

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream);
			// eslint-disable-next-line
			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
					})
					.catch(e => console.log(e));
			});
		}

		stream.getVideoTracks()[0].onended = () => {
			this.setState({
				video: false,
				audio: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch (e) {
					console.log(e)
				}

				let silence = () => {
					let ctx = new AudioContext()
					let oscillator = ctx.createOscillator()
					let dst = oscillator.connect(ctx.createMediaStreamDestination())
					oscillator.start()
					ctx.resume()
					return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
				}

				let black = ({ width = 640, height = 480 } = {}) => {
					let canvas = Object.assign(document.createElement("canvas"), { width, height });
					canvas.getContext('2d').fillRect(0, 0, width, height);
					let stream = canvas.captureStream();
					return Object.assign(stream.getVideoTracks()[0], { enabled: false });
				}

				let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				for (let id in connections) {
					connections[id].addStream(window.localStream);
					// eslint-disable-next-line
					connections[id].createOffer().then((description) => {
						connections[id].setLocalDescription(description)
							.then(() => {
								socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
							})
							.catch(e => console.log(e));
					});
				}
			})
		};
	}

	getDislayMedia = () => {
		if (this.state.screen) {
			if (navigator.mediaDevices.getDisplayMedia) {
				navigator.mediaDevices.getDisplayMedia({ video: true, audio: true })
					.then(this.getDislayMediaSuccess)
					.then((stream) => { })
					.catch((e) => console.log(e))
			}
		}
	}

	getDislayMediaSuccess = (stream) => {
		var w = window.screen.width;
		var h = window.screen.height;
		var r = this.gcd (w, h);
		var me = this
		socket.emit('shareScreenStart', { socketId : socket.id, x : h/r, y : w/r, url: window.location.href })
		var Ele = document.getElementById('my-video');
		Ele.style.height = parseInt(Ele.style.width.split('px')[0]) * h/r / w/r + 'px'
		stream.getVideoTracks()[0].addEventListener('ended', () => {
			socket.emit('shareScreenStop', { socketId : socket.id, x : h/r, y : w/r, url: window.location.href })
			var height;
			if (elms === 1 || elms === 2) {
				// height = me.state.Vwidth * 0.45 * childAspect[1] / childAspect[0]+'px'
				height = me.state.Vwidth * 0.35+'px'
			} else if (elms === 3 || elms === 4) {
				// height = me.state.Vwidth * 0.25 * childAspect[1] / childAspect[0]+'px'
				height = me.state.Vwidth * 0.25+'px'
			} else {
				height = me.state.Vwidth * (100 / elms / 100)+'px';
				// width = String(100 / elms / 100) + "%"
			}
			var Ele = document.getElementById('my-video');
			Ele.style.height = height
		})
		
		try {
			window.localStream.getTracks().forEach(track => track.stop())
		} catch (e) {
			console.log(e)
		}

		window.localStream = stream
		this.localVideoref.current.srcObject = stream

		for (let id in connections) {
			if (id === socketId) continue

			connections[id].addStream(window.localStream);
			// eslint-disable-next-line
			connections[id].createOffer().then((description) => {
				connections[id].setLocalDescription(description)
					.then(() => {
						socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
					})
					.catch(e => console.log(e));
			});
		}


		stream.getVideoTracks()[0].onended = () => {
			this.setState({
				screen: false,
			}, () => {
				try {
					let tracks = this.localVideoref.current.srcObject.getTracks()
					tracks.forEach(track => track.stop())
				} catch (e) {
					console.log(e)
				}

				let silence = () => {
					let ctx = new AudioContext()
					let oscillator = ctx.createOscillator()
					let dst = oscillator.connect(ctx.createMediaStreamDestination())
					oscillator.start()
					ctx.resume()
					return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
				}

				let black = ({ width = 640, height = 480 } = {}) => {
					let canvas = Object.assign(document.createElement("canvas"), { width, height });
					canvas.getContext('2d').fillRect(0, 0, width, height);
					let stream = canvas.captureStream();
					return Object.assign(stream.getVideoTracks()[0], { enabled: false });
				}

				let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
				window.localStream = blackSilence()
				this.localVideoref.current.srcObject = window.localStream

				this.getUserMedia()
			})
		};
	}

	gotMessageFromServer = (fromId, message) => {
		var signal = JSON.parse(message)

		if (fromId !== socketId) {
			if (signal.sdp) {
				connections[fromId].setRemoteDescription(new RTCSessionDescription(signal.sdp)).then(() => {
					if (signal.sdp.type === 'offer') {
						connections[fromId].createAnswer().then((description) => {
							connections[fromId].setLocalDescription(description).then(() => {
								socket.emit('signal', fromId, JSON.stringify({ 'sdp': connections[fromId].localDescription }));
							}).catch(e => console.log(e));
						}).catch(e => console.log(e));
					}
				}).catch(e => console.log(e));
			}

			if (signal.ice) {
				connections[fromId].addIceCandidate(new RTCIceCandidate(signal.ice)).catch(e => console.log(e));
			}
		}
	}

	connectToSocketServer = () => {
		var me = this;

		socket = io.connect(server_url, { secure: true })

		socket.on('signal', this.gotMessageFromServer)

		socket.on('connect', () => {
			me.setState({mysocketId:socket.id})
			socket.emit('join-call', window.location.href, this.state.username, this.state.aspect, this.state.img_url, this.state.role)
			socketId = socket.id
			me.setState({
				mysocketId: socketId
			});
			socket.on('chat-message', this.addMessage)
			
			socket.on('user-left', function (id) {
				var ms = me.state.members.filter(item=>item.socketId !== id)
				me.setState({
					members: ms
				})
				var video = document.getElementById(id);
				if (video !== null) {
					elms--
					video.parentNode.removeChild(video);

					var main = document.getElementById('main')
					var videos = main.querySelectorAll("video");

					// if(videos.length === 0) {
					// 	me.setState({
					// 		othersStyle: {
					// 			width: "0px",
					// 			background: "transparent",
					// 			height: "800px",
					// 			overflow: "auto"
					// 		}
					// 	})
					// }

					var widthMain = main.offsetWidth

					var minWidth = "30%"
					if ((widthMain * 30 / 100) < 300) {
						minWidth = "300px"
					}

					var minHeight = minWidth
					
					// var height = "280px"
					// var width = "300px"
					var height = String(100 / elms) + "%"
					var width = ""
					
					for (let a = 0; a < videos.length; ++a) {
						var childAspect = me.state.otheraspects.filter(item=>item.socketId === videos[a].id);
						if(childAspect.length > 0) {
							childAspect = childAspect[0]['aspect'].split(':');
							childAspect[0] = parseInt(childAspect[0])
							childAspect[1] = parseInt(childAspect[1])
						} else {
							var w = window.screen.width;
							var h = window.screen.height;
							var r = me.gcd (w, h);
							childAspect = [h/r,w/r]
						}
						if (elms === 1 || elms === 2) {
							width = me.state.Vwidth * 0.45+'px';
							// height = me.state.Vwidth * 0.45 * childAspect[1] / childAspect[0]+'px'
							height = me.state.Vwidth * 0.35+'px'
						} else if (elms === 3 || elms === 4) {
							width = me.state.Vwidth * 0.35+'px';
							height = me.state.Vwidth * 0.25 + 'px'
						} else {
							width = me.state.Vwidth * (100 / elms / 100)+'px';
							height = me.state.Vwidth * (100 / elms / 100)+'px';
							// width = String(100 / elms / 100) + "%"
						}
						videos[a].style.minWidth = minWidth
						videos[a].style.minHeight = minHeight
						videos[a].style.setProperty("width", width)
						videos[a].style.setProperty("height", height)
					}
					me.setState({
						myvideostyle:{
							borderStyle: "solid",
							borderColor: "#bdbdbd",
							margin: "10px",
							objectFit: "fill",
							height: '100%',
							justifyContent: 'center',
							textAlign: 'center'
						}
					})
				}
			});
			socket.on('parents', function(data){
				var m = []
				for(var i = 0 ; i < data.length ; i++) {
					m.push(data[i])
				}
				me.setState({
					members: m,
				})
			})
			socket.on('user-joined', function (id, clients, name, aspects, img_url, role) {
				var ms = me.state.members;
				ms.push({
					'socketId':id,
					'name':name,
					'img_url' : img_url
				})
				me.setState({
					members: ms,
					otheraspects: aspects
				})
				clients.forEach(function (socketListId) {
					connections[socketListId] = undefined
					if (connections[socketListId] === undefined) {
						// console.log("new entry")
						connections[socketListId] = new RTCPeerConnection(peerConnectionConfig);
						//Wait for their ice candidate
						connections[socketListId].onicecandidate = function (event) {
							if (event.candidate != null) {
								socket.emit('signal', socketListId, JSON.stringify({ 'ice': event.candidate }));
							}
						}

						//Wait for their video stream
						connections[socketListId].onaddstream = (event) => {

							// TODO mute button, full screen button
							var searchVidep = document.getElementById(socketListId);
							if (searchVidep !== null) { // se non faccio questo check crea un quadrato vuoto inutile
								searchVidep.srcObject = event.stream
							} else {
								elms = clients.length
								var main = document.getElementById('main')
								// var otherVideos = document.getElementById('other-videos')
								var videos = main.querySelectorAll("video")

								var widthMain = main.offsetWidth

								var minWidth = "30%"
								if ((widthMain * 30 / 100) < 300) {
									minWidth = "300px"
								}
								var childAspect = me.state.otheraspects.filter(item=>item.socketId === socketListId);
								if(childAspect.length > 0) {
									childAspect = childAspect[0]['aspect'].split(':');
									childAspect[0] = parseInt(childAspect[0])
									childAspect[1] = parseInt(childAspect[1])
								} else {
									var w = window.screen.width;
									var h = window.screen.height;
									var r = me.gcd (w, h);
									childAspect = [h/r,w/r]
								}
								var minHeight = "280px"

								var height = "280px"
								var width = "300px"
								// var height = String(100 / elms) + "%"
								// var width = ""
								if (elms === 1 || elms === 2) {
									width = me.state.Vwidth * 0.45+'px';
									// height = me.state.Vwidth * 0.45 * childAspect[1] / childAspect[0]+'px'
									height = me.state.Vwidth * 0.35+'px'
								} else if (elms === 3 || elms === 4) {
									width = me.state.Vwidth * 0.35+'px';
									// height = me.state.Vwidth * 0.25 * childAspect[1] / childAspect[0]+'px'
									height = me.state.Vwidth * 0.25+'px'
								} else {
									width = me.state.Vwidth * (100 / elms / 100)+'px';
									height = me.state.Vwidth * (100 / elms / 100)+'px';
									// width = String(100 / elms / 100) + "%"
								}


								for (let a = 0; a < videos.length; ++a) {
									videos[a].style.minWidth = minWidth
									videos[a].style.minHeight = minHeight
									videos[a].style.setProperty("width", width)
									videos[a].style.setProperty("height", height)
								}

								me.setState({
									myvideostyle:{
										borderStyle: "solid",
										borderColor: "#bdbdbd",
										margin: "10px",
										objectFit: "fill",
										width: width,
										height: height
									}
								})

								var video = document.createElement('video')
								video.style.minWidth = minWidth
								video.style.minHeight = minHeight
								// video.style.maxHeight = "100%"
								video.style.setProperty("width", width)
								video.style.setProperty("height", height)
								video.style.margin = "10px"
								video.style.borderStyle = "solid"
								video.style.borderColor = "#bdbdbd"
								video.style.objectFit = "fill"

								video.id = socketListId
								video.srcObject = event.stream
								video.autoplay = true;
								// video.muted       = true;
								video.playsinline = true;

								main.appendChild(video)
								// if(otherVideos.children.length > 0) {
								// 	me.setState({
								// 		othersStyle: {
								// 			width: "340px",
								// 			background: "transparent",
								// 			height: "800px",
								// 			overflow: "auto"
								// 		}
								// 	})
								// }
								// for(var i = 0 ; i < main.children.length ; i++) {
								// 	main.children[i].addEventListener('click', function(){
								// 		var temp = null;
								// 		var myvideo = document.querySelector('#my-video')
								// 		temp = this.srcObject
								// 		this.srcObject = myvideo.srcObject
								// 		myvideo.srcObject = temp
								// 	})
								// }
							}
						}

						//Add the local video stream
						if (window.localStream !== undefined && window.localStream !== null) {
							connections[socketListId].addStream(window.localStream);
						} else {
							let silence = () => {
								let ctx = new AudioContext()
								let oscillator = ctx.createOscillator()
								let dst = oscillator.connect(ctx.createMediaStreamDestination())
								oscillator.start()
								ctx.resume()
								return Object.assign(dst.stream.getAudioTracks()[0], { enabled: false });
							}

							let black = ({ width = 640, height = 480 } = {}) => {
								let canvas = Object.assign(document.createElement("canvas"), { width, height });
								canvas.getContext('2d').fillRect(0, 0, width, height);
								let stream = canvas.captureStream();
								return Object.assign(stream.getVideoTracks()[0], { enabled: false });
							}

							let blackSilence = (...args) => new MediaStream([black(...args), silence()]);
							window.localStream = blackSilence()
							connections[socketListId].addStream(window.localStream);
						}
					}
				});
				if (id !== socketId) {
					setTimeout(() => {
						// Create an offer to connect with your local description
						connections[id].createOffer().then((description) => {
							connections[id].setLocalDescription(description)
								.then(() => {
									socket.emit('signal', id, JSON.stringify({ 'sdp': connections[id].localDescription }));
								})
								.catch(e => console.log(e));
						});
					}, 1000);
				}
			});
			socket.on('nameChanged', function(data){
				for(var i = 0 ; i < $('.menu-item span').length ; i++) {
					if($($('.menu-item span')[i]).text() === data['oldName']) {
						$($('.menu-item span')[i]).text(data['changedName'])
					}
				}
			})
			socket.on('imgchanged', function(data){
				for(var i = 0 ; i < $('.menu-item span').length ; i++) {
					if($($('.menu-item span')[i]).text() === data['name']) {
						$($('.menu-item img')[i]).attr('src',data['img_url'])
					}
				}
			})
			socket.on('shareScreenStart',function(data) {
				var Ele = document.getElementById(data['socketId']);
				Ele.style.height = parseInt(Ele.style.width.split('px')[0]) * data['x'] / data['y'] + 'px'
			})
			socket.on('shareScreenStop',function(data) {
				var height;
				if (elms === 1 || elms === 2) {
					// height = me.state.Vwidth * 0.45 * childAspect[1] / childAspect[0]+'px'
					height = me.state.Vwidth * 0.35+'px'
				} else if (elms === 3 || elms === 4) {
					// height = me.state.Vwidth * 0.25 * childAspect[1] / childAspect[0]+'px'
					height = me.state.Vwidth * 0.25+'px'
				} else {
					height = me.state.Vwidth * (100 / elms / 100)+'px';
					// width = String(100 / elms / 100) + "%"
				}
				var Ele = document.getElementById(data['socketId']);
				Ele.style.height = height
			})
		})
	}

	handleVideo = () => {
		this.setState({
			video: !this.state.video,
		}, () => {
			this.getUserMedia()
		})
	}

	handleAudio = () => {
		this.setState({
			audio: !this.state.audio,
		}, () => {
			this.getUserMedia()
		})
	}

	handleScreen = () => {
		this.setState({
			screen: !this.state.screen
		}, () => {
			this.getDislayMedia()
		})
	}

	handleEndCall = () => {
		try {
			let tracks = this.localVideoref.current.srcObject.getTracks()
			tracks.forEach(track => track.stop())
		} catch (e) {

		}

		window.location.href = "/Home"
	}

	openChat = () => {
		this.setState({
			showModal: true,
			newmessages: 0,
		})
	}

	closeChat = () => {
		this.setState({
			showModal: false,
		})
	}

	handleMessage = (e) => {
		this.setState({
			message: e.target.value,
		})
	}

	handleMessageF = (e) => {
		if(e.charCode === 13) {
			this.sendMessage()
		}
	}

	addMessage = (data, sender, username, chat_id, tchat) => {
		if( chat_id.indexOf(this.state.nowOpponent) === -1 ) {
			message.success(username+' :  '+data)
			$('.'+sender).parent().parent().append('<span class="MuiBadge-badge MuiBadge-anchorOriginTopRightRectangle MuiBadge-colorSecondary">4</span>')
		}
		var messageBody = document.querySelector('.modal-body');
		messageBody.scrollTop = messageBody.scrollHeight - messageBody.clientHeight;
		this.setState(prevState => ({
			messages: [...prevState.messages, { "sender": sender, "data": data, 'username': username,  'chat_id': chat_id, 'tchat' : tchat}],
		}))

		if (sender !== socketId) {
			this.setState({
				newmessages: this.state.newmessages + 1
			})
		}
		document.querySelector('.modal-body').scrollTo(0,300*this.state.messages.length)
	}

	isKanji(ch) {
		return (ch >= "\u4e00" && ch <= "\u9faf") ||
		(ch >= "\u3400" && ch <= "\u4dbf") || (ch >= "\u3040" && ch <= "\u309f") || (ch >= "\u30a0" && ch <= "\u30ff");
	}

	some(str, callback) {
		return Array.prototype.some.call(str, callback);
	}

	gcd (a, b) {
		return (b === 0) ? a : this.gcd (b, a%b);
	}

	hasKanji(str) {
		return this.some(str, this.isKanji);
	}

	sendMessage = () => {
		var mesg = this.state.message;
		var me = this;
		var targetLa = 'ja';
		var tflag = this.hasKanji(mesg);
		if(tflag === true) {
			targetLa = 'en'
		}
		var url = "https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl="+targetLa+"&dt=t&q=" + encodeURI(mesg);
		fetch(url, {
			method: 'GET'
		})
		.then((response) => response.json())
		.then((responseJson) => {
			if(me.state.nowOpponent === 'public') {
				socket.emit('chat-message', mesg, me.state.username, responseJson[0][0][0], 'public')
			} else {
				socket.emit('chat-message', mesg, me.state.username, responseJson[0][0][0], me.state.nowOpponent+'=+='+me.state.mysocketId)
			}
			me.setState({
				message: "",
			})
		})
		.catch((error) => {
			console.error(error);
		});
		// if(this.state.nowOpponent === 'public') {
		// 	socket.emit('chat-message', this.state.message, this.state.username, 'public')
		// 	this.setState({
		// 		message: "",
		// 	})
		// } else {
		// 	socket.emit('chat-message', this.state.message, this.state.username, this.state.nowOpponent+'=+='+this.state.mysocketId)
		// 	this.setState({
		// 		message: "",
		// 	})
		// }
	}

	copyUrl = (e) => {
		var text = window.location.href

		if (!navigator.clipboard) {
			var textArea = document.createElement("textarea")
			textArea.value = text
			document.body.appendChild(textArea)
			textArea.focus()
			textArea.select()
			try {
				document.execCommand('copy')
				message.success("Link copied to clipboard!")
			} catch (err) {
				message.error("Failed to copy")
			}
			document.body.removeChild(textArea)
			return
		}
		navigator.clipboard.writeText(text).then(function () {
			message.success("Link copied to clipboard!")
		}, function (err) {
			message.error("Failed to copy")
		})
	}

	handleUsername = (e) => {
		this.setState({
			username: e.target.value
		})
		localStorage.setItem('name', e.target.value)
 	}

	connect = () => {
		this.setState({
			askForUsername: false,
		}, () => {
			this.getMedia()
		})
	}

	cancel = () => {
		window.location.href = server_url + "Home"
	}

	editName() {
		var checkmode = this.state.editName === true ? false : true
		this.setState({editName: checkmode})
		if (this.state.editName === true) {
			socket.emit('nameChanged', {oldName: localStorage.getItem('name') ,changedName : this.state.username, socketId : this.state.mysocketId, url: window.location.href})
			localStorage.setItem('name', this.state.username)
			axios.post(`/tenji-con/updateuser`, {email: localStorage.getItem('email'), name: this.state.username , type: 'name', usertype: localStorage.getItem('type')})
			.then(res => {
				if(typeof(res.data) !== "string") {
					message.success("Success!")
				} else {
					message.error(res.data)
				}
			})
		}
	}

	changeImage() {
		document.querySelector("#portfolio").click()
	}

	uploadImage(event) {
		var me = this
		var file = event.target.files[0];
		const API_ENDPOINT = server_url + `tenji-con/imageUpload`;
		const request = new XMLHttpRequest();
		const formData = new FormData();
	
		request.open("POST", API_ENDPOINT, true);
		request.onreadystatechange = () => {
			if (request.readyState === 4 && request.status === 200) {
				message.success(request.responseText.split('-=~=-')[0]);
				// socket.emit('imgchanged', {name : this.state.username, socketId : this.state.mysocketId, url: window.location.href, img_url: request.responseText.split('-=~=-')[1]})
				me.setState({img_url: request.responseText.split('-=~=-')[1]})
				localStorage.setItem('img', request.responseText.split('-=~=-')[1])
				return
			}
		};
		formData.append("file", file);
		formData.append('email',localStorage.getItem('email'))
		formData.append('type',localStorage.getItem('type'))
		request.send(formData);
	}

	isChromeOrFirefox = function () {
		var userAgent = ((navigator && navigator.userAgent) || '').toLowerCase()
		var vendor = ((navigator && navigator.vendor) || '').toLowerCase()
		var matchChrome = /google inc/.test(vendor) ? userAgent.match(/(?:chrome|crios)\/(\d+)/) : null
		var matchFirefox = userAgent.match(/(?:firefox|fxios)\/(\d+)/)
		return matchChrome !== null || matchFirefox !== null
	}

	render () {
		if (this.isChromeOrFirefox() === false) {
			return (
				<div style={{
					background: "white", width: "30%", height: "auto", padding: "20px", minWidth: "400px",
					textAlign: "center", margin: "auto", marginTop: "50px", justifyContent: "center"
				}}>
					<h1>ChromeまたはFirefoxを使用する</h1>
				</div>
			)
		}
		return (
			<div>
				<Translator />
				{this.state.askForUsername === true ?
					<div>
						<div style={{
							background: "white", width: "50%", height: "auto", padding: "20px", minWidth: "400px",
							textAlign: "center", margin: "auto", marginTop: "50px", justifyContent: "center"
						}}>
							<p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>ユーザー名を設定</p>
							<Input placeholder="ユーザー名" defaultValue={localStorage.getItem('name')} onChange={e => this.handleUsername(e)} />
							<Button variant="contained" color="primary" onClick={this.connect} style={{ margin: "20px" }}>接続する</Button>
							<Button variant="contained" color="primary" onClick={this.cancel} style={{ margin: "20px" }}>キャンセル</Button>
						</div>

						<p style={{ margin: 0, fontWeight: "bold", paddingRight: "50px" }}>プレビュー</p>
						<div style={{ justifyContent: "center", textAlign: "center", paddingTop: "40px" }}>
							<video id="my-video" ref={this.localVideoref} autoPlay muted style={{
								borderStyle: "solid",
								borderColor: "#bdbdbd",
								objectFit: "fill",
								height: "50%"
							}}></video>
						</div>
					</div>
					:
					<div>
						<SideBar pageWrapId={"page-wrap"} parent={this} members={this.state.members.filter(item=> item.socketId !== this.state.mysocketId )} outerContainerId={"App"} />
						<div className={this.state.style} style={{ zIndex:10, width:this.state.Flexwidth }}>
							<div style={{ height: "100%", width: "calc(100% - 180px)", display: "inline-block", float: "left" }}>
								<div style={{ width: "100%" }} id="useravatar">
									{(() => {
										if(this.state.img_url !== "" || this.state.img_url === "''") {
											return (
												<img alt="user" src={this.state.img_url} onClick={()=>this.changeImage()} />
											)
										} else if(this.state.username.length > 2) {
											return (
												<span className="noImageavatar" onClick={()=>this.changeImage()}>{this.state.username.slice(0,2)}</span>
											)
										} else {
											return (
												<span className="noImageavatar" onClick={()=>this.changeImage()}>{this.state.username}</span>
											)
										}
									})()}
									{this.state.editName === false ? 
										<h3>{this.state.username}</h3> :
										<Input placeholder="名前" defaultValue={this.state.username} style={{ width:'40%' }} onChange={e => this.setState({username: e.target.value})} />
									}
									<input type="file" name="file" id="portfolio" style={{ display: 'none' }} onChange={this.uploadImage} />
									<Button variant="contained" color="primary" onClick={this.editName} style={{ marginLeft: "10px", marginBottom: "9px", padding: '0' }}>
										<Icon icon={editIcon} color="white" width="20" height="20" />
									</Button>
								</div>
								<Modal.Header>
									<Modal.Title style={{ paddingLeft: "5%", width: "100%", textAlign: "left" }}>
										<span>{this.state.title}</span>
									</Modal.Title>
								</Modal.Header>
								<Modal.Body style={{ overflow: "auto", overflowY: "auto", height: "80%" }} >
									{this.state.messages.length > 0 ?
										this.state.nowOpponent === 'public'? this.state.messages.filter(item=>item.chat_id==='public').map((item, index) => 
										{
											// console.log(item.chat_id, this.state.nowOpponent)
											if(item.sender === socketId)
											{
												if(item.sender !== this.state.status) {
													// eslint-disable-next-line
													this.state.status = socketId;
													return (
														<div key={item.sender + item.data + index}>
															<p className="tar">
																<b>{this.state.username}</b>
															</p>
															<p className="original tar">
																{item.data}<br />
																<span className="tred tar">( {item.tchat} )</span>
															</p>
														</div>
													)
												} else {
													if(index === 0) {
														return (
															<div key={item.sender + item.data + index}>
																<p className="tar">
																	<b>{this.state.username}</b>
																</p>
																<p className="original tar">
																{item.data}<br />
																<span className="tred tar">( {item.tchat} )</span>
															</p>
															</div>
														)
													}
													return (
														<div key={item.sender + item.data + index}>
															<p className="original tar">
																{item.data}<br />
																<span className="tred tar">( {item.tchat} )</span>
															</p>
														</div>
													)
												}
											}
											if(item.sender !== this.state.status) {
												// eslint-disable-next-line
												this.state.status = item.sender;
												return (
													<div key={item.sender + item.data + index}>
														<p className="tal">
															<b>{item.username}:</b>
														</p>
														<p className="original tal">
															{item.data}<br />
															<span className="tred tar">( {item.tchat} )</span>
														</p>
													</div>
												)
											} else {
												if(index === 0) {
													return (
														<div key={item.sender + item.data + index}>
															<p className="tal">
																<b>{item.username}:</b>
															</p>
															<p className="original tal">
																{item.data}<br />
																<span className="tred tal">( {item.tchat} )</span>
															</p>
														</div>
													)
												}
												return (
													<div key={item.sender + item.data + index}>
														<p className="original tal">
															{item.data}<br />
															<span className="tred tal">( {item.tchat} )</span>
														</p>
													</div>
												)
											}
										}) : this.state.messages.filter(item=>item.chat_id === this.state.mysocketId+'=+='+this.state.nowOpponent || item.chat_id === this.state.nowOpponent+'=+='+this.state.mysocketId).map((item, index) => 
										{
											// console.log(item.chat_id, this.state.nowOpponent)
											if(item.sender === socketId)
											{
												if(item.sender !== this.state.status) {
													// eslint-disable-next-line
													this.state.status = socketId;
													return (
														<div key={item.sender + item.data + index}>
															<p className="tar">
																<b>{this.state.username}</b>
															</p>
															<p className="original tar">
																{item.data}<br />
																<span className="tred tar">( {item.tchat} )</span>
															</p>
														</div>
													)
												} else {
													if(index === 0) {
														return (
															<div key={item.sender + item.data + index}>
																<p className="tar">
																	<b>{this.state.username}</b>
																</p>
																<p className="original tar">
																{item.data}<br />
																<span className="tred tar">( {item.tchat} )</span>
															</p>
															</div>
														)
													}
													return (
														<div key={item.sender + item.data + index}>
															<p className="original tar">
																{item.data}<br />
																<span className="tred tar">( {item.tchat} )</span>
															</p>
														</div>
													)
												}
											}
											if(item.sender !== this.state.status) {
												// eslint-disable-next-line
												this.state.status = item.sender;
												return (
													<div key={item.sender + item.data + index}>
														<p className="tal">
															<b>{item.username}:</b>
														</p>
														<p className="original tal">
															{item.data}<br />
															<span className="tred tal">( {item.tchat} )</span>
														</p>
													</div>
												)
											} else {
												if(index === 0) {
													return (
														<div key={item.sender + item.data + index}>
															<p className="tal">
																<b>{item.username}:</b>
															</p>
															<p className="original tal">
															{item.data}<br />
															<span className="tred tal">( {item.tchat} )</span>
														</p>
														</div>
													)
												}
												return (
													<div key={item.sender + item.data + index}>
														<p className="original tal">
															{item.data}<br />
															<span className="tred tal">( {item.tchat} )</span>
														</p>
													</div>
												)
											}
										}) : <p>まだメッセージはありません</p>}
								</Modal.Body>
								<Modal.Footer className="div-send-msg">
									<Input placeholder="メッセージ" value={this.state.message} style={{ width:'80%' }} onChange={e => this.handleMessage(e)} onKeyPress={this.handleMessageF} />
									<Button variant="contained" color="primary" onClick={this.sendMessage}>送る</Button>
								</Modal.Footer>
							</div>
						</div>
						<div className="btn-down" style={this.state.footerStyle}>
							{(() => {
								if(this.state.role > 0) {
									return (
										<IconButton style={{ color: "#424242" }} onClick={this.handleVideo}>
											{(this.state.video === true) ? <VideocamIcon /> : <VideocamOffIcon />}
										</IconButton>
									)
								}
							})()}
							

							<IconButton style={{ color: "#f44336" }} onClick={this.handleEndCall}>
								<CallEndIcon />
							</IconButton>
							
							{(() => {
								if(this.state.role > 0) {
									return (
										<IconButton style={{ color: "#424242" }} onClick={this.handleAudio}>
											{this.state.audio === true ? <MicIcon /> : <MicOffIcon />}
										</IconButton>
									)
								}
							})()}

							{this.state.screenAvailable === true ?
								<IconButton style={{ color: "#424242" }} onClick={this.handleScreen}>
									{this.state.screen === true ? <ScreenShareIcon /> : <StopScreenShareIcon />}
								</IconButton>
								: null}

							{/* <Badge badgeContent={this.state.newmessages} max={999} color="secondary">
							</Badge> */}

							<IconButton style={{ color: "#424242" }} onClick={this.toogleSidebar}>
								<ChatIcon />
							</IconButton>
						</div>

						<div className="container">
							<div style={this.state.CopyLinkUrl}>
								<Input value={window.location.href} disable="true"></Input>
								<Button style={{
									backgroundColor: "#3f51b5",
									color: "whitesmoke",
									marginLeft: "20px",
									marginTop: "10px",
									width: "120px",
									fontSize: "10px"
								}} onClick={this.copyUrl}>招待リンクをコピー </Button>
							</div>

							<Row id="main" className="flex-container" style={this.state.videoStyle}>
								<video id="my-video" ref={this.localVideoref} autoPlay muted style={this.state.myvideostyle}></video>
								{/* <div id="other-videos" style={this.state.othersStyle}></div> */}
							</Row>
						</div>
					</div>
				}
			</div>
		)
	}
}

export default Video;
