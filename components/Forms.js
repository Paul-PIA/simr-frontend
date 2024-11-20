import React, { createContext, useState } from "react";
import { Layout } from "antd";
import _Footer from "./Footer";
import ForgotPassword from "../contents/ForgotPassword";
import Register from "../contents/Register";
import Login from "../contents/Login";

const { Content } = Layout;
const FormContext = createContext();

export default function Forms({ item }) {
  const [currentForm, setCurrentForm] = useState("login");

  const renderButton = () => {
    return (
      <div>
        {currentForm === "login" && (
          <div className="auth-links">
            <button
              className="link-button"
              onClick={() => setCurrentForm("register")}
            >
              Pas de compte ?
            </button>
            <button
              className="link-button"
              onClick={() => setCurrentForm("forgot")}
            >
              Mot de passe oublié ?
            </button>
          </div>
        )}
        {currentForm === "forgot" && (
          <div className="auth-links">
            <button
              className="link-button"
              onClick={() => setCurrentForm("login")}
            >
              Se connecter
            </button>
            <button
              className="link-button"
              onClick={() => setCurrentForm("register")}
            >
              Pas de compte ?
            </button>
          </div>
        )}
        {currentForm === "register" && (
          <div className="auth-links">
            <button
              className="link-button"
              onClick={() => setCurrentForm("login")}
            >
              Déjà un compte ?
            </button>
            <button
              className="link-button"
              onClick={() => setCurrentForm("forgot")}
            >
              Mot de passe oublié ?
            </button>
          </div>
        )}
        <style jsx="true">{`
          .auth-links {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-top: 15px;
            padding: 0 15px;
            box-sizing: border-box;
          }

          .link-button {
            background: none;
            border: none;
            color: #007bff;
            cursor: pointer;
            text-decoration: none;
            font-size: 14px;
            transition: color 0.3s ease;
            padding: 0;
            margin: 0;
          }

          .link-button:hover {
            color: #0056b3;
          }
        `}</style>
      </div>
    );
  };

  const renderForm = () => {
    switch (currentForm) {
      case "forgot":
        return <ForgotPassword />;
      case "register":
        return <Register />;
      default:
        return <Login />;
    }
  };

  return (
    <div>
      <Layout style={{ minHeight: "100vh" }}>
        <Content className="auth-container">
          <div>
            {renderForm()}
            {renderButton()}
          </div>
        </Content>
        <_Footer />
      </Layout>
      <style jsx="true">{`
        .auth-container {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #f2f2f2;
        }
      `}</style>
    </div>
  );
}
