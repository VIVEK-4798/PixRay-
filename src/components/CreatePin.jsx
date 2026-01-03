import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";

import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

import Spinner from './Spinner';
import { categories } from '../utils/data';

const CreatePin = ({ user }) => {
  const [title, setTitle] = useState('');
  const [about, setAbout] = useState('');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);

  const navigate = useNavigate();

  /* ------------------------------------------------------------------
     IMAGE UPLOAD
  ------------------------------------------------------------------ */
  const uploadImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowed = [
      "image/png",
      "image/jpeg",
      "image/jpg",
      "image/gif",
      "image/svg+xml",
      "image/tiff"
    ];

    if (!allowed.includes(file.type)) {
      setErrorMsg("Wrong Image Type");
      return;
    }

    setErrorMsg(false);
    setLoading(true);

    const storage = getStorage();
    const storageRef = ref(storage, `images/${Date.now()}-${file.name}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      () => {},
      (err) => {
        console.log("Upload error:", err);
        setLoading(false);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          setImageUrl(url);
          setLoading(false);
        });
      }
    );
  };

  /* ------------------------------------------------------------------
      SAVE PIN
  ------------------------------------------------------------------ */
  const savePin = async () => {
    if (!title || !about || !destination || !category || !imageUrl) {
      setErrorMsg(true);
      setTimeout(() => setErrorMsg(false), 3000);
      return;
    }

    const db = getFirestore();
    const pinsRef = collection(db, "pins");

    const docData = {
      title,
      about,
      destination,
      category,
      imageUrl,
      userId: user.googleId,       // IMPORTANT
      postedBy: {
        _id: user.googleId,
        userName: user.name,
        image: user.imageUrl
      },
      save: [],
      createdAt: serverTimestamp()  // FIREBASE TIMESTAMP ✔
    };

    try {
      await addDoc(pinsRef, docData);
      navigate('/');
    } catch (err) {
      console.error("Error saving pin:", err);
    }
  };

  /* ------------------------------------------------------------------
      UI
  ------------------------------------------------------------------ */
  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      <div className="flex lg:flex-row flex-col justify-center items-center bg-white lg:p-5 p-3 lg:w-4/5 w-full">

        {/* LEFT SIDE - Image upload */}
        <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
          <div className="flex flex-col justify-center items-center border-2 border-dotted border-gray-300 p-3 w-full h-420">

            {loading && <Spinner />}
            {errorMsg && <p className="text-red-500">{errorMsg}</p>}

            {!imageUrl ? (
              <label>
                <div className="flex flex-col justify-center items-center h-full cursor-pointer">
                  <p className="text-2xl font-bold"><AiOutlineCloudUpload /></p>
                  <p className="text-lg">Click to upload</p>
                  <p className="mt-32 text-gray-400 text-center">
                    Upload JPG, PNG, GIF, SVG, TIFF (under 20MB)
                  </p>
                </div>

                <input
                  type="file"
                  name="upload-image"
                  onChange={uploadImage}
                  className="w-0 h-0"
                />
              </label>
            ) : (
              <div className="relative h-full">
                <img src={imageUrl} alt="uploaded" className="h-full w-full" />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-white text-xl shadow-md"
                  onClick={() => setImageUrl(null)}
                >
                  <MdDelete />
                </button>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT SIDE - Form */}
        <div className="flex flex-col flex-1 lg:pl-5 mt-5 w-full gap-5">

          {errorMsg && (
            <p className="text-red-500 text-xl">Please fill all fields</p>
          )}

          <input
            type="text"
            placeholder="Add your title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border-b-2 border-gray-200 p-2 outline-none text-2xl font-bold"
          />

          {user && (
            <div className="flex gap-2 items-center my-2">
              <img src={user.imageUrl} className="w-10 h-10 rounded-full" alt="" />
              <p className="font-bold">{user.name}</p>
            </div>
          )}

          <input
            type="text"
            placeholder="What is your pin about?"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            className="border-b-2 border-gray-200 p-2 outline-none"
          />

          <input
            type="text"
            placeholder="Add destination link"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border-b-2 border-gray-200 p-2 outline-none"
          />

          <div>
            <p className="font-semibold text-lg">Choose category</p>
            <select
              onChange={(e) => setCategory(e.target.value)}
              className="border-b-2 border-gray-200 p-2 outline-none w-4/5"
            >
              <option value="">Select Category</option>
              {categories.map((item) => (
                <option value={item.name} key={item.name}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={savePin}
              className="bg-red-500 text-white font-bold rounded-full p-2 w-28"
            >
              Save Pin
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CreatePin;
