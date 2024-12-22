import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./Pages/Landing/Landing";
import Home from "./Pages/Home/Home";
import Question from "./Pages/Question/Question";
import Answer from "./Pages/Answer/Answer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SharedLayout from "./components/sharedLayout/SharedLayout";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SharedLayout />}>
          <Route path="/" element={<Landing />}></Route>
          <Route path="/dashboard" element={<Home />}></Route>
          <Route path="/question" element={<Question />}></Route>
          <Route path="/answer/:questionId" element={<Answer />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
