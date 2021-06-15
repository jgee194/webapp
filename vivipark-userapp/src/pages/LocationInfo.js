import React, { Component } from 'react';
import { connect } from 'react-redux';


class LocationInfo extends Component {
    render() {
        let location = this.props.selectedLocation;
        return (
            <div>
                <h1>{location.parkingLotName}</h1>
                <p>{JSON.stringify(this.props.selectedLocation)}</p>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    token: state.token.token, 
    selectedLocation: state.location.selected
})

export default connect(mapStateToProps, null)(LocationInfo);

