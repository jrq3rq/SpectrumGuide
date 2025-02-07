// src/App.js
import React, { lazy, Suspense } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import ScrollToTop from "./utils/ScrollToTop";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute"; // Import the new PublicRoute
import Header from "./components/Header";
import Footer from "./components/Footer";
import Form from "./pages/Form";
import About from "./pages/About";
import Payment from "./pages/Payment";
import ChatHistoryDisplay from "./pages/ChatHistoryDisplay";
import SocialStories from "./pages/SocialStories";
import SignUp from "./pages/SignUp";
import LoadingOverlay from "./components/LoadingOverlay";

const SignIn = lazy(() => import("./pages/SignIn"));

const App = () => {
  return (
    <Router>
      <UserProvider>
        <ScrollToTop />
        <Header />
        <main>
          <Routes>
            {/* Public Routes */}
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
            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/form" element={<Form />} />
              <Route path="/about" element={<About />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/history" element={<ChatHistoryDisplay />} />
              <Route path="/social-stories" element={<SocialStories />} />
            </Route>
            {/* Redirect unknown routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </UserProvider>
    </Router>
  );
};

export default App;
