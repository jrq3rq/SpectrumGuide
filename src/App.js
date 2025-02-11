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
import About from "./pages/About";
import Payment from "./pages/Payment";
import ChatHistoryDisplay from "./pages/ChatHistoryDisplay";
import SocialStories from "./pages/SocialStories";
import SignUp from "./pages/SignUp";
import LoadingOverlay from "./components/LoadingOverlay";
import ChildProfileForm from "./components/ChildProfileForm";

const SignIn = lazy(() => import("./pages/SignIn"));
const CreateProfile = lazy(() => import("./pages/CreateProfile"));

/** ✅ Save the last visited page in sessionStorage */
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
  return (
    <Router>
      <UserProvider>
        <ScrollToTop />
        <SaveLastPage />
        <Header />
        <main>
          <Routes>
            {/* Public Routes (Sign In & Sign Up) */}
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

            {/* Profile Completion Route (Handled in PublicRoute.js) */}
            <Route
              path="/create-profile"
              element={
                <Suspense fallback={<LoadingOverlay />}>
                  <CreateProfile />
                </Suspense>
              }
            />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/form" element={<ChildProfileForm />} />
              <Route path="/about" element={<About />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/history" element={<ChatHistoryDisplay />} />
              <Route path="/social-stories" element={<SocialStories />} />
            </Route>

            {/* ✅ Fixed: Redirect unknown routes to last visited page or /form */}
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
      </UserProvider>
    </Router>
  );
};

export default App;
