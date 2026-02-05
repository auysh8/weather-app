import { useState } from "react";
import styles from "./Login_popup.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { AnimatePresence, motion } from "framer-motion";

const Login_popup = ({ isRegister, onSuccess }) => {
  const API_BASE_URL = "http://localhost:5000";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const formData = {
    email: email,
    password: password,
  };
  const handleLogin = async () => {
    try {
      const url = `${API_BASE_URL}/auth/login`;
      const response = await axios.post(url, formData);
      const token = await response.data.token;
      localStorage.setItem("authToken", token);
      window.dispatchEvent(new Event("storage-update"));
      if (token) onSuccess();
    } catch (error) {
      if (error.response || error.response.status === 400) {
        toast.error("User not found, Please register");
      }
      console.log(error);
    }
  };
  return (
    <motion.div
      className={styles.login_container}
      initial={{ opacity: 0}}
      animate={{ opacity: 1}}
      exit={{ opacity: 0}}
      transition={{duration: 0.3}}
    >
      <header className={styles.header}>
        <span className={styles.welcome_heading}>Welcome back</span>
        <span className={styles.instructions}>
          Please enter your details to sign in
        </span>
      </header>
      <main className={styles.main}>
        <label htmlFor="email" className={styles.email}>
          <span className={styles.input_head}>Email</span>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className={styles.pass} htmlFor="pass">
          <span className={styles.input_head}>Password</span>
          <input
            type="text"
            id="pass"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <span className={styles.forgot_pass}>Forgot password?</span>
        <button onClick={handleLogin} className={styles.sign_in}>
          <span>Sign in</span>
        </button>
      </main>
      <footer>
        <span className={styles.footer_message}>Dont have a account?</span>
        <button className={styles.signup} onClick={() => isRegister()}>
          <span>Sign up</span>
        </button>
      </footer>
    </motion.div>
  );
};

export default Login_popup;
