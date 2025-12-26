import React, { useState, useEffect, useRef } from 'react';

const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState('next');
  const timerRef = useRef(null);
  
  const slides = [
    {
      mainTitle: "The World's Best Creators",
      subtitle: "Are On Pixray",
      description: "A comprehensive platform to help hirers and creators navigate the creative world from discovering inspiration, to connecting with one another",
      author: "Hiroa Freshman",
      role: "Featured Creator",
      cta: "Try Pixray Pro",
      images: [
        {
          url: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?auto=format&fit=crop&w=600&q=80",
          top: "12%",
          left: "8%",
          width: "w-44 md:w-56",
          height: "h-56 md:h-72",
          rotate: "-8deg",
          zIndex: "z-10",
          delay: "delay-0"
        },
        {
          url: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=600&q=80",
          top: "18%",
          right: "12%",
          width: "w-48 md:w-60",
          height: "h-60 md:h-76",
          rotate: "5deg",
          zIndex: "z-20",
          delay: "delay-100"
        },
        {
          url: "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?auto=format&fit=crop&w=600&q=80",
          bottom: "15%",
          left: "15%",
          width: "w-40 md:w-52",
          height: "h-52 md:h-68",
          rotate: "-3deg",
          zIndex: "z-30",
          delay: "delay-200"
        },
        {
          url: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=600&q=80",
          bottom: "12%",
          right: "10%",
          width: "w-52 md:w-64",
          height: "h-64 md:h-80",
          rotate: "10deg",
          zIndex: "z-40",
          delay: "delay-300"
        }
      ]
    },
    {
      mainTitle: "Get Your Next",
      subtitle: "Chai Time Snacks Idea",
      description: "Discover delicious snack ideas from creative chefs around the world. Perfect for your tea time inspiration.",
      author: "Food Creative Team",
      role: "Featured Creators",
      cta: "Explore Recipes",
      images: [
        {
          url: "https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80",
          top: "10%",
          left: "10%",
          width: "w-44 md:w-56",
          height: "h-56 md:h-72",
          rotate: "-5deg",
          zIndex: "z-10",
          delay: "delay-0"
        },
        {
          url: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
          top: "20%",
          right: "10%",
          width: "w-48 md:w-60",
          height: "h-60 md:h-76",
          rotate: "4deg",
          zIndex: "z-20",
          delay: "delay-100"
        },
        {
          url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
          bottom: "15%",
          left: "12%",
          width: "w-40 md:w-52",
          height: "h-52 md:h-68",
          rotate: "-2deg",
          zIndex: "z-30",
          delay: "delay-200"
        },
        {
          url: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=600&q=80",
          bottom: "10%",
          right: "8%",
          width: "w-52 md:w-64",
          height: "h-64 md:h-80",
          rotate: "8deg",
          zIndex: "z-40",
          delay: "delay-300"
        }
      ]
    },
    {
      mainTitle: "Discover Amazing",
      subtitle: "Outfit Inspiration",
      description: "Find fashion inspiration from top stylists and designers. Create your perfect look with our curated collection.",
      author: "Fashion Collective",
      role: "Style Experts",
      cta: "Browse Styles",
      images: [
        {
          url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
          top: "12%",
          left: "8%",
          width: "w-44 md:w-56",
          height: "h-56 md:h-72",
          rotate: "-6deg",
          zIndex: "z-10",
          delay: "delay-0"
        },
        {
          url: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=600&q=80",
          top: "18%",
          right: "15%",
          width: "w-48 md:w-60",
          height: "h-60 md:h-76",
          rotate: "3deg",
          zIndex: "z-20",
          delay: "delay-100"
        },
        {
          url: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?auto=format&fit=crop&w=600&q=80",
          bottom: "16%",
          left: "10%",
          width: "w-40 md:w-52",
          height: "h-52 md:h-68",
          rotate: "-4deg",
          zIndex: "z-30",
          delay: "delay-200"
        },
        {
          url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80",
          bottom: "12%",
          right: "6%",
          width: "w-52 md:w-64",
          height: "h-64 md:h-80",
          rotate: "7deg",
          zIndex: "z-40",
          delay: "delay-300"
        }
      ]
    },
    {
      mainTitle: "Transform Your Space",
      subtitle: "With Home Decor Ideas",
      description: "Transform your space with interior design ideas from leading creatives. From modern to classic styles.",
      author: "Design Studio Team",
      role: "Interior Designers",
      cta: "View Designs",
      images: [
        {
          url: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=600&q=80",
          top: "10%",
          left: "6%",
          width: "w-44 md:w-56",
          height: "h-56 md:h-72",
          rotate: "-4deg",
          zIndex: "z-10",
          delay: "delay-0"
        },
        {
          url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
          top: "22%",
          right: "12%",
          width: "w-48 md:w-60",
          height: "h-60 md:h-76",
          rotate: "5deg",
          zIndex: "z-20",
          delay: "delay-100"
        },
        {
          url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
          bottom: "18%",
          left: "14%",
          width: "w-40 md:w-52",
          height: "h-52 md:h-68",
          rotate: "-3deg",
          zIndex: "z-30",
          delay: "delay-200"
        },
        {
          url: "https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=600&q=80",
          bottom: "10%",
          right: "8%",
          width: "w-52 md:w-64",
          height: "h-64 md:h-80",
          rotate: "9deg",
          zIndex: "z-40",
          delay: "delay-300"
        }
      ]
    }
  ];

  const nextSlide = () => {
    if (isAnimating) return;
    setDirection('next');
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
      setIsAnimating(false);
    }, 600);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setDirection('prev');
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
      setIsAnimating(false);
    }, 600);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === activeIndex) return;
    setDirection(index > activeIndex ? 'next' : 'prev');
    setIsAnimating(true);
    setTimeout(() => {
      setActiveIndex(index);
      setIsAnimating(false);
    }, 600);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isAnimating]);

  const currentSlide = slides[activeIndex];
  const nextIndex = (activeIndex + 1) % slides.length;
  const nextSlideData = slides[nextIndex];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-50 via-gray-100 to-gray-50 overflow-hidden transition-all duration-1000">
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-white/50 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white/50 to-transparent"></div>
        
        {/* Grid pattern - very subtle */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000008_1px,transparent_1px),linear-gradient(to_bottom,#00000008_1px,transparent_1px)] bg-[size:40px_40px]"></div>
        </div>
      </div>

      {/* Floating gradient orbs - subtle */}
      <div className="absolute top-1/4 -left-32 w-64 h-64 bg-gradient-to-br from-gray-200/30 via-gray-100/10 to-transparent rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-1/4 -right-32 w-72 h-72 bg-gradient-to-bl from-gray-300/20 via-gray-200/10 to-transparent rounded-full blur-3xl animate-float-delayed"></div>

      {/* Main container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 py-12 md:py-0">
        <div className="max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            {/* Text content section */}
            <div className="relative space-y-8 lg:space-y-10 min-h-[500px] md:min-h-[600px] flex flex-col justify-center">
              {/* Animated text container */}
              <div className="relative overflow-hidden h-auto">
                {/* Current slide text */}
                <div className={`transition-all duration-700 transform ${isAnimating && direction === 'next' ? '-translate-x-full opacity-0' : 'translate-x-0 opacity-100'} ${isAnimating && direction === 'prev' ? 'translate-x-full opacity-0' : ''}`}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                        {currentSlide.mainTitle}
                      </h1>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700 leading-tight">
                        {currentSlide.subtitle}
                      </h2>
                    </div>
                    
                    <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mt-6">
                      {currentSlide.description}
                    </p>
                    
                    <div className="pt-4 space-y-6">
                      <div className="flex items-center space-x-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-xl">
                            {currentSlide.author.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 font-medium">
                            {currentSlide.role}
                          </p>
                          <p className="text-gray-800 font-semibold text-lg">
                            {currentSlide.author}
                          </p>
                        </div>
                      </div>
                      
                      <button className="group relative px-8 py-4 bg-gradient-to-r from-gray-800 to-gray-700 text-white font-semibold rounded-full hover:from-gray-700 hover:to-gray-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 overflow-hidden">
                        <span className="relative z-10">{currentSlide.cta}</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-600 to-gray-500 transform -translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Next slide text (for animation) */}
                {isAnimating && (
                  <div className={`absolute top-0 left-0 w-full transition-all duration-700 transform ${direction === 'next' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'} ${direction === 'prev' ? '-translate-x-full opacity-0' : ''}`}>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight tracking-tight">
                          {nextSlideData.mainTitle}
                        </h1>
                        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-700 leading-tight">
                          {nextSlideData.subtitle}
                        </h2>
                      </div>
                      
                      <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl mt-6">
                        {nextSlideData.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Controls and indicators */}
              <div className="pt-8 border-t border-gray-200/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`relative transition-all duration-300 ${index === activeIndex ? 'w-10' : 'w-2 hover:w-4'} h-2 rounded-full overflow-hidden group`}
                      >
                        <div className={`absolute inset-0 rounded-full transition-all duration-300 ${index === activeIndex ? 'bg-gray-800' : 'bg-gray-300 group-hover:bg-gray-400'}`}></div>
                        {index === activeIndex && (
                          <div className="absolute inset-0 bg-gradient-to-r from-gray-700 to-gray-600 animate-pulse-slow rounded-full"></div>
                        )}
                      </button>
                    ))}
                    
                    <div className="ml-4 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200 shadow-sm">
                      <span className="text-gray-600 text-sm font-medium">
                        <span className="text-gray-800 font-bold">{activeIndex + 1}</span>
                        <span className="text-gray-400 mx-1">/</span>
                        <span>{slides.length}</span>
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={prevSlide}
                      disabled={isAnimating}
                      className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={nextSlide}
                      disabled={isAnimating}
                      className="p-3 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200 shadow-sm hover:shadow-md hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
                    >
                      <svg className="w-5 h-5 text-gray-700 group-hover:text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Images section */}
            <div className="relative h-[500px] md:h-[600px] lg:h-[700px]">
              {/* Current slide images */}
              <div className={`absolute inset-0 transition-all duration-700 ${isAnimating && direction === 'next' ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${isAnimating && direction === 'prev' ? 'opacity-0 scale-105' : ''}`}>
                {currentSlide.images.map((img, index) => (
                  <div
                    key={`current-${index}`}
                    className={`absolute ${img.width} ${img.height} rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 transform ${img.delay} border-4 border-white`}
                    style={{
                      top: img.top,
                      left: img.left || 'auto',
                      right: img.right || 'auto',
                      bottom: img.bottom || 'auto',
                      transform: `rotate(${img.rotate})`,
                      zIndex: img.zIndex
                    }}
                  >
                    <img
                      src={img.url}
                      alt=""
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent"></div>
                  </div>
                ))}
              </div>

              {/* Next slide images (for animation) */}
              {isAnimating && (
                <div className={`absolute inset-0 transition-all duration-700 ${direction === 'next' ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${direction === 'prev' ? 'opacity-100 scale-95' : ''}`}>
                  {nextSlideData.images.map((img, index) => (
                    <div
                      key={`next-${index}`}
                      className={`absolute ${img.width} ${img.height} rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 transform ${img.delay} border-4 border-white`}
                      style={{
                        top: img.top,
                        left: img.left || 'auto',
                        right: img.right || 'auto',
                        bottom: img.bottom || 'auto',
                        transform: `rotate(${img.rotate})`,
                        zIndex: img.zIndex
                      }}
                    >
                      <img
                        src={img.url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/10 to-transparent"></div>
                    </div>
                  ))}
                </div>
              )}

              {/* Container border effect */}
              <div className="absolute inset-0 rounded-3xl border border-gray-200/50 shadow-inner pointer-events-none"></div>
              
              {/* Floating decoration */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/50 to-transparent rounded-full blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-tr from-gray-100/50 to-transparent rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </div>
  );
};

export default HeroSlider;