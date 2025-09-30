'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch cart count
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const res = await fetch('/api/cart');
        if (!res.ok) return;
        const data = await res.json();
        if (mounted) setCartCount(data.items.length);
      } catch {}
    };
    load();
    const handler = () => load();
    window.addEventListener('cart-updated' as any, handler);
    return () => {
      mounted = false;
      window.removeEventListener('cart-updated' as any, handler);
    };
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

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
            <div className="flex items-center bg-white rounded-full shadow-lg border-2 border-gray-300 pl-2 w-full">
              <input
                type="text"
                placeholder="Search products..."
                className="flex-1 px-4 py-2 text-sm bg-transparent border-none rounded-full shadow-none outline-none focus:border-none focus:ring-0 focus:outline-none"
              />
              <button className="ml-2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <span className="hidden sm:inline">Search</span>
              </button>
            </div>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Account Section */}
            {status === 'loading' ? (
              <div className="hidden sm:flex items-center space-x-1">
                <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
              </div>
            ) : session ? (
              <div className="hidden sm:flex items-center space-x-3 relative" ref={dropdownRef}>
                <div 
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      {session.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium">{session.user?.name}</span>
                </div>
                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link 
                      href="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    {/* <Link 
                      href="/orders" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Orders
                    </Link> */}
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/signin"
                className="hidden sm:flex items-center space-x-1 hover:text-blue-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden md:block text-sm">Sign in</span>
              </Link>
            )}

            {/* Orders - Only show if logged in */}
            {session && (
              <Link href="/orders" className="hidden sm:flex items-center space-x-1 hover:text-blue-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden md:block text-sm">Orders</span>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className="flex items-center space-x-1 hover:text-blue-600 relative">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
              <span className="hidden sm:block text-sm">Cart</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center">{cartCount}</span>
            </Link>

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
          <Link href="/product" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            All Products
          </Link>
          <Link href="/#custom" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            Custom Made
          </Link>
          <Link href="/iot-board" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            IoT Board
          </Link>
          <Link href="/software" className="text-gray-700 hover:text-blue-600 px-2 py-1 text-sm font-medium transition-colors">
            Software
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
              {/* Mobile Account Section */}
              {session ? (
                <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-100">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ''}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white">
                      {session.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{session.user?.name}</p>
                    <p className="text-xs text-gray-500">{session.user?.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium border-b border-gray-100"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Sign in</span>
                </Link>
              )}

              {/* Mobile Navigation Links */}
              <Link href="/" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Home
              </Link>
              <Link href="/product" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                All Products
              </Link>
              <Link href="/#custom" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Custom Made
              </Link>
              <Link href="/iot-board" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                IoT Board
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

              {/* Mobile Sign Out Button - Only show if logged in */}
              {session && (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium border-t border-gray-100"
                >
                  Sign out
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}