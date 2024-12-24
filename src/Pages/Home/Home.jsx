import React, { useState, useEffect } from "react";
import classes from "./Home.module.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../API/axios";
// react-redux
import { connect } from "react-redux";
// actions creation function
import { storeUser } from "../../Utility/action";
import { toast } from "react-toastify";
import { FaUserTie } from "react-icons/fa";
import { FaAngleRight } from "react-icons/fa";

const Home = ({ user, storeUser, questionsPerPage }) => {
  //all question data state
  const [questions, setQuestions] = useState([]);

  /***************************************** 
  // // For storing the search query
  // const [title, setTitle] = useState("");
  // // For storing search results
  // const [searchResults, setSearchResults] = useState([]);
  // // For controlling dropdown visibility
  // const [dropdownVisible, setDropdownVisible] = useState(false);
  // //search question display
  // const [search, setSearch] = useState([]);
  // const [open, setOpen] = useState(false);
  // */

  // Current page state
  const [currentPage, setCurrentPage] = useState(1);

  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const checkUserLogged = async () => {
    try {
      const { data } = await axios.get("/user/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      storeUser(data?.userName);
      // console.log(data);
      await fetchAllQuestions();
    } catch (error) {
      console.error(error);
      // toast.error("Please log in to your account first. ", {
      //   position: "top-center",
      // });
    }
  };
  // http://localhost:3003/api/question
  const fetchAllQuestions = async () => {
    try {
      const { data } = await axios.get("/question", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!data || data.length === 0) {
        setQuestions([]);
        toast.error("No question found ", {
          position: "top-center",
        });
      }
      // console.log(data.data);
      setQuestions(data.data.reverse());
    } catch (error) {
      toast.error(
        `Error: ${error.response?.data?.message || "Fetching question error"}`,
        {
          position: "top-center",
        }
      );
      // console.error(error)
    }
  };

  // // Function to handle search input change
  // const searchHandling = async (e) => {
  //   const searchQuery = e.target.value;
  //   setTitle(searchQuery);

  //   if (searchQuery.length === 0) {
  //     setSearchResults([]);
  //     setDropdownVisible(false);
  //     return;
  //   }
  //   try {
  //     const { data } = await axios.get(`/questions/${searchQuery}`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     console.log(data);
  //     setSearchResults(data?.searchQuestion);
  //     setDropdownVisible(true);
  //   } catch (error) {
  //     console.error(
  //       "Error:",
  //       error.response ? error.response.data : error.message
  //     );
  //     toast.error(
  //       error.response ? error.response.data.message : error.message,
  //       {
  //         position: "top-center",
  //       }
  //     );
  //     setSearchResults([]);
  //     setDropdownVisible(false);
  //   }
  // };
  // Calculate the total number of pages

  const totalPages = Math.ceil(questions.length / questionsPerPage);
  // Function to handle page change
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  // Calculate the current questions to display based on the page
  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  useEffect(() => {
    if (token) {
      checkUserLogged();
    } else {
      navigate("/");
      toast.error("Please create account or login first ! ", {
        position: "top-center",
      });
    }
  }, []);

  console.log(questions);
  console.log(currentQuestions);
  console.log(user);
  return (
    <div className={classes.home__container}>
      <div className={classes.home__wrapper}>
        <div className={classes.home__header}>
          <Link to="/question">
            <button>Ask Question</button>
          </Link>

          <h4>
            Welcome: <span>{user}</span>
          </h4>
        </div>
        <div className={classes.home_search_question}>
          <h4>Search Questions</h4>
        </div>
        <div className={classes.home_search_input}>
          <input placeholder="Type question title here to search" />
          {/* {dropdownVisible && searchResults.length > 0 && (
            <ul className={classes.search__question}>
              {searchResults.map((question) => (
                <li
                  key={question.questionId}
                  onClick={() => {
                    setSearch(question);
                    setOpen(true);
                  }}
                  className={classes.search_question_open}
                >
                  <h3>{question.title}</h3>
                  <p>{question.description}</p>
                  <p className={classes.question_user}>
                    Asked by {question.userName} on{" "}
                    {new Date(question.create_at).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          )} */}
        </div>

        {currentQuestions?.map((singleQuestion, i) => {
          return (
            <Link
              key={i}
              className={classes.question__container}
              to={`/answer/${singleQuestion?.questionId}`}
            >
              <hr />
              <div className={classes.question__wrapper}>
                <div className={classes.question__left}>
                  <div className={classes.question__img}>
                    <FaUserTie size={35} />
                  </div>
                  <h6>{singleQuestion?.userName}</h6>
                </div>
                <div className={classes.question__middle}>
                  <h6>{singleQuestion?.title}</h6>
                </div>
                <div className={classes.question__right}>
                  <FaAngleRight size={30} />
                </div>
              </div>
            </Link>
          );
        })}

        {/* Pagination Controls */}
        <div className={classes.question__pagination}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {/* dynamically generates pagination buttons based on the totalPages and change bg-color of the button for the current page. */}
          {[...Array(totalPages).keys()].map((number) => (
            <button
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={number + 1 === currentPage ? `${classes.active}` : ""}
            >
              {number + 1}
            </button>
          ))}

          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    storeUser: (users) => dispatch(storeUser(users)),
  };
};

// export default Home;
export default connect(mapStateToProps, mapDispatchToProps)(Home);
