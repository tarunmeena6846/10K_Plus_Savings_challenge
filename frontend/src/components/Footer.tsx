import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex bg-black justify-between p-8 min-h-[400px] pt-20">
      <div className="text-white p-3">
        <div className="flex">
          <img
            src="./10ksc.png"
            className="w-20 h-20 bg-white rounded-3xl"
            alt="10KSC Logo"
          />
          <div className="flex items-center text-3xl p-3">
            10K Savings Challenge
          </div>
        </div>
        <div className="flex pt-3 flex-col">
          <div className="flex space-x-4 pt-5">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaFacebookF className="text-2xl" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaTwitter className="text-2xl" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaInstagram className="text-2xl" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white"
            >
              <FaLinkedinIn className="text-2xl" />
            </a>
          </div>
          <h1 className="pt-3">Contact us: 10Ksavingschallenge@gmail.com</h1>
        </div>
      </div>
      <div className="flex p-5 space-x-10 text-white">
        <div>
          <h1 className="text-xl">PRODUCTS</h1>
          <ul className="pt-5">
            <li>Saving Portals</li>
            <li>Analytics</li>
            <li>SWOT Portal</li>
          </ul>
        </div>

        <div className="mr-4">
          <h1 className="text-xl">RESOURCES</h1>
          <ul className="pt-5">
            <li>
              <a href="/community">Community</a>
            </li>
            <li>Support</li>
          </ul>
        </div>

        <div className="mr-4">
          <h1 className="text-xl">GET STARTED</h1>
          <ul className="pt-5">
            <li>Create a new account</li>
            <li>Log in</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
