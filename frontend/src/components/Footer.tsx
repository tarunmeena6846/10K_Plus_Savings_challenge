import React from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="flex bg-[#111f36] justify-between p-8 min-h-[400px] pt-20 flex-col sm:flex-row">
      <div className=" p-3">
        <div className="flex">
          <img
            src="./10ksc.png"
            className="w-20 h-20 bg-white rounded-3xl"
            alt="10KSC Logo"
          />
          <div className="flex items-center text-white text-3xl p-3">
            10K Savings Challenge
          </div>
        </div>
        <div className="flex pt-3 flex-col">
          <div className="flex space-x-4 pt-5 text-white">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500"
            >
              <FaFacebookF className="text-2xl" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500"
            >
              <FaTwitter className="text-2xl" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500"
            >
              <FaInstagram className="text-2xl" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className=" hover:text-gray-500"
            >
              <FaLinkedinIn className="text-2xl" />
            </a>
          </div>
          <h1 className="pt-3 text-white">
            Contact us: 10Ksavingschallenge@gmail.com
          </h1>
        </div>
      </div>
      <hr className="sm:hidden"></hr>
      <div className="flex flex-col lg:flex-row p-5 text-white">
        <div className="mr-4 my-3">
          <h1 className="text-xl lg:text-2xl">PRODUCTS</h1>
          <ul className="pt-2">
            <li>Saving Portals</li>
            <li>Analytics</li>
            <li>SWOT Portal</li>
          </ul>
        </div>

        <div className="mr-4 my-3">
          <h1 className="text-xl lg:text-2xl">RESOURCES</h1>
          <ul className="pt-2">
            <li>
              <a href="/community">Community</a>
            </li>
            <li>Support</li>
          </ul>
        </div>

        <div className="mr-4 my-3">
          <h1 className="text-xl lg:text-2xl">GET STARTED</h1>
          <ul className="pt-2">
            <li>Create a new account</li>
            <li>Log in</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
