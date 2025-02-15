import React, { useEffect, useRef } from "react";
import { BsEye } from "react-icons/bs";
import { BsEyeSlash } from "react-icons/bs";
import axios from "../../API/axios";
import classes from "./Login.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
// react-redux
import { connect } from "react-redux";
// actions
import {
  storeUser,
  userPassword,
  userSignUp,
  userReset,
} from "../../Utility/action";

const Login = ({
  storeUser,
  userSignUp,
  userReset,
  userPassword,
  password,
}) => {
  //hooks to control inputs data
  const emailDom = useRef();
  const passwordDom = useRef();

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const validateSigninForm = () => {
    const email = emailDom.current.value;
    const password = passwordDom.current.value;
    console.log({
      email: emailDom.current.value,
      password: passwordDom.current.value,
    });

    // Email validation
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
      toast.error("Email is required", { position: "top-center" });
      return false;
    } else if (!emailPattern.test(email)) {
      toast.error("Please enter a valid email address", {
        position: "top-center",
      });
      return false;
    }
    // Password validation
    if (!password) {
      toast.error("Password is required", { position: "top-center" });
      return false;
    }
    return true;
  };
  //check for logged in user
  const checkUserLogged = async () => {
    try {
      // Makes a GET Request: This line sends a request to the server to check if the user is logged in. It includes the token in the request headers for authorization.
      const { data } = await axios.get("/user/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      storeUser(data.userName);
      navigate("/dashboard");
    } catch (error) {
      console.log(error);
      navigate("/");
    }
  };

  useEffect(() => {
    if (token) {
      checkUserLogged();
    }
  }, []);

  // signin function to call the API and handle to sign in user
  const signInHandling = async (e) => {
    e.preventDefault();
    if (!validateSigninForm()) return;

    try {
      const { data } = await axios.post("/user/login", {
        email: emailDom.current.value,
        password: passwordDom.current.value,
      });
      // console.log(data);
      storeUser(data?.userName);
      localStorage.setItem("token", data.token);
      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      // show error message
      return toast.error("Email or password does't correct try again! ", {
        position: "top-center",
      });
      console.error(error.response);
    }
  };

  return (
    <form onSubmit={signInHandling} className={classes.signin__container}>
      <div className={classes.signin__wrapper}>
        <div className={classes.signin__title}>
          <h4>Login to your account</h4>
          <p>
            Don't have an account?{" "}
            <span onClick={() => userSignUp()}>Create a new account</span>
          </p>
        </div>
        <div className={classes.signin__inputs}>
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
              // type="password"
              placeholder="Password"
            />
            <span
              className={classes.password_eye_icon}
              onClick={() => userPassword()}
            >
              {password ? <BsEye /> : <BsEyeSlash />}
            </span>
          </div>
        </div>
        <div className={classes.signin__terms}>
          <small onClick={() => userReset()}>Forget password?</small>
        </div>
        <button type="submit">Login</button>
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
    userSignUp: () => dispatch(userSignUp()),
    userReset: () => dispatch(userReset()),
    userPassword: () => dispatch(userPassword()),
  };
};
// export default Login;
export default connect(mapStateToProps, mapDispatchToProps)(Login);
