import React from 'react'
import Axios from 'axios';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateUserFromDatabase } from '../actions/userActions';
import { storeEvent } from '../actions/eventActions';
import { trackPromise } from 'react-promise-tracker';

import Map from '../components/map';
import Burger from '../components/Burger';
import LoadSpinner from "../components/LoadSpinner";
import './home.css';

// import Dialog from '@material-ui/core/Dialog';
// import DialogContent from '@material-ui/core/DialogContent';
// import DialogTitle from '@material-ui/core/DialogTitle';
// import DialogActions from '@material-ui/core/DialogActions';
// import FormControl from '@material-ui/core/FormControl';
// import Select from '@material-ui/core/Select';

class Home extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            redirect: false
        }
    }
    componentDidMount() {
        let bearer = "Bearer " + this.props.token;
        //checks for token
        Axios.post("https://backend-for-test.herokuapp.com/api/auth/checkToken", null, { headers: { 'authorization': bearer } })
            .then(async (res) => {
                if (res.status === 200) {
                    this.setState({
                        redirect: false
                    })
                    await this.props.updateUserFromDatabase(this.props.user);
                    // let exitbtn = document.getElementsByClassName("exit-button")[0];
                    // exitbtn.disabled = true;
                    this.manageButtons();
                } else {
                    throw new Error(res.error);
                }
            })
            .catch(err => {
                console.log(err);
                this.setState({
                    redirect: true
                })
            })
    }

    //manages button enable/disable based on cars status
    manageButtons = () => {
        let doorbtn = document.getElementsByClassName("door-btn")[0];
        let exitbtn = document.getElementsByClassName("exit-button")[0];
        let car = this.props.cars.find(element => element.status === "active");
        if (car === undefined) {
            car = this.props.sharedCars.find(element => element.status === "active");
        }
        if (car !== undefined) {
            if (doorbtn) {
                doorbtn.disabled = true;
            }
            //disables exit button
            if (exitbtn) {
                exitbtn.disabled = false;
            }
            // document.getElementsByClassName("exit-button")[0].disabled = true;
        } else {
            //enables exit button, disables door button
            // document.getElementsByClassName("exit-button")[0].disabled = false;
            if (doorbtn) {
                doorbtn.disabled = true;
            }
            if (exitbtn) {
                exitbtn.disabled = true;
            }
            //document.getElementsByClassName("door-btn")[0].setAttribute("disabled", "true");
        }
    }

    //opens door for exit. writes to database
    // exitClicked = () => {
    //     let car = this.props.cars.find(element => element.status === "active");
    //     if (car === undefined) {
    //         car = this.props.sharedCars.find(element => element.status === "active");
    //     }
    //     trackPromise(
    //         Axios.post("https://backend-for-test.herokuapp.com/api/doorActions/exit", {
    //             user: this.props.user,
    //             car: car
    //         })
    //             .then(res => {
    //                 this.props.storeEvent("");
    //                 this.props.updateUserFromDatabase(this.props.user)
    //                     .then(() => {
    //                         this.manageButtons();
    //                     })
    //             })
    //             .catch(err => {
    //                 console.log(err)
    //             })
    //     );
    // }



    render() {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
        return (
            <div className='home-div'>
                <LoadSpinner />
                <Burger />
                {/* <button className="exit-button" onClick={this.exitClicked}>出場</button> */}
                <Map manageButtons={this.manageButtons} />
            </div>
        )
    }
}

const mapStateToProps = state => ({
    token: state.token.token,
    selectedLocation: state.location.selected,
    user: state.user.user,
    event: state.event.event,
    cars: state.cars.cars,
    sharedCars: state.sharedCars.sharedCars
})

export default connect(mapStateToProps, { updateUserFromDatabase, storeEvent })(Home);
