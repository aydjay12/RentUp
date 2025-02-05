import "./App.css";
import { useState, useEffect, Suspense } from "react";
import Layout from "./components/pages/Layout";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Home from "./components/home/Home";
import About from "./components/about/About";
import Pricing from "./components/pricing/Pricing";
import Contact from "./components/contact/Contact";
import Properties from "./components/properties/properties";
import ScrollToTop from "./components/scrollToTop/scrollToTop";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserDetailContext from "./context/UserDetailContext";
import Property from "./components/Property/Property";
import Favourites from "./components/Favourites/Favourites";
import Search from "./components/search/Search";
import Signup from "./components/auth/signup/Signup";
import Signin from "./components/auth/signin/signin";
import Verified from "./components/auth/verified/Verified";
import ForgotPassword from "./components/auth/forgot-password/ForgotPassword";
import NewPassword from "./components/auth/new-password/NewPassword";

const App = () => {
  const [showButton, setShowButton] = useState(false);
  const queryClient = new QueryClient();
  const [userDetails, setUserDetails] = useState({
    favourites: [],
    contacts: [],
    token: null,
  });

  return (
    <>
      <UserDetailContext.Provider value={{ userDetails, setUserDetails }}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <ScrollToTop />
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route element={<Layout />}>
                  <Route path="/" element={<Home></Home>} />
                  <Route path="/about" element={<About></About>} />
                  <Route path="/search" element={<Search></Search>} />
                  <Route path="/pricing" element={<Pricing></Pricing>} />
                  <Route path="/contact" element={<Contact></Contact>} />
                  <Route path="/properties">
                    <Route index element={<Properties />} />
                    <Route path=":propertyId" element={<Property />} />
                  </Route>
                  <Route path="/favourites" element={<Favourites />} />
                </Route>
                <Route path="/signup" element={<Signup></Signup>} />
                <Route path="/signin" element={<Signin />} />
                <Route path="/verified" element={<Verified />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/new-password" element={<NewPassword />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
          <ToastContainer />
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </UserDetailContext.Provider>
    </>
  );
};

export default App;
