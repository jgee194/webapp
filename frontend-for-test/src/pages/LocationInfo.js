
import React, { Component } from 'react';
import { connect } from 'react-redux';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CallIcon from '@material-ui/icons/Call';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import RoomIcon from '@material-ui/icons/Room';
class LocationInfo extends Component {

    render() {
        let location = this.props.selectedLocation;
        const itemsList = [
            {
                text: "20小時/hr 月租卡 通行卡",
                icon: <AttachMoneyIcon color="primary" />,
                // onClick: () => history.push("/")
            },
            {
                text: "營業時間:24小時",
                icon: <AccessTimeIcon color="primary" />,
                // onClick: () => history.push("/")
            },
            {
                text: <a href="http://maps.google.com/maps?f=d&daddr=taipei+101,+Taipei,+Taiwan&sll=25.034180,121.564528&sspn=0.2,0.1&nav=1"> 導航至此 </a>,
                icon: <MonetizationOnIcon color="primary" />,
                // onClick: () => history.push("/")
            },
            {
                text: <a href="tel:1243433">02-54488566</a>,
                icon: <CallIcon color="primary" />,
                // onClick: () => history.push("/contact")
            },
            {
                text: "地址:台北市文山區興隆路三段",
                icon: <RoomIcon color="primary" />,
                // onClick: () => history.push("/contact")
            }
        ]
        return (
            <div className='info-div'>
                {/* <p>{JSON.stringify(this.props.selectedLocation)}</p> */}
                <List >
                    {itemsList.map((item, index) => {
                        const { text, icon, onClick } = item;
                        return (
                            <ListItem button key={text} onClick={onClick}>
                                {icon && <ListItemIcon>{icon}</ListItemIcon>}
                                <ListItemText primary={text} />
                            </ListItem>
                        );
                    })}
                </List>

            </div>
        )
    }
}

const mapStateToProps = state => ({
    token: state.token.token,
    selectedLocation: state.location.selected
})

export default connect(mapStateToProps, null)(LocationInfo);

