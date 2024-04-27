import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [alert, setAlert] = useState(null);
  const navigate = useNavigate();
  const {token}=useParams();
  const handleNewPasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
       // console.log(token);
      setAlert({ type: "danger", message: "Passwords do not match." });
      return;
    }
 
    // Make API call to reset password
    axios.post(`http://localhost:5000/reset_password/${token}`, { newPassword }).then(async res => {
      const data = await res.data;
      if (data.status === "success") {
        setAlert({ type: "success", message: "Password reset successfully." });
        setTimeout(() => {
          setAlert(null);
          // navigate to another page if needed
        }, 3000);
      } else {
        setAlert({ type: "danger", message: "An error occurred. Please try again." });
      }
   console.log(data);
    }).catch(error => {
      setAlert({ type: "danger", message: "An error occurred. Please try again." });
    });
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100" id="formbackground">
      <div className="card p-4" style={{ maxWidth: '400px', width: '100%', backgroundColor: '#000', color: '#fff' }}>
        <h2 className="text-center mb-4">Reset Password</h2>
        {alert && (
          <div className={`alert alert-${alert.type}`} role="alert" style={{ marginBottom: '1rem' }}>
            {alert.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="newPassword" className="form-label">New Password</label>
            <input
              type="password"
              className="form-control"
              id="newPassword"
              value={newPassword}
              onChange={handleNewPasswordChange}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
          </div>
          <div className="d-flex justify-content-center">
            <div style={{ width: '50%' }}>
              <button type="submit" className="btn btn-primary w-100">Reset Password</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
