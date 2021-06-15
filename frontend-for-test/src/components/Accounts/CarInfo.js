import React, { useState } from 'react';
import Axios from 'axios';
import { connect } from 'react-redux';
import { updateCarFromDatabase } from '../../actions/carActions';
import Modal from '../Modal';
import Button from '@material-ui/core/Button';
import DeleteForever from '@material-ui/icons/DeleteForever';
// import Clear from '@material-ui/icons/Clear';
import './CarInfo.css';
import "@reach/combobox/styles.css";

import ShareCar from './ShareCar';

// const styles = {

//     smallIcon: {
//         width: 100,
//         height: 8,
//     },

// };

function CarInfo(props) {


    const [carStatus, setCarStatus] = useState("");

    //const[carNum, setCarNum] = useState("");

    const handleRemoveCar = (event) => {

        event.preventDefault();

        Axios.post("https://backend-for-test.herokuapp.com/api/accounts/removeCars", [props.car.carNum], {
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(res => {
                console.log(res);

                setCarStatus(res.data)
                props.updateCarFromDatabase(props.user);
                const modal = document.getElementById(props.carNum);
                if (modal) modal.style.display = 'flex';
            })
            .catch(err => {
                console.log(err);

                setCarStatus("server error")
            })

    }
    const handleClearShare = () => {
        Axios.post("https://backend-for-test.herokuapp.com/api/accounts/clearShareCar", {
            car: { carNum: props.car.carNum, carId: props.car.carId }
        })
            .then((res) => {
                console.log(res.data);
                props.updateCarFromDatabase(props.user);
            })
            .catch((err) => {
                console.log(err);
            })
    }


    return (
        <div>
            <div className= 'plan-card'>
                <center>
                <h1 style={{}}>{props.car.carNum}<Button className="remove" onClick={handleRemoveCar}>
                    <DeleteForever />
                </Button></h1>



                {/* { props.car.name !== null && <h3><right> {props.car.name}</right></h3>} */}
                { props.car.name !== null && <h3><right><Button className="stop_sharing" onClick={handleClearShare}> 取消共享會員: {props.car.name}</Button></right></h3>}
                {/* {props.car.name !== null && <h3>共享會員: {props.car.name}  <right><Button className={styles.smallIcon} onClick={handleClearShare}><Clear /></Button></right></h3>} */}
                {/* {props.car.name !== null && <h3>共享會員: {props.car.name}  <right><button className="stop_sharing" onClick={handleClearShare}>x</button></right></h3>} */}


                {props.car.name == null && <ShareCar carId={props.car.carId} carNum={props.car.carNum} />}
                {/* <ShareCar carId={props.car.carId} carNum={props.car.carNum}/> */}
                </center>


            </div>
            <Modal identifier={props.car.carNum}>{carStatus} </Modal>
        </div>
    )
}
const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan
})

export default connect(mapStateToProps, { updateCarFromDatabase })(CarInfo);