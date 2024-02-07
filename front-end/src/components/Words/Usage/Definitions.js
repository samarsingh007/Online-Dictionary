import { useState } from "react";
import classes from "./Definitions.module.css";

const Definitions = (props) => {
  const [numExamples, setNumExamples] = useState(5);
   
  function replaceWord(sentence) {
    const regex = new RegExp(`\\b${props.word}\\b`, 'gi');
    var replacement = sentence.replace(regex, `<b style="color: black;font-style: italic;">${props.word}</b>`);
   
    return replacement;
  }

  
  const defList = props.item.slice(0, numExamples).map((item,index) => (
    
    <li className={classes.li} key={index}>
      <ol>
      <span className={classes.ol} dangerouslySetInnerHTML={{ __html: replaceWord(item.text) }}></span>
      <sub className={classes.examplesource} >{item.source}</sub>
      </ol>
    </li>
   
  ));
  
  
  const handleShowMore = () => {
    setNumExamples(numExamples + 5);
  };

 

  return (
    <li className={classes.meal}>
      <div>
        <h1>{props.name}</h1>
        <ul>{defList}</ul>

        {numExamples < props.item.length && (
          <button 
            className={classes.showMoreButton} 
            onClick={handleShowMore}
          >
            Show More
          </button>
        )}
      </div>
    </li>
  );
};

export default Definitions;
