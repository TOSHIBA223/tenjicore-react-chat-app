import React from 'react';
import './css/signStyle.css';
import "./css/Home.css"
import SigninForm from './Signin'
import SignupForm from './Signup'
import Translator from './Translator'
const pro = 1920 / 150;

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            mode: 'login',
            signinCla : "transition ease-linear duration-150 font-display nav-tab nav-tab-selected",
            signupCla : "transition ease-linear duration-150 font-display nav-tab",
        }
    }
    toggleMode1() {
        this.setState({
            signinCla : "transition ease-linear duration-150 font-display nav-tab nav-tab-selected",
            signupCla : "transition ease-linear duration-150 font-display nav-tab",
            mode: "login"
        });
    }
    toggleMode2() {
        this.setState({
            signinCla : "transition ease-linear duration-150 font-display nav-tab",
            signupCla : "transition ease-linear duration-150 font-display nav-tab nav-tab-selected",
            mode: "signup"
        });
    }
    componentDidMount () {
        this.setPro();
        window.addEventListener("resize", this.setPro);
    }
    setPro = () => {
        if(window.innerWidth < window.innerHeight || this.mobileCheck() === true) {
            document.getElementById("imageStyle").parentElement.style.display = "none"
            document.getElementById("loginE").className = "w-full px-4 sm:w-auto flex-start"
            document.getElementById("loginE").style.width = "100%"
        } else {
            document.getElementById("imageStyle").parentElement.style.display = "block"
            document.getElementById("loginE").className = "w-full px-4 sm:w-auto flex-start w-50"
            document.getElementById("loginE").style.width = "100%"
            var rightWidth = window.innerWidth;
            var height = rightWidth / pro;
            document.getElementById("bottomStyle").style.height = height + "px";
            document.getElementById("imageStyle").style.height = window.innerHeight - height + "px";
        }
    }
    mobileCheck (){
        let check = false;
        // eslint-disable-next-line
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    }
    render() {
        return (
            <main className="w-full h-screen" role="main">
                <Translator />
                <div className="phx-connected" data-phx-main="true" data-phx-root-id="phx-FjXHwILQNpFJ0QNC" data-phx-session="SFMyNTY.g2gDaAJhBHQAAAAHZAACaWRtAAAAFHBoeC1GalhId0lMUU5wRkowUU5DZAAKcGFyZW50X3BpZGQAA25pbGQACHJvb3RfcGlkZAADbmlsZAAJcm9vdF92aWV3ZAAXRWxpeGlyLkJyYXVuV2ViLlBvd0xpdmVkAAZyb3V0ZXJkABZFbGl4aXIuQnJhdW5XZWIuUm91dGVyZAAHc2Vzc2lvbnQAAAAAZAAEdmlld2QAF0VsaXhpci5CcmF1bldlYi5Qb3dMaXZlbgYAN1yQn3QBYgABUYA.Uu4pY1KANb6lNYC-pTj_pEvJWZREFZ-vrCz0oL7PGUc" data-phx-static="SFMyNTY.g2gDaAJhBHQAAAADZAAKYXNzaWduX25ld2pkAAVmbGFzaHQAAAAAZAACaWRtAAAAFHBoeC1GalhId0lMUU5wRkowUU5DbgYAN1yQn3QBYgABUYA.FsjoWj81WgJw3UNLBalKGethJDZu0N1hu-LJWQOsvRs" data-phx-view="PowLive" id="phx-FjXHwILQNpFJ0QNC">
                <div className="flex w-full h-screen o-x-h">
                    <div className="w-full px-4 sm:w-auto flex-start w-30" id="loginE" style={{height: '100vh', overflowY: 'auto'}}>
                        <section className="m-auto mt-32 bg-white mt-8" id="form">
                            <div className="px-8">
                                <img alt="Amplified" className="px-8 mb-12" src="/image/logo.png" />
                                <nav className="flex flex-row mb-12 px-4 justify-around" id="">
                                    <button className={this.state.signinCla} data-phx-link="patch" data-phx-link-state="push" onClick={() => this.toggleMode1()} id="login-nav-tab">ログイン</button>
                                    <button className={this.state.signupCla} data-phx-link="patch" data-phx-link-state="push" onClick={() => this.toggleMode2()} id="signup-nav-tab">登録</button>
                                </nav>
                                {(() => {
                                    if(this.state.mode === 'login') {
                                        return (
                                            <SigninForm parent={this} />
                                        );
                                    } else {
                                        return (
                                            <SignupForm parent={this} />
                                        );
                                    }
                                })()}
                            </div>
                        </section>
                    </div>
                    <div className="m-w-70">
                        <img id="imageStyle" style={{ height : "calc(100% - 150px)", width : "100%" }} src="/image/logimage.png" alt="logo" />
                        <div id="bottomStyle" style={{ height : "150px", width : "100%", display : "-webkit-box", overflow : "hidden", overflowX : "auto"}}>
                            <img className="im-11 pd-15" style={{ height : "100%", width : "11%", marginLeft: "5%"}} src="/logos/logo1.png" alt="logo" />
                            <img className="im-21 pd-15" style={{ height : "100%", width : "25%"}} src="/logos/logo2.png" alt="logo" />
                            <img className="im-31 pd-15" style={{ height : "100%", width : "45%"}} src="/logos/logo3.jpg" alt="logo" />
                            <img className="im-41 pd-15" style={{ height : "100%", width : "13%"}} src="/logos/logo4.png" alt="logo" />
                        </div>
                    </div>
                </div>
            </div>
            </main>
        )
    }
}

export default Login;
  