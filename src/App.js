import React, { lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
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

const SignIn = lazy(() => import("./pages/SignIn"));
const CreateProfile = lazy(() => import("./pages/CreateProfile"));

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
  const pagesWithBackground = ["/", "/signup"];

  useEffect(() => {
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
        <Routes>
          <Route element={<PublicRoute />}>
            <Route
              path="/"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <SignIn />
                </Suspense>
              }
            />
            <Route path="/signup" element={<SignUp />} />
          </Route>
          <Route
            path="/create-profile"
            element={
              <Suspense fallback={<LoadingOverlay />}>
                <CreateProfile />
              </Suspense>
            }
          />
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
          </Route>
          <Route
            path="*"
            element={
              <Navigate
                to={sessionStorage.getItem("lastVisitedPage") || "/form"}
                replace
              />
            }
          />
        </Routes>
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
