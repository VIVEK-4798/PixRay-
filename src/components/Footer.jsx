import React from 'react';
import { 
  Instagram, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Sparkles, 
  Briefcase, 
  Heart, 
  Palette,
  Camera,
  Video,
  Code,
  PenTool,
  ChevronDown,
  Globe,
  Shield,
  Users
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 py-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sparkles className="w-6 h-6 text-gray-300" />
                <h3 className="text-2xl font-bold">Stay Creative. Stay Inspired.</h3>
              </div>
              <p className="text-gray-300 max-w-lg">
                Join thousands of creatives getting exclusive content, inspiration, and opportunities delivered to their inbox.
              </p>
            </div>
            <div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent placeholder-gray-400"
                />
                <button className="px-6 py-3 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 rounded-lg font-medium transition-all duration-300 hover:shadow-lg border border-gray-600">
                  Subscribe
                </button>
              </div>
              <p className="text-gray-400 text-sm mt-3">
                By subscribing, you agree to our Privacy Policy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12 border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
            
            {/* Built For Creatives */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-gray-300" />
                Built For Creatives
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Try Pixray Pro
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Find Inspiration
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Get Hired
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Sell Creative Assets
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Sell Freelance Services
                  </a>
                </li>
              </ul>
            </div>

            {/* Find Talent */}
            <div>
              <h4 className="text-lg font-semibold mb-4 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-gray-300" />
                Find Talent
              </h4>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    Post a Job
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <Palette className="w-4 h-4 mr-2 text-gray-400" />
                    Graphic Designers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <Camera className="w-4 h-4 mr-2 text-gray-400" />
                    Photographers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <Video className="w-4 h-4 mr-2 text-gray-400" />
                    Video Editors
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <Code className="w-4 h-4 mr-2 text-gray-400" />
                    Web Designers
                  </a>
                </li>
                <li>
                  <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center group">
                    <PenTool className="w-4 h-4 mr-2 text-gray-400" />
                    Illustrators
                  </a>
                </li>
              </ul>
            </div>

            {/* Pixray Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Pixray</h4>
              <ul className="space-y-3">
                {['About Pixray', 'Portfolio', 'Download the App', 'Blog', 'Careers', 'Help Center', 'Contact Us', 'Popular Search Terms', 'Login'].map((item) => (
                  <li key={item}>
                    <a 
                      href="#" 
                      className="text-gray-300 hover:text-white transition-colors duration-200 hover:pl-2 block"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
              <div className="flex space-x-4 mb-6">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300 border border-gray-700">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300 border border-gray-700">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300 border border-gray-700">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors duration-300 border border-gray-700">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              
              {/* App Download */}
              <div className="mt-8">
                <h5 className="text-sm font-semibold mb-3 text-gray-400">GET THE APP</h5>
                <div className="flex space-x-3">
                  <a href="#" className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg p-3 flex items-center justify-center transition-colors border border-gray-700">
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Download on the</div>
                      <div className="font-semibold">App Store</div>
                    </div>
                  </a>
                  <a href="#" className="flex-1 bg-gray-800 hover:bg-gray-700 rounded-lg p-3 flex items-center justify-center transition-colors border border-gray-700">
                    <div className="text-left">
                      <div className="text-xs text-gray-400">Get it on</div>
                      <div className="font-semibold">Google Play</div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700">
              <h4 className="text-lg font-semibold mb-4">Creative Community</h4>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Projects</span>
                  <span className="text-xl font-bold">10M+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Creatives</span>
                  <span className="text-xl font-bold">2M+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Countries</span>
                  <span className="text-xl font-bold">180+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-300">Views Daily</span>
                  <span className="text-xl font-bold">15M+</span>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <Users className="w-6 h-6 mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-400 text-center">
                  Join the world's largest creative community
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Left */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-gray-700 to-gray-800 rounded-lg flex items-center justify-center border border-gray-600">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold">Pixray</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400 text-sm">Creative Platform</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-400 text-sm">© 2025 Pixray Inc. All rights reserved.</span>
            </div>

            {/* Right - Language & Policies */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              {/* Language Selector */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors border border-gray-700">
                  <Globe className="w-4 h-4" />
                  <span>English</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute bottom-full mb-2 right-0 bg-gray-800 rounded-lg shadow-xl border border-gray-700 py-2 min-w-[150px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  {['English', 'Español', 'Français', 'Deutsch', '日本語', '中文'].map((lang) => (
                    <button key={lang} className="w-full text-left px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700">
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Policy Links */}
              <div className="flex items-center space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Privacy
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Community
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Cookie preferences
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors bg-gradient-to-r from-gray-700/20 to-gray-800/20 px-3 py-1 rounded-full border border-gray-600">
                  Do not sell or share my personal information
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;