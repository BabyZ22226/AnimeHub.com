import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Film, Compass, BookMarked } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';

export const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black/95 shadow-lg' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <Film className="w-8 h-8 text-red-600" />
              <span className="text-white font-bold text-xl">AnimeHub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/browse" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <Compass className="w-4 h-4" />
              Browse
            </Link>
            <Link to="/lists" className="text-gray-300 hover:text-white transition-colors flex items-center gap-2">
              <BookMarked className="w-4 h-4" />
              Lists
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <LanguageSelector />
            <button
              className="md:hidden text-gray-300 hover:text-white p-2 rounded-full transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/browse"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Browse
            </Link>
            <Link
              to="/lists"
              className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
            >
              Lists
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};