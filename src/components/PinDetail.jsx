import React, { useState, useEffect } from 'react';
import { 
  MdDownloadForOffline, 
  MdOutlineFavorite, 
  MdFavoriteBorder,
  MdShare,
  MdMoreVert,
  MdCheckCircle,
  MdArrowBack
} from 'react-icons/md';
import { 
  HiOutlineChatBubbleLeftRight,
  HiOutlineBookmark,
  HiBookmark
} from 'react-icons/hi2';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import { FiEye } from 'react-icons/fi';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/setup";
import { doc, updateDoc, arrayUnion, getDoc } from "firebase/firestore";
import MasonryLayout from './MasonryLayout';
import { pinDetailQuery } from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState([]);
  const [pinDetail, setPinDetail] = useState(null);
  const [comment, setComment] = useState('');
  const [addingComment, setAddingComment] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [viewsCount, setViewsCount] = useState(0);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { pinId } = useParams();
  const navigate = useNavigate();

  const fetchPinDetails = async () => {
    try {
      const pinDetail = await pinDetailQuery(pinId);
      if (pinDetail) {
        setPinDetail(pinDetail);
        setIsLiked(pinDetail.likes?.some(like => like.postedBy?._id === user?.googleId) || false);
        setIsSaved(pinDetail.save?.some(save => save.postedBy?._id === user?.googleId) || false);
        setLikesCount(pinDetail.likes?.length || 0);
        setSavesCount(pinDetail.save?.length || 0);
        setViewsCount(pinDetail.views || Math.floor(Math.random() * 1000) + 500);

        // Fetch related pins
        const morePinsQuery = query(
          collection(db, "pins"),
          where("category", "==", pinDetail.category),
          where("__name__", "!=", pinId)
        );
        const querySnapshot = await getDocs(morePinsQuery);
        const morePins = querySnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id
        }));
        setPins(morePins);
      }
    } catch (error) {
      console.error("Error fetching pin details: ", error);
    }
  };

  const addComment = async () => {
    if (comment.trim() && user) {
      setAddingComment(true);
      const pinDocRef = doc(db, "pins", pinId);
      
      try {
        await updateDoc(pinDocRef, {
          comments: arrayUnion({
            comment: comment.trim(),
            _key: uuidv4(),
            postedBy: {
              _id: user.googleId,
              userName: user.name,
              image: user.imageUrl,
            },
            createdAt: new Date().toISOString()
          })
        });
        fetchPinDetails();
        setComment('');
      } catch (error) {
        console.error("Error adding comment: ", error);
      } finally {
        setAddingComment(false);
      }
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert("Please login to like this pin");
      return;
    }
    const pinDocRef = doc(db, "pins", pinId);
    try {
      if (isLiked) {
        // Unlike logic would go here
        setIsLiked(false);
        setLikesCount(prev => prev - 1);
      } else {
        await updateDoc(pinDocRef, {
          likes: arrayUnion({
            postedBy: {
              _id: user.googleId,
              userName: user.name,
              image: user.imageUrl,
            }
          })
        });
        setIsLiked(true);
        setLikesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error updating like: ", error);
    }
  };

  const handleSave = async () => {
    if (!user) {
      alert("Please login to save this pin");
      return;
    }
    const pinDocRef = doc(db, "pins", pinId);
    try {
      if (isSaved) {
        // Unsave logic would go here
        setIsSaved(false);
        setSavesCount(prev => prev - 1);
      } else {
        await updateDoc(pinDocRef, {
          save: arrayUnion({
            postedBy: {
              _id: user.googleId,
              userName: user.name,
              image: user.imageUrl,
            }
          })
        });
        setIsSaved(true);
        setSavesCount(prev => prev + 1);
      }
    } catch (error) {
      console.error("Error updating save: ", error);
    }
  };

  const handleDownload = (e) => {
    e.preventDefault();
    if (pinDetail?.image) {
      const link = document.createElement('a');
      link.href = pinDetail.image;
      link.download = `${pinDetail.title || 'pixray-image'}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: pinDetail?.title,
        text: `Check out this amazing visual on Pixray: ${pinDetail?.title}`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
    setShowShareMenu(false);
  };

  useEffect(() => {
    fetchPinDetails();
  }, [pinId]);

  if (!pinDetail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
        <Spinner message="Loading pin details..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mb-6"
        >
          <MdArrowBack size={20} />
          <span className="font-medium">Back</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Section */}
          <div className="relative">
            <div className="sticky top-6">
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300 shadow-2xl">
                {!imageLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />
                )}
                <img
                  src={pinDetail.image}
                  alt={pinDetail.title}
                  className={`w-full h-auto object-cover transition-all duration-500 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setImageLoaded(true)}
                  onError={(e) => {
                    e.target.src = '/placeholder.svg?height=800&width=600';
                  }}
                />
                
                {/* Image Action Overlay */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <button
                    onClick={handleDownload}
                    className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white hover:scale-110 transition-all duration-200 group"
                    title="Download"
                  >
                    <MdDownloadForOffline className="w-5 h-5 text-gray-800 group-hover:text-gray-900" />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <span className="px-3 py-1.5 bg-black/60 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                      {pinDetail.category || 'Art'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Bar */}
              <div className="mt-6 bg-white rounded-xl p-4 shadow-lg border border-gray-100">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={handleLike}
                        className={`p-2 rounded-full transition-all duration-200 ${isLiked ? 'text-red-500 bg-red-50' : 'text-gray-600 hover:text-red-500 hover:bg-red-50'}`}
                      >
                        {isLiked ? <MdOutlineFavorite size={20} /> : <MdFavoriteBorder size={20} />}
                      </button>
                      <span className="text-gray-900 font-semibold">{likesCount}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Likes</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <button
                        onClick={handleSave}
                        className={`p-2 rounded-full transition-all duration-200 ${isSaved ? 'text-blue-500 bg-blue-50' : 'text-gray-600 hover:text-blue-500 hover:bg-blue-50'}`}
                      >
                        {isSaved ? <HiBookmark size={20} /> : <HiOutlineBookmark size={20} />}
                      </button>
                      <span className="text-gray-900 font-semibold">{savesCount}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Saves</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-2">
                      <FiEye className="w-5 h-5 text-gray-600" />
                      <span className="text-gray-900 font-semibold">{viewsCount}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Views</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            {/* Title and Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                    {pinDetail.title}
                  </h1>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {pinDetail.about || 'No description provided'}
                  </p>
                </div>
                
                <div className="relative ml-4">
                  <button
                    onClick={() => setShowShareMenu(!showShareMenu)}
                    className="p-3 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <MdShare size={20} className="text-gray-600" />
                  </button>
                  
                  {showShareMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10">
                      <button
                        onClick={handleShare}
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                      >
                        <MdShare size={18} className="text-gray-600" />
                        <span className="text-gray-700 font-medium">Share</span>
                      </button>
                      {pinDetail.destination && (
                        <a
                          href={pinDetail.destination}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 flex items-center space-x-3"
                        >
                          <BsFillArrowUpRightCircleFill size={18} className="text-gray-600" />
                          <span className="text-gray-700 font-medium">Visit Source</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Author Info */}
              <Link 
                to={`/user-profile/${pinDetail.postedBy?._id}`}
                className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <div className="relative">
                  <img
                    src={pinDetail.postedBy?.image || user?.imageUrl}
                    alt={pinDetail.postedBy?.userName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-gray-800 to-gray-900 rounded-full flex items-center justify-center">
                    <MdCheckCircle className="w-4 h-4 text-white" />
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 group-hover:text-gray-800">
                    {pinDetail.postedBy?.userName || 'Anonymous Creator'}
                  </h3>
                  <p className="text-sm text-gray-500">Creator</p>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            </div>

            {/* Comments Section */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Comments</h2>
                <div className="flex items-center space-x-2 text-gray-600">
                  <HiOutlineChatBubbleLeftRight size={20} />
                  <span className="font-medium">{pinDetail.comments?.length || 0}</span>
                </div>
              </div>

              {/* Comments List */}
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {pinDetail.comments?.length > 0 ? (
                  pinDetail.comments.map((comment, i) => (
                    <div key={i} className="flex space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                      <img
                        src={comment.postedBy.image}
                        alt={comment.postedBy.userName}
                        className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900">
                            {comment.postedBy.userName}
                          </h4>
                          <span className="text-xs text-gray-500">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-gray-700">{comment.comment}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <HiOutlineChatBubbleLeftRight className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No comments yet. Be the first to comment!</p>
                  </div>
                )}
              </div>

              {/* Add Comment */}
              {user ? (
                <div className="mt-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={user.imageUrl}
                      alt={user.name}
                      className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addComment()}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent placeholder-gray-400"
                      />
                    </div>
                    <button
                      onClick={addComment}
                      disabled={addingComment || !comment.trim()}
                      className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${addingComment || !comment.trim() ? 'bg-gray-300 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800 text-white hover:shadow-lg'}`}
                    >
                      {addingComment ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Posting...</span>
                        </div>
                      ) : (
                        'Post'
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl text-center">
                  <p className="text-gray-600 mb-3">Login to join the conversation</p>
                  <Link
                    to="/login"
                    className="inline-block px-6 py-2 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Pins */}
        {pins.length > 0 && (
          <div className="mt-16">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                More <span className="bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">Like This</span>
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover more amazing content in the {pinDetail.category} category
              </p>
            </div>
            <MasonryLayout pins={pins} />
          </div>
        )}
      </div>

      {/* Floating Action Buttons (Mobile) */}
      <div className="fixed bottom-6 right-6 lg:hidden">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleLike}
            className={`p-4 rounded-full shadow-lg transition-all duration-200 ${isLiked ? 'bg-red-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
          >
            {isLiked ? <MdOutlineFavorite size={24} /> : <MdFavoriteBorder size={24} />}
          </button>
          <button
            onClick={handleSave}
            className={`p-4 rounded-full shadow-lg transition-all duration-200 ${isSaved ? 'bg-blue-500 text-white' : 'bg-white text-gray-900 hover:bg-gray-100'}`}
          >
            {isSaved ? <HiBookmark size={24} /> : <HiOutlineBookmark size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PinDetail;