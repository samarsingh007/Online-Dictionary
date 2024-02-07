import React, { useState } from "react";
import classes from "./AddWord.module.css";
import wordList from "../../../assets/wordList";

const AddWord = (props) => {
  const [addWord, setAddWord] = useState(0);


  async function addWordHandler(event) {
    event.preventDefault();

   
    const word = event.target.elements.word.value;
    const present = await props.onCheck(word,true);
    if (!present) {
      setAddWord(1);
      return;
    }
    else if (present == 1){
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        word: word,
        languageCode: "en-US",
      }),
    };

    fetch(
      `https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/getWord/addNewWord`,
      requestOptions
    );

    setAddWord(1);
  }

  const clickHandler = () => {
    setAddWord(0);
    
  };

  const addWordForm = (
    <div>
      <h1 className={classes.h1}>Help us to increase our vocabulary</h1>
      <form className={classes.form} onSubmit={addWordHandler}>
        <input
          className={classes.input}
          type="text"
          name="word"
          placeholder={"Add a new word"}
        />
        <button className={classes.button}>Submit</button>
      </form>
    </div>
  );

  const wordAddedForm = (
    <div className={classes.addedWord}>
      <h1>Your word has been sent for review.</h1>
      <button className={classes.addWordButton} onClick={clickHandler}>
        Add another word
      </button>
    </div>
  );

  const wordExistsMessage = (
    <div className={classes.addedWord}>
      <h1>The word already exists in the dictionary.</h1>
      <button className={classes.addWordButton} onClick={clickHandler}>
        Add another word
      </button>
    </div>
  );

  return (
    <div className={classes.card}>
      {addWord === 0 && addWordForm}
      {addWord ===1  && wordAddedForm}
      {addWord === 2  && wordExistsMessage}
    </div>
  );
};

export default AddWord;
