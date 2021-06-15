import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';

import PageTitle from '../components/PageTitle';
import EventHistory from './EventHistory';
import PurchaseHistory from './PurchaseHistory'
import './history.css';

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

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`
    };
}
  
const useStyles = makeStyles((theme) => ({
root: {
    width: `100%`, 
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
},
}));

export default function History() {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <div className="history-tabs">
            <PageTitle title="歷史紀錄" />
            <div className="title-spacer"></div>
            <div className={classes.root}>
                <AppBar position="static">
                    <Tabs value={value} onChange={handleChange} variant="fullWidth" aria-label="simple tabs example">
                        <Tab label="停車紀錄" {...a11yProps(0)} />
                        <Tab label="購買紀錄" {...a11yProps(1)} />
                    </Tabs>
                </AppBar>
                <TabPanel value={value} index={1}>
                    <PurchaseHistory />
                </TabPanel>
                <TabPanel value={value} index={0}>
                    <EventHistory />
                </TabPanel>
            </div>
        </div>
    )
}
