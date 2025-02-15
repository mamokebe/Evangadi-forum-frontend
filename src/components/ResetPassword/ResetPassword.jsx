import React, { useState } from "react";
import classes from "./Reset.module.css";
import axios from "../../API/axios";
import { toast } from "react-toastify";

// react-redux
import { connect } from "react-redux";
// actions
import { userSignIn, userSignUp } from "../../Utility/action";

const ResetPassword = ({ userSignIn, userSignUp }) => {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState("");
  const [otp, setOtp] = useState(null);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };
  const onSubmitEmail = async (e) => {
    // axios.defaults.withCredentials = false;
    e.preventDefault();
    try {
      const { data } = await axios.post("/user/send-reset-otp", { email });
      // storeUser(data.data.userName);
      // localStorage.setItem("token", data.token);
      console.log(data);
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success && setIsEmailSent(true);
    } catch (error) {
      console.error(error);
      toast.error(error.message);
    }
  };
  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };
  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/user/reset-password", {
        email,
        otp,
        newPassword,
      });
      data.success ? toast.success(data.message) : toast.error(data.message);
      setTimeout(() => {
        data.success && userSignIn();
      }, 1000);
    } catch (error) {
      toast.error(error.message);
    }
  };
  return (
    <div className={classes.reset__container}>
      {/* enter email form and  condition function*/}
      {!isEmailSent && (
        <form onSubmit={onSubmitEmail} className={classes.reset__wrapper}>
          <div className={classes.reset__title}>
            <h4>Reset password</h4>
            <p>
              Enter your registered email and we will send you the OTP code.
            </p>
          </div>
          <div className={classes.reset__inputs}>
            <input
              className="bg-transparent outline-none text-white"
              type="email"
              placeholder="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button>Submit</button>
          <div className={classes.reset__terms}>
            <p onClick={() => userSignIn()}>Already have an account?</p>
            <p onClick={() => userSignUp()}>Don't have an account?</p>
          </div>
        </form>
      )}
      {/* otp input form and condition function*/}
      {!isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitOTP} className={classes.reset__wrapper}>
          <div className={classes.reset__title}>
            <h4>Reset password OTP</h4>
            <p>Enter the 6-digit code sent to your email</p>
          </div>
          <div onPaste={handlePaste} className={classes.reset_input_all}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md"
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  ref={(e) => (inputRefs.current[index] = e)}
                  onInput={(e) => handleInput(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
          </div>
          <button>Submit</button>
        </form>
      )}
      {/* enter new password form and condition function */}
      {isOtpSubmitted && isEmailSent && (
        <form onSubmit={onSubmitNewPassword} className={classes.reset__wrapper}>
          <div className={classes.reset__title}>
            <h4>New password</h4>
            <p className="text-center mb-6 text-indigo-300">
              Enter the new password below
            </p>
          </div>
          <div className={classes.reset__inputs}>
            <input
              type="password"
              placeholder="New password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button>Submit</button>
        </form>
      )}
    </div>
  );
};

// export default ResetPassword;
const mapDispatchToProps = (dispatch) => {
  return {
    userSignIn: () => dispatch(userSignIn()),
    userSignUp: () => dispatch(userSignUp()),
  };
};

export default connect(null, mapDispatchToProps)(ResetPassword);
