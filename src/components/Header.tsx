'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';
import HeaderAuthSkeleton from '@/components/skeletons/HeaderAuthSkeleton';
import HeaderSearch from '@/components/HeaderSearch';
import { getCartItems, getCartUnitCount } from '@/lib/client-cart';

const desktopNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/product', label: 'Shop IoT Products' },
  { href: '/iot-board', label: 'IoT DIY Kit' },
  { href: '/firmware', label: 'Firmware' },
  { href: '/pcb', label: 'Custom PCB' },
  { href: '/about', label: 'About' },
] as const;

const mobileNavLinks = [
  { href: '/', label: 'Home' },
  { href: '/product', label: 'All Products' },
  { href: '/pcb', label: 'Custom PCB' },
  { href: '/firmware', label: 'Firmware' },
  { href: '/iot-board', label: 'IoT DIY Kit' },
  { href: '/about', label: 'About' },
] as const;

function isActivePath(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

interface HeaderProps {
  forceWhite?: boolean;
}

export default function Header({ forceWhite = false }: HeaderProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { data: session, status } = useSession();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [cartCount, setCartCount] = useState<number>(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const desktopLinkClass = (href: string) => {
    const active = isActivePath(pathname, href);
    if (active) {
      return isScrolled
        ? 'text-blue-600 px-2 py-1 text-sm font-semibold border-b-2 border-blue-600'
        : 'text-[#FFD166] px-2 py-1 text-sm font-semibold border-b-2 border-[#FFD166]';
    }
    return `hover:text-blue-500 px-2 py-1 text-sm font-medium transition-colors border-b-2 border-transparent ${
      isScrolled ? 'text-gray-700' : 'text-gray-100'
    }`;
  };

  const mobileLinkClass = (href: string) => {
    const active = isActivePath(pathname, href);
    if (active) {
      return 'text-blue-600 bg-blue-50 border-l-2 border-blue-600 block px-3 py-1.5 text-sm font-semibold';
    }
    return 'text-gray-700 hover:text-blue-600 block px-3 py-1.5 text-sm font-medium border-l-2 border-transparent';
  };

  // Handle scroll event for header transparency
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(forceWhite || window.scrollY > 20);
    };
    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [forceWhite]);

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

  // Fetch cart count (works for guests via localStorage + resolve API)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const isAuthenticated = status === 'authenticated';
        if (status === 'loading') return;
        const items = await getCartItems(isAuthenticated);
        if (mounted) setCartCount(getCartUnitCount(items));
      } catch { }
    };
    load();
    const handler = () => load();
    window.addEventListener('cart-updated' as keyof WindowEventMap, handler);
    return () => {
      mounted = false;
      window.removeEventListener('cart-updated' as keyof WindowEventMap, handler);
    };
  }, [status]);

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' });
  };

  return (
    <header className={`fixed inset-x-0 top-0 z-50 w-full transition-all duration-300 ${isScrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-transparent border-transparent'}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        {/* Main Header */}
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center shrink-0">
            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <span className="bg-white rounded-md sm:rounded-lg p-0.5 sm:p-1 shadow-sm ring-1 ring-black/5 shrink-0 transition-shadow group-hover:shadow-md">
                <Image
                  src="/icon.png"
                  alt=""
                  width={36}
                  height={36}
                  className="h-7 w-7 sm:h-9 sm:w-9 object-contain"
                  priority
                />
              </span>
              {/* <span
                className={`text-xl sm:text-2xl font-bold transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}
              >
                <span className="text-blue-500">Bit</span>nBolt
              </span> */}
            </Link>
          </div>

          {/* Search Bar - Algolia */}
          <HeaderSearch isScrolled={isScrolled} />

          {/* Right Side Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-4">
            {/* Account Section */}
            {status === 'loading' ? (
              <HeaderAuthSkeleton />
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
                  <span className={`hidden md:block text-sm font-medium transition-colors ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                    {session.user?.name}
                  </span>
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
                className={`hidden sm:flex items-center space-x-1 hover:text-blue-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden md:block text-sm">Sign in</span>
              </Link>
            )}

            {/* Orders - Only show if logged in */}
            {session && (
              <Link href="/orders" className={`hidden sm:flex items-center space-x-1 hover:text-blue-500 transition-colors ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="hidden md:block text-sm">Orders</span>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart" className={`flex items-center space-x-1 hover:text-blue-500 relative transition-colors p-1 ${isScrolled ? 'text-gray-700' : 'text-white'}`}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 1116 0 2 2 0 01-4 0z" />
              </svg>
              <span className="hidden sm:block text-sm">Cart</span>
              <span className="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 bg-red-500 text-white text-xs rounded-full min-w-4 h-4 px-1 flex items-center justify-center border border-white">{cartCount}</span>
            </Link>

            {/* Mobile menu button */}
            <div className="sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`focus:outline-none focus:text-blue-500 p-1 transition-colors ${isScrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-gray-200'}`}
                aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
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
        <nav className={`hidden sm:flex space-x-6 py-1 border-t transition-colors duration-300 ${isScrolled ? 'border-gray-100' : 'border-white/10'}`}>
          {desktopNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={isActivePath(pathname, link.href) ? 'page' : undefined}
              className={desktopLinkClass(link.href)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://career.bitnbolt.in/"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-blue-500 px-2 py-1 text-sm font-medium transition-colors border-b-2 border-transparent ${isScrolled ? 'text-gray-700' : 'text-gray-100'}`}
          >
            Career
          </a>
          <a
            href="https://career.bitnbolt.in/cap"
            target="_blank"
            rel="noopener noreferrer"
            className={`hover:text-blue-500 px-2 py-1 text-sm font-medium transition-colors border-b-2 border-transparent ${isScrolled ? 'text-gray-700' : 'text-gray-100'}`}
          >
            CAP
          </a>
        </nav>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="px-2 pt-1.5 pb-2 space-y-0.5 bg-white border-t border-gray-100">
              {/* Mobile Account Section */}
              {session ? (
                <div className="flex items-center space-x-3 px-3 py-2 border-b border-gray-100">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image}
                      alt={session.user.name || ''}
                      width={28}
                      height={28}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm">
                      {session.user?.name?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/auth/signin"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-1.5 text-sm font-medium border-b border-gray-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Sign in</span>
                </Link>
              )}

              {session && (
                <>
                  <Link
                    href="/profile"
                    aria-current={isActivePath(pathname, '/profile') ? 'page' : undefined}
                    className={mobileLinkClass('/profile')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="/orders"
                    aria-current={isActivePath(pathname, '/orders') ? 'page' : undefined}
                    className={mobileLinkClass('/orders')}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Orders
                  </Link>
                </>
              )}

              {/* Mobile Navigation Links */}
              {mobileNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActivePath(pathname, link.href) ? 'page' : undefined}
                  className={mobileLinkClass(link.href)}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/#custom"
                className="text-gray-700 hover:text-blue-600 block px-3 py-1.5 text-sm font-medium border-l-2 border-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Custom Made
              </Link>
              <Link
                href="/#deals"
                className="text-gray-700 hover:text-blue-600 block px-3 py-1.5 text-sm font-medium border-l-2 border-transparent"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              <a
                href="https://career.bitnbolt.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 block px-3 py-1.5 text-sm font-medium"
              >
                Career
              </a>
              <a
                href="https://career.bitnbolt.in/cap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-700 hover:text-blue-600 block px-3 py-1.5 text-sm font-medium"
              >
                CAP
              </a>

              {/* Mobile Sign Out Button - Only show if logged in */}
              {session && (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left text-gray-700 hover:text-blue-600 px-3 py-1.5 text-sm font-medium border-t border-gray-100 mt-0.5"
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