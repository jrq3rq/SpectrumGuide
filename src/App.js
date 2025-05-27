// import React, { lazy, Suspense, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
//   Navigate,
// } from "react-router-dom";
// import { UserProvider } from "./context/UserContext";
// import ScrollToTop from "./utils/ScrollToTop";
// import PrivateRoute from "./components/PrivateRoute";
// import PublicRoute from "./components/PublicRoute";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Payment from "./pages/Payment";
// import ChatHistoryDisplay from "./pages/ChatHistoryDisplay";
// import SocialStories from "./pages/SocialStories";
// import SignUp from "./pages/SignUp";
// import LoadingOverlay from "./components/LoadingOverlay";
// import ChildProfileForm from "./components/ChildProfileForm";
// import InteractiveHub from "./components/InteractiveHub";
// import AboutPage from "./pages/AboutPage";

// const SignIn = lazy(() => import("./pages/SignIn"));
// const CreateProfile = lazy(() => import("./pages/CreateProfile"));

// const SaveLastPage = () => {
//   const location = useLocation();
//   useEffect(() => {
//     if (location.pathname !== "/create-profile") {
//       sessionStorage.setItem("lastVisitedPage", location.pathname);
//     }
//   }, [location.pathname]);
//   return null;
// };

// const App = () => {
//   const location = useLocation();
//   const pagesWithBackground = ["/", "/signup", "/signin"];

//   useEffect(() => {
//     console.log("App - Pathname changed to:", location.pathname);
//     if (pagesWithBackground.includes(location.pathname)) {
//       document.body.classList.add("has-background");
//     } else {
//       document.body.classList.remove("has-background");
//     }
//   }, [location.pathname]);

//   return (
//     <div className="app-wrapper">
//       <ScrollToTop />
//       <SaveLastPage />
//       <Header />
//       <main>
//         <Suspense fallback={<LoadingOverlay />}>
//           <Routes>
//             <Route element={<PublicRoute />}>
//               <Route path="/" element={<SignIn />} />
//               <Route path="/signin" element={<SignIn />} />
//               <Route path="/signup" element={<SignUp />} />
//             </Route>
//             <Route element={<PrivateRoute />}>
//               <Route
//                 path="/form"
//                 element={<ChildProfileForm key={Date.now()} />}
//               />
//               <Route path="/about" element={<AboutPage />} />
//               <Route path="/payment" element={<Payment />} />
//               <Route path="/history" element={<ChatHistoryDisplay />} />
//               <Route path="/social-stories" element={<SocialStories />} />
//               <Route path="/interactive-hub" element={<InteractiveHub />} />
//               <Route path="/create-profile" element={<CreateProfile />} />
//             </Route>
//             {/* Fallback for unmatched routes */}
//             <Route path="*" element={<Navigate to="/signin" replace />} />
//           </Routes>
//         </Suspense>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// const AppWithRouter = () => (
//   <Router>
//     <UserProvider>
//       <App />
//     </UserProvider>
//   </Router>
// );

// export default AppWithRouter;

// import React, { lazy, Suspense, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   useLocation,
//   Navigate,
// } from "react-router-dom";
// import { UserProvider } from "./context/UserContext";
// import ScrollToTop from "./utils/ScrollToTop";
// import PrivateRoute from "./components/PrivateRoute";
// import PublicRoute from "./components/PublicRoute";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Payment from "./pages/Payment";
// import ChatHistoryDisplay from "./pages/ChatHistoryDisplay";
// import SocialStories from "./pages/SocialStories";
// import SignUp from "./pages/SignUp";
// import LoadingOverlay from "./components/LoadingOverlay";
// import ChildProfileForm from "./components/ChildProfileForm";
// import InteractiveHub from "./components/InteractiveHub";
// import AboutPage from "./pages/AboutPage";
// import TestImageGeneration from "./components/TestImageGeneration";

// // Lazy load components
// const SignIn = lazy(() => import("./pages/SignIn"));
// const CreateProfile = lazy(() => import("./pages/CreateProfile"));
// const PecsBoard = lazy(() => import("./pages/PecsBoard"));

// const SaveLastPage = () => {
//   const location = useLocation();
//   useEffect(() => {
//     if (location.pathname !== "/create-profile") {
//       sessionStorage.setItem("lastVisitedPage", location.pathname);
//     }
//   }, [location.pathname]);
//   return null;
// };

// const App = () => {
//   const location = useLocation();
//   const pagesWithBackground = ["/", "/signup", "/signin"];

