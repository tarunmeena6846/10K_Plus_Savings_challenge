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
import EmailVerify from "./components/EmailVerify";
import SavingPortalLanding from "./components/savingportal/SavingPortalLanding";
import IncomePortalLanding from "./components/incomeportal/IncomePortalLanding";
import CommunityLanding from "./components/community/CommunityLanding";
import SWOTanalysisPortal from "./components/SWOTanalysisPortal/SWOTanalysisPortal";
import HandleCreatePost from "./components/community/CreatePost";
import PostLanding from "./components/community/Post/PostLanding";
import MyDraft from "./components/community/UserPosts/MyDraft";
import MyPosts from "./components/community/UserPosts/MyPosts";
import MyBookmarked from "./components/community/UserPosts/MyBookmarked";
import BookSession from "./components/scheduler/BookSession";
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
          <Route path="/savingportal" element={<SavingPortalLanding />} />
          <Route path="/incomeportal" element={<IncomePortalLanding />} />

          {/* <Route path="/checkout" element={<Payment />} /> */}
          <Route path="/projecteddashboard" element={<ProjectedDashboard />} />
          <Route path="/swotportal" element={<SWOTanalysisPortal />} />
          <Route path="/swotportal/schedulesession" element={<BookSession />} />

          <Route path="/verify-email/:token" element={<EmailVerify />} />
          <Route path="/community" element={<CommunityLanding />} />
          <Route path="/community/mydiscussion" element={<MyPosts />} />
          <Route path="/community/bookmarked" element={<MyBookmarked />} />
          <Route path="/community/drafts" element={<MyDraft />} />
          <Route path="/community/post/:postId" element={<PostLanding />} />

          <Route path="/newpost" element={<HandleCreatePost />}></Route>
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
