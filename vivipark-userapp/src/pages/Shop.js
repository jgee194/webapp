import React from 'react'
import Axios from 'axios';
import { trackPromise } from 'react-promise-tracker';
import './shop.css';

import PlanCard from '../components/PlanCard';
import PageTitle from '../components/PageTitle';
import LoadSpinner from "../components/LoadSpinner";
import ShopSearch from '../components/ShopSearch';

class Shop extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            locationFilter: false, 
            plans: []
        }
    }

    componentDidMount() {
        trackPromise(
            Axios.get("http://localhost:3030/api/shop/getPlans")
                .then(res => {
                    this.setState({
                        plans: res.data
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        );
    }

    sortArray = (target) => {
        this.setState({
            plans: this.state.plans.sort((a, b) => {
                return this.compareLatLng(a, b, target);
            })
        })
    }

    compareLatLng = (a, b, target) => {
        return this.haversine_distance(target.lat, target.lng, a.lat, a.lng) - this.haversine_distance(target.lat, target.lng, b.lat, b.lng);
    }

    haversine_distance = (lat1, lon1, lat2, lon2) => {
        var R = 6371; // Radius of the Earth in km
        var rlat1 = lat1 * (Math.PI/180); // Convert degrees to radians
        var rlat2 = lat2 * (Math.PI/180); // Convert degrees to radians
        var difflat = rlat2-rlat1; // Radian difference (latitudes)
        var difflon = (lon2 - lon1) * (Math.PI/180); // Radian difference (longitudes)
  
        var d = 2 * R * Math.asin(Math.sqrt(Math.sin(difflat/2)*Math.sin(difflat/2)+Math.cos(rlat1)*Math.cos(rlat2)*Math.sin(difflon/2)*Math.sin(difflon/2)));
        return d;
    }

    render() {
        return(
            <div>
                <LoadSpinner />
                <PageTitle title="商店"/>
                <button className="filter" onClick={() => this.setState({locationFilter: !this.state.locationFilter})}>找尋最近的停車場</button>
                { this.state.locationFilter && <ShopSearch sortArray={this.sortArray}/> }
                { this.state.plans.map((plan, index) => <PlanCard key={index} plan={plan} identifier={index} />) }
            </div>
        )
    }
}

export default Shop;
