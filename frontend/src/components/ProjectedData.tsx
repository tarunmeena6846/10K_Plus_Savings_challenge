import React, { useRef, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";
// import { monthlyExpenseState, monthlyIncomeState } from "./store/atoms/total";
// import { useRecoilState } from "recoil";

const ProjectedData = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [monthlyExpense, setMonthlyExpense] = useState<number>(0);
  const [monthlyIncome, setMonthlyIncome] = useState<number>(0);
  const navigate = useNavigate();
  const handleContinue = () => {
    setIsOpen(true);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
  };
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref);
  const container = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["300px end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
  const marginTop = useTransform(scrollYProgress, [0, 1], ["-100px", "0px"]);

  return (
    <div ref={container} className=" bg-[#eaeaea] py-5">
      {/* <div className="flex justify-center"> */}
      {/* <div> */}
      <div className="flex flex-col items-center">
        <div className="flex">
          <div
            ref={ref}
            className={classNames(
              "feature-title py-16 text-3xl  lg:text-5xl text-center font-bold",
              isInView ? "text-gray-800" : "text-gray-300"
            )}
          >
            <span>Your Current Year-end</span>
            <br />
            <span className="bg-[#b3f5a0] my-2">Savings Trajectory</span>
          </div>
          <div>
            <motion.img
              src="./circle.svg"
              className="hidden lg:block"
              animate={{
                rotate: 360, // Rotate the image to complete the circle
              }}
              transition={{
                duration: 7, // Duration of one full circle
                ease: "linear", // Smooth motion
                repeat: Infinity, // Infinite loop
              }}
            />
          </div>
        </div>
        {/* <div className="flex justify-center items-center"> */}
        {!isOpen ? (
          <motion.div
            className="projected-input border-[7px] flex flex-col justify-center sm:w-1/4 md:w-[30%] lg:w-[30%] xl:w-1/4 p-[20px] cursor-pointer rounded-[20px]"
            style={{
              scale,
              marginTop,
              // borderRadius: "20px",
              background: "#111f36",
              // marginBottom: "50px",
              // cursor: "pointer",
              boxShadow: "0px 10px 30px black",
              // padding: "20px",
            }}
          >
            <motion.input
              placeholder="Monthly Income"
              className="mb-4 p-2 rounded "
              onChange={(e) => {
                const value = e.target.value;
                setMonthlyIncome(value === "" ? 0 : parseInt(value));
              }}
            />
            <motion.input
              placeholder="Monthly Expenses"
              className="mb-4 p-2 rounded"
              onChange={(e) => {
                const value = e.target.value;
                setMonthlyExpense(value === "" ? 0 : parseInt(value));
              }}
            />
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleContinue}
              className={
                "show-me-btn rounded-xl bg-white px-2 py-1 mt-5 mb-5 text-black shadow-lg self-center w-1/2"
              }
            >
              Calculate
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            className="p-[20px] sm:w-[50%] md:w-[70%] lg:w-[70%] xl:w-[50%] cursor-pointer rounded-[20px] "
            style={{
              scale,
              background: "linear-gradient(360deg, #1C1C1C 10%, #494949 360%)",
              boxShadow: "0px 10px 30px black",
            }}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              style={{
                // width: "80%",
                padding: "10px",
                // margin: "auto",
                // display: "flex",
                // flexDirection: "column",
              }}
            >
              <h1 className="mb-10 text-white  text-left text-5xl">
                You will save $
                {(monthlyIncome - monthlyExpense) *
                  (12 - new Date().getMonth())}
              </h1>
              <h1 className="mb-4 text-white  text-5xl">Do you know ?</h1>
              <h1 className="mb-4 text-white  text-3xl">
                Majority of the 10K Savings Challengers identify $3k in
                additional savings within the first day of joining the
                challenge. Join the 10K Challenge for a year-end financial win.
              </h1>
              <h1 className="mb-10 mt-4 text-white  text-5xl">
                Ready to kickstart your ideal life?
              </h1>
              <div className="flex flex-col items-center">
                <motion.button
                  className={
                    "show-me-btn rounded-xl bg-white px-2 py-1 mt-5 text-black shadow-lg lg:w-1/2"
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Continue
                </motion.button>
                <motion.button
                  className={
                    "show-me-btn rounded-xl bg-white px-2 py-1 mt-5 mb-5 text-black shadow-lg lg:w-1/2"
                  }
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleClosePopup}
                  style={{
                    marginBottom: "10px",
                  }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
        {/* </div> */}
        {/* </div> */}
      </div>
    </div>
  );
};

export default ProjectedData;
