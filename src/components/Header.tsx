import React from 'react';
import { Palette, Sparkles } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-200 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Palette className="w-8 h-8 text-blue-600" />
              <Sparkles className="w-4 h-4 text-yellow-400 absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">AI Interior Designer</h1>
              <p className="text-xs text-gray-500">Powered by Advanced AI</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <div className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              Pro Plan
            </div>
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;