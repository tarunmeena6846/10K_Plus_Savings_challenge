import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Login from "./components/Login";
import Landing from "./components/Landing";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Appbar from "./AppBar";
import { RecoilRoot, useRecoilState } from "recoil";
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
import CurrentDashboard from "./components/CurrentDashboard";
import TargetDashboard from "./components/Dashboard/TargetDashboard";
import ActualDashboard from "./components/Dashboard/ActualDashboard";
import SWOTtasklist from "./components/SWOTanalysisPortal/SWOTtaskListDisplay";

import {
  SubscriptionData,
  subscriptionState,
  userState,
  videoModalState,
} from "./components/store/atoms/user";
import countAtom from "./components/store/atoms/quickLinkCount";
import { NewPostWrapper } from "./components/community/NewPostWrapper";
import { EditPostWrapper } from "./components/community/EditPostWrapper";
import AnalyticsLanding from "./AnalyticsDashboard/Landing";
import RequestOTP from "./components/RequestOTP";
import ResetPassword from "./components/ResetPassword";
import LandingConsole from "./components/AdminConsole/ConsoleLanding";
import { useIsMobile } from "./components/MonthlyBarGraph";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker.register("/service-worker.js").then(
      function (registration) {
        console.log(
          "ServiceWorker registration successful with scope: ",
          registration.scope
        );
      },
      function (error) {
        console.log("ServiceWorker registration failed: ", error);
      }
    );
  });
}

function App() {
  const location = useLocation();
  const isMobile = useIsMobile();
  console.log(isMobile);
  // Check if the current location matches any of the routes where Appbar should not be rendered
  const hideAppbarRoutes = [
    "/dashboard",
    "/currentdashboard",
    "/targetdashboard",
    "/actualdashboard",
    "/analytics",
    "/login",
    "/register",
    // "/",
  ];
  const shouldRenderAppbar = (() => {
    if (isMobile) {
      // For mobile: Do not render appbar only for login and register
      return (
        location.pathname !== "/login" && location.pathname !== "/register"
      );
    } else {
      // For larger screens: Do not render appbar for routes in hideAppbarRoutes
      return !hideAppbarRoutes.includes(location.pathname);
    }
  })();
  // console.log("tarun inside app.tsx");
  console.log(shouldRenderAppbar, location.pathname);

  return (
    // <Router>
    <RecoilRoot>
      <InitUser />
      {shouldRenderAppbar && <Appbar />}
      {/* Render the Appbar conditionally */}
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/request-otp" element={<RequestOTP />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/currentdashboard" element={<CurrentDashboard />} />
        <Route path="/targetdashboard" element={<TargetDashboard />} />
        <Route path="/actualdashboard" element={<ActualDashboard />} />
        <Route path="/analytics" element={<AnalyticsLanding />} />

        <Route path="/pricing" element={<StripePricingTable />} />
        {/* <Route path="/savingportal" element={<SavingPortalLanding />} /> */}
        {/* <Route path="/incomeportal" element={<IncomePortalLanding />} /> */}
        {/* <Route path="/projecteddashboard" element={<ProjectedDashboard />} /> */}
        <Route path="/swotportal" element={<SWOTanalysisPortal />} />
        <Route path="/swotportal/tasklist" element={<SWOTtasklist />} />
        <Route path="/swotportal/schedulesession" element={<BookSession />} />
        <Route path="/verify-email/:token" element={<EmailVerify />} />
        <Route path="/community" element={<CommunityLanding />} />
        <Route path="/community/mydiscussion" element={<MyPosts />} />
        <Route path="/community/bookmarked" element={<MyBookmarked />} />
        <Route path="/community/drafts" element={<MyDraft />} />
        <Route path="/community/post/:postId" element={<PostLanding />} />
        <Route path="/newpost" element={<NewPostWrapper />}></Route>
        <Route path="/adminconsole" element={<LandingConsole />}></Route>
        <Route
          path="/community/drafts/editpost/:postId"
          element={<EditPostWrapper />}
        ></Route>
      </Routes>
    </RecoilRoot>
    // </Router>
  );
}

