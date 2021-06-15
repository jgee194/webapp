import React from "react";
import Axios from "axios";
import { Link } from "react-router-dom";
import LogoHeader from "../components/LogoHeader";
import "./register.css";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

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

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      phone: "",
      email: "",
      password: "",
      re_password: "",
      vcode: "",
      status: null,
      vcode2: "",
      open: false,
      valid: true,
      focused: false
    };
  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "password") {
      if (value.length === 0 || (value.length <= 12 && value.length >= 6)) {
        this.setState({
          valid: true
        })
      } else {
        this.setState({
          valid: false
        })
      }
    }
    this.setState({
      [name]: value,
    });
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open,
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();

    if (this.state.password.length < 6 || this.state.password.length > 12) {
      this.setState({
        status: "密碼長度錯誤",
      });
      return;
    }

    if (this.state.password === this.state.re_password) {
      Axios.post("https://backend-for-test.herokuapp.com/api/auth/verification", this.state, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          console.log(typeof res.data.vcode);
          if (typeof res.data.vcode === "number") {
            this.handleToggle();
            this.setState({
              status: "驗證碼已送出，請檢查您的手機",
              vcode2: res.data.vcode,
            });
          } else {
            this.setState({
              status: res.data,
            });
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            status: "伺服器錯誤",
          });
        });
    } else {
      this.setState({
        status: "密碼不相符",
      });
    }
  };

  handleVerificationSubmit = (event) => {
    event.preventDefault();
    if (this.state.vcode === this.state.vcode2 + "") {
      this.handleToggle();
      Axios.post("https://backend-for-test.herokuapp.com/api/auth/register", this.state, {
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          this.setState({
            status: res.data,
          });
        })
        .catch((err) => {
          console.log(err);
          this.setState({
            status: "伺服器錯誤",
          });
        });
    } else {
      this.setState({
        status: "認證失敗",
      });
    }
  };

  displayStatus = (status) => {
    if (status) {
      if (status === "Registered!") {
        return <h3 className="register-success">{status}</h3>;
      } else {
        return <h3 className="register-fail">{status}</h3>;
      }
    } else {
      return;
    }
  };

  render() {
    const { classes } = this.props;
    const { open } = this.state;
    return (
      <div className="form-div">
        <LogoHeader />
        <ThemeProvider theme={theme}>
          <form onSubmit={this.handleSubmit} className={classes.root}>
            <TextField
              size="small"
              name="name"
              required
              id="name"
              label="姓名"
              type="name"
              margin="dense"
              variant="outlined"
              onChange={this.handleChange}
            />
            <TextField
              size="small"
              name="phone"
              required
              id="phone"
              label="請輸入行動電話"
              type="phone"
              margin="dense"
              variant="outlined"
              inputProps={{ pattern: "[0-9]{10}" }}
              onChange={this.handleChange}
            />
            <TextField
              size="small"
              name="email"
              id="email"
              label="請輸入Email"
              type="email"
              margin="dense"
              variant="outlined"
              onChange={this.handleChange}
            />
            <TextField
              size="small"
              name="password"
              required
              error={!this.state.valid}
              id="password"
              label="請輸入密碼"
              type="password"
              margin="dense"
              variant="outlined"
              helperText={this.state.focused && "6-12個字元"}
              onFocus={() => {
                this.setState({
                  focused: true
                })
              }}
              onBlur={() => {
                this.setState({
                  focused: false
                })
              }}
              onChange={this.handleChange}
            />
            <TextField
              size="small"
              name="re_password"
              required
              id="re_password"
              label="請重新確認密碼"
              type="password"
              margin="dense"
              variant="outlined"
              onChange={this.handleChange}
            />
            <Button size="small" type="submit" color="primary">
              送出
            </Button>
          </form>

          <Link to="/">已經是vivipark會員</Link>
          {this.displayStatus(this.state.status)}
          <Dialog
            open={open}
            onClose={this.handleToggle}
            disableBackdropClick
            disableEscapeKeyDown
          >
            <DialogTitle id="form-dialog-title">手機驗證</DialogTitle>
            <DialogContent>
              <DialogContentText>
                請輸入簡訊中的驗證碼
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="vcode"
                label="驗證碼"
                type="vcode"
                name="vcode"
                onChange={this.handleChange}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleToggle} color="primary">
                取消
              </Button>
              <Button onClick={this.handleVerificationSubmit} color="primary">
                送出
              </Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
      </div>
    );
  }
}
Register.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(Register);
