import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import About from "./pages/About";
import Collections from "./pages/Collections";
import Contect from "./pages/Contact";
import Product from "./pages/Product";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import PlaceOrder from "./pages/PlaceOrder";
import Navbar from "./components/Navbar";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SignIn, SignUp, UserButton } from "@clerk/clerk-react";
import ScrollToTop from "./components/ScrollToTop";
import LoginWrapper from "./pages/Login";
// import TestCartFetch from "./components/testCartFetch";

const App = () => {
  return (
    <>
      {/* <TestCartFetch/> */}
      <ScrollToTop />
      <Navbar />
      <SearchBar />
      <div className="px-4 sm:px-[5vw]">
        <ToastContainer
          position="top-right"
          toastClassName={() =>
            "relative flex p-5 sm:px-7 rounded-md justify-between overflow-hidden cursor-pointer shadow-lg bg-white text-black"
          }
          style={{ top: "10px", right: "10px" }}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/collections" element={<Collections />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/product/:productId" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          {/* <Route path="/login" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} /> */}
          <Route path="/orders" element={<Orders />} />
          <Route path="/place-order" element={<PlaceOrder />} />
          <Route path="/login" element={<LoginWrapper />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default App;
