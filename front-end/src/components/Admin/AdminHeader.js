import React from 'react';
import classes from './AdminHeader.module.css'
const AdminHeader = (props) => {
  return (
    <div>
    <div className = {classes.title}>Online Dictionary - Admin</div>
    <div className = {classes.headerbuttons}>
      <button className={classes.button1} onClick={()=>props.onInit()}>Initial Review</button>
      <button className={classes.button2} onClick={()=>props.onFin()}>Final Review</button>
    </div>
    </div>
  );
};

export default AdminHeader;