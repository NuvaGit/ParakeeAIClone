"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/firebase/auth";
import Logo from "./logo";
import { usePathname } from 'next/navigation';

export default function Header() {
  const { user } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  
  // Hide header on dashboard routes
  const isDashboardRoute = pathname?.startsWith('/dashboard');
  
  if (isDashboardRoute) {
    return null; // Don't render the header at all for dashboard routes
  }

  useEffect(() => {
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
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ease-in-out ${
        isScrolled 
          ? "py-2 backdrop-blur-lg" 
          : "mt-2 md:mt-5"
      }`}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div 
          className={`relative flex h-14 items-center justify-between gap-3 rounded-2xl px-3 
            before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border 
            before:border-transparent before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] 
            after:absolute after:inset-0 after:-z-10 after:backdrop-blur-xs
            transition-all duration-300 ease-in-out ${
              isScrolled 
                ? "bg-gray-900/95 before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] shadow-lg" 
                : "bg-gray-900/90 before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box]"
            }`}
        >
          {/* Site branding */}
          <div className="flex flex-1 items-center">
            <Logo />
            <span className="ml-3 text-lg font-semibold text-gray-200">Interview Ace AI</span>
          </div>

          {/* Desktop navigation */}
          <nav className="flex">
            <ul className="flex items-center gap-4">
              <li>
                <Link 
                  href="/#workflows" 
                  className="text-sm text-indigo-200/65 hover:text-indigo-300 transition-colors duration-200"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link 
                  href="/#pricing" 
                  className="text-sm text-indigo-200/65 hover:text-indigo-300 transition-colors duration-200"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link 
                  href="/#interviewer" 
                  className="text-sm text-indigo-200/65 hover:text-indigo-300 transition-colors duration-200"
                >
                  Interview Coder
                </Link>
              </li>
            </ul>
          </nav>

          {/* Desktop sign in links or dashboard link */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            {user ? (
              <li>
                <Link
                  href="/dashboard"
                  className={`btn-sm bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white 
                    shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] transition-all duration-300 ${
                      isScrolled ? "hover:scale-105" : ""
                    }`}
                >
                  Dashboard
                </Link>
              </li>
            ) : (
              <>
                <li>
                  <Link
                    href="/signin"
                    className={`btn-sm relative bg-linear-to-b from-gray-800 to-gray-800/60 bg-[length:100%_100%] bg-[bottom] py-[5px] text-gray-300 
                      before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent 
                      before:[background:linear-gradient(to_right,var(--color-gray-800),var(--color-gray-700),var(--color-gray-800))_border-box] 
                      before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] 
                      hover:bg-[length:100%_150%] transition-all duration-300`}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/signup"
                    className={`btn-sm bg-linear-to-t from-indigo-600 to-indigo-500 bg-[length:100%_100%] bg-[bottom] py-[5px] text-white 
                      shadow-[inset_0px_1px_0px_0px_--theme(--color-white/.16)] hover:bg-[length:100%_150%] transition-all duration-300 ${
                        isScrolled ? "hover:scale-105" : ""
                      }`}
                  >
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}