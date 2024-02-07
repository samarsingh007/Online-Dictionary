import { Fragment } from 'react';
// import Card from '../UI/Card';
import './Word.module.css';
import AvailableUsage from './AvailableUsage';


const Word = (props) => {
  async function handleLanguageChange(data){
   
    await props.onLanguageChange(data);
  }
  return (
    <Fragment>
     <AvailableUsage wordData={props.wordData} languageCode={props.languageCode} onLanguageChange = {handleLanguageChange}/>
     
    </Fragment>
  );
};

export default Word;