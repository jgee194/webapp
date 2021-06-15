import React,  { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import Modal from "../Modal";
import { updateUserFromDatabase } from '../../actions/userActions';
//import './AddCars.css';


import "@reach/combobox/styles.css";


function UpdatePhone(props) {

    const [phoneNumStatus, setPhoneNumStatus] = useState("");
    
    const[phoneNum, setPhoneNum] = useState("");

    
    const handleSubmitPhoneNum = (event) => {

        event.preventDefault();

        Axios.post("http://localhost:3030/api/accounts/phoneNum", [props.user.id, phoneNum], {
            headers: {
            'Content-Type': 'application/json',
            }
        })
            .then(res => {
                console.log(res);

                setPhoneNumStatus (res.data)
                props.updateUserFromDatabase(props.user);
                const modal = document.getElementById('updatePhone');
                modal.style.display = 'flex';
            })
            .catch(err => {
                console.log(err);
 
                setPhoneNumStatus("server error")
            })
    }


    return (
        <div className='add-cars'>
             <form onSubmit={ handleSubmitPhoneNum } className="form-div-addcars">
                    <label htmlFor = "cars"></label>
                    更新會員電話 <input id = "cars" name="phoneNum" value ={phoneNum} placeholder= "請輸入電話號碼" onChange={event =>setPhoneNum(event.target.value)} required/>
                    <input type = "submit" className="submit-button"></input>
                </form>
                <Modal identifier ={"updatePhone"}>{phoneNumStatus}</Modal>
        </div>
    )
}
const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan   
})
export default connect (mapStateToProps, { updateUserFromDatabase })(UpdatePhone);


