import React, { useEffect, useState } from "react";
// import { motion } from "framer-motion";

const Footer = () => {
  return (
    <div>
      <footer className="flex flex-col">
        <div className="mx-auto max-w-7xl">
          <ul className="flex flex-wrap justify-center items-center mb-6 text-black">
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                About
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Premium
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6 ">
                Campaigns
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Blog
              </a>
            </li>

            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Affiliate Program
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                FAQs
              </a>
            </li>
            <li>
              <a href="#" className="mr-4 hover:underline md:mr-6">
                Contact
              </a>
            </li>
          </ul>
        </div>
        <div className="w-full flex justify-start items-center">
          <img src="./10kscfooter.png" className="w-full" alt="10KSC Logo" />
        </div>
      </footer>
    </div>
  );
};

export default Footer;
