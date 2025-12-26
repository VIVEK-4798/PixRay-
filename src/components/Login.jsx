import React, { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/LARGE.jpg";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase/setup";
import axios from "axios";

const db = getFirestore();

// Change this if you deploy the backend somewhere else
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();
  const provider = new GoogleAuthProvider();
  const auth = getAuth();

  // ----------- Manual login/register state -----------
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ----------- Manual login/register handlers -----------
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const endpoint =
        mode === "login" ? "/api/auth/login" : "/api/auth/register";

      const payload =
        mode === "login"
          ? { email, password }
          : { email, password, name };

      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload);

      // Backend returns: { _id, email, name, token }
      const userData = res.data;

      // Save backend user + token
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", userData.token);

      navigate("/home");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Something went wrong. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  // ----------- Google (Firebase) sign-in - existing logic -----------
  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const user = result.user;
      console.log("User authenticated:", user);

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        const storageRef = ref(storage, `images/${user.uid}.jpg`);
        const imgBlob = await fetch(user.photoURL).then((res) => res.blob());
        await uploadBytes(storageRef, imgBlob);
        const downloadURL = await getDownloadURL(storageRef);

        await setDoc(userDocRef, {
          name: user.displayName,
          googleId: user.uid,
          imageUrl: downloadURL,
        });
      }

      // NOTE: This still stores Firebase user.
      // Your Mongo backend does not know about this yet.
      localStorage.setItem(
        "user",
        JSON.stringify({
          name: user.displayName,
          googleId: user.uid,
          imageUrl: user.photoURL,
        })
      );

      navigate("/home");
    } catch (error) {
      console.error("Error during authentication:", error);
      setErrorMsg("Google sign-in failed. Please try again.");
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_API_TOKEN}>
      <div className="flex justify-start items-center flex-col h-screen">
        <div className="relative w-full h-full">
          <video
            src={shareVideo}
            type="video/mp4"
            loop
            controls={false}
            muted
            autoPlay
            className="w-full h-full object-cover"
          />
          <div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
            <div className="p-5">
              <img src={logo} width="130px" alt="logo" />
            </div>

            {/* Auth card */}
            <div className="bg-white bg-opacity-90 rounded-xl shadow-2xl p-6 w-80 max-w-full">
              {/* Mode toggle */}
              <div className="flex justify-center mb-4">
                <button
                  className={`px-3 py-1 rounded-l-full text-sm ${
                    mode === "login"
                      ? "bg-mainColor text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setMode("login")}
                  type="button"
                >
                  Login
                </button>
                <button
                  className={`px-3 py-1 rounded-r-full text-sm ${
                    mode === "register"
                      ? "bg-mainColor text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                  onClick={() => setMode("register")}
                  type="button"
                >
                  Register
                </button>
              </div>

              {/* Error message */}
              {errorMsg && (
                <p className="text-red-500 text-xs mb-3 text-center">
                  {errorMsg}
                </p>
              )}

              {/* Manual login/register form */}
              <form className="flex flex-col" onSubmit={handleAuthSubmit}>
                {mode === "register" && (
                  <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mb-3 px-3 py-2 rounded-md border border-gray-300 text-sm outline-none"
                    required
                  />
                )}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mb-3 px-3 py-2 rounded-md border border-gray-300 text-sm outline-none"
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mb-4 px-3 py-2 rounded-md border border-gray-300 text-sm outline-none"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-mainColor text-white font-semibold py-2 rounded-md text-sm disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading
                    ? "Please wait..."
                    : mode === "login"
                    ? "Login"
                    : "Create account"}
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center my-3">
                <div className="flex-1 h-px bg-gray-300" />
                <span className="px-2 text-xs text-gray-500">OR</span>
                <div className="flex-1 h-px bg-gray-300" />
              </div>

              {/* Google sign-in button */}
              <button
                type="button"
                className="bg-white flex justify-center items-center w-full py-2 rounded-md border border-gray-300 text-sm cursor-pointer outline-none"
                onClick={handleGoogleSignIn}
              >
                <FcGoogle className="mr-2 text-lg" />
                <span>Sign in with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
};

export default Login;
