import React, {useState}from 'react';
//import Axios from 'axios';
import { connect } from 'react-redux';
//import { Link } from 'react-router-dom';
import { updateUserFromDatabase } from '../actions/userActions';
import { updateCarFromDatabase } from '../actions/carActions';

import AddCars from '../components/Accounts/AddCar';
import UpdatePhone from '../components/Accounts/UpdatePhone';

import PageTitle from '../components/PageTitle';
import CarInfo from '../components/Accounts/CarInfo';
import UserPlan from '../components/Accounts/UserPlan';
import ChangePassword from '../components/Accounts/ChangePassword';
// import Facebook from '../components/Facebook';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
//import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabRoot: {
    backgroundColor: theme.palette.background.paper,
    flexGrow: 1,
    color: 'black',
    fontWeight: 'bold',
    fontSize:'70px',
  }

}));
function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.any.isRequired,
    value: PropTypes.any.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  function Account(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);
    const[state, setState] =useState({
        carNum: "",
        newPhoneNum: "",
        phoneNum: props.user.phone,
        customerId: props.user.id,
        phoneStatus: null,
        carStatus: null,
        addCars: false,
        updatePhoneNum: false,
        changePassword: false,
    })
    function carloop(cars) {
        return cars.map(value => {
            return <CarInfo key={value.carNum} car={value} />;
        })
    }
    function showSharedCars() {
        return props.sharedCars.map(car => {
            return <h1>{car.carNum}</h1>;
        })
    }  
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  
    return (
      
      <div className={classes.root}>
        <PageTitle title="會員資料" />
        <div className="title-spacer"></div>
        {/* <AppBar position="static" color = "transparent" border = "none" > */}
          <Tabs centered value={value} onChange={handleChange} aria-label="simple tabs example" variant="fullWidth" >
            <Tab label="基本資料" {...a11yProps(0)} />
            <Tab label="使用車輛" {...a11yProps(1)} />
            <Tab label="使用方案" {...a11yProps(2)} />
          </Tabs>
        {/* </AppBar> */}
        <TabPanel value={value} index={0}>
          <p>會員姓名 : {props.user.name}</p>
          <p>會員電話: {props.user.phone == null ? "尚未新增會員電話" : props.user.phone} </p>
          <p><button className="filter" onClick={() => setState({ updatePhoneNum: !state.updatePhoneNum })}> 更改會員電話 </button>
          {state.updatePhoneNum && <UpdatePhone />}</p>
    
          <p><button className="filter" onClick={() => setState({ changePassword: !state.changePassword })}> 更改密碼 </button>
          {state.changePassword && <ChangePassword  />}</p>

        </TabPanel>
        <TabPanel value={value} index={1}>
          <button className="filter" onClick={() => setState({ addCars: !state.addCars })}>新增使用車輛</button>
          {state.addCars && <AddCars />}
          <div>{( props.cars == null || props.cars.length < 1)? " 尚未新增車輛 " : carloop(props.cars)}</div>
          <br/>
          {(props.sharedCars !== null || props.sharedCars?.length  > 1) && <div> 共享車輛: {showSharedCars()}</div>}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <center><UserPlan /></center>
        </TabPanel>
      </div>
    );
  }
  



const mapStateToProps = state => ({
    user: state.user.user,
    cars: state.cars.cars,
    plan: state.plan.plan,
    sharedCars: state.sharedCars.sharedCars
})

export default connect(mapStateToProps, { updateUserFromDatabase, updateCarFromDatabase })(withStyles(useStyles)(Account));