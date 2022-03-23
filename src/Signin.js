import React from 'react';
import axios from 'axios';
import { server_url, server_url2 } from './config/config'
import { message } from 'antd';

class Signin extends React.Component {
    constructor() {
        super()
        this.handleMEvent = this.handleMEvent.bind(this)
    }
    UNSAFE_componentWillMount() {
        console.log(server_url)
    }
    Login() {
        if(this.refs.user_email.value === "" || this.refs.user_password.value === "") {
            message.error("There is empty field !")
            return
        }
        var userinfo = { user_email: this.refs.user_email.value, user_password: this.refs.user_password.value }
        axios.post(server_url + `tenji-con/SigninUser`, userinfo)
        .then(res => {
            if(typeof(res.data) !== "string") {
                if(res.data[0]['active'] === '0') {
                    message.error("You aren't allowed yet!")
                } else {
                    message.success("Success!")
                    setTimeout(function(){
                        localStorage.setItem('role', res.data[0]['role'])
                        localStorage.setItem('type', res.data[0]['type'])
                        if(res.data[0]['type'] === "0") {
                            localStorage.setItem('email', res.data[0]['cEmail'])
                            localStorage.setItem('img', res.data[0]['img'])
                            localStorage.setItem('name', res.data[0]['cRepresentativeL'])
                            localStorage.setItem('password', res.data[0]['cPass'])
                        } else {
                            localStorage.setItem('email', res.data[0]['uEmail'])
                            localStorage.setItem('img', res.data[0]['img'])
                            localStorage.setItem('name', res.data[0]['uLname'])
                            localStorage.setItem('password', res.data[0]['uPass'])
                        }
                        if( localStorage.getItem('justurl') !== null ) {
                            var now_url = localStorage.getItem('justurl')
                            localStorage.removeItem('justurl')
                            window.location.href = now_url
                        } else {
                            window.location.href = server_url2 + "Home"
                        }
                    },500)
                }
            } else {
                message.error(res.data)
            }
        })
    }

    handleMEvent(event) {
        if(event.charCode === 13) {
			this.Login()
		}
    }
    
    render() {
        return (
            
            <form action="#" data-phx-component="5" id="phx-FjXHwILQNpFJ0QNC-5-0" method="get" name="phx-FjXHwILQNpFJ0QNC-5-0">
                <div className="flex flex-col mt-4" data-phx-component="6" id="phx-FjXHwILQNpFJ0QNC-6-0">
                    <label className="text-sm font-display" htmlFor="user_email">メールアドレス</label>
                    <input className="form-input form-input" id="user_email"  ref="user_email" name="user[email]" type="text" defaultValue=""  onKeyPress={this.handleMEvent} />
                    <span className="text-xs"></span>
                    <span className="text-sm text-utility_red invisible">
                        <span className="invalid-feedback">メールアドレスは空白にできません</span>&nbsp;
                    </span>
                </div>
                <div className="flex flex-col mt-4" data-phx-component="7" id="phx-FjXHwILQNpFJ0QNC-7-0">
                    <label className="text-sm font-display" htmlFor="user_password">パスワード</label> 
                    <input className="form-input" id="user_password"  ref="user_password" name="user[password]" type="password" defaultValue=""  onKeyPress={this.handleMEvent} /> 
                    <span className="text-xs"></span> <span className="text-sm text-utility_red invisible">
                        <span className="invalid-feedback">パスワードは空白にできません</span>&nbsp;
                    </span>
                </div>
                <button className="button button-primary w-full my-10 dn" type="submit" ref="loginBtn">ログイン</button>
                <button className="button button-primary w-full my-10" type="button" onClick={() => this.Login()}>ログイン</button>
            </form>
                            
        )
    }
}
export default Signin;
