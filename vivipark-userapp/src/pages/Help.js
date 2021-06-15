import React from 'react';
import PageTitle from '../components/PageTitle';
import FacebookIcon from '@material-ui/icons/Facebook';
import  {IconButton} from '@material-ui/core';

function Help (props){


    return (
        <div>
            <PageTitle title="幫助中心"/>
            <div>服務專線：02-2568-3773</div>
            <div>(週一至週五 09:00-18:00)</div>
            <div>Line@：ViVi PARK</div>
            <IconButton href="http://www.facebook.com/viviparktaiwan/" target="_blank" rel="noopener noreferrer">
                <FacebookIcon />
            </IconButton>
            <div><a href={'http://www.vivi-park.com'}>官方網站</a></div>
           
        </div>
        
        
    )
}


export default (Help);


