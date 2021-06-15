import React from 'react'
import { removeToken } from '../actions/tokenActions';
import { removeUser } from '../actions/userActions';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import './logout.css';

const Logout = ({ removeToken, removeUser }) => {
    const logout = () => {
        removeToken();
        removeUser();
    }

    return (
        <div className='logout'>
            <Link to='/' onClick={logout}>登出</Link>
        </div>
    )
}

export default connect(null, { removeToken, removeUser })(Logout);
