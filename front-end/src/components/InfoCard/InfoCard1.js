// import PropTypes from 'prop-types'
import React, { Component } from 'react'

// import Card from "../UI/Card";
import classes from './InfoCard1.module.css';
// import Modal from '../UI/Modal';
  
export default class InfoCard1 extends Component {

  constructor(props) {
    super(props)
  
    this.state = {
       modalFlag: false
    }
  }

  hideWordHandler = () => {
    this.setState({
      modalFlag: !this.state.modalFlag
    })
    if (this.state.modalFlag){
      this.listContent()
    }
  };


  render() {  
    return (
      <div>
        <button
          className={classes.woddbutton}
          onClick={() => this.props.showWord(this.props.word)}
        >
          <a className={classes.wodd}>{this.props.word} </a>
          <a className={classes.meaning}> {this.props.meaning}</a>
        </button>
      </div>
    )
  }
}  