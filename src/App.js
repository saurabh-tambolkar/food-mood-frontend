import React, { useContext } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css"
import Navbar from "./components/Navbar";
import Home from "./screens/Home";
import MyOrders from "./screens/MyOrders";
import Footer from "./components/Footer";
import Rewards from "./screens/Rewards";
import SignUp from "./screens/SignUp";
import Menu from "./screens/Menu";
import SignIn from "./screens/SignIn";
import Cart from "./components/Cart";
import Verify from "./screens/Verify";
import PaymentSuccess from "./screens/PaymentSuccess";
import { AuthContext } from "./context/Auth";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import ForgotPassWord from "./screens/ForgotPassWord";
import ResetPass from "./screens/ResetPass";

const getToken = () =>{
   const cookie = document.cookie;
  const token = cookie.split("=")[1]
  return token;
}




const App = () => {
  const location = useLocation();
  return (
    <div>
     {location.pathname.startsWith('/reset-password') ? null : <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menu" element={<Menu />} />
        <Route
          path="/my-orders"
          element={
            <ProtectedRoute>
            <MyOrders />
            </ProtectedRoute>
          }
        />
        <Route path="/rewards" element={<Rewards />} />
        <Route
          path="/my-cart"
          element={
            <ProtectedRoute>
              <Cart/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/paymentsuccess"
          element={
            <ProtectedRoute>
              <PaymentSuccess/>
            </ProtectedRoute>
          }
        />
        <Route
          path="/sign-up"
          element={
            <PublicRoute>
              <SignUp />
            </PublicRoute>
          }
        />
        <Route
          path="/sign-in"
          element={
            <PublicRoute>
              <SignIn />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassWord/>
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPass/>
            </PublicRoute>
          }
        />
        <Route
          path="/verify-user"
          element={
            <PublicRoute>
              <Verify/>
            </PublicRoute>
          }
        />
        <Route path="/newRou" element={<h1>Hello </h1>}/>
      </Routes>
      {location.pathname.startsWith('/reset-password') ? null : <Footer/>}
    </div>
  );
};

export default App;
