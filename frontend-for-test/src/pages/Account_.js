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
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import SwipeableViews from 'react-swipeable-views';
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
          <AppBar position="static" color="default">
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Item One" {...a11yProps(0)} />
          <Tab label="Item Two" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          Item One
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          Item Two
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          Item Three
        </TabPanel>
      </SwipeableViews>
          <PageTitle title="會員資料" />
          
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