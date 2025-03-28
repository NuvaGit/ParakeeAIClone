"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Pricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6" id="pricing">
      <div className="border-t py-12 [border-image:linear-gradient(to_right,transparent,--theme(--color-slate-400/.25),transparent)1] md:py-20">
        {/* Section header */}
        <div className="mx-auto max-w-3xl pb-16 text-center">
          <h1 className="text-7xl font-bold text-white mb-6">
            Pricing
          </h1>
          <p className="text-2xl text-gray-400">
            Ready to land your dream job?
          </p>
        </div>

        {/* Pricing cards */}
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          {/* Monthly plan */}
          <div className="relative flex flex-col rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 p-8 shadow-xl">
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
          <div className="relative flex flex-col rounded-2xl bg-gradient-to-b from-gray-900 to-gray-950 p-8 shadow-xl">
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
    </div>
  );
}