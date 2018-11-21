import React, { Component } from 'react';
import './App.css';
import Auth from "./Auth";

class App extends Component {

  state = {
    loading: true,
    showEmailOTPEntry: false,
    showMobileOTPEntry: false,
    optValue: "",
    email: null,
    mobile: null
  }

  constructor() {
    super();

    this.auth = new Auth();
    this.auth.checkSesssion((error, data) => {
      if (error) {
        console.log(error);
        alert(JSON.stringify(error));
        return;
      }

      fetch("/api/start-enrollment", {
        headers: {
          "Authorization": `Bearer ${data.accessToken}`
        },
      }).then(response => response.json())
        .then((resp) => {
          if (resp.status === "email_enrollment") {
            this.setState({
              showEmailOTPEntry: true,
              loading: false,
              email: resp.email
            })
          } else if (resp.status === "mobile_enrollment") {
            this.setState({
              showMobileOTPEntry: true,
              loading: false,
              mobile: resp.mobile
            })
          } else {
            window.location = `https://${process.env.REACT_APP_AUTH0_DOMAIN}/continue?state=${window.sessionStorage.getItem("state")}`
          }
      });
    });

    const urlParams = new URLSearchParams(window.location.search);
    const stateParam = urlParams.get('state');
    if (stateParam) {
      window.sessionStorage.setItem("state", stateParam);
    }
  }

  onOTPUpdate = (e) => {
    this.setState({
      otpValue: e.target.value,
    })
  };

  submitEmailOTP = () => {
    this.auth.verifyEmailOTP(this.state.email, this.state.otpValue, (err, resp) => {
      console.log(err, resp)
    });
  };

  submitMobileOTP = () => {
    this.auth.verifyMobileOTP(this.state.mobile, this.state.otpValue, (err, resp) => {
      console.log(err, resp)
    });
  };

  render() {
    if (this.state.loading) {
      return (
        <div className="App">
          <h1>LOADING</h1>
        </div>
      );
    }

    if (this.state.showEmailOTPEntry) {
      return (
        <div className="App">
          <h1>Enter email code</h1>
          <input type="text" onChange={this.onOTPUpdate} value={this.state.otpValue}></input>
          <button onClick={this.submitEmailOTP}>Submit</button>
        </div>
      );
    }

    if (this.state.showMobileOTPEntry) {
      return (
        <div className="App">
          <h1>Enter mobile code</h1>
          <input type="text" onChange={this.onOTPUpdate} value={this.state.otpValue}></input>
          <button onClick={this.submitMobileOTP}>Submit</button>
        </div>
      );
    }
  }
}

export default App;
