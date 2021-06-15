import React, { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import Modal from "../components/Modal";


import "@reach/combobox/styles.css";


function ForgetPassword(props) {

    const [password, setPassword] = useState("");

    const [phone, setPhone] = useState("");

    const handleSubmit = (event) => {

        event.preventDefault();
        console.log(phone);

        Axios.post("https://backend-for-test.herokuapp.com/api/auth/forgetPassword", [phone], {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                setPassword(res.data)
                const modal = document.getElementById('forgetPassword');
                modal.style.display = 'flex';
            })
            .catch(err => {
                console.log(err);

                setPassword("server error")
            })

    }



    return (
        <div>
            <div className='add-cars'>
                <form className="form-div-addcars">
                    <label htmlFor="cars"></label>
                    Phone Number: <input id="phone" name="phone" value={phone} placeholder="phone" onChange={event => setPhone(event.target.value)} required />
                    {/* <input type = "submit" className="submit-button"></input> */}
                    <button onClick={handleSubmit}> Reset password</button>
                    <br />
                </form>
            </div>
            <Modal identifier={"forgetPassword"}>{password}</Modal>
        </div>

    )
}
const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan
})
export default connect(mapStateToProps, null)(ForgetPassword);


