import { GridLoader } from "react-spinners";

const Loader = () => {
  // return <GridLoader color="#e61c1c" size={30} />;
  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="w-64 h-40 flex items-center justify-center">
        {/* <GridLoader color="#e61c1c" size={30} /> */}
        Loading ...
      </div>
    </div>
  );
};

export default Loader;
