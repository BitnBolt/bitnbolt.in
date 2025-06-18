'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex justify-between items-center h-12">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link href="/">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 cursor-pointer">
                  <span className="text-blue-600">Bit</span>nBolt
                </h1>
              </Link>
            </div>
          </div>

          {/* Search Bar - Visible on all devices */}
          <div className="flex flex-1 max-w-sm sm:max-w-xl mx-3 sm:mx-6">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full px-2 sm:px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm"
              />
              <button className="absolute right-1 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-2 sm:px-3 py-0.5 rounded text-xs hover:bg-blue-700 transition-colors">
                <span className="hidden sm:inline">Search</span>
                <span className="sm:hidden">🔍</span>
              </button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Account - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-1 cursor-pointer hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden md:block text-sm">Account</span>
            </div>

            {/* Orders - Hidden on mobile */}
            <div className="hidden sm:flex items-center space-x-1 cursor-pointer hover:text-blue-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <span className="hidden md:block text-sm">Orders</span>
            </div>

            {/* Cart */}
            <div className="flex items-center space-x-1 cursor-pointer hover:text-blue-600 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="hidden sm:block text-sm">Cart</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
            </div>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 p-1"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  {isMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Menu - Desktop */}
        <nav className="hidden sm:flex space-x-6 py-1 border-t border-gray-100">
          <Link href="/" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            Home
          </Link>
          <Link href="/#products" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            All Products
          </Link>
          <Link href="/#custom" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            Custom Made
          </Link>
          <Link href="/#iot" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            IoT Solutions
          </Link>
          <Link href="/#deals" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            Deals
          </Link>
          <Link href="/about" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            About
          </Link>
          <Link href="/testimonials" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            Testimonials
          </Link>
          <Link href="/contact" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            Contact
          </Link>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-100">
              {/* Mobile Account & Orders */}
              <div className="flex space-x-4 pb-3 border-b border-gray-100">
                <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Account</span>
                </a>
                <a href="#" className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  <span>Orders</span>
                </a>
              </div>
              
              {/* Navigation Links */}
              <Link href="/" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Home
              </Link>
              <Link href="/#products" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                All Products
              </Link>
              <Link href="/#custom" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Custom Made
              </Link>
              <Link href="/#iot" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                IoT Solutions
              </Link>
              <Link href="/#deals" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Deals
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                About
              </Link>
              <Link href="/testimonials" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Testimonials
              </Link>
              <Link href="/contact" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 