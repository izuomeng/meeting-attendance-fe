import * as React from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom'
import Layout from './components/Layout'

import Home from './pages/Home'
import Finished from './pages/Finished'

import './App.css'

class App extends React.Component {
  render() {
    return (
      <Router>
        <Layout>
          <Switch>
            <Route path="/" exact={true} component={Home} />
            <Route path="/finished" component={Finished} />
            <Redirect to="/" />
          </Switch>
        </Layout>
      </Router>
    )
  }
}

export default App
