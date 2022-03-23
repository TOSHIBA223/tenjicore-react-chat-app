import React, { Component } from 'react';
import { Button, } from "reactstrap";
import { Input, } from "@material-ui/core";
import KeyboardBackspaceSharpIcon from '@material-ui/icons/KeyboardBackspaceSharp';
import { message } from 'antd';
import { server_url, server_url2 } from './config/config'
import Translator from './Translator'
import "./css/Home.css"


class Home extends Component {
  	constructor (props) {
		super(props)
		this.state = {
			url: '',
			imgUrl:'/image/logo.png',
		}
	}

	UNSAFE_componentWillMount() {
		if(localStorage.getItem('email') === null) {
			message.error("You have to Sign in")
			setTimeout(function(){
				window.location.href = server_url
			}, 500)
		}
	}

	handleChange = (e) => {
		this.setState({
			url: e.target.value
		})
	}

	join = () => {
		if (this.state.url !== "") {
			if (this.state.url.includes(window.location.href) || this.state.url.includes(window.location.href.substring(8, window.location.href.length))) {
				window.location.href = this.state.url
			}else{
				window.location.href = `/${this.state.url}`
			}
		} else {
			var url = Math.random().toString(36).substring(2, 7)
			window.location.href = `/${url}`
		}
	}
	signout = () => {
		localStorage.clear()
		window.location.href = server_url2
	}

	usermanage = () => {
		window.location.href = server_url2 + "usermanage"
	}

	render() {
		return (
			<div className="container2">
				<Translator />
				<div>
					<img src={this.state.imgUrl} alt="logo" style={{ width: '30%', display: "inline-block" }} />
					<p style={{ fontWeight: "200" }}>
						The Japan based platform for your digital conference, training, class, fair and exhibition needs. Enter your tenji code below.<br/>
						TENJIは日本発バーチヤル展示会・トレーニング・クラス・エクスポプラットフォームです。展示コードを下記に入力してください。
					</p>
				</div>

				<div style={{
					background: "white", width: "50%", height: "auto", padding: "20px", minWidth: "400px",
					textAlign: "center", margin: "auto", marginTop: "100px"
				}}>
					<Input placeholder="CODE コード" onChange={e => this.handleChange(e)} defaultValue="" />
					<Button variant="contained" color="primary" onClick={() => this.join()} style={{ margin: "20px" }}>参加する</Button>
					{(() => {
						if(localStorage.getItem("role") === '2') {
							return <Button variant="contained" color="primary" onClick={() => this.usermanage()} style={{ margin: "20px" }}>ユーザー管理</Button>
						}
					})()}
					<Button variant="contained" color="primary" onClick={() => this.signout()} style={{ margin: "20px" }}>
						<KeyboardBackspaceSharpIcon width="30" height="30" />
					</Button>
				</div>
			</div>
		)
	}
}

export default Home;