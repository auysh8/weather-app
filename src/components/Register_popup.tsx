import React from "react";
import styles from "./Register_popup.module.css";

const Register_popup = ({ isLogin }) => {
  return (
    <div className={styles.register_container}>
      <header className={styles.header}>
        <span className={styles.welcome_heading}>Create a account</span>
        <span className={styles.instructions}>Join us to get started</span>
      </header>
      <main className={styles.main}>
        <label htmlFor="username">
          <span className={styles.user_name}>User Name</span>
          <input type="text" id="username" placeholder="john doe" />
        </label>
        <label htmlFor="email" className={styles.email}>
          <span className={styles.input_head}>Email</span>
          <input id="email" type="email" placeholder="name@company.com" />
        </label>
        <label className={styles.pass} htmlFor="pass">
          <span className={styles.input_head}>Password</span>
          <input type="text" id="pass" placeholder="Enter your password" />
        </label>
        <span className={styles.forgot_pass}>Forgot password?</span>
        <button className={styles.sign_in}>
          <span>Sign up</span>
        </button>
      </main>
      <footer>
        <span className={styles.footer_message}>Already have a account?</span>
        <button onClick={() => isLogin()}>
          <span>Sign in</span>
        </button>
      </footer>
    </div>
  );
};

export default Register_popup;