export function InitUser() {
  const [currentUserState, setCurrentUserState] = useRecoilState(userState);
  const [userPostCount, setUserPostCount] = useRecoilState(countAtom);
  const [videoModalOpen, setVideoModalOpen] = useRecoilState(videoModalState);
  const navigate = useNavigate();

  const [subscription, setSubscripton] =
    useRecoilState<SubscriptionData>(subscriptionState);
  const Init = async () => {
    console.log("inside InitUser");
    setCurrentUserState((prev) => ({ ...prev, isLoading: true }));
    const storedToken = localStorage.getItem("token");
    console.log("stored token", storedToken);
    if (!storedToken) {
      console.log("no token found");
      setCurrentUserState((prev) => ({
        ...prev,
        userEmail: "",
        isLoading: false,
        imageUrl: "",
        // isVerified: currentUserState.isVerified,
        // myWhy: currentUserState.myWhy,
        // isAdmin: currentUserState.isAdmin,
      }));
      console.log("here");
      navigate("/login");
      return;
    }
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SERVER_URL}/auth/me`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + storedToken,
          },
        }
      );

      console.log("response from me route", response);
      if (response.status === 401) {
        console.log("Unauthorized: Token may be expired or invalid.");
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      console.log("data after me route", data);
      if (data.success) {
        setCurrentUserState({
          userEmail: data?.userData?.email,
          userName: data?.userData?.username,
          isLoading: false,
          imageUrl: data?.userData?.imageUrl,
          isVerified: data?.userData?.verified,
          myWhy: data?.userData?.myWhy,
          isAdmin: data?.userData?.isAdmin,
        });

        setSubscripton({
          isSubscribed: data.userData.isSubscribed,
          stripeCustomerId: data.userData.stripeUserId,
          stripePlanId: data.userData.stripePlanId,
          isTopTier: data.userData.isTopTier,
        });
        console.log(
          data.userData.myPosts?.length ?? 0,
          data.userData.myDrafts?.length ?? 0,
          data.userData.bookmarkPosts?.length ?? 0
        );
        setVideoModalOpen({
          dashboardVideoModal:
            data.userData.videoModalSettings.dashboardVideoModal,
        });
        // console.log(
        //   "cunt at appbar",
        //   data.userData.myPosts.length,
        //   data.userData.bookmarkPost.length,
        //   data.userData.myDrafts.length
        // );
        setUserPostCount({
          myDiscussionCount: data.userData.myPosts?.length ?? 0,
          bookmarkCount: data.userData.bookmarkedPosts?.length ?? 0,
          draftCount: data.userData.myDrafts?.length ?? 0,
        });
        if (!data.userData.isSubscribed) {
          navigate("/pricing");
        }
      } else {
        console.log("here inside else part of inituser");
        setCurrentUserState((prev) => ({
          ...prev,
          userEmail: "",
          isLoading: false,
          imageUrl: "",
          // isVerified: currentUserState.isVerified,
          // myWhy: currentUserState.myWhy,
          // isAdmin: currentUserState.isAdmin,
        }));
        // localStorage.removeItem("token");

        // navigate("/login");
      }
    } catch (error) {
      console.log("here");
      console.error("Error while logging in", error);
      setCurrentUserState((prev) => ({
        ...prev,
        userEmail: "",
        isLoading: false,
        imageUrl: "",
        // isVerified: currentUserState.isVerified,
        // myWhy: currentUserState.myWhy,
        // isAdmin: currentUserState.isAdmin,
      }));
      // setLogoutModalOpen(false);
    }
  };
  useEffect(() => {
    console.log("inside inituseeffect ");
    Init();
  }, [setCurrentUserState, navigate]);
  return <></>;
}
export default App;
