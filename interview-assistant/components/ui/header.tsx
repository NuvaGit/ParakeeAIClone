"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/firebase/auth";
import Logo from "./logo";
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  // Hide header on dashboard routes
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  
  useEffect(() => {
    // Skip the effect logic if on dashboard route
    if (isDashboardRoute) return;
    
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isDashboardRoute]);

  // Close mobile menu when changing routes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Only return null AFTER all hooks have been called
  if (isDashboardRoute) {
    return null;
  }

  // Smooth scroll to section function with offset
  const scrollToSection = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) {
      // Get the element's position
      const elementRect = element.getBoundingClientRect();
      const absoluteElementTop = elementRect.top + window.pageYOffset;
      
      // Calculate a position that's partway down the element (middle of the section)
      // Adjust the offset percentage (0.2 means 20% down from the top of the section)
      const offset = elementRect.height * 0.2;
      const scrollPosition = absoluteElementTop - (window.innerHeight / 3) + offset;
      
      // Scroll to the adjusted position
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleNavLinkClick = (e: React.MouseEvent, targetId: string) => {
    // Only handle special case for home page sections
    if (pathname === '/') {
      e.preventDefault();
      scrollToSection(targetId);
    }
  };

  const navItems = [
    {
      name: 'Features',
      href: '/#features', 
      targetId: 'features'
    },
    {
      name: 'Pricing',
      href: '/#pricing',
      targetId: 'pricing'
    },
    {
      name: 'Interview Coder',
      href: '/#interviewer',
      targetId: 'interviewer'
    }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled 
          ? "py-2 backdrop-blur-lg bg-gray-900/90" 
          : "mt-2 md:mt-5"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div 
          className={`flex items-center justify-between rounded-xl transition-all duration-300 ${
            isScrolled 
              ? "h-16 shadow-lg border border-gray-700/50" 
              : "h-16 border border-gray-700/30"
          } bg-gray-800/90 backdrop-blur-sm px-4`}
        >
          {/* Site branding */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="flex items-center"
              onClick={(e) => {
                if (pathname === '/') {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
            >
              <Logo />
              <span className="ml-3 text-lg font-semibold text-white hidden sm:inline-block">
                Interview Ace AI
              </span>
              <span className="ml-2 text-lg font-semibold text-white sm:hidden">
                IA AI
              </span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <ul className="flex items-center space-x-6">
              <li>
                <Link 
                  href="/#features" 
                  className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-700/50"
                  onClick={(e) => handleNavLinkClick(e, "features")}
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/#pricing" 
                  className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-700/50"
                  onClick={(e) => handleNavLinkClick(e, "pricing")}
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/#interviewer" 
                  className="text-sm font-medium text-gray-300 hover:text-indigo-400 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-700/50"
                  onClick={(e) => handleNavLinkClick(e, "interviewer")}
                >
                  Interview Coder
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop sign in links or dashboard link */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <Link
                href="/dashboard"
                className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 font-medium text-sm"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="text-sm font-medium text-gray-300 hover:text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors duration-200"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="bg-gradient-to-r from-indigo-600 to-indigo-500 text-white px-4 py-2 rounded-md hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 font-medium text-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-800 border-t border-gray-700">
          <div className="space-y-1 px-4 py-3">
            <Link
              href="/#features"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={(e) => handleNavLinkClick(e, "features")}
            >
              Features
            </Link>
            <Link
              href="/#pricing"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={(e) => handleNavLinkClick(e, "pricing")}
            >
              Pricing
            </Link>
            <Link
              href="/#interviewer"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
              onClick={(e) => handleNavLinkClick(e, "interviewer")}
            >
              Interview Coder
            </Link>
            <div className="pt-4 pb-3 border-t border-gray-700">
              {user ? (
                <Link
                  href="/dashboard"
                  className="block w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md font-medium transition-colors duration-200"
                >
                  Dashboard
                </Link>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/signin"
                    className="block text-center text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md transition-colors duration-200"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="block text-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md font-medium transition-colors duration-200"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}