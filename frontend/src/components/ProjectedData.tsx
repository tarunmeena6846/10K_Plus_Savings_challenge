import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

const ProjectedData = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const handleContinue = () => {
    setIsOpen(true);
  };

  const handleClosePopup = () => {
    setIsOpen(false);
  };
  const ref = useRef<HTMLParagraphElement>(null);
  const documentRef = useRef(document);
  const isInView = useInView(ref, {
    // margin: "0% 0px 0% 0px",
    // NOTE: The only reason we pass in the document here, is because
    // of security restrictions set by the browser when using an iFrame.
    // In an iFrame (so eg in the preview on frontend.fyi),
    // margin won't take effect unless you specify the root manually.
    // By default it will be the window element, which is what we want in this case.
    // If you specify your own root, you can usually only pass in an Element, and
    // not the document (since document/window is the default). However, in order
    // to fix the issue in the iframe, we need to pass in the document here and thus
    // tell TypeScript that we know what we're doing. If you're implementing
    // this in your own website, you can just pass in the root property as well as the documentRef.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    root: documentRef,
  });
  return (
    <motion.div
      //   ref={ref}
      className="flex flex-col pb-4 justify-center items-center"
      //   style={{
      //     opacity: isInView ? "1" : "0",
      //   }}
    >
      <p
        ref={ref}
        className={classNames(
          "feature-title py-16 font-heading text-7xl transition-colors",
          isInView ? "text-black" : "text-gray-300"
        )}
      >
        Let’s calculate your current year-end savings trajectory.
      </p>
      {!isOpen ? (
        <motion.div
          ref={ref}
          className="projected-input"
          //   transition={{ layout: { duration: 1, type: "spring" } }}
          layout
          style={{
            borderRadius: "20px",
            background: isInView
              ? "linear-gradient(360deg, #1C1C1C 10%, #494949 360%)"
              : "grey",
            width: "50%",
            // margin: "50px 0",
            marginBottom: "50px",
            cursor: "pointer",
            boxShadow: "0px 10px 30px black",
            padding: "20px",
          }}
        >
          <motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              style={{
                width: "70%",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <label className="text-white mb-2">Income</label>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-2 rounded"
              />
              <label className="text-white mb-2">Expense</label>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-2 rounded"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleContinue}
                className={
                  "show-me-btn rounded-xl bg-white px-2 py-1 mt-5 mb-5 text-black shadow-lg"
                }
              >
                Calculate
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          layout
          style={{
            borderRadius: "20px",
            background: "linear-gradient(360deg, #1C1C1C 10%, #494949 360%)",
            width: "70%",
            margin: "50px 0",
            cursor: "pointer",
            boxShadow: "0px 10px 30px black",
            padding: "20px",
          }}
        >
          <motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 2 }}
              style={{
                width: "80%",
                margin: "auto",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <h1 className="mb-10 text-white font-heading text-5xl">
                You will Save $10,000
              </h1>
              {/* <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-2 rounded"
              />
              <label className="text-white mb-2">Expense</label>
              <motion.input
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-4 p-2 rounded"
              /> */}
              <h1 className="mb-4 text-white font-heading text-5xl">
                Do you Know ?
              </h1>
              <h1 className="mb-4 text-white font-heading text-3xl">
                Majority of the 10K Savings Challengers identify $3k in
                additional savings within the first day of joining the
                challenge. Join the 10K Challenge for a year-end financial win.
              </h1>
              <h1 className="mb-10 mt-4 text-white font-heading text-5xl">
                Ready to kickstart your ideal life?
              </h1>
              <motion.button
                className={
                  "show-me-btn rounded-xl bg-white px-2 py-1 mt-5 text-black shadow-lg"
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
                  "show-me-btn rounded-xl bg-white px-2 py-1 mt-5 mb-5 text-black shadow-lg"
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
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectedData;
