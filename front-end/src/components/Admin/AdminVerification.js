import React, { useState, useEffect } from "react";
import classes from "./AdminVerification.css";

const AdminVerification = () => {
  const [data, setData] = useState([]);
  const [modalWord, setWord] = useState("");

  const handleCloseModal = () => {
    setShowModal(false);
  };
  // const [acceptedWords, setAcceptedWords] = useState([]);
  // const [rejectedWords, setRejectedWords] = useState([]);
  const [showModal, setShowModal] = useState(false);
  // const [meanings, setMeanings] = useState({});
  // const [newWord, setNewWord] = useState({ word: "", meaning: "" });
  // const [showMeaning, setShowMeaning] = useState(false);
  // const [wordToShow, setWordToShow] = useState("");

  // const [showAddMeaning, setShowAddMeaning] = useState(false); // added state variable
  useEffect(() => {
    getNewWordList();
  }, []);

  async function getNewWordList() {
    await fetch(
      `https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/getword/getnewwords?requestedState=Accepted`
    )
      .then((response) => response.json())
      .then((result) => {
        result = result.map((item, index) => {
          return { ...item, id: index + 1 };
        });
        result = result.sort((a, b) => b.count - a.count);
        console.log(result);
        setData(result);
        
      });
      
      
  }

  function handleAddMeaningSubmit(event) {
    event.preventDefault();

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        word: event.target.elements.word.value,
        // pos: event.target.elements.pos.value,
        meaning: event.target.elements.meaning.value,
        example: event.target.elements.example.value,
        state: "add",
        manualAccept: "true",
        
      }),
    };

    fetch(
      `https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/getword/adminWord`,
      requestOptions
    );

    setData((prevState) => {
      return prevState.filter((item) => item.word !== event.target.elements.word.value);
    });

    // added code to show modal for adding new meaning
    
    setShowModal(false);
  }

  const manualAccept = (id, wordGiven) => {
    setWord(wordGiven);
    setShowModal(true);
  };

  function acceptRejectWords(postBody) {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(postBody),
    };

    fetch(`https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/getword/adminWord`,
      requestOptions)

       setData((prevState)=>{
        return prevState.filter((item) => item.word !== postBody.word)
       })

  }




  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Word</th>
            
            <th>Show Meaning</th>
            <th>Count</th>
            <th>Final Accept</th>
            <th>Reject</th>
            <th>Add</th>
            
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.word}</td>
              <td>
                  {item.meaning}
              </td>
              <td>{item.count}</td>
              <td>
                <button
                  className="accept"
                  onClick={() => acceptRejectWords({word : item.word, state:"add",manualAccept:"false"})}
                >
                  Accept
                </button>
              </td>
              <td>
                <button
                  className="reject"
                  onClick={() => acceptRejectWords({word : item.word, state:"reject"})}
                >
                  Reject
                </button>
              </td>
              <td>
                <button
                  className="accept"
                  onClick={() => manualAccept(item.id, item.word)}
                >
                  Add Manually
                </button>
              </td>
              
            </tr>
          ))}
        </tbody>
      </table>
    
      {showModal && (
        <div className="modall">
          <div className="modal-content1">
            <span className="close" onClick={handleCloseModal}>
              &times;
            </span>
            <form className={classes.forms} onSubmit={handleAddMeaningSubmit}>
              <div>
              <label htmlFor="word">Word:</label>
              <input type="text" id="word" name="word" value={modalWord}/>
              <label htmlFor="meaning">Meaning:</label>
              <input type="text" id="meaning" name="meaning" />
              <label htmlFor="example">Example Usage:</label>
              <input type="text" id="example" name="example" />
              <button type="submit">Add Meaning</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVerification;
