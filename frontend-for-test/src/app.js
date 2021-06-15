import React from 'react';
import './App.css';
import { BrowserRouter, Route} from "react-router-dom";
import { connect } from 'react-redux';

import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import LocationInfo from './pages/LocationInfo';
import Account from './pages/Account';
// import Account from './pages/Account_';
import Shop from './pages/Shop';
import PurchaseHistory from './pages/PurchaseHistory';
import EventHistory from './pages/EventHistory';
import Help from './pages/Help';
import History from './pages/History';

import { updateLocation } from './actions/userActions';
import MetaTags from 'react-meta-tags';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoggedIn: false, 
      user: {}
    }

    this.updateToken = this.updateToken.bind(this)
  }

  success = (position) => {
    console.log("running geolocation");
    this.props.updateLocation(position.coords);
    // this.props.updateLocation({latitude: 25.052282, longitude: 121.514258});
  }

  componentDidMount() {
    navigator.geolocation.watchPosition(this.success, (err) => {
      console.log(err)
    })
  }

  updateToken = (token) => {
    console.log('called');
    
    this.setState({
      token: token
    })
  }

  render() {
    return (
      <div>
        <MetaTags>
          <title>Vivipark</title>
          <meta name="developers" content="Juo-Yang Chen, Nai-Chen Chi, Bojun Huang, Yvonne Wu"/>
        </MetaTags>
        <BrowserRouter>
          <div className="App">
            <Route path="/home" component={Home} />
            <Route path="/register" component={Register} />
            <Route path="/info" component={LocationInfo}/>
            <Route path="/" exact component={Login} />
            <Route path="/account" component={Account} />
            <Route path="/shop" component={Shop} />
            <Route path="/history" component={History}/>
            <Route path="/purchasehistory" component ={PurchaseHistory}/>
            <Route path="/eventhistory" component ={EventHistory}/>
            <Route path="/help" component ={Help}/>
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, { updateLocation })(App);
