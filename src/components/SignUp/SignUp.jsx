import React, { useRef } from "react";
import classes from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import axios from "../../API/axios";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { toast } from "react-toastify";

// react-redux
import { connect } from "react-redux";
// actions
import { storeUser, userSignIn, userPassword } from "../../Utility/action";

const SignUp = ({ storeUser, userSignIn, userPassword, password }) => {
  const userNameDom = useRef();
  const firstNameDom = useRef();
  const lastNameDom = useRef();
  const emailDom = useRef();
  const passwordDom = useRef();
  const navigate = useNavigate();


  // const validateSignupForm = () => {
  //   const userName = userNameDom.current.value;
  //   const firstName = firstNameDom.current.value;
  //   const lastName = lastNameDom.current.value;
  //   const email = emailDom.current.value;
  //   const password = passwordDom.current.value;
  //   console.log({
  //     userName: userNameDom.current.value,
  //     firstName: firstNameDom.current.value,
  //     lastName: lastNameDom.current.value,
  //     email: emailDom.current.value,
  //     password: passwordDom.current.value,
  //   });

  //   // Name validation
  //   const namePattern = /^[a-zA-Z\s]+$/;
  //   if (!userName) {
  //     toast.error("user names is required", { position: "top-center" });
  //     return false;
  //   }
  //   if (!firstName || !lastName) {
  //      toast.error("first & last names are required", {
  //       position: "top-center",
  //     });
  //     return false;
  //   } else if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
  //      toast.error("Names must only contain letters and spaces.", {
  //       position: "top-center",
  //     });
  //     return false;
  //   }

  //   // Email validation
  //   const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  //   if (!email) {
  //      toast.error("Email is required", { position: "top-center" });
  //      return false;
  //   } else if (!emailPattern.test(email)) {
  //     toast.error("Please enter a valid email address", {
  //       position: "top-center",
  //     });
  //     return false;
  //   }

  //   // Password validation
  //   const passwordPattern =/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  //   if (!password) {
  //      toast.error("Password is required", { position: "top-center" });
  //      return false;
  //   } else if (!passwordPattern.test(password)) {
  //       toast.error(
  //       "Password must be at least 8 characters, include a number and a special character.",
  //       { position: "top-center" }
  //     );
  //     return false
  //   }

  //   return true;
  // };
  const validateSignupForm = () => {
    const userName = userNameDom.current.value;
    const firstName = firstNameDom.current.value;
    const lastName = lastNameDom.current.value;
    const email = emailDom.current.value;
    const password = passwordDom.current.value;
  
    console.log({
      userName: userName,
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password,
    });
  
    // Name validation
    const namePattern = /^[a-zA-Z\s]+$/;
    if (!userName) {
      toast.error("User name is required", { position: "top-center" });
      return false;
    }
    if (!firstName || !lastName) {
      toast.error("First & last names are required", { position: "top-center" });
      return false;
    } else if (!namePattern.test(firstName) || !namePattern.test(lastName)) {
      toast.error("Names must only contain letters and spaces.", { position: "top-center" });
      return false;
    }
  
    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
      toast.error("Email is required", { position: "top-center" });
      return false;
    } else if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address", { position: "top-center" });
      return false;
    }
  
    // Password validation
    // const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!password) {
      toast.error("Password is required", { position: "top-center" });
      return false;
    // } else if (!passwordPattern.test(password)) {
    //   toast.error(
    //     "Password must be at least 8 characters, include a number and a special character.",
    //     { position: "top-center" }
    //   );
    //   return false;
    // }
    }
    return true;
  };
  

  const signUpHandling = async (e) => {
    e.preventDefault();
    if (!validateSignupForm()) return;

    try {
      const { data } = await axios.post("/user/register", {
        userName: userNameDom.current.value,
        firstName: firstNameDom.current.value,
        lastName: lastNameDom.current.value,
        email: emailDom.current.value,
        password: passwordDom.current.value,
      });


      storeUser(data.userName);
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1300);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed", {
        position: "top-center",
      });
      navigate("/");
    }
  };

  return (
    <form onSubmit={signUpHandling} className={classes.signup__container}>
      <div className={classes.signup__wrapper}>
        <div className={classes.signup__title}>
          <h4>Join the Network</h4>
          <p>
            Already have an account?{" "}
            <span onClick={() => userSignIn()}>Sign in</span>
          </p>
        </div>
        <input
          name="userName"
          ref={userNameDom}
          type="text"
          placeholder="User name"
        />
        <div className={classes.multi__inputs}>
          <input
            name="firstName"
            ref={firstNameDom}
            type="text"
            placeholder="First name"
          />
          <input
            name="lastName"
            ref={lastNameDom}
            type="text"
            placeholder="Last name"
          />
        </div>
        <input
          name="email"
          ref={emailDom}
          type="email"
          placeholder="Email address"
        />
        <div className={classes.password__input}>
          <input
            name="password"
            ref={passwordDom}
            type={password ? "text" : "password"}
            placeholder="Password"
          />
          <span
            className={classes.password_eye_icon}
            onClick={() => userPassword()}
          >
            {password ?  <BsEye />:<BsEyeSlash /> }
          </span>
        </div>
        <div className={classes.signup__terms}>
          <small>
            I agree to the <a href="">privacy policy</a> and{" "}
            <a href="">terms of service</a>.
          </small>
        </div>
        <button type="submit">Agree and Join</button>
      </div>
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    password: state.password,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeUser: (users) => dispatch(storeUser(users)),
    userSignIn: () => dispatch(userSignIn()),
    userPassword: () => dispatch(userPassword()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(SignUp);
