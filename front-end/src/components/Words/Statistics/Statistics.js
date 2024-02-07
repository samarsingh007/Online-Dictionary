import React, { useState, useEffect, Fragment, FunctionComponent } from "react";
import classes from "./Statistics.module.css"
// import Modal from "../../UI/Modal";
// import Card from "../../UI/Card";
import Plot from 'react-plotly.js';
import "./styles.css";
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid } from "recharts";
import { scaleOrdinal } from "d3-scale";
import { schemeCategory10 } from "d3-scale-chromatic";

const colors = '#1F77B4';

//const data = [
//   {
//     name: "Words",
//     uv: 'statis.Words',
//     pv: 2400,
//     amt: 2400
//   },
 
//   {
//     name: "Definitions",
//     uv: 3000,
//     pv: 1398,
//     amt: 2210
//   },
 
//   {
//     name: "Audios",
//     uv: 2000,
//     pv: 9800,
//     amt: 2290
//   },
 
//   {
//     name: "Examples",
//     uv: 2780,
//     pv: 3908,
//     amt: 2000
//   },
 
//   {
//     name: "All Audios",
//     uv: 1890,
//     pv: 4800,
//     amt: 2181
//   },
 
//   {
//     name: "All Definitions",
//     uv: 2390,
//     pv: 3800,
//     amt: 2500
//   },
 
//   {
//     name: "All Examples ",
//     uv: 3490,
//     pv: 4300,
//     amt: 2100
//   }
// ];



const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${
    y + height / 3
  } 
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${
    x + width
  }, ${y + height}
  Z`;
};

const TriangleBar =  (props) => {
  const { fill, x, y, width, height } = props;

  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

function Statistics(props) {
  const [statis, setStatistics] = useState(false);
  const [statisDaily,setStatisticsDaily] = useState(false);
//   const data = [
//   {
//     name: "Words",
//     uv: statis.Words,
//     pv: 2400,
//     amt: 2400
//   },
 
//   {
//     name: "Definitions",
//     uv: statis.WordsWithDefintions,
//     pv: 1398,
//     amt: 2210
//   },
 
//   {
//     name: "Audios",
//     uv: statis.WordsWithAudios,
//     pv: 9800,
//     amt: 2290
//   },
 
//   {
//     name: "Examples",
//     uv: statis.WordsWithExamples,
//     pv: 3908,
//     amt: 2000
//   },
 
//   {
//     name: "All Audios",
//     uv: statis.TotalAudios,
//     pv: 4800,
//     amt: 2181
//   },
 
//   {
//     name: "All Definitions",
//     uv: statis.TotalDefinitions,
//     pv: 3800,
//     amt: 2500
//   },
 
//   {
//     name: "All Examples ",
//     uv: statis.TotalExamples,
//     pv: 4300,
//     amt: 2100
//   }
// ];
 
  useEffect(() => {
    test();
  }, []);

  useEffect(() => {
    testDaily();
  }, []);

  async function test() {
    await fetch(`https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/getWord/getStatistics`)
      .then((response) => response.json())
      .then((result) => {
        setStatistics(result);
      });
  }

  async function testDaily() {
    await fetch(`https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/getWord/getStatistics`)
      .then((response1) => response1.json())
      .then((result1) => {
        setStatisticsDaily(result1);
      });
  }

  var statList = [];

  for (var key in statis) {
    if (key === "_id") {
      continue;
    }
    statList.push(
      <li className={classes.li}>
       <h5>{key}</h5> <h5>{statis[key]}{" "}
        </h5>
      </li>
    );
  }

  return (

   <div id = "wrapper"  /*className={classes.card}*/ style={{backgroundColor: '#E2E2E2', marginTop:"20px", marginLeft:"130px", }}>
 
    <div id= "#statsBar" style={{marginLeft:'400px', marginRight:'50px', backgroundColor: 'white ' , paddingLeft:'0px',paddingRight:'10px',paddingTop:'10px',paddingBottom:'10px',borderRadius:'10px', width:'500px', boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
        <p style={{fontFamily: "Calibri", paddingLeft: '125px',color: 'black'}}> Total Number of queries today:<b id = '#querycounter'> {statis.TotalQueries}</b></p>
        <p style={{fontFamily: "Calibri", paddingLeft: '125px',color: 'black'}}> Total Meanings Searched today:<b id = '#querycounter1'> {statis["meanings searched today"]}</b></p>

        {/* <p style={{fontFamily: "Calibri", paddingLeft: '60px', color: 'black'}}>    The below graph contains our corpus data. It shows the number of words we have available, number of Audios and example sentences.
        <br></br>
        The list is bound to be expanded since we are learning and adding new words everyday!</p> */}
    </div>
    <div id = "Stat1" style={{margin: 10,backgroundColor: '#E2E2E2',paddingLeft:'10px',paddingRight:'10px',borderRadius:'10px', boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"}}>
      <h2 style={{paddingLeft:'15px', paddingTop:'20px' }}>Word Statistics</h2>
    <Plot
        data={[
          {type: 'bar', x: ['Words', "Words with Defns", "Words with Audio","Words with Example","Total Audios","Total Defns","Total Examples"], y: [statis.Words, statis.WordsWithDefintions, statis.WordsWithAudios,statis.WordsWithExamples,statis.TotalAudios,statis.TotalExamples,statis.TotalDefinitions]},
        ]}
        layout={ { width: 1300 ,height: 500, plot_bgcolor: '#E2E2E2',borderRadius:'20px', color: '#E2E2E2',paper_bgcolor:'#E2E2E2'} }
       
      />

       <div style={{width:'1000px', marginLeft:'150px', marginRight:'50px', backgroundColor: '#E2E2E2 ' , paddingLeft:'0px',paddingRight:'10px',paddingBottom:'10px',borderRadius:'10px', boxShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)" }}>
        <p style={{fontFamily: "Calibri", paddingTop:'20px', paddingLeft: '75px',color: 'black'}}>The above graph contains our corpus data. It shows the number of words we have available, number of Audios and example sentences. <br></br>The list is bound to be expanded since we are learning and adding new words everyday!</p>
      </div>

    </div>
   {/* <BarChart
      width={1200}
      height={400}
      data={data}
      margin={{
        top: 20,
        right: 30,
        left: 20,
        bottom: 5
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Bar
        dataKey="uv"
        fill="#1F77B4"
        shape={<TriangleBar />}
        label={{ position: "top" }}
       

      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={colors} />
        ))}
      </Bar>
     
    </BarChart> */}

    {/* <div id = "Stat2" style={{margin: 10,backgroundColor: '#E5ECF6',paddingLeft:'10px',paddingRight:'10px',borderRadius:'10px'}}>
    <h2 style={{  }}>Statistics of the day</h2>
      <p style={{color: 'black'}}>The below graph shows day-to-day logging activity on this website including daily traffic, words searched, sessions etc!</p>
      <br>
      </br>
      <br>
      </br>
     
    <Plot
       
        data={[
          {type: 'bar', x: ['Total Visits', "Total Users", "Sessions per User","Numbers per Query"], y: [12,4,2,29,]},
        ]}
        layout={ {
          width: 550, height: 500,plot_bgcolor: 'white',borderRadius:'20px'}}
      />
    </div> */}
    </div>
  );
}

export default Statistics;