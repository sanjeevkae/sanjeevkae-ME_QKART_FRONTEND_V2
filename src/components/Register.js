import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  //const[formData,setformData]=useState({});
  const [formData, setformData] = useState({
    username:"",
    password:"",
    confirmPassword:""
  });
  const[loading,setLoading]=useState(false);
  const history=useHistory();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function





  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  function handleChange(e) {
    let data = {
      [e.target.name]: e.target.value,
    };
    setformData((prev) => ({ ...prev, ...data }));
    // console.log("from handleChange fn", formData);
  }

  const register = async (formData) => {
    // console.log(formData);
    if(validateInput(formData))
    {
    try
    {
      setLoading(true);
      let apicall = await axios.post(`${config.endpoint}/auth/register`,{
        username: formData.username,
        password: formData.password,
      });
      console.log("from register fn", apicall.status);
      if (apicall.status === 201)
       {      
        enqueueSnackbar("Registered successfully", { variant: "Success" });        
        history.push("/login")      
           
      }
      setLoading(false)
    }
    catch(err)
    {
      setLoading(false)
      if (err.response.status === 400) {
        // console.log("404 error");
        enqueueSnackbar(err.response.data.message, {
          variant: "error",
        });
      } else {
        // setLoading(false);
        console.log("went wrong");
        enqueueSnackbar(
          "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
          {
            variant: "error",
          }
        );
      }
    }  
  }
  else{
    setLoading(false)
    return null;
  }       
    
    
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    console.log("from validateInput fn",data);
    if (data.username.length === 0) {
      //|| data.password.length==0 || data.confirmPassword.length==0){
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    } else if (data.username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else if (data.password.length === 0) {
      //|| data.password.length==0 || data.confirmPassword.length==0){
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    } else if (data.password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters", {
        variant: "warning",
      });
      return false;
    } else if (data.password !== data.confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    } else {
      return true;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            onChange={(e) => handleChange(e)}
            placeholder="Enter Username"
            fullWidth
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            onChange={(e) => handleChange(e)}
            placeholder="Enter a password with minimum 6 characters"
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            onChange={(e) => handleChange(e)}
            fullWidth
          />
          {loading?(
          <div>
              <Box display="flex" alignItems="center" justifyContent="center">
                <CircularProgress />
              </Box>
           </div>):(
           <Button
            className="button"
            variant="contained"
            onClick={() => register(formData)}
          >
            Register Now
          </Button>)}
          
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="/login">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
