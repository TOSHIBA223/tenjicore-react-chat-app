import React from 'react';
import axios from 'axios';
import { message } from 'antd';
import Select from 'react-select'
import Property from './property'
import {server_url, server_url2} from './config/config'

const RequiredNoofSeats = [
    { value: '3', label: '3' },
    { value: '5', label: '5' },
    { value: '10', label: '10' },
    { value: 'random', label: 'カスタム ' },
]

class Signup extends React.Component {
    constructor() {
        super()
        this.state = {
            property: '0',
            seats: '0',

            cName: "",
            cRepresentativeLastname: "",
            cRepresentativeFirstname: "",
            cRepresentativeLastnameKana: "",
            cRepresentativeFirstnameKana: "",
            cTel: "",
            cEmail: "",
            cEmailConfirm: "",
            cPass: "",
            cPassConfirm: "",

            uName: "",
            uLastN: "",
            uFirstN: "",
            uLastNKana: "",
            uFirstNKana: "",
            uE: "",
            uEConfirm: "",
            uTel: "",
            uPass: "",
            uPassConfirm: "",
        }
        // this.SelectProperty = this.SelectProperty.bind(this);
        this.SelectRequiredNoofSeats = this.SelectRequiredNoofSeats.bind(this);
        // this.SelectPay = this.SelectPay.bind(this);
    }
    async Signup() {
        var obj = {}
        if(this.state.property === "0") {
            obj['type'] = "0";
            obj['cName'] = this.state.cName;
            obj['cRepresentativeLastname'] = this.state.cRepresentativeLastname;
            obj['cRepresentativeFirstname'] = this.state.cRepresentativeFirstname;
            obj['cRepresentativeLastnameKana'] = this.state.cRepresentativeLastnameKana;
            obj['cRepresentativeFirstnameKana'] = this.state.cRepresentativeFirstnameKana;
            obj['cRequiredNoofSeats'] = this.state.seats;
            obj['cEmail'] = this.state.cEmail;
            obj['cEmailConfirm'] = this.state.cEmailConfirm;
            obj['cTel'] = this.state.cTel;
            obj['cPass'] = this.state.cPass;
            obj['cPassConfirm'] = this.state.cPassConfirm;
            if(obj['cName'] === "" || obj['cRepresentativeLastname'] === "" || obj['cRepresentativeFirstname'] === "" || obj['cRepresentativeLastnameKana'] === "" || obj['cRepresentativeFirstnameKana'] === "" || obj['cRequiredNoofSeats'] === "" || obj['cEmail'] === "" || obj['cEmailConfirm'] === "" || obj['cPass'] === "" || obj['cPassConfirm'] === "") {
                message.error("There is an empty field.")
                return
            }
            if(obj['cEmail'] !== obj['cEmailConfirm']) {
                message.error("Email confirm doesn't match")
                return
            }
            if(obj['cPass'] !== obj['cPassConfirm']) {
                message.error("Password confirm doesn't match")
                return
            }
        } else {
            obj['type'] = "1";
            obj['uLastN'] = this.state.uLastN;
            obj['uFirstN'] = this.state.uFirstN;
            obj['uLastNKana'] = this.state.uLastNKana;
            obj['uFirstNKana'] = this.state.uFirstNKana;
            obj['uE'] = this.state.uE;
            obj['uEConfirm'] = this.state.uEConfirm;
            obj['uTel'] = this.state.uTel;
            obj['uPass'] = this.state.uPass;
            obj['uPassConfirm'] = this.state.uPassConfirm;
            if(obj['uLastN'] === "" || obj['uFirstN'] === "" || obj['uLastNKana'] === "" || obj['uFirstNKana'] === "" || obj['uE'] === "" || obj['uEConfirm'] === "" || obj['uTel'] === "" || obj['uPass'] === "" || obj['uPassConfirm'] === "") {
                message.error("There is an empty field.")
                return
            }
            if(obj['uE'] !== obj['uEConfirm']) {
                message.error("Email confirm doesn't match")
                return
            }
            if(obj['uPass'] !== obj['uPassConfirm']) {
                message.error("Password confirm doesn't match")
                return
            }
        }
        var me = this
        axios.post(server_url + `tenji-con/createUser`, obj)
        .then(res => {
            if(res.data === 'Success!') {
                message.success(res.data)
                setTimeout(function(){
                   me.setState({
                    property: '0',
                    seats: '0',
        
                    cName: "",
                    cRepresentativeLastname: "",
                    cRepresentativeFirstname: "",
                    cRepresentativeLastnameKana: "",
                    cRepresentativeFirstnameKana: "",
                    cEmail: "",
                    cEmailConfirm: "",
                    cPass: "",
                    cPassConfirm: "",
        
                    uName: "",
                    uLastN: "",
                    uFirstN: "",
                    uLastNKana: "",
                    uFirstNKana: "",
                    uE: "",
                    uEConfirm: "",
                    uTel: "",
                    uPass: "",
                    uPassConfirm: "",
                   }) 
                }, 500)
                window.location.href = server_url2 + "ThankyouPage"
            } else {
                message.error(res.data)
            }
        })
    }
    SelectRequiredNoofSeats(e) {
        this.setState({
            seats: e['value']
        })
    }
    render() {
        return (
            <form action="/" data-phx-component="1" id="phx-FjXKpysKh5DyC0XD-1-0" method="get" name="phx-FjXKpysKh5DyC0XD-1-0">
                <Property parent={this} />
                {this.state.property === "0" ? 
                    <span>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="Company">会社名</label>
                            <input className="form-input form-input" id="Company" name="user[id]" type="text" onChange={(e) => {this.setState({ cName : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                        <label className="text-sm font-display mt-4">者　名前</label>
                        <div className="flex flex-row mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <div className="col-md-6">
                                <label className="text-sm font-display w-20" htmlFor="RepresentativeLastName">性</label>
                                <input className="form-input form-input w-80" id="RepresentativeLastName" name="user[name]" type="text" onChange={(e) => {this.setState({ cRepresentativeLastname : e.target.value })}}  />
                            </div>
                            <div className="col-md-6">
                                <label className="text-sm font-display w-20" htmlFor="RepresentativeFirstName">名</label>
                                <input className="form-input form-input w-80" id="RepresentativeFirstName" name="user[name]" type="text"  onChange={(e) => {this.setState({ cRepresentativeFirstname : e.target.value })}} />
                            </div>
                        </div>
                        <div className="flex flex-row mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <div className="col-md-6">
                                <label className="text-sm font-display w-30" htmlFor="RepresentativeLastNameKana">性 かな</label>
                                <input className="form-input form-input w-70" id="RepresentativeLastNameKana" name="user[name]" type="text"  onChange={(e) => {this.setState({ cRepresentativeLastnameKana : e.target.value })}} />
                            </div>
                            <div className="col-md-6">
                                <label className="text-sm font-display w-30" htmlFor="RepresentativeFirstNameKana">名 かな</label>
                                <input className="form-input form-input w-70" id="RepresentativeFirstNameKana" name="user[name]" type="text"  onChange={(e) => {this.setState({ cRepresentativeFirstnameKana : e.target.value })}} />
                            </div>
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="RequiredNoofSeats">代表者込みの接続ID数</label> 
                            <Select 
                                options={RequiredNoofSeats} 
                                onChange={this.SelectRequiredNoofSeats} 
                                defaultValue={{ value: '3', label: '3' }}
                            />
                            {this.state.seats === "random" ? 
                                <div className="flex flex-row mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                                    <label className="text-sm font-display w-30" htmlFor="costomSeats">カスタム</label> 
                                    <input className="form-input form-input w-70" id="costomSeats" name="user[email]" type="text"   onChange={(e) => {this.setState({ seats : e.target.value })}} />
                                </div>
                                : <span></span>
                            }
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="Email">メールアドレス</label> 
                            <input className="form-input form-input" id="Email" name="user[email]" type="text" onChange={(e) => {this.setState({ cEmail : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="EmailConfirm">メールアドレス確認</label> 
                            <input className="form-input form-input" id="EmailConfirm" name="user[email]" type="text"  onChange={(e) => {this.setState({ cEmailConfirm : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="cTel">会社電話番号</label> 
                            <input className="form-input form-input" id="cTel" name="user[email]" type="text"  onChange={(e) => {this.setState({ cTel : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="Password">パスワード作成</label> 
                            <input className="form-input form-input" id="Password" name="user[email]" type="password" onChange={(e) => {this.setState({ cPass : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="PasswordConfirm">パスワード確認</label> 
                            <input className="form-input form-input" id="PasswordConfirm" name="user[email]" type="password" onChange={(e) => {this.setState({ cPassConfirm : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                    </span>
                    : 
                    <span>
                        <label className="text-sm font-display mt-4">名前</label>
                        <div className="flex flex-row mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <div className="col-md-6">
                                <label className="text-sm font-display w-20" htmlFor="LastName">性</label>
                                <input className="form-input form-input w-80" id="LastName" name="user[name]" type="text"  onChange={(e) => {this.setState({ uLastN : e.target.value })}} />
                            </div>
                            <div className="col-md-6">
                                <label className="text-sm font-display w-20" htmlFor="FirstName">名</label>
                                <input className="form-input form-input w-80" id="FirstName" name="user[name]" type="text" onChange={(e) => {this.setState({ uFirstN : e.target.value })}} />
                            </div>
                        </div>
                        <div className="flex flex-row mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <div className="col-md-6">
                                <label className="text-sm font-display w-30" htmlFor="LastNameKana">性 かな</label>
                                <input className="form-input form-input w-70" id="LastNameKana" name="user[name]" type="text"  onChange={(e) => {this.setState({ uLastNKana : e.target.value })}} />
                            </div>
                            <div className="col-md-6">
                                <label className="text-sm font-display w-30" htmlFor="FirstNameKana">名 かな</label>
                                <input className="form-input form-input w-70" id="FirstNameKana" name="user[name]" type="text" onChange={(e) => {this.setState({ uFirstNKana : e.target.value })}} />
                            </div>
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="Email">メールアドレス</label> 
                            <input className="form-input form-input" id="Email" name="user[email]" type="text" onChange={(e) => {this.setState({ uE : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="EmailConfirm">メールアドレス確認</label> 
                            <input className="form-input form-input" id="EmailConfirm" name="user[email]" type="text" onChange={(e) => {this.setState({ uEConfirm : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="Phone">電話番号</label> 
                            <input className="form-input form-input" id="Phone" name="user[email]" type="text" onChange={(e) => {this.setState({ uTel : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="Password">パスワード作成</label> 
                            <input className="form-input form-input" id="Password" name="user[email]" type="password" onChange={(e) => {this.setState({ uPass : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                        <div className="flex flex-col mt-4" data-phx-component="2" id="phx-FjXKpysKh5DyC0XD-2-0">
                            <label className="text-sm font-display" htmlFor="PasswordConfirmation">パスワード確認</label> 
                            <input className="form-input form-input" id="PasswordConfirmation" name="user[email]" type="password" onChange={(e) => {this.setState({ uPassConfirm : e.target.value })}} />
                            <span className="text-xs"></span> 
                        </div>
                    </span>
                }
                <button className="button button-primary w-full my-10 dn" type="submit">登録する</button>
                <button className="button button-primary w-full my-10 mb-6" type="button" onClick={() => this.Signup()}>登録する</button>
            </form>
                            
        )
    }
}
export default Signup;
