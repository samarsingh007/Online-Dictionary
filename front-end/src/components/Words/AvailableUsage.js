import Card from "../UI/Card";
import classes from "./AvailableUsage.module.css";
import Pos from "./Usage/Pos";
import WordSummary from "./Usage/WordSummary";
import Definitions from "./Usage/Definitions";

const AvailableUsage = (props) => {

  async function handleLanguageChange(data){
    
    await props.onLanguageChange(data);
    
  }

  const posList = props.wordData["meanings"].map((meaning) => (
    <Pos
      key={props.wordData["meanings"].indexOf(meaning)}
      data={meaning}
      word={props.wordData["word"]}
    />
  ));

  return (
    <section className={classes.meals}>
      <Card>
        <WordSummary word={props.wordData["word"]} ipa = {props.wordData["ipa"]} languageCode={props.languageCode} onLanguageChange = {handleLanguageChange} />
        <ul>{posList}</ul>
        {props.wordData["generalExamples"].length !== 0  &&  <Definitions word={props.wordData["word"]} item={props.wordData.generalExamples} name="Example Usage"/>}
      </Card>
    </section>
  );
};

export default AvailableUsage;
