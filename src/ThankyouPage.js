import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import "./css/Home.css"
import {server_url2} from './config/config'
import Translator from './Translator'

class Home extends Component {
  	constructor (props) {
		super(props)
		this.state = {
			url: '',
			imgUrl:'/image/logo.png',
		}
	}

	loginPage = () => {
		window.location.href = server_url2
	}

	render() {
		return (
			<div className="container2">
				<Translator />
				<div>
					<img src={this.state.imgUrl} alt="logo" style={{ width: '30%', display: "inline-block" }} />
					<p style={{ fontWeight: "200", fontSize:"25px" }}>
                        Thank You for signing up<br/>
                        登録ありがとうございました
					</p>
				</div>

				<div style={{
					background: "white", width: "30%", height: "auto", padding: "20px", minWidth: "400px",
					textAlign: "center", margin: "auto", marginTop: "100px"
				}}>
					<Button variant="contained" color="primary" onClick={() => this.loginPage()} style={{ margin: "20px" }}>ログイン</Button>
				</div>
			</div>
		)
	}
}

export default Home;