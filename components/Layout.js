import React, { useState } from "react";
import { Layout } from "antd";
import _Footer from "./Footer";
import _Header from "./Header";
import _Sider from "./Sidebar";
import Notifications from "../contents/Notifications";
import Settings from "../contents/Settings";
import Profile from "../contents/Profile";

const { Content } = Layout;

export default function _Layout({ item }) {
  const [content, setContent] = useState("This is index.");

  const HeaderClick = (contentKey) => {
    switch (contentKey) {
      case "Notifications":
        setContent(<Notifications />);
        break;
      case "Settings":
        setContent(<Settings />);
        break;
      case "Profile":
        setContent(<Profile />);
        break;
      default:
        setContent("This is index.");
    }
  };
  const SiderClick = (content) => {
    setContent(content);
  };
  return (
    <div>
      <Layout style={{ minHeight: "100vh", margin: 0, padding: 0 }}>
        <_Header onMenuClick={HeaderClick} />
        <Layout>
          <_Sider onMenuClick={SiderClick} />
          <Content className="layout-content">
            <div style={{ flex: 1 }}>{content}</div>
            <_Footer />
          </Content>
        </Layout>
      </Layout>
      <style jsx>{`
        .layout-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          padding: 16px;
        }
      `}</style>
    </div>
  );
}
