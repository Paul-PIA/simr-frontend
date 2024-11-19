import React, { useState, useEffect } from 'react';
import HomePageButton from '../../components/HomePageButton';
import {Layout} from 'antd';
import Sider_ from '../../components/Sidebar';
import _Footer from "../../components/Footer";
import ExercisePage from '../../contents/filePage';

export default function ExerPage() {
  const[id,setId]=useState(null);

  const fetch=async()=>{
  const queryParams = new URLSearchParams(window.location.search);
  setId(queryParams.get('id')) }

  useEffect(()=>{fetch()},[])

  const {Content}=Layout;
  return (
    <div>
      <Layout style={{ minHeight: "100vh", margin: 0, padding: 0 }}> <HomePageButton/>
        <Layout><Sider_/>
        <Content className="layout-content"><div style={{flex:1}}>
        <ExercisePage id={id}/></div>
        <_Footer/>
        </Content></Layout></Layout>
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