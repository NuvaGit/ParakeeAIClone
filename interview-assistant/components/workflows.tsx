"use client";  

import { useEffect, useRef, useState } from "react"; 
import Image from "next/image"; 
import WorflowImg01 from "@/public/images/workflow-01.png"; 
import WorflowImg02 from "@/public/images/workflow-02.png"; 
import WorflowImg03 from "@/public/images/workflow-03.png"; 
import Spotlight from "@/components/spotlight";  

export default function Workflows() {  
  const sectionRef = useRef<HTMLElement>(null);  
  // Track if section is currently in view
  const [isInView, setIsInView] = useState<boolean>(false);
  // Individual animation states for each card
  const [cardStates, setCardStates] = useState<boolean[]>([false, false, false]);
  
  useEffect(() => {
    const observerOptions = {  
      root: null, // Use the viewport as the root  
      rootMargin: '-50px 0px',  // Slightly tighter margin so animation triggers at a better scroll position
      threshold: 0.15  // Single threshold for simpler triggering
    };  
     
    const handleIntersection = (entries: IntersectionObserverEntry[]) => {  
      entries.forEach(entry => {  
        // Set overall section visibility state
        setIsInView(entry.isIntersecting);
        
        if (entry.isIntersecting) {  
          // When section comes into view, animate cards in sequence
          // First reset all cards to ensure animation restarts
          setCardStates([false, false, false]);
          
          // Then trigger animations with delays
          setTimeout(() => {
            setCardStates(prev => [true, prev[1], prev[2]]);
            
            setTimeout(() => {
              setCardStates(prev => [prev[0], true, prev[2]]);
              
              setTimeout(() => {
                setCardStates(prev => [prev[0], prev[1], true]);
              }, 200);
            }, 200);
          }, 100);
        } else {
          // When section goes out of view, reset all cards to initial state
          setCardStates([false, false, false]);
        }
      });  
    };  
     
    const observer = new IntersectionObserver(handleIntersection, observerOptions);  
     
    if (sectionRef.current) {  
      observer.observe(sectionRef.current);  
    }  
         
    return () => {  
      if (sectionRef.current) {  
        observer.unobserve(sectionRef.current);  
      }
    };  
  }, []);

  // Card data  
  const cards = [  
    {  
      image: WorflowImg01,  
      alt: "Workflow 01",  
      title: "AI-Powered Prep",  
      description: "Seamlessly get real-time AI-generated answers during interviews, directly in your overlay"  
    },  
    {  
      image: WorflowImg02,  
      alt: "Workflow 02",  
      title: "Instant Responses",  
      description: "AI listens, understands, and provides the best possible answers instantly—no delays, no stress."  
    },  
    {  
      image: WorflowImg03,  
      alt: "Workflow 03",  
      title: "Undetectable & Smart",  
      description: "Designed to be invisible yet powerful, ensuring you ace any interview without breaking a sweat."  
    }  
  ];  
 
  return (  
    <section id="workflows" ref={sectionRef} className="relative py-20">  
      <div className="mx-auto max-w-6xl px-4 sm:px-6">  
        <div className="pb-12 md:pb-20">  
          {/* Section header */}  
          <div className={`mx-auto max-w-3xl pb-12 text-center md:pb-20 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
               style={{ transitionDelay: '150ms' }}>  
            <div className="inline-flex items-center gap-3 pb-3 before:h-px before:w-8 before:bg-linear-to-r before:from-transparent before:to-indigo-200/50 after:h-px after:w-8 after:bg-linear-to-l after:from-transparent after:to-indigo-200/50">  
              <span className="inline-flex bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">  
                AI-Powered Interview Assistance  
              </span>  
            </div>  
            <h2 className="animate-[gradient_6s_linear_infinite] bg-[linear-gradient(to_right,var(--color-gray-200),var(--color-indigo-200),var(--color-gray-50),var(--color-indigo-300),var(--color-gray-200))] bg-[length:200%_auto] bg-clip-text pb-4 font-nacelle text-3xl font-semibold text-transparent md:text-4xl">  
              Get the Right Answers, Instantly  
            </h2>  
            <p className="text-lg text-indigo-200/65">  
              Our seamless AI overlay listens to interview questions and provides real-time, precise answers—ensuring you impress every time. Stay ahead effortlessly.  
            </p>  
          </div>  
                   
          {/* Cards section with spotlight effect */}  
          <Spotlight className="group mx-auto grid max-w-sm items-start gap-6 lg:max-w-none lg:grid-cols-3">  
            {cards.map((card, index) => (  
              <a  
                key={index}  
                className={`  
                  group/card relative h-full overflow-hidden rounded-2xl bg-gray-800 p-px  
                   before:pointer-events-none before:absolute before:-left-40 before:-top-40 before:z-10 before:h-80 before:w-80  
                   before:translate-x-[var(--mouse-x)] before:translate-y-[var(--mouse-y)] before:rounded-full  
                   before:bg-indigo-500/80 before:opacity-0 before:blur-3xl before:transition-opacity before:duration-500  
                   after:pointer-events-none after:absolute after:-left-48 after:-top-48 after:z-30 after:h-64 after:w-64  
                   after:translate-x-[var(--mouse-x)] after:translate-y-[var(--mouse-y)] after:rounded-full  
                   after:bg-indigo-500 after:opacity-0 after:blur-3xl after:transition-opacity after:duration-500  
                   hover:after:opacity-20 group-hover:before:opacity-100  
                  transition-all duration-700  
                  ${cardStates[index]  
                     ? 'opacity-100 translate-y-0'  
                     : 'opacity-0 translate-y-12'}  
                `}  
                href="#0"  
                style={{  
                   transitionDelay: `${index * 150}ms`  
                }}  
              >  
                <div className="relative z-20 h-full overflow-hidden rounded-[inherit] bg-gray-950 after:absolute after:inset-0 after:bg-linear-to-br after:from-gray-900/50 after:via-gray-800/25 after:to-gray-900/50">  
                  {/* Arrow */}  
                  <div  
                    className="absolute right-6 top-6 flex h-8 w-8 items-center justify-center rounded-full border border-gray-700/50 bg-gray-800/65 text-gray-200 opacity-0 transition-opacity group-hover/card:opacity-100"  
                    aria-hidden="true"  
                  >  
                    <svg  
                      xmlns="http://www.w3.org/2000/svg"  
                      width={9}  
                      height={8}  
                      fill="none"  
                    >  
                      <path  
                        fill="#F4F4F5"  
                        d="m4.92 8-.787-.763 2.733-2.68H0V3.443h6.866L4.133.767 4.92 0 9 4 4.92 8Z"  
                      />  
                    </svg>  
                  </div>  
                                   
                  {/* Image */}  
                  <Image  
                    className="inline-flex"  
                    src={card.image}  
                    width={350}  
                    height={288}  
                    alt={card.alt}  
                  />  
                                   
                  {/* Content */}  
                  <div className="p-6">  
                    <div className="mb-3">  
                      <span className="btn-sm relative rounded-full bg-gray-800/40 px-2.5 py-0.5 text-xs font-normal before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:border before:border-transparent before:[background:linear-gradient(to_bottom,--theme(--color-gray-700/.15),--theme(--color-gray-700/.5))_border-box] before:[mask-composite:exclude_!important] before:[mask:linear-gradient(white_0_0)_padding-box,_linear-gradient(white_0_0)] hover:bg-gray-800/60">  
                        <span className="bg-linear-to-r from-indigo-500 to-indigo-200 bg-clip-text text-transparent">  
                          {card.title}  
                        </span>  
                      </span>  
                    </div>  
                    <p className="text-indigo-200/65">  
                      {card.description}  
                    </p>  
                  </div>  
                </div>  
              </a>  
            ))}  
          </Spotlight>  
        </div>  
      </div>  
    </section>  
  );  
}