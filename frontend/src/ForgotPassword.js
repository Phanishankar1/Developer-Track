import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
const ForgotPassword = (props) => {
  const [email, setEmail] = useState('');
  const [alert, setAlert] = useState(null);
const navigate=useNavigate();
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:5000/forgot_password",{email}).then(res => {
      const data = res.data;
      if (data.status === "verified") {
        setAlert({ type: "success", message: "Reset link has been sent to your email." });
        setTimeout(() => {
          setAlert(null);
        // navigate('/form');
        }, 3000);
      } else if (data.status === "email_doesnt_exist") {
        setAlert({ type: "danger", message: "Email doesn't exist." });
      }
    }).catch(error => {
      setAlert({ type: "danger", message: "An error occurred. Please try again." });
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" id="formbackground">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#000', color: '#fff' }}>
        <h2 className="text-center mb-4">Forgot Password</h2>
        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert" style={{ marginBottom: '1rem' }}>
            {alert.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          <div className="d-grid">
            <button type="submit" className="btn btn-primary">Send Reset Link</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
