import React, { useState } from 'react';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [inputValue1, setInputValue1] = useState('');
  const [inputValue2, setInputValue2] = useState('');
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "textfield1") {
      setInputValue1(value);
    } else if (name === "textfield2") {
      setInputValue2(value);
    }
  };

  const handleInputBlur = () => {
    const audio1 = document.getElementById('audio1');
    audio1.src = `http://localhost:8080/word/${inputValue1}`;
    const audio2 = document.getElementById('audio2');
    audio2.src = `http://localhost:8080/${inputValue2}`;
  };
  
  return (
    <div>
      <input type="text" name="textfield1" value={inputValue1} onChange={handleInputChange} onBlur={handleInputBlur} />
      <audio controls id="audio1">
        <source type="audio/mp3" />
      </audio>
      <br></br>
      <br></br>
      <input type="text" name="textfield2" value={inputValue2} onChange={handleInputChange} onBlur={handleInputBlur} />
      <audio controls id="audio2">
        <source type="audio/mp3" />
      </audio>
    </div>
  );
  
}

export default App;

