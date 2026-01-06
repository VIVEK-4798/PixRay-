import { Link } from "react-router-dom"
import { useState } from "react"
import { MdDownloadForOffline } from "react-icons/md"
import { BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { fetchUser } from "../utils/fetchUser"
import { getFirestore, updateDoc, arrayUnion, doc , setDoc } from "firebase/firestore"
import { v4 as uuidv4 } from "uuid"

const db = getFirestore()

const LandingGallery = ({ pins = [] }) => {
  const [loadedImages, setLoadedImages] = useState(new Set())
  const [hoveredPin, setHoveredPin] = useState(null)
  const user = fetchUser()

  if (!pins || !pins.length) {
    return (
      <div className="py-20">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <p className="text-lg text-gray-600 font-medium">No images found</p>
          <p className="text-sm text-gray-400 mt-2">Start uploading your creative work!</p>
        </div>
      </div>
    )
  }

  const handleImageLoad = (pinId) => {
    setLoadedImages((prev) => new Set(prev).add(pinId))
  }

  const handleDownload = (e, imageUrl, title) => {
    e.preventDefault()
    e.stopPropagation()
    if (!imageUrl) return

    console.log(". Downloading image:", imageUrl)
    const link = document.createElement("a")
    link.href = `${imageUrl}?dl=`
    link.download = title || "image"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

const handleSave = async (e, pin) => {
  e.preventDefault();
  e.stopPropagation();

  if (!user || !user.googleId) {
    alert("Please log in to save pins");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/pins/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        pin,
        userId: user.googleId,
      }),
    });

    const data = await response.json();

    if (!data.success) {
      console.error("Save failed:", data.message);
      alert("Could not save pin.");
      return;
    }

    console.log("Pin saved in MongoDB:", data.pin);

    // Update UI without reload
    pin.save = [...(pin.save || []), { userId: user.googleId }];
    alert("Saved!");

  } catch (err) {
    console.error("Error saving pin:", err);
  }
};

  const handleOpenLink = (e, destination) => {
    e.preventDefault()
    e.stopPropagation()
    if (!destination) return

    console.log(". Opening link:", destination)
    window.open(destination, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="w-full py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto mb-12 text-center">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent mb-4 tracking-tight">
          Discover Creative Ideas
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Explore thousands of inspiring visuals from creators around the world
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="columns-2 sm:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4" style={{ columnGap: "1rem" }}>
          {pins.map((pin) => {
            if (!pin || !pin._id || !pin.imageUrl) {
              console.warn(". Invalid pin detected:", pin)
              return null
            }

            const isLoaded = loadedImages.has(pin._id)
            const isHovered = hoveredPin === pin._id
            const alreadySaved = !!pin?.save?.filter((item) => item.postedBy?._id === user?.googleId)?.length

            return (
              <Link
                key={pin._id}
                to={`/pin-detail/${pin._id}`}
                className="block break-inside-avoid mb-4 group"
                onMouseEnter={() => setHoveredPin(pin._id)}
                onMouseLeave={() => setHoveredPin(null)}
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-100 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                  {!isLoaded && (
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse" />
                  )}

                  <img
                    src={pin.imageUrl || "/placeholder.svg"}
                    alt={pin.title || "Image"}
                    className={`w-full h-auto object-cover transition-all duration-500 ${
                      isLoaded ? "opacity-100" : "opacity-0"
                    } ${isHovered ? "scale-105" : "scale-100"}`}
                    loading="lazy"
                    onLoad={() => handleImageLoad(pin._id)}
                    onError={(e) => {
                      console.error(". Image failed to load:", pin.imageUrl)
                      e.target.src = "/placeholder.svg?height=600&width=400"
                    }}
                  />

                  <div
                    className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}
                  >
                    {/* Top action buttons */}
                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <div className="flex gap-2">
                        {/* Download button */}
                        <button
                          onClick={(e) => handleDownload(e, pin.imageUrl, pin.title)}
                          className="p-2.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200"
                          title="Download image"
                        >
                          <MdDownloadForOffline className="w-5 h-5 text-gray-800" />
                        </button>
                      </div>

                      {/* Save button */}
                      {alreadySaved ? (
                        <button
                          className="bg-red-500 text-white font-bold px-4 py-2 text-sm rounded-full shadow-lg hover:scale-105 transition-all duration-200"
                          title="Already saved"
                        >
                          {pin.save?.length || 1} Saved
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleSave(e, pin)}
                          className="bg-red-500 hover:bg-red-600 text-white font-bold px-4 py-2 text-sm rounded-full shadow-lg hover:scale-105 transition-all duration-200"
                          title="Save pin"
                        >
                          Save
                        </button>
                      )}
                    </div>

                    {/* Bottom info and link button */}
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <div className="flex items-end justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg mb-2 line-clamp-2 drop-shadow-lg text-white">
                            {pin.title || "Untitled"}
                          </h3>
                          <div className="flex items-center gap-2 text-sm">
                            {pin.postedBy?.image ? (
                              <img
                                src={pin.postedBy.image || "/placeholder.svg"}
                                alt={pin.postedBy.userName}
                                className="w-7 h-7 rounded-full border-2 border-white/60 shadow-md"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-white/40 backdrop-blur-sm flex items-center justify-center text-xs font-bold border-2 border-white/60 shadow-md">
                                {pin.isFromAPI ? "U" : pin.postedBy?.userName?.[0] || "?"}
                              </div>
                            )}
                            <span className="text-white font-medium drop-shadow">
                              {pin.postedBy?.userName || (pin.isFromAPI ? "Unsplash" : "Anonymous")}
                            </span>
                          </div>
                        </div>

                        {/* Link to source */}
                        {(pin.destination || pin.isFromAPI) && (
                          <button
                            onClick={(e) => handleOpenLink(e, pin.destination || pin.imageUrl)}
                            className="bg-white/95 backdrop-blur-sm p-2.5 rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 flex-shrink-0"
                            title="Visit source"
                          >
                            <BsFillArrowUpRightCircleFill className="w-5 h-5 text-gray-800" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 text-center">
        <button className="px-8 py-3 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
          Load More Ideas
        </button>
      </div>
    </div>
  )
}

export default LandingGallery
