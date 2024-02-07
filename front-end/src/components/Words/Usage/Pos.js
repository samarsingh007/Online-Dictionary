import classes from "./Pos.module.css";
import speakerLogo from "../../../assets/Icons/speaker.png";

const Pos = (props) => {


  function replaceWord(sentence) {
    const regex = new RegExp(`\\b${props.word}\\b`, 'gi');
    var replacement = sentence.replace(regex, `<b style="color: black;font-style: italic;">${props.word}</b>`);
    
    return replacement;
  }

  const defList = props.data["definitions"].map((definition,index) => (
    <div key={index}>
      <li>
        {definition["meaning"]}
        {definition["usage"] && (
            // <ol > {replaceWord(definition["usage"])} </ol>
            <ol>
            <span> Eg: </span>
            <span dangerouslySetInnerHTML={{ __html: replaceWord(definition["usage"]) }}></span>
            </ol>
        )}
      </li>
    </div>
  ));

  let source = null;

  if (props.data["definitions"].length > 0) {
    const firstDefinition = props.data["definitions"][0];
    if (firstDefinition["source"]) {
      source = (
        <div className={classes.source + " " + classes.rightAlign}>Source: {firstDefinition["source"]}</div>
      );
    }
  }

  var audioButton = null;

  async function playSound() {
    var snd = new Audio(props.data["audio"]["audioLink"]);
    snd.play(snd);
    console.log(props.data["audio"]);
  }

  if (props.data.hasOwnProperty("audio")) {
    audioButton = (
      <button className={classes.speakerButton} onClick={playSound}>
        <img src={speakerLogo} alt="Speaker Logo" />
      </button>
    );
  }

  return (
    <li className={classes.meal}>
      <div>
        <h1>
          {props.data["pos"]}
          <span className={classes.icon}>{audioButton}</span>
        </h1>
        <ul>{defList}</ul>
        {source}
      </div>
    </li>
  );
};

export default Pos;
