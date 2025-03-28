"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Pricing() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the section enters viewport, trigger animation
        if (entry.isIntersecting) {
          setIsVisible(true);
        } else {
          // When section leaves viewport, reset animation state
          setIsVisible(false);
        }
      },
      {
        // Start animation when 20% of the section is visible
        threshold: 0.2,
        // This adds a small negative margin to the viewport
        rootMargin: "0px 0px -10% 0px"
      }
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6" id="pricing" ref={sectionRef}>
      <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-16 text-center">
          <h1 className="text-7xl font-bold text-white mb-6 opacity-0" 
              style={{ animation: isVisible ? "fadeIn 0.8s ease-out forwards" : "none" }}>
            Pricing
          </h1>
          <p className="text-2xl text-gray-400 opacity-0"
             style={{ animation: isVisible ? "fadeIn 0.8s ease-out 0.3s forwards" : "none" }}>
            Ready to land your dream job?
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Monthly plan */}
          <div 
            className={`relative flex flex-col rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 p-8 shadow-xl opacity-0 transform translate-y-8`}
            style={{ 
              animation: isVisible ? "cardSlideUp 0.8s ease-out 0.5s forwards" : "none"
            }}
          >
            <div className="flex-grow">
              <h3 className="text-3xl font-bold text-white">Monthly</h3>
              <p className="text-sm text-gray-400">Billed monthly</p>
              
              <div className="my-6">
                <span className="text-6xl font-bold text-white">$60</span>
                <span className="text-xl text-gray-400">/month</span>
              </div>
              
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                  </div>
                  <span className="text-gray-300">50 credits that reset every month</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                  </div>
                  <span className="text-gray-300">Each credit can be used for either solving or debugging a problem</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-16">
              <Link 
                href="/signup" 
                className="block w-full rounded-full bg-yellow-400 py-4 text-center font-semibold text-gray-900 transition-colors hover:bg-yellow-300"
              >
                Subscribe
              </Link>
            </div>
          </div>

          {/* Annual plan */}
          <div 
            className={`relative flex flex-col rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 p-8 shadow-xl opacity-0 transform translate-y-8`}
            style={{ 
              animation: isVisible ? "cardSlideUp 0.8s ease-out 0.8s forwards" : "none"
            }}
          >
            <div className="flex-grow">
              <h3 className="text-3xl font-bold text-white">Annual</h3>
              <p className="text-sm text-gray-400">Billed yearly</p>
              
              <div className="my-6">
                <span className="text-6xl font-bold text-white">$300</span>
                <span className="text-xl text-gray-400">/year</span>
              </div>
              
              <ul className="space-y-5">
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                  </div>
                  <span className="text-gray-300">50 credits every month throughout the year</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                  </div>
                  <span className="text-gray-300">Each credit can be used for either solving or debugging a problem</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white">
                    <span className="h-2 w-2 rounded-full bg-white"></span>
                  </div>
                  <span className="text-gray-300">Best value</span>
                </li>
              </ul>
            </div>
            
            <div className="mt-8">
              <Link 
                href="/signup" 
                className="block w-full rounded-full bg-yellow-400 py-4 text-center font-semibold text-gray-900 transition-colors hover:bg-yellow-300"
              >
                Subscribe
              </Link>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes cardSlideUp {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Add this to prevent animations from showing before scrolling */
        .opacity-0 {
          opacity: 0;
        }
        
        /* For reset animation behavior */
        .reset-animation {
          animation: none !important;
          opacity: 0 !important;
          transform: translateY(30px) !important;
        }
      `}</style>
    </div>
  );
}