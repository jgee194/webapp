import React from 'react'
import Axios from 'axios';
import { connect } from 'react-redux';
import { storeToken } from '../actions/tokenActions';
import { storeUser } from '../actions/userActions';
import { storeCars, updateSharedCars } from '../actions/carActions';
import { storePlan } from '../actions/planActions';
import { Link } from 'react-router-dom';

import LogoHeader from '../components/LogoHeader';
import ForgetPassword from '../components/ForgetPassword';
import "./register.css";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";
import {
  withStyles,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";

const styles = (theme) => ({
  root: {
    width: "20ch",
    margin: "0 auto 0 auto",
  },
});

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#89c7b9",
    },
  },
});

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      password: "",
      status: "",
      forgetPassword: false
    };
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    Axios.post("https://backend-for-test.herokuapp.com/api/auth/login", this.state, {
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(res => {
        if (res.data === "Invalid phone or password") {
          throw new Error("Invalid phone or password");
        }
        this.props.storeUser(res.data.user);
        this.props.storeToken(res.data.token);
        this.props.storeCars(res.data.cars);
        this.props.storePlan(res.data.plan);
        this.props.updateSharedCars(res.data.user);
        const { history } = this.props;
        history.push('/home');
      })
      .catch(err => {
        if (err.response && err.response.status === 500) {
          this.setState({
            status: "Server Error"
          })
        } else {
          this.setState({
            status: "Invalid email or password"
          })
        }
      })
  }

  render() {
    const { classes } = this.props;
    return (
      <div className="form-div">
        <LogoHeader />
        <ThemeProvider theme={theme}>
          <form className={classes.root} onSubmit={this.handleSubmit}>
            <TextField
              name="phone"
              required
              id="phone"
              label="電話"
              type="phone"
              margin="dense"
              variant="outlined"
              onChange={this.handleChange}
            />
            <br />
            <TextField
              name="password"
              required
              id="password"
              label="密碼"
              type="password"
              margin="dense"
              variant="outlined"
              onChange={this.handleChange}
            />
            <br />
            <Button type="submit" color="primary">
              送出
            </Button>
          </form>
        </ThemeProvider>
        <Link to="/register">註冊成為vivipark 會員</Link>
        {this.state.status && (
          <h3 className="register-fail">{this.state.status}</h3>
        )}
        <p><button className="filter" onClick={() => this.setState({ forgetPassword: !this.state.forgetPassword })}>忘記密碼</button>
          {this.state.forgetPassword && <ForgetPassword />}
        </p>
      </div>
    );
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default connect(null, { storeToken, storeUser, storeCars, storePlan, updateSharedCars })(
  withStyles(styles)(Login)
);