//   useEffect(() => {
//     console.log("App - Pathname changed to:", location.pathname);
//     if (pagesWithBackground.includes(location.pathname)) {
//       document.body.classList.add("has-background");
//     } else {
//       document.body.classList.remove("has-background");
//     }
//   }, [location.pathname]);

//   return (
//     <div className="app-wrapper">
//       <ScrollToTop />
//       <SaveLastPage />
//       <Header />
//       <main>
//         <Suspense fallback={<LoadingOverlay />}>
//           <Routes>
//             <Route element={<PublicRoute />}>
//               <Route path="/" element={<SignIn />} />
//               <Route path="/signin" element={<SignIn />} />
//               <Route path="/signup" element={<SignUp />} />
//             </Route>
//             <Route element={<PrivateRoute />}>
//               <Route
//                 path="/form"
//                 element={<ChildProfileForm key={Date.now()} />}
//               />
//               <Route path="/about" element={<AboutPage />} />
//               <Route path="/payment" element={<Payment />} />
//               <Route path="/history" element={<ChatHistoryDisplay />} />
//               <Route path="/social-stories" element={<SocialStories />} />
//               <Route path="/interactive-hub" element={<InteractiveHub />} />
//               <Route path="/create-profile" element={<CreateProfile />} />
//               <Route path="/pecs-board" element={<PecsBoard />} />
//               <Route
//                 path="/test-image-generation"
//                 element={<TestImageGeneration />}
//               />
//             </Route>
//             {/* Fallback for unmatched routes */}
//             <Route path="*" element={<Navigate to="/signin" replace />} />
//           </Routes>
//         </Suspense>
//       </main>
//       <Footer />
//     </div>
//   );
// };

// const AppWithRouter = () => (
//   <Router>
//     <UserProvider>
//       <App />
//     </UserProvider>
//   </Router>
// );

// export default AppWithRouter;
import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import ScrollToTop from "./utils/ScrollToTop";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Payment from "./pages/Payment";
import ChatHistoryDisplay from "./pages/ChatHistoryDisplay";
import SocialStories from "./pages/SocialStories";
import SignUp from "./pages/SignUp";
import LoadingOverlay from "./components/LoadingOverlay";
import ChildProfileForm from "./components/ChildProfileForm";
import InteractiveHub from "./components/InteractiveHub";
import AboutPage from "./pages/AboutPage";
import TestImageGeneration from "./components/TestImageGeneration";

// Lazy load components
const SignIn = lazy(() => import("./pages/SignIn"));
const CreateProfile = lazy(() => import("./pages/CreateProfile"));
const PecsBoard = lazy(() => import("./pages/PecsBoard"));
const InvestorsPage = lazy(() => import("./pages/InvestorsPage"));

const SaveLastPage = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.pathname !== "/create-profile") {
      sessionStorage.setItem("lastVisitedPage", location.pathname);
    }
  }, [location.pathname]);
  return null;
};

const App = () => {
  const location = useLocation();
  const pagesWithBackground = ["/", "/signup", "/signin", "/investors"];

  useEffect(() => {
    console.log("App - Pathname changed to:", location.pathname);
    if (pagesWithBackground.includes(location.pathname)) {
      document.body.classList.add("has-background");
    } else {
      document.body.classList.remove("has-background");
    }
  }, [location.pathname]);

  return (
    <div className="app-wrapper">
      <ScrollToTop />
      <SaveLastPage />
      <Header />
      <main>
        <Suspense fallback={<LoadingOverlay />}>
          <Routes>
            <Route element={<PublicRoute />}>
              <Route path="/" element={<SignIn />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/investors" element={<InvestorsPage />} />
            </Route>
            <Route element={<PrivateRoute />}>
              <Route
                path="/form"
                element={<ChildProfileForm key={Date.now()} />}
              />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/history" element={<ChatHistoryDisplay />} />
              <Route path="/social-stories" element={<SocialStories />} />
              <Route path="/interactive-hub" element={<InteractiveHub />} />
              <Route path="/create-profile" element={<CreateProfile />} />
              <Route path="/pecs-board" element={<PecsBoard />} />
              <Route
                path="/test-image-generation"
                element={<TestImageGeneration />}
              />
            </Route>
            <Route path="*" element={<Navigate to="/signin" replace />} />
          </Routes>
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

const AppWithRouter = () => (
  <Router>
    <UserProvider>
      <App />
    </UserProvider>
  </Router>
);

export default AppWithRouter;