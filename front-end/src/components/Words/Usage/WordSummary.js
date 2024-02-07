import classes from "./WordSummary.module.css";
import speakerLogo from "../../../assets/Icons/speaker.png";
import { useState, useEffect} from "react";


const WordSummary = (props) => {
  const [selectedValue, setSelectedValue] = useState(props.languageCode || 'en-US');

  useEffect(() => {
    setSelectedValue(props.languageCode);
  }, [props.languageCode]);

  async function handleSelectChange(event){
    setSelectedValue(event.target.value);
   
    await props.onLanguageChange(event.target.value);
    }
  const playAudio = () => {
    const timestamp = new Date().getTime();
    const audio = new Audio(
      `https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/mongo/audio/${props.word}?t=${timestamp}&lang=${selectedValue}`
    );
    audio.play();
  };

  return (
    <div className={classes.meal}>
        <h1 className={classes.word}>{props.word}</h1>
        <button onClick={playAudio} className={classes.audioPlayer}>
          <img src={speakerLogo} alt="Speaker Logo" />
        </button>
        {props.ipa && <div className={classes.ipa}>[ {props.ipa} ]</div>}
        <div className={classes.dropdown}>
        <select value={selectedValue} onChange={handleSelectChange} className={classes.languageSelect}>
            <option value="en-US">en-US</option>
            <option value="en-GB">en-GB</option>
            <option value="hi-IN">hi-IN</option>
            <option value="es-ES">es-ES</option>
            <option value="ja-JP">ja-JP</option>
            <option value="da-DK">da-DK</option>
          </select>
          </div>
        <div className={classes.source}>Source: Google Audio</div>
        </div>
  );
};

export default WordSummary;