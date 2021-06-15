import React from 'react';
//import Axios from 'axios';
import { connect } from 'react-redux';
import { updateUserFromDatabase } from '../actions/userActions';
import { updateCarFromDatabase } from '../actions/carActions';

import AddCars from '../components/Accounts/AddCar';
import PageTitle from '../components/PageTitle';
import CarInfo from '../components/Accounts/CarInfo';
// import Facebook from '../components/Facebook';

class AccountCar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carNum: "",
            newPhoneNum: "",
            phoneNum: this.props.user.phone,
            customerId: this.props.user.id,
            phoneStatus: null,
            carStatus: null,
            addCars: false,
            updatePhoneNum: false

        }
    }

    carloop(cars) {
        return cars.map(value => {
            return <CarInfo key={value.carNum} car={value} />;
        })
    }
    planloop(plan) {
        return plan.map(value => {
            var plan_obj = {};
            plan_obj.parkingLotName = value.parkingLotName;
            plan_obj.endTime = value.endTime;

            return value.name + " " + value.endTime
        })
    }

    showSharedCars() {
        return this.props.sharedCars.map(car => {
            return <h1>{car.carNum}</h1>;
        })
    }

    render() {
        return (
            <div>
                <PageTitle title="會員資料" />
 
                <div>使用車輛 : {this.props.cars?.length < 1 ? " 尚未新增車輛 " : this.carloop(this.props.cars)}</div>
                <br />
                {this.props.sharedCars.length !== 0 && <div> 共享車輛: {this.showSharedCars()}</div>}

                <button className="filter" onClick={() => this.setState({ addCars: !this.state.addCars })}>新增使用車輛</button>
                {this.state.addCars && <AddCars />}

                {/* <Facebook /> */}

            </div>



        );
    }
}

const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan,
    sharedCars: state.sharedCars.sharedCars
})

export default connect(mapStateToProps, { updateUserFromDatabase, updateCarFromDatabase })(AccountCar);