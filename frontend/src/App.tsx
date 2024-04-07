import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
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
import SideBar from "./components/Sidebar/SideBar";
import "./App.css";
import CurrentDashboard from "./components/Dashboard/CurrentDashboard";
import TargetDashboard from "./components/Dashboard/TargetDashboard";
import ActualDashboard from "./components/Dashboard/ActualDashboard";
import SWOTtasklist from "./components/SWOTanalysisPortal/SWOTtaskListDisplay";

function App() {
  const location = useLocation();

  // Check if the current location matches any of the routes where Appbar should not be rendered
  const hideAppbarRoutes = [
    "/dashboard",
    "/currentdashboard",
    "/targetdashboard",
    "/actualdashboard",
  ];
  const shouldRenderAppbar = !hideAppbarRoutes.includes(location.pathname);
  // console.log("tarun inside app.tsx");

  return (
    // <Router>
    <RecoilRoot>
      {shouldRenderAppbar && <Appbar />} {/* Render the Appbar conditionally */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/currentdashboard" element={<CurrentDashboard />} />
        <Route path="/targetdashboard" element={<TargetDashboard />} />
        <Route path="/actualdashboard" element={<ActualDashboard />} />
        <Route path="/pricing" element={<StripePricingTable />} />
        <Route path="/savingportal" element={<SavingPortalLanding />} />
        <Route path="/incomeportal" element={<IncomePortalLanding />} />
        <Route path="/projecteddashboard" element={<ProjectedDashboard />} />
        <Route path="/swotportal" element={<SWOTanalysisPortal />} />
        <Route path="/swotportal/tasklist" element={<SWOTtasklist />} />
        <Route path="/swotportal/schedulesession" element={<BookSession />} />
        <Route path="/verify-email/:token" element={<EmailVerify />} />
        <Route path="/community" element={<CommunityLanding />} />
        <Route path="/community/mydiscussion" element={<MyPosts />} />
        <Route path="/community/bookmarked" element={<MyBookmarked />} />
        <Route path="/community/drafts" element={<MyDraft />} />
        <Route path="/community/post/:postId" element={<PostLanding />} />
        <Route path="/newpost" element={<HandleCreatePost />}></Route>
      </Routes>
    </RecoilRoot>
    // </Router>
  );
}

export default App;
