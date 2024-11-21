import { useState } from 'react'
import './LoginRegister.css'
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa"; // npm install react-icons
import validator from 'validator'; // npm install validator

const LoginRegister = () => {

    // state variables to manage form data, error messages, and action (login or register)
    const [action, setAction] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);
    const [termsError, setTermsError] = useState('');
    const [loginError, setLoginError] = useState('');
    const [registerError, setRegisterError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    // switch to register form
    const registerLink = () => {
        setAction( ' alternate' );
        clearFields();
    };

    // switch to login form
    const loginLink = () => {
        setAction( '' );
        clearFields();
    };

    // clear all input fields and error messages
    const clearFields = () => {
        setUsername('');
        setEmail('');
        setPassword('');
        setTermsChecked(false);
        setTermsError('');
        setLoginError('');
        setRegisterError('');
        setEmailError('');
        setPasswordError('');
    };

    // password validate function
    const validatePassword = (password) => {
        const isValid = validator.isStrongPassword(password, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        });
        return isValid;
    };
    
    // handle registration logic and perform validation checks
    const handleRegister = (e) => {
        e.preventDefault(); {/*remove later*/}

        if (!validator.isEmail(email)) {
            setEmailError('Please enter a valid email address');
        } else {
            setEmailError('');
        }

        if (!validatePassword(password)) {
            setPasswordError(
                'Weak Password'
            );
        } else {
            setPasswordError('');
        }
        
        if (!username || !email || !password) {
            setRegisterError('Please fill out all fields');
        }
        else
        {
            setRegisterError('');
        }

        if (!termsChecked) {
            setTermsError('You must agree to the terms and conditions');
        }
        else
        {
            setTermsError('');
        }

        if (!username || !email || !password || !termsChecked || emailError || passwordError) 
        {
            return;
        }

        alert('Registered successfully!');
        clearFields();
        loginLink();
    };

    // handle login logic and check for required fields
    const handleLogin = (e) => {
        e.preventDefault(); // remove later

        if (username && password) {
            setLoginError('');
            alert('Logged in successfully!');  
            clearFields();
        } else {
            setLoginError('Please fill out both fields');
        }
    };

    return (
    <div className={`wrapper${action}`}>

        {/*login form*/}
        <div className="form-box login">
            <form action="">
                <h1>Login</h1>

                <div className="input-box">
                    <input type="text" 
                    placeholder='Username' 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required/>
                    <FaUser className='icon' />
                </div>

                <div className="input-box">
                    <input type="password" 
                    placeholder='Password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                    <FaLock className='icon' />
                </div>

                <div className="remember-forgot">
                    <label><input type="checkbox"/>
                    Remember Me</label>
                    <a href="#">Forgot Password</a>
                </div>

                <button type="submit" onClick={handleLogin}>Login</button>

                {loginError && <div className="error-message">{loginError}</div>}
                
                <div className="register-link">
                    <p>Don&apos;t have an account? 
                        <a href="#" onClick={registerLink}>Register</a>
                    </p>
                </div>
            </form>
        </div>

        {/*register form*/}
        <div className="form-box register">
            <form action="">
                <h1>Register</h1>

                <div className="input-box">
                    <input type="text" 
                    placeholder='Username' 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required/>
                    <FaUser className='icon' />
                </div>

                <div className="input-box">
                    <input type="email" 
                    placeholder='E-Mail'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required/>
                    <FaEnvelope  className='icon' />
                </div>
                {emailError && <div className="error-message">{emailError}</div>}

                <div className="input-box">
                    <input type="password" 
                    placeholder='Password' 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required/>
                    <FaLock className='icon' />
                </div>
                {passwordError && <div className="error-message">{passwordError}</div>}

                <div className="remember-forgot">
                    <label><input type="checkbox"
                    checked={termsChecked}
                    onChange={() => setTermsChecked(!termsChecked)}/>
                    I agree to the terms & conditions</label>
                </div>

                {termsError && <div className="error-message">{termsError}</div>}

                <button type="submit" onClick={handleRegister}>Register</button>

                {registerError && <div className="error-message">{registerError}</div>}

                <div className="register-link">
                    <p>Already have an account? 
                        <a href="#" onClick={loginLink}>Login</a>
                    </p>
                </div>
            </form>
        </div>
    </div>
  )
}

export default LoginRegister