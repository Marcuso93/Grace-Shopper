import React from 'react';
import { useState } from 'react';
import { loginUser, registerUser } from '../utilities/apiCalls';
import { setTokenInLocalStorage } from '../utilities/utils';

const Account = ({ token, setToken, user, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [isRegistered, setIsRegistered] = useState(true);
  const [address, setAddress] = useState('');
  const [fullname, setFullName] = useState('');
  const [email, setEmail] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    const login = await loginUser(username, password);
    console.log(login)
    if (login.error) {
      alert(`Error: ${login.message} If you do not have an account, please register.`);
    } else if (login.user && login.token) {
      setUserData(login.user, login.token);
    } else {
      alert('There was an error during login.');
    }
  }

  const handleRegistration = async (event) => {
    event.preventDefault();
    if (password === passwordConfirmation) {
      const registration = await registerUser(username, password, address, fullname, email);
      if (registration.error) {
        alert(`Error: ${registration.message}`);
      } else if (registration.user && registration.token) {
        setUserData(registration.user, registration.token);
      } else {
        alert('There was an error during registration.');
      }
    } else {
      alert("The passwords don't match!");
    }
  }

  const setUserData = (returnedUser, returnedToken) => {
    setUser(returnedUser);
    setToken(returnedToken);
    setTokenInLocalStorage(returnedToken);
    resetForm();
  }

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setPasswordConfirmation('');
    setAddress('');
    setFullName('');
    setEmail('');
    setIsRegistered(true);
  }

  return (
    <div className='login'>
      <h2 className='account'>Account</h2>
      {
        (user && token) ?
          <>
            <h2>User Profile</h2>
            <p>You are logged in as {user.username}.</p>
          </> :
          <form
            className='login-form'
            onSubmit={ (event) => {
              isRegistered ? handleLogin(event) : handleRegistration(event)
          }}>
            <h3>{isRegistered ? "Login" : "Register"}</h3>
            <div>
              <div> Username </div>
              <input
                required
                type='text'
                name='username'
                placeholder='Username'
                value={username}
                onChange={(event) => { setUsername(event.target.value) }}
              />
            </div>
            <div>
              <div> Password </div>
              <input
                required
                type='password'
                name='password'
                placeholder='Password'
                value={password}
                onChange={(event) => { setPassword(event.target.value) }}
              />
            </div>
            {
              !isRegistered ?
              <>
                <div>
                  <div>Confirm Password</div>
                  <input
                    type='password'
                    name='password-confirmation'
                    placeholder='Password'
                    value={passwordConfirmation}
                    onChange={(event) => { setPasswordConfirmation(event.target.value) }}
                  />
                  {/* TODO: onscreen error messaging */}
                </div>
                <div>
                  <div> Full Name </div>
                  <input
                    required
                    type='text'
                    name='fullname'
                    placeholder='Full Name'
                    value={fullname}
                    onChange={(event) => { setFullName(event.target.value) }}
                  />
                </div>
                <div>
                  <div> Address </div>
                  <input
                    required
                    type='text'
                    name='address'
                    placeholder='Address'
                    value={address}
                    onChange={(event) => { setAddress(event.target.value) }}
                  />
                </div>
                <div>
                  <div> Email </div>
                  <input
                    required
                    type='text'
                    name='email'
                    placeholder='Email'
                    value={email}
                    onChange={(event) => { setEmail(event.target.value) }}
                  />
                </div>
              </> :
              null
            }
            <button type='submit'>{isRegistered ? 'Login' : 'Register'}</button>
            <br/>
            <button className='login-register-button' onClick={(event) => {
              event.preventDefault();
              isRegistered ?
              setIsRegistered(false) :
              setIsRegistered(true); 
            }}>{ isRegistered ? 'Need to register a new user?' : 'Already have an account?' }</button>
          </form>
      }
    </div>
  )
}

export default Account;