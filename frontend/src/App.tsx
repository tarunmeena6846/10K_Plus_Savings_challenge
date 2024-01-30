import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
// import MonthlyIncome from "./components/MonthlyIncome";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
// import MonthlyExpenses from "./components/MonthlyExpenses";
import Appbar from "./AppBar";
import { RecoilRoot } from "recoil";
import ProjectedDashboard from "./components/ProjectedDashboard";
import StripePricingTable from "./components/StripePricingTable";
// import Payment from "./components/Payment";

// This file shows how you can do routing in React.
// Try going to /login, /register, /about, /courses on the website and see how the html changes
// based on the route.
// You can also try going to /random and see what happens (a route that doesnt exist)
function App() {
  return (
    <RecoilRoot>
      <Router>
        <Appbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pricing" element={<StripePricingTable />} />
          {/* <Route path="/checkout" element={<Payment />} /> */}
          <Route path="/projecteddashboard" element={<ProjectedDashboard />} />

          {/*

        <Route path="/createCourse" element={<CreateCourse />} />
        <Route path="/courses" element={<ShowCourses />} />
        <Route path="/course/:courseId" element={<Course />} /> */}
        </Routes>
      </Router>
    </RecoilRoot>
  );
}

export default App;
