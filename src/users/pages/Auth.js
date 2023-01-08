import React, { useContext, useState } from "react";

import Card from "../../shared/components/UIElements/Card";
import Button from "../../shared/components/FormElements/Button";
import Input from "../../shared/components/FormElements/Input";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ImageUpload from "../../shared/components/FormElements/imageUpload";
import { useForm } from "../../shared/hooks/form-hook";
import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/Validators";

import "./Auth.css";
import { AuthContext } from "../../shared/context/auth-context";
import { useHttpClient } from "../../shared/hooks/http-hook";

const Authorization = () => {
  const auth = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm(
    {
      email: {
        value: "",
        isValid: false,
      },
      password: {
        value: "",
        fileIsValid: false,
      },
    },
    false
  );

  const switchModeHandler = () => {
    if (!isLoginMode) {
      setFormData(
        {
          ...formState.inputs,
          name: undefined,
          image: undefined,
        },
        formState.inputs.email.isValid && formState.inputs.password.isValid
      );
    } else {
      setFormData(
        {
          ...formState.inputs,
          name: {
            value: "",
            isValid: false,
          },
          image: {
            value: null,
            isValid: false,
          },
        },
        false
      );
    }
    setIsLoginMode((prevMode) => !prevMode);
  };

  const authSubmitHandler = async (e) => {
    e.preventDefault();

    if (isLoginMode) {
      try {
        const resData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/users/login`,
          "POST",
          JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value,
          }),
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(resData.data._id, resData.token);
      } catch (err) {}
    } else {
      //for uploading an image we have t append the form
      const formData = new FormData();
      formData.append("email", formState.inputs.email.value);
      formData.append("name", formState.inputs.name.value);
      formData.append("image", formState.inputs.image.value);
      formData.append("password", formState.inputs.password.value);

      try {
        const resData = await sendRequest(
          "http://localhost:5000/api/users/signup",
          "POST",
          // JSON.stringify({
          //   name: formState.inputs.name.value,
          //   email: formState.inputs.email.value,
          //   password: formState.inputs.password.value,
          // }),
          formData,
          {
            "Content-Type": "application/json",
          }
        );
        auth.login(resData.data._id, resData.token);
      } catch (err) {}
    }
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />

      <Card className="authentication">
        {isLoading && <LoadingSpinner asOverlay />}
        {isLoginMode ? <h2>Login Required </h2> : <h2>Please Signup</h2>}
        <hr />
        <form onSubmit={authSubmitHandler}>
          {!isLoginMode && (
            <Input
              id="name"
              element="input"
              type="text"
              label="Your name"
              validators={[VALIDATOR_REQUIRE()]}
              errorText="Please enter a your name"
              onInput={inputHandler}
            />
          )}
          {!isLoginMode && (
            <ImageUpload
              id="image"
              center
              onInput={inputHandler}
              errorText={"Please upload an image!"}
            />
          )}
          <Input
            id="email"
            element="input"
            type="email"
            label="E-mail"
            validators={[VALIDATOR_EMAIL()]}
            errorText="Please enter a valid email"
            onInput={inputHandler}
          />
          <Input
            id="password"
            type="password"
            element="input"
            label="Password"
            validators={[VALIDATOR_MINLENGTH(8)]}
            errorText="Password must be 8 characters long !"
            onInput={inputHandler}
          />
          <Button type="submit" disabled={!formState.isValid}>
            {isLoginMode ? "Login" : "Signup"}
          </Button>
        </form>
        <Button
          inverse
          onClick={switchModeHandler}
          disabled={formState.isValid}
        >
          Switch to {isLoginMode ? "Signup" : "Login"}
        </Button>
      </Card>
    </React.Fragment>
  );
};

export default Authorization;
