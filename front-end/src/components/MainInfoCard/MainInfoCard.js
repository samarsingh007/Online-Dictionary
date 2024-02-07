// import PropTypes from 'prop-types'
import React from 'react'
import InfoCard from '../InfoCard/InfoCard'
import InfoCard1 from '../InfoCard/InfoCard1'
import classes from './MainInfoCard.module.css';
// import ReactDOM from "react-dom";
// import { useState } from 'react';
export default class MainInfoCard extends React.Component {
    constructor(props) {
      super(props)
    
      this.state = {
        wordLimit:5,
        WOD: null,
        TOD: null        
      }
      this.state={
        monthh: new Date().toLocaleDateString('en-us', { month: 'long' }),
        date1: new Date().toLocaleDateString('en-us', { day: '2-digit' }),
        yearr: new Date().getFullYear(),
        wordLimit:5
      };
    }

    setLimit() {
      const { TOD } = this.state;
      const maxLimit = TOD ? TOD.length : 0;
      this.setState((prevState) => {
          const newLimit = prevState.wordLimit === maxLimit ? 5 : prevState.wordLimit + 5;
          return { wordLimit: newLimit };
      });
  }
  
      
    componentDidMount() {          
        fetch(`https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/getword/wordoftheday`)
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    WOD: result
                })
            })
            .catch((error) => console.log(error));

        fetch(`https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/getword/trendingword`)
            .then((response) => response.json())
            .then((result) => {
                this.setState({
                    TOD: result,
                    trendingWords: Object.keys(result),
                    trendingMeanings: Object.values(result)


                })
            })
            .catch((error) => console.log(error));
    }

    

render() {
    const { WOD, TOD ,trendingWords,trendingMeanings} = this.state;
    const trendList =
        TOD && 
        trendingWords.slice(0, this.state.wordLimit).map((meaning, index) => (
            <InfoCard1
                word={meaning}
                index={index}
                showWord={this.props.showWord}
                meaning = {trendingMeanings[index]}
                listData={TOD}
                key={index}
                className={
                    index >= this.state.wordLimit - 5
                }
            />            
        ));
    return (
        <>
            <div className={classes.MainCard}>
                {WOD && (
                    <div className={classes.MainInfocard}>
                        <InfoCard
                            title={"WORD OF THE DAY"}
                            word={WOD.word}
                            meaning={WOD.meaning}
                            pos = {(WOD.pos.length && WOD.pos )|| " "}
                            showWord={this.props.showWord}
                            month={this.state.monthh}
                            datee={this.state.date1}
                            yearr={this.state.yearr}
                        />
                    </div>
                )}
                {TOD && (
                    <div className={classes.MainInfocardTrend}>
                        <h1>TRENDING WORDS</h1>
                        <div id="trendList" className={classes.trendList}>
                            {trendList}
                        </div>
                        { TOD && trendingWords.length > 5 &&
                        (this.state.wordLimit >= trendingWords.length ? (
                            <button
                                className={classes.showmorebutton}
                                onClick={() => this.setState({ wordLimit: 5 })}
                            >
                                Show Less
                            </button>
                        ) : (
                            <button
                                className={classes.showmorebutton}
                                onClick={() => this.setLimit()}
                            >
                                Show More
                            </button>
                        ))
                    }
                    </div>
                )}
            </div>
        </>
    );
}

      
}