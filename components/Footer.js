import React from "react";
import { Layout } from "antd";
//import logo from "/media_front/logo.png";
import Image from 'next/image';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faTwitter,
  faInstagram,
  faLinkedin,
} from "@fortawesome/free-brands-svg-icons";

import { MultiColumn } from "./MultiColumn";

const { Footer } = Layout;


export default function Footer_() {
  const columns = [
    [<a key={"img"} href="https://parisinfrastructureadvisory.com/">
    <Image  
      src="media/logo.png" 
      alt="Logo-PIA" 
      height={100} 
      width={200} 
      title="Logo-PIA"/> </a>],
    [
      <h3 key={1}>
        <a
          href="https://parisinfrastructureadvisory.com/privacy-policy/"
          className="footer-link"
          title="Understand how we handle your data."
        >
          Privacy policy
        </a>
      </h3>,
      // <h3 key={2}>
      //   <a
      //     href="https://www.pia.com/terms-of-service"
      //     className="footer-link"
      //     title="View the terms and conditions of our services."
      //   >
      //     Terms of service
      //   </a>
      // </h3>,
      <h3 key={"follow"}>Follow us</h3>,
      <div key={"social"}>
        {/* <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          aria-label="Facebook"
        >
          <FontAwesomeIcon icon={faFacebook} />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          aria-label="Twitter"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a> */}
        <a
          href="https://www.linkedin.com/company/pia-paris-infrastructure-advisory/?viewAsMember=true"
          target="_blank"
          rel="noopener noreferrer"
          className="icon-link"
          aria-label="LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedin} />
        </a>
      </div>,
    ],
    [
      <p key={"email"} className="footer-text">
        Email:contact@parisinfrastructureadvisory.com
      </p>,
      <p key={"tel"} className="footer-text">
        Tel:(+33) 1 02 03 04 05
      </p>,
      <p key={"adrs"} className="footer-text">
        Adress:15
        Rue Lacépède, 75005 Paris, France
        <br />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
      </p>,
    ],
  ];

  return (
    <>
      <Footer className="footer">
        <MultiColumn columns={columns} />
      </Footer>
      <div className="footer-bottom">
        <p>Copyright &copy; 2024 SimR-PIA. All rights reserved.</p>
      </div>
      <style jsx="true">{`
        .footer {
          background-color: #f1f1f1;
          color: #333;
        }
        .footer-link {
          color: #333;
          text-decoration: none;
          padding: 0px;
          margin: 0px;
        }
        .footer-link:hover {
          text-decoration: underline;
        }
        .footer-bottom {
          width: 100%;
          margin-top: 2px;
          text-align: center;
        }
        .footer-text {
          font-size: 15px;
        }
        p {
          margin: 0;
          padding: 0;
          line-height: 1.6;
        }
        a {
          display: inline-block;
          margin: 0;
          padding: 0;
          line-height: 0;
          text-decoration: none;
        }
        a:hover {
          color: #ff5722;
          text-decoration: underline;
        }
        .icon-link {
          color: #0000FF;
          font-size: 24px;
          margin-right: 12px;
        }
        .icon-link:hover {
          color: #ff5722;
      }
      `}</style>
    </>
  );
}
