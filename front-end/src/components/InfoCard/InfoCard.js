import React from 'react'
// import Card from "../UI/Card";
import classes from './InfoCard.module.css';
// import Modal from '../UI/Modal';
  
const InfoCard = (props) => {


  
     return (
      <div>
      <div className={classes.woddheader}>{props.title}</div>
        <div className={classes.infocardborder}>
            <button className= {classes.woddbutton}>
                <a className={classes.wodd} onClick={()=>props.showWord(props.word)}> {props.word} </a>
            </button>
            <div className={classes.pos}>{props.pos}</div>
            <div className={classes.meaning}>{props.meaning}</div>
            <h3>{props.month} {props.datee && props.datee+","} {props.yearr}</h3>
        </div>
        </div>
    )
     }
export default InfoCard;