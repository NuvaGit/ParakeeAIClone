// src/components/pages/Home.jsx
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import AnimatedNavbar from "../layout/AnimatedNavbar";
import {
  AnimatedBackground,
  AnimatedSection,
  AnimatedButton,
  AnimatedCard,
  TypingText,
  GradientText,
  WaveAnimation
} from '../ui/AnimatedComponents';

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  const features = [
    {
      icon: (
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path>
        </svg>
      ),
      title: "Real-time Transcription",
      description: "Our app listens to your interview and provides real-time transcription, so you can focus on the conversation.",
    },
    {
      icon: (
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
        </svg>
      ),
      title: "AI-Powered Responses",
      description: "Get intelligent response suggestions tailored to your resume and experience for even the toughest interview questions.",
    },
    {
      icon: (
        <svg className="w-12 h-12 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
        </svg>
      ),
      title: "Works Everywhere",
      description: "Use our assistant in your browser or as a desktop app that integrates with Zoom and Teams for real interviews.",
    },
  ];

  const testimonials = [
    {
      quote: "This tool helped me land my dream job at a top tech company. The AI suggestions were spot on!",
      author: "Sarah M.",
      role: "Software Engineer",
    },
    {
      quote: "I used to get nervous during interviews, but having real-time response suggestions gives me confidence.",
      author: "James T.",
      role: "Product Manager",
    },
    {
      quote: "The desktop integration with Zoom is seamless. My interviewer had no idea I was using an assistant!",
      author: "Michelle R.",
      role: "Marketing Director",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      <AnimatedNavbar />
      <AnimatedBackground>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <AnimatedSection>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
                  <GradientText>Interview</GradientText> Assistant
                </h1>
                <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
                  Your AI-powered interview coach that helps you prepare and excel in job interviews.
                  <WaveAnimation className="inline-block ml-2">👋</WaveAnimation>
                </p>
              </AnimatedSection>

              <AnimatedSection delay={200} className="mt-8">
                <div className="inline-flex rounded-md shadow">
                  {currentUser ? (
                    <Link to="/interview">
                      <AnimatedButton variant="primary" size="lg">
                        Start Interview Practice
                      </AnimatedButton>
                    </Link>
                  ) : (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/register">
                        <AnimatedButton variant="primary" size="lg">
                          Get Started
                        </AnimatedButton>
                      </Link>
                      <Link to="/login">
                        <AnimatedButton variant="outline" size="lg">
                          Log In
                        </AnimatedButton>
                      </Link>
                    </div>
                  )}
                </div>
              </AnimatedSection>
            </div>

            {/* Mock UI Preview (floating in animation) */}
            <AnimatedSection delay={400} className="mt-12 relative">
              <div className="max-w-4xl mx-auto">
                <div className="relative rounded-xl bg-white shadow-xl overflow-hidden border border-gray-200 floating">
                  <div className="p-4 bg-primary-500 text-white rounded-t-xl flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Interview Assistant</h2>
                    <div className="flex space-x-2">
                      <button className="p-1 rounded hover:bg-primary-400">🎤</button>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="bg-blue-50 border-l-4 border-blue-300 rounded p-3 mb-4">
                      <div className="text-xs text-gray-500 mb-1">Interviewer • 2:34 PM</div>
                      <div className="text-sm">Tell me about a time when you had to solve a complex problem.</div>
                    </div>
                    <div className="bg-green-50 border-l-4 border-green-300 rounded p-3">
                      <div className="text-xs text-gray-500 mb-1">AI Assistant • 2:34 PM</div>
                      <div className="text-sm">
                        <TypingText 
                          text="At my previous role, I faced a challenging data synchronization issue that was causing inconsistencies. I methodically analyzed the problem by implementing logging, identified the root cause in the ordering of operations, and developed a two-phase commit approach. This solution reduced sync errors by 98% and was adopted across other projects."
                          speed={30}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-6 -right-6 w-64 h-64 bg-accent-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
                <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-primary-400/10 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow animation-delay-2000"></div>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-center mb-12">
                Supercharge Your <GradientText>Interview Skills</GradientText>
              </h2>
            </AnimatedSection>

            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
              {features.map((feature, index) => (
                <AnimatedSection key={index} delay={index * 100}>
                  <AnimatedCard className="h-full flex flex-col items-center p-6 text-center">
                    <div className="rounded-full bg-primary-100 p-4 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </AnimatedCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-center mb-16">
                How It <GradientText>Works</GradientText>
              </h2>
            </AnimatedSection>

            <div className="relative">
              {/* Timeline line */}
              <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-primary-200"></div>
              
              {/* Step 1 */}
              <AnimatedSection delay={100}>
                <div className="flex flex-col md:flex-row mb-16">
                  <div className="flex-1 md:text-right md:pr-12">
                    <div className="mb-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-semibold">1</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Create Your Profile</h3>
                    <p className="text-gray-600">Add your resume, job history, and key skills to get personalized responses.</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 border-4 border-white flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-primary-500"></div>
                    </div>
                  </div>
                  <div className="flex-1 mt-4 md:mt-0 md:pl-12">
                    <img 
                      src="https://ui-avatars.com/api/?name=Profile&background=e6f1ff&color=0073ff" 
                      alt="Profile Setup" 
                      className="rounded-lg shadow-md w-full md:max-w-xs mx-auto"
                    />
                  </div>
                </div>
              </AnimatedSection>
              
              {/* Step 2 */}
              <AnimatedSection delay={200}>
                <div className="flex flex-col md:flex-row mb-16">
                  <div className="flex-1 md:text-right md:pr-12 md:order-2">
                    <div className="mb-4 md:hidden">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-semibold">2</span>
                    </div>
                    <img 
                      src="https://ui-avatars.com/api/?name=Transcription&background=e6f1ff&color=0073ff" 
                      alt="Interview Interface" 
                      className="rounded-lg shadow-md w-full md:max-w-xs mx-auto"
                    />
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 border-4 border-white flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-primary-500"></div>
                    </div>
                  </div>
                  <div className="flex-1 mt-4 md:mt-0 md:order-1">
                    <div className="mb-4 md:text-left">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-semibold md:ml-0">2</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 md:text-left">Start The Interview</h3>
                    <p className="text-gray-600">Begin your practice session or join a real interview with the assistant by your side.</p>
                  </div>
                </div>
              </AnimatedSection>
              
              {/* Step 3 */}
              <AnimatedSection delay={300}>
                <div className="flex flex-col md:flex-row">
                  <div className="flex-1 md:text-right md:pr-12">
                    <div className="mb-4">
                      <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary-500 text-white font-semibold">3</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Get AI-Powered Responses</h3>
                    <p className="text-gray-600">Receive intelligent suggestions tailored to your background that you can use or modify.</p>
                  </div>
                  <div className="hidden md:flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary-100 border-4 border-white flex items-center justify-center">
                      <div className="w-4 h-4 rounded-full bg-primary-500"></div>
                    </div>
                  </div>
                  <div className="flex-1 mt-4 md:mt-0 md:pl-12">
                    <img 
                      src="https://ui-avatars.com/api/?name=AI&background=e6f1ff&color=0073ff" 
                      alt="AI Responses" 
                      className="rounded-lg shadow-md w-full md:max-w-xs mx-auto"
                    />
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <AnimatedSection>
              <h2 className="text-3xl font-bold text-center mb-16">
                What Our <GradientText>Users Say</GradientText>
              </h2>
            </AnimatedSection>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <AnimatedSection key={index} delay={index * 150}>
                  <AnimatedCard className="h-full p-6 relative">
                    <div className="absolute -top-4 left-6 text-5xl text-primary-300">"</div>
                    <p className="text-gray-600 mb-4 relative z-10">{testimonial.quote}</p>
                    <div className="mt-auto">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-sm text-gray-500">{testimonial.role}</p>
                    </div>
                  </AnimatedCard>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary-500 to-secondary-500 text-white">
          <div className="max-w-5xl mx-auto text-center">
            <AnimatedSection>
              <h2 className="text-3xl font-bold mb-6">Ready to ace your next interview?</h2>
              <p className="text-xl mb-8 opacity-90">Join thousands of professionals who have improved their interview performance with our AI assistant.</p>
              <div className="inline-flex">
                {currentUser ? (
                  <Link to="/interview">
                    <AnimatedButton 
                      variant="accent" 
                      size="lg" 
                      className="shadow-lg hover:shadow-xl"
                    >
                      Start Practicing Now
                    </AnimatedButton>
                  </Link>
                ) : (
                  <Link to="/register">
                    <AnimatedButton 
                      variant="accent" 
                      size="lg" 
                      className="shadow-lg hover:shadow-xl"
                    >
                      Create Free Account
                    </AnimatedButton>
                  </Link>
                )}
              </div>
            </AnimatedSection>
          </div>
        </section>
        
        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <AnimatedLogo text="InterviewAssist" className="text-2xl mb-4" />
              <p className="text-gray-400">Your AI-powered interview coach that helps you prepare and excel in job interviews.</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/interview" className="text-gray-400 hover:text-white transition-colors">Interview Room</Link></li>
                <li><Link to="/profile" className="text-gray-400 hover:text-white transition-colors">Profile</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <p className="text-gray-400">Questions or feedback? Reach out to our team.</p>
              <div className="mt-4">
                <a href="mailto:support@interviewassist.com" className="text-primary-300 hover:text-primary-200 transition-colors">support@interviewassist.com</a>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-gray-800 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} InterviewAssist. All rights reserved.</p>
          </div>
        </footer>
      </AnimatedBackground>
    </div>
  );
};

export default Home;