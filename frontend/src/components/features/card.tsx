import classNames from "classnames";
import { useFeatureStore } from "./store";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";

type FeatureCardProps = {
  gradient: string;
  children: React.ReactNode;
} & CardProps;

type CardProps = {
  id: string;
};

const FeatureCard = ({ gradient, children, id }: FeatureCardProps) => {
  console.log("children ", children, id);
  const inViewFeature = useFeatureStore((state) => state.inViewFeature);
  const setFullscreenFeature = useFeatureStore(
    (state) => state.setFullscreenFeature
  );

  return (
    <div
      className={classNames(
        "absolute inset-0 h-full w-full rounded-2xl transition-opacity",
        inViewFeature === id
          ? "active-card opacity-100"
          : "pointer-events-none opacity-0"
      )}
      style={{ zIndex: inViewFeature === id ? 1 : 0 }} // Set a higher z-index for the active card
    >
      <div
        className={classNames(
          "gradient absolute inset-0 origin-bottom-left rounded-2xl bg-gradient-to-br",
          gradient
        )}
      />

      {children}
      {/* <Typography style={{ background: "black" }}>Hello </Typography> */}
      {/* <button
        onClick={() => setFullscreenFeature(id)}
        className="show-me-btn absolute bottom-6 right-6 rounded-xl bg-black px-4 py-2 text-white shadow-lg"
      >
        Show me
      </button> */}
    </div>
  );
};

export const Todo = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#f7f0ff] to-[#a78afe]">
      <img
        className={classNames(
          "absolute left-[10%] top-[10%] w-[40%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/comm1.jpg"
      />
      <img
        className={classNames(
          "absolute left-[60%] top-[40%] w-[35%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/comm2.jpg"
      />
    </FeatureCard>
  );
};

export const Colors = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#f5fbff] to-[#addeff]">
      <img
        className={classNames(
          "absolute left-[10%] top-[10%] w-[40%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/expert1.png"
      />
      <img
        className={classNames(
          "absolute left-[60%] top-[40%] w-[35%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/expert2.jpg"
      />
      <img
        className={classNames(
          "absolute left-[10%] top-[60%] w-[40%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/expert3.webp"
      />
    </FeatureCard>
  );
};

export const ProjectedCard = ({ id }: CardProps) => {
  return (
    // <></>
    <FeatureCard id={id} gradient="from-[#f5fbff] to-[#addeff]">
      // {/* setFullscreenFeature(id) */}
      // {/* <Typography>hello my name </Typography> */}
    </FeatureCard>
  );
};
export const Availability = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#f5fff7] to-[#adf8ff]">
      <img
        className={classNames(
          "absolute left-[30%] top-[10%] w-[40%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/kelly-sikkema-xoU52jUVUXA-unsplash-1-scaled-1.jpg"
      />
      {/* <img
        className={classNames(
          "absolute left-[60%] top-[40%] w-[35%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/expert2.jpg"
      /> */}
      <img
        className={classNames(
          "absolute left-[10%] top-[60%] w-[50%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/alison_courseware_intro_1591.jpg"
      />{" "}
    </FeatureCard>
  );
};

export const Music = ({ id }: CardProps) => {
  // const fullscreenFeature = useFeatureStore((store) => store.fullscreenFeature);
  // const isFullscreen = fullscreenFeature === id;

  return (
    <FeatureCard id={id} gradient="from-[#f7fff5] to-[#adffd8]">
      <img
        className={classNames(
          "absolute left-[10%] top-[10%] w-[40%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/extra1.jpg"
      />
      <img
        className={classNames(
          "absolute left-[60%] top-[40%] w-[35%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/extra2.jpg"
      />
      <img
        className={classNames(
          "absolute left-[10%] top-[60%] w-[40%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/extra3.jpg"
      />
    </FeatureCard>
  );
};

export const SchedulingLinks = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#fff7f5] to-[#ffd8ad]">
      <img
        className={classNames(
          "absolute left-[10%] top-[10%] w-[40%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/save1.jpg"
      />
      <img
        className={classNames(
          "absolute left-[60%] top-[40%] w-[35%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/daily1.png"
      />
      {/* <img
        className={classNames(
          "absolute left-[10%] top-[60%] w-[40%] h-[30%] rounded-xl shadow-lg transition-transform"
          // isFullscreen ? "scale-0" : "scale-100"
        )}
        src="/extra3.jpg"
      /> */}
    </FeatureCard>
  );
};

export const price = ({ id }: CardProps) => {
  return (
    <FeatureCard id={id} gradient="from-[#fef5ff] to-[#ffade1]">
      <motion.div className="flex flex-col items-center justify-center absolute inset-0">
        <h1
          // ref={ref}
          className={classNames(
            "absolute left-[20%] top-[10%] text-5xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl",
            "text-black transition-transform"
          )}
        >
          $99/year
        </h1>
        <h1
          className={classNames(
            "absolute  left-[40%] top-[30%] text-5xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl transition-transforms",
            "text-black"
          )}
        >
          Or
        </h1>
        <h1
          // ref={ref}
          className={classNames(
            "absolute left-[20%] top-[50%]  text-5xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl transition-transforms",
            "text-black"
          )}
        >
          $499/year
        </h1>
      </motion.div>
    </FeatureCard>
  );
};
