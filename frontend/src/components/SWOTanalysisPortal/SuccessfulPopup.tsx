import React, { useEffect, useState } from "react";

interface SuccessPopupProps {
  message: string;
  duration: number; // Duration in milliseconds
  onClose: () => void; // Function to close the popup
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
  message,
  duration,
  onClose,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          onClose();
          return 100;
        }
        return prev + 100 / (duration / 1000);
      });
    }, 1000);

    const timeout = setTimeout(() => {
      onClose();
    }, duration);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [duration, onClose]);

  const getColorForProgress = (progress: number) => {
    if (progress < 33) return "bg-red-500";
    if (progress < 66) return "bg-yellow-500";
    return "bg-green-800";
  };

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white p-3 rounded-lg shadow-lg">
      <div>{message}</div>
      <div className="w-full bg-green-700 rounded-full h-1.5 mt-2">
        <div
          className={`h-1.5 rounded-full ${getColorForProgress(progress)}`}
          style={{ width: `${progress}%`, transition: "width 1s linear" }}
        ></div>
      </div>
    </div>
  );
};

export default SuccessPopup;
