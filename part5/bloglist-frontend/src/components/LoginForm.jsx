import loginService from "../services/login";
import blogService from "../services/blogs";
import { useState } from "react";
import Notification from "./Notification";

async function handleLogout(event, setUser) {
  window.localStorage.removeItem("loggedBlogappUser");
  setUser(null);
}

async function handleLogin(
  event,
  username,
  password,
  setUser,
  setUsername,
  setPassword,
  setErrorMessage
) {
  event.preventDefault();
  try {
    const user = await loginService.login({
      username,
      password,
    });
    window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));
    blogService.setToken(user.token);
    setUser(user);
    setUsername("");
    setPassword("");
  } catch (error) {
    console.error(error)
    setErrorMessage(error.response.data.error)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }
}

export const LoginForm = ({
  setUser,
  errorMessage,
  setErrorMessage,
}) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div>
      <h2>Log in to application</h2>
      <Notification message={errorMessage} className={"error"} />
      <form
        onSubmit={(event) =>
          handleLogin(
            event,
            username,
            password,
            setUser,
            setUsername,
            setPassword,
            setErrorMessage
          )
        }
      >
        <div>
          username{" "}
          <input
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password{" "}
          <input
            type="password"
            value={password}
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export const LoginInfo = ({ user, setUser }) => {
  return (
    <div>
      {user.name} logged in{" "}
      <button onClick={(event) => handleLogout(event, setUser)}>logout</button>
    </div>
  );
};
