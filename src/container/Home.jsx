import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/setup";
import { HiMenu } from "react-icons/hi";
import { Link, Routes, Route, useLocation } from "react-router-dom";

import { Sidebar, UserProfile } from "../components";
import HeroSlider from "../components/HeroSlider";
import Pins from "./Pins";
import MasonryLayout from "../components/MasonryLayout";
import logo from "../assets/LARGE-Black.png";
import { AiFillCloseCircle } from "react-icons/ai";
import NewNavbar from "../components/NewNavbar";
import LandingGallery from "../components/LandingGallery";

import { fetchRandomImages, convertUnsplashToPin } from "../utils/image.api";

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);

  const [firebasePins, setFirebasePins] = useState([]);
  const [apiPins, setApiPins] = useState([]);

  const [loadingLanding, setLoadingLanding] = useState(false);
  const scrollRef = useRef(null);
  const location = useLocation();

  const userInfo =
    localStorage.getItem("user") !== "undefined"
      ? JSON.parse(localStorage.getItem("user"))
      : localStorage.clear();


  // Fetch user
  useEffect(() => {
    let mounted = true;
    const fetchUserData = async () => {
      try {
        if (userInfo?.googleId) {
          const userDocRef = doc(db, "users", userInfo.googleId);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists() && mounted) setUser(userDoc.data());
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0);
  }, []);

  const isHomeRoot =
    location.pathname === "/" ||
    location.pathname === "/Search" ||
    location.pathname === "/home";


  // FETCH BOTH PIN SOURCES SEPARATELY
  useEffect(() => {
    if (!isHomeRoot) return;

    let mounted = true;
    setLoadingLanding(true);

    const loadPins = async () => {
      try {
        // ----------- FIREBASE PINS -----------
        let fb = [];
        try {
          const pinsCol = collection(db, "pins");
          const snapshot = await getDocs(query(pinsCol, limit(20)));

          fb = snapshot.docs.map((d) => {
            const data = d.data();
            return {
              _id: d.id,
              ...data,
              imageUrl: data.imageUrl || data.image || null,
            };
          });
        } catch (err) {
          console.error("Error fetching Firebase pins:", err);
        }

        if (mounted) setFirebasePins(fb);

        // ----------- API PINS -----------
        let api = [];
        try {
          const images = await fetchRandomImages(24);
          api = images.map(convertUnsplashToPin).filter(Boolean);
        } catch (err) {
          console.error("Unsplash fetch failed:", err);
          api = [];
        }

        if (mounted) setApiPins(api);
      } finally {
        setLoadingLanding(false);
      }
    };

    loadPins();
    return () => (mounted = false);
  }, [isHomeRoot]);


  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen">
      <div className="hidden md:flex h-screen flex-initial"></div>

      {/* Mobile navbar */}
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu fontSize={40} className="cursor-pointer" onClick={() => setToggleSidebar(true)} />
          <Link to="/home">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          {user && (
            <Link to={`user-profile/${userInfo.googleId}`}>
              <img src={user.imageUrl} alt={user.name} className="w-12 rounded-full" />
            </Link>
          )}
        </div>

        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle fontSize={30} className="cursor-pointer" onClick={() => setToggleSidebar(false)} />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      {/* MAIN CONTENT */}
      <div className="pb-2 flex-1 h-screen overflow-y-scroll" ref={scrollRef}>
        <NewNavbar />
        {isHomeRoot && <HeroSlider />}

        {/* Routes */}
        {user && (
          <Routes>
            <Route path="/user-profile/:userId" element={<UserProfile />} />
            <Route path="/*" element={<Pins user={user} />} />
          </Routes>
        )}

        {/* ------------ FIREBASE PINS (MASONRY LAYOUT) ------------ */}
        {isHomeRoot && firebasePins.length > 0 && (
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold mb-4">Latest Community Pins</h2>
            <MasonryLayout pins={firebasePins} />
          </div>
        )}

        {/* ------------ TEXT SECTION ------------ */}
        {isHomeRoot && (
          <div className="p-8 bg-gradient-to-b from-gray-50 to-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Discover Amazing Content</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-3">Explore Ideas</h3>
                  <p className="text-gray-600">Find inspiration from creative minds around the world.</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-3">Save Your Favorites</h3>
                  <p className="text-gray-600">Collect and organize images that inspire you.</p>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-3">Share Your Vision</h3>
                  <p className="text-gray-600">Upload and share your creative work with the community.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ------------ API PINS (LandingGallery) ------------ */}
        {isHomeRoot && (
          <div>
            {loadingLanding ? (
              <p className="text-center py-10 text-gray-500">Loading images…</p>
            ) : (
              <LandingGallery pins={apiPins} />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
