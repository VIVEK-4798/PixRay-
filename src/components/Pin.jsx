import { useState } from "react"
import { getFirestore, deleteDoc, updateDoc, arrayUnion, doc } from "firebase/firestore"
import { useNavigate, Link } from "react-router-dom"
import { v4 as uuidv4 } from "uuid"
import { MdDownloadForOffline } from "react-icons/md"
import { AiTwotoneDelete } from "react-icons/ai"
import { BsFillArrowUpRightCircleFill } from "react-icons/bs"
import { fetchUser } from "../utils/fetchUser"

const db = getFirestore()

const Pin = ({ pin }) => {
  const { postedBy, imageUrl, _id, id, save, destination, image } = pin
  const pinId = _id || id

  const imageSrc = image || imageUrl || image?.url || imageUrl?.url || ""

  const [postHovered, setPostHovered] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = fetchUser()

  const alreadySaved = !!pin?.save?.filter((item) => item.postedBy?._id === user.googleId)?.length

  const savePin = async (id) => {
    if (!user || !user.googleId) {
      console.error("Required data is missing. Check user and postedBy properties.")
      return
    }

    const pinRef = doc(db, "pins", id)

    try {
      await updateDoc(pinRef, {
        save: arrayUnion({
          _key: uuidv4(),
          userId: user.googleId,
        }),
      })
      window.location.reload()
    } catch (error) {
      console.error("Error saving post: ", error)
    }
  }

  const deletePin = async (id) => {
    try {
      const pinRef = doc(db, "pins", id)
      await deleteDoc(pinRef)
      window.location.reload()
    } catch (error) {
      console.error("Error deleting pin:", error)
    }
  }

  const handleDownload = (e) => {
    e.stopPropagation()
    if (!imageSrc) return
    const link = document.createElement("a")
    link.href = `${imageSrc}?dl=`
    link.download = "image"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleOpenDestination = (e) => {
    e.stopPropagation()
    if (!destination) return
    window.open(destination, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="m-2">
      <Link
        to={`/pin-detail/${pinId}`}
        className="relative cursor-zoom-in w-auto rounded-2xl overflow-hidden transition-all duration-300 ease-in-out block group"
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
      >
        <div className="relative overflow-hidden rounded-2xl shadow-md group-hover:shadow-2xl transition-shadow duration-300">
          {imageSrc ? (
            <img
              className="rounded-2xl w-full transform group-hover:scale-105 transition-transform duration-500"
              alt="user-post"
              src={imageSrc || "/placeholder.svg"}
              onLoad={() => setLoading(false)}
              style={{
                opacity: loading ? 0.5 : 1,
                transition: "opacity 0.3s ease-in-out",
              }}
            />
          ) : (
            <div className="w-full h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse rounded-2xl" />
          )}

          {postHovered && (
            <div
              className="absolute top-0 w-full h-full flex flex-col justify-between p-3 z-50 bg-gradient-to-t from-black/60 via-black/20 to-transparent"
              style={{ height: "100%" }}
            >
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="bg-white/95 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center text-dark text-xl opacity-90 hover:opacity-100 hover:scale-110 hover:shadow-lg outline-none transition-all duration-200"
                    title="Download image"
                  >
                    <MdDownloadForOffline />
                  </button>
                </div>
                {alreadySaved ? (
                  <button
                    type="button"
                    className="bg-red-500 opacity-90 hover:opacity-100 text-white font-bold px-5 py-2 text-base rounded-full hover:shadow-lg hover:scale-105 outline-none transition-all duration-200"
                  >
                    {save?.length} Saved
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      savePin(pinId)
                    }}
                    className="bg-red-500 opacity-90 hover:opacity-100 text-white font-bold px-5 py-2 text-base rounded-full hover:shadow-lg hover:scale-105 outline-none transition-all duration-200"
                  >
                    Save
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center gap-2 w-full">
                {destination && (
                  <button
                    type="button"
                    onClick={handleOpenDestination}
                    className="bg-white/95 backdrop-blur-sm flex items-center gap-2 text-black font-semibold p-2 pl-4 pr-4 rounded-full opacity-90 hover:opacity-100 hover:scale-105 hover:shadow-lg transition-all duration-200"
                    title="Visit source"
                  >
                    <BsFillArrowUpRightCircleFill />
                    <span className="text-sm">
                      {destination.length > 15 ? `${destination.slice(0, 15)}...` : destination}
                    </span>
                  </button>
                )}
                {postedBy?._id === user.googleId && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      deletePin(pinId)
                    }}
                    className="bg-white/95 backdrop-blur-sm p-2 opacity-90 hover:opacity-100 hover:scale-110 text-red-600 font-bold text-xl rounded-full hover:shadow-lg outline-none transition-all duration-200"
                    title="Delete pin"
                  >
                    <AiTwotoneDelete />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="flex justify-between mt-3 items-center">
        <Link
          to={`user-profile/${postedBy?._id}`}
          className="flex gap-2 items-center hover:opacity-80 transition-opacity"
        >
          <img
            className="w-9 h-9 rounded-full object-cover border-2 border-gray-100 shadow-sm"
            src={
              postedBy?.image ||
              "https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o=" ||
              "/placeholder.svg"
            }
            alt="user-profile"
          />
          <p className="font-semibold capitalize text-gray-800">{postedBy?.userName}</p>
        </Link>
        {postedBy?._id === user.googleId && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              deletePin(pinId)
            }}
            className="max-sm:block hidden bg-red-50 p-2 opacity-70 hover:opacity-100 text-red-600 font-bold text-base rounded-full hover:shadow-md outline-none transition-all duration-200"
          >
            <AiTwotoneDelete />
          </button>
        )}
      </div>
    </div>
  )
}

export default Pin
