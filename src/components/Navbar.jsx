import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { IoMdAdd, IoMdSearch, IoMdClose, IoMdFunnel } from "react-icons/io"
import { BiChevronDown, BiChevronRight } from "react-icons/bi"
import { fetchUser } from "../utils/fetchUser"
import { categories } from "../utils/data"

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState("Recommended")
  const [activeTab, setActiveTab] = useState("images")

  const navigate = useNavigate()
  const location = useLocation()

  if (!user) return null
  const userInfo = fetchUser()

  // Format category name for display
  const formatCategoryName = (name) => {
    return name.charAt(0).toUpperCase() + name.slice(1)
  }

  // detect active category from URL (/category/:name)
  const activeCategoryFromPath = () => {
    const match = location.pathname.match(/^\/category\/([^/]+)/)
    return match ? match[1] : null
  }
  const activeCategory = activeCategoryFromPath()

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="max-w-full px-4 py-4">
        {/* Category Buttons with Images */}
        <div className="flex items-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {categories.slice(0, categories.length - 1).map((category) => {
            const isActive = activeCategory === category.name
            return (
              <Link
                key={category.name}
                to={`/category/${category.name}`}
                onClick={() => {
                  // optional: reset search / ui state when category clicked
                  setSelectedFilter("Recommended")
                  setActiveTab("images")
                }}
                className={`relative group flex-shrink-0 w-56 h-18 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] ${
                  isActive ? "ring-2 ring-amber-400" : ""
                }`}
                style={{
                  backgroundImage: `url(${category.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark Overlay for better text visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 group-hover:from-black/70 group-hover:via-black/50 group-hover:to-black/30 transition-all duration-300"></div>

                {/* Text Container */}
                <div className="relative h-full flex items-center justify-center p-4">
                  <span className="text-white font-bold text-lg text-center drop-shadow-lg">
                    {formatCategoryName(category.name)}
                  </span>
                </div>

                {/* Hover Effect Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </Link>
            )
          })}

          {/* Arrow button to show more categories */}
          <button
            className="flex items-center justify-center w-14 h-20 rounded-xl border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 ml-2 flex-shrink-0 group"
            onClick={() => {
              // scroll to end or navigate to categories page
              navigate("/categories")
            }}
            aria-label="More categories"
          >
            <BiChevronRight size={28} className="text-gray-600 group-hover:text-gray-800 transition-colors" />
          </button>
        </div>
      </div>

      {/* Mobile User Profile */}
      <div className="md:hidden mt-4 px-4 pt-4 border-t border-gray-200">
        <Link to={`user-profile/${userInfo.googleId}`} className="flex items-center space-x-3">
          <img
            src={user.imageUrl || "/placeholder.svg"}
            alt={`${user.name}'s profile`}
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
          />
          <div>
            <p className="text-gray-900 font-medium">{user.name}</p>
            <p className="text-sm text-gray-500">View Profile</p>
          </div>
        </Link>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes slideInFromTop {
          0% {
            transform: translateY(-10px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-in {
          animation: slideInFromTop 0.2s ease-out;
        }

        /* Hide scrollbar for categories */
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

export default Navbar
