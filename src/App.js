import React, { Component } from 'react'
import Video from './Video'
import Home from './Home'
import Login from './Login'
import ThankyouPage from './ThankyouPage'
import usersTable from './usersTable'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

class App extends Component {
	constructor() {
		super()
		this.state = {
			isauth: false,
		}
	}
	render() {
		return (
			<Router>
				<Switch>
					<Route path="/" exact component={Login} />
					<Route path="/ThankyouPage" exact component={ThankyouPage} />
					<Route path="/usermanage" exact component={usersTable} />
					<Route path="/Home" exact component={Home} />
					<Route path="/:url" component={Video} />
				</Switch>
			</Router>
		)
	}
}

export default App;