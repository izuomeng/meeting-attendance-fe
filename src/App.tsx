import * as React from 'react'
import { hot } from 'react-hot-loader'
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home'
import Finished from './pages/Finished'
import Settings from './pages/Settings'
import Statistics from './pages/Statistics'

import './App.css'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/finished" component={Finished} />
            <Route path="/settings" component={Settings} />
            <Route path="/statistics" component={Statistics} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      </Router>
    )
  }
}

export default hot(module)(App)
