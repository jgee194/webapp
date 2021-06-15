import React from 'react'
import MyLocationIcon from '@material-ui/icons/MyLocation';

import './locate.css';
import { connect } from 'react-redux';

function Locate(props) {
    return (
        <div>
            <button className="locate" onClick={() => {
                props.panTo(props.user.location);
            }}>
                <MyLocationIcon />
            </button>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.user.user
})

export default connect(mapStateToProps, null)(Locate);