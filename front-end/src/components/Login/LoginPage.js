import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './LoginPage.css';

function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/logindetails`)
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching username and password:', error);
        setLoading(false);
      });
  }, []);

  const handleLogin = async() => {
    if (!username) {
      setErrorMessage('Username is empty.');
      return;
    }
    if (!password) {
      setErrorMessage('Password is empty.');
      return;
    }
    try {
      const response = await fetch(`https://online-dictionary-backend-1.10xw8i3rxjwe.us-east.codeengine.appdomain.cloud/logindetails`);
      const data = await response.json();
      const { username: usernameFromMongo, password: passwordFromMongo } = data;
      if (username === usernameFromMongo && password === passwordFromMongo) {
        onLogin();
        navigate('/admin');
      } else {
        setErrorMessage('Either username or password is incorrect.');
      }
    } catch (error) {
      console.log(error);
      setErrorMessage('Failed to fetch username and password from MongoDB.');
    }
  };

  if (loading) {
    return <p>Loading username and password...</p>;
  }

  return (
    <div className='login-form'>
      <div className='login-container'>
        <h1>Admin Login</h1>
        <div className='input-container'>
          <input
            type='text'
            className='input-text'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='Username'
            required
          />
        </div>
        <div className='input-container'>
          <input
            type='password'
            className='input-text'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
        </div>
        <div className='input-container'>
          <button className={classes.buttonx} onClick={handleLogin}>Login</button>
        </div>
        {errorMessage && <p>{errorMessage}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
