import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import backIcon from '../assets/icon_back.png'
import '../styles/ResetPassword.css'
import logo from "../assets/cj-tech-logo.png";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isEmailSent, setIsEmailSent] = useState(false)
  const [otp, setOtp] = useState('')
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false)
  const inputRefs = React.useRef([])

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1)
      inputRefs.current[index + 1].focus()
  }
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0)
      inputRefs.current[index - 1].focus()
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text').split('')
    paste.forEach((char, index) => {
      if (inputRefs.current[index]) inputRefs.current[index].value = char
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const { data } = await axios.post(`${backendUrl}/api/auth/send-reset-otp`, { email })
      data.success ? toast.success(data.message) : toast.error(data.message)
      if (data.success) setIsEmailSent(true)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitOtp = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const otpArray = inputRefs.current.map((el) => el.value)
      const otpValue = otpArray.join('')
      setOtp(otpValue)
      const { data } = await axios.post(`${backendUrl}/api/auth/verify-reset-account`, { email, otp: otpValue })
      if (data.success) {
        toast.success(data.message)
        setIsOtpSubmitted(true)
      } else toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const { data } = await axios.post(`${backendUrl}/api/auth/reset-password`, { email, otp, newPassword })
      data.success ? toast.success(data.message) : toast.error(data.message)
      if (data.success) navigate('/')
    } catch (error) {
      toast.error(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="reset-page">
      <div className="reset-card">
<div className="logo-circle">
  <img src={logo} alt="PureText Logo" />
</div>
       

        {!isEmailSent && (
  <form onSubmit={onSubmitEmail}>
    <h1>PureText</h1>
    <h2>Reset Password</h2>

    <label className="text-left text-black block mb-1">Email Address</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      className="reset-input"
      required
    />

    <button type="submit" className="btn" disabled={isLoading}>
      {isLoading ? 'Loading...' : 'Submit'}
    </button>

    {/* ✅ New Back button below Submit */}
    <button
      type="button"
      onClick={() => navigate('/login')}
      className="btn btn-small"
    >
       Back to Login
    </button>
          </form>
        )}

        {!isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitOtp}>
            <h2>Reset Password OTP</h2>
            <h4>Enter the 6-digit code sent to your email.</h4>
            <div className="otp-container" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, i) => (
                  <input
                    key={i}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputRefs.current[i] = el)}
                    onInput={(e) => handleInput(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="otp-input"
                    required
                  />
                ))}
            </div>

            <button className="btn" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Verify OTP'}
            </button>

            <button type="button" onClick={() => navigate('/login')} className="btn btn-small">
              Back to Login
            </button>
          </form>
        )}

        {isOtpSubmitted && isEmailSent && (
          <form onSubmit={onSubmitNewPassword}>
            <h1>PureText</h1>
            <h4>Enter your new password</h4>

            <label className="text-left text-black block mb-1">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="reset-input"
              required
            />

            <label className="text-left text-black block mb-1">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="reset-input"
              required
            />

            <button type="submit" className="btn" disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Submit'}
            </button>

            <button type="button" onClick={() => navigate('/login')} className="btn btn-small">
              Back to Login
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default ResetPassword
