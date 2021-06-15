import React,  { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import Modal from "../Modal";
import { updateCarFromDatabase } from '../../actions/carActions';




import "@reach/combobox/styles.css";


function AddCars(props) {

    const [carStatusAdd, setCarStatusAdd] = useState("");
    
    const[carNum, setCarNum] = useState("");

    const [name, setName] = useState("");

    const[pictures, setPicture] = useState("");

    const handleChange = (event) => {
        if (event.target.files.length === 0){
            return;
        }
        console.log(event.target.files[0].name)
        const {value} = event.target.files[0].name
        setName(value);
        console.log(name);
        const file = event.target.files[0];
        setPicture(file);
    }
    
    const handleSubmitCar = (event) => {

        event.preventDefault();

        if (carNum === "") {
            setCarStatusAdd("請輸入車牌號碼")
            const modal = document.getElementById('addCars');
            modal.style.display = 'flex';
            return;
        } else if (pictures === "") {
            setCarStatusAdd("請上傳車牌照片")
            const modal = document.getElementById('addCars');
            modal.style.display = 'flex';
            return;
        }

        var file = new FormData();
        file.append("name", carNum);
        file.append('file', pictures);
        file.append("userId", props.user.id);

        Axios.post("http://localhost:3030/api/accounts/addcars", file, {
            headers: {
            'Content-Type': 'application/json',
            }
        })
            .then(res => {
                setCarStatusAdd(res.data)
                props.updateCarFromDatabase(props.user);
                const modal = document.getElementById('addCars');
                modal.style.display = 'flex';
            })
            .catch(err => {
                console.log(err);
 
                setCarStatusAdd("server error")
            })
    }



    return (
        <div>
            <div className='add-cars'>
             <form  className="form-div-addcars">
                    <label htmlFor = "cars"></label>
                    欲新增車牌號碼: <input id = "cars" name="carNum" value ={carNum} placeholder= "請輸入車牌號碼" onChange={event =>setCarNum(event.target.value)} required/>
                    {/* <input type = "submit" className="submit-button"></input> */}
                    <br/>

                    <input type="file" id="myFile" name="filename" onChange={handleChange} required />
                    <button onClick ={handleSubmitCar}> 上傳車牌號照片 </button>
             </form> 
            </div>
    <Modal identifier ={"addCars"}>
        {carStatusAdd}
    </Modal>
        </div>
        
    )
}
const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan   
})
export default connect (mapStateToProps, { updateCarFromDatabase })(AddCars);


