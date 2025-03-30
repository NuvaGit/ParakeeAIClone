import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@/firebase/auth";
import Sidebar from "@/components/dashboard/Sidebar";
import { 
  createInterviewSession, 
  completeInterviewSession, 
  addInterviewQuestion,
  INTERVIEW_TYPES,
  InterviewType
} from '@/firebase/interviews';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import html2canvas from 'html2canvas';

// Speech recognition interfaces
interface SpeechRecognitionResult {
  text: string;
  isFinal: boolean;
  speaker: 'user' | 'interviewer';
}

// Added interface for CV data
interface CVData {
  fileName: string;
  fileSize: number;
  content?: string;
  uploadedAt: Date;
}

export default function InterviewPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState<'setup' | 'permission' | 'cvUpload' | 'interview' | 'feedback'>('setup');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [interviewType, setInterviewType] = useState<InterviewType>("Technical Interview");
  const [company, setCompany] = useState("");
  const [position, setPosition] = useState("");
  const [autoResponse, setAutoResponse] = useState(true);
  const [currentInterviewId, setCurrentInterviewId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [aiUsageCount, setAiUsageCount] = useState(0);
  const [interviewStartTime, setInterviewStartTime] = useState<Date | null>(null);
  const [hotkeys, setHotkeys] = useState({
    activateAI: 'Space',
    hideOverlay: 'Escape',
    nextSuggestion: 'Tab',
    useSuggestion: 'Enter',
    takeScreenshot: 'F2'
  });

  // CV upload state
  const [cv, setCV] = useState<CVData | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showCVPreview, setShowCVPreview] = useState(false);

  // Dialog states
  const [showMicPermissionDialog, setShowMicPermissionDialog] = useState(false);
  const [showEndInterviewDialog, setShowEndInterviewDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [interviewFeedback, setInterviewFeedback] = useState<{ score: number; feedback: string } | null>(null);

  // For transcript management
  const [fullTranscript, setFullTranscript] = useState<string[]>([]);
  const [interimText, setInterimText] = useState<string>('');
  const [interimSpeaker, setInterimSpeaker] = useState<'user' | 'interviewer' | null>(null);
  const [currentAIResponse, setCurrentAIResponse] = useState<string>("");
  const [isProcessingAI, setIsProcessingAI] = useState(false);
  const [showAIResponse, setShowAIResponse] = useState(false);

  // Testing visualization states
  const [showTranscriptTesting, setShowTranscriptTesting] = useState(true);
  const [lastProcessedTime, setLastProcessedTime] = useState<Date | null>(null);

  // Add state for tracking if permission is granted
  const [micPermissionGranted, setMicPermissionGranted] = useState(false);
  // Add active stream state to properly clean up
  const [micStream, setMicStream] = useState<MediaStream | null>(null);

  // Refs for speech recognition
  const recognitionRef = useRef<any>(null);
  const interviewerRecognitionRef = useRef<any>(null);
  const isListeningRef = useRef(false);
  const isInterviewerListeningRef = useRef(false);

  // Scroll container for transcript
  const transcriptContainerRef = useRef<HTMLDivElement>(null);
  // Time-based context tracking
  const recentContextStartTime = useRef<Date | null>(null);

  // File input ref for CV upload
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Flag to prevent multiple recognition starts
  const recognitionStartingRef = useRef(false);

  // Check if user is logged in
  useEffect(() => {
    // Check if user is logged in
    if (!user) {
      console.log("No user detected, redirecting to signin page");
      router.push('/signin');
      return;
    }
    
    // Clean up any Firestore listeners when component unmounts
    return () => {
      if (currentInterviewId) {
        console.log(`Cleaning up Interview session: ${currentInterviewId}`);
        // Optional: Add logic to update the interview status if needed
      }
    };
  }, [user, router, currentInterviewId]);

  // Load hotkeys from localStorage
  useEffect(() => {
    const savedHotkeys = localStorage.getItem('hotkeys');
    if (savedHotkeys) {
      try {
        const parsedHotkeys = JSON.parse(savedHotkeys);
        if (parsedHotkeys) {
          // Ensure we have the screenshot hotkey, add it if not
          if (!parsedHotkeys.takeScreenshot) {
            parsedHotkeys.takeScreenshot = 'F2';
            localStorage.setItem('hotkeys', JSON.stringify(parsedHotkeys));
          }
          setHotkeys(parsedHotkeys);
        }
      } catch (e) {
        console.error('Failed to parse saved hotkeys:', e);
      }
    }
  }, []);

  // Setup keyboard event listeners for hotkeys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInterviewStarted) return;

      // Don't trigger hotkeys if user is typing in a form field
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Check for hotkeys
      if (e.key === hotkeys.activateAI || e.code === hotkeys.activateAI) {
        e.preventDefault();
        getAIResponseFromTranscript();
      } else if (e.key === hotkeys.hideOverlay || e.code === hotkeys.hideOverlay) {
        e.preventDefault();
        setShowAIResponse(!showAIResponse);
      } else if (e.key === hotkeys.takeScreenshot || e.code === hotkeys.takeScreenshot) {
        e.preventDefault();
        captureAndAnalyzeScreenshot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInterviewStarted, hotkeys, showAIResponse, fullTranscript]);

  // Auto-scroll transcript to bottom when new content is added
  useEffect(() => {
    if (transcriptContainerRef.current) {
      transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
    }
  }, [fullTranscript, interimText]);

  // Clean up speech recognition when component unmounts
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          console.warn("Error stopping recognition during cleanup:", e);
        }
        isListeningRef.current = false;
      }
      
      if (interviewerRecognitionRef.current) {
        try {
          interviewerRecognitionRef.current.stop();
        } catch (e) {
          console.warn("Error stopping interviewer recognition during cleanup:", e);
        }
        isInterviewerListeningRef.current = false;
      }
      
      // Clean up any active media streams
      if (micStream) {
        micStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [micStream]);

  // Memoize the speech recognition setup - improved for stability
  const setupSpeechRecognition = useCallback(() => {
    console.log("Setting up speech recognition...");
    // Only run this in browser environment
    if (typeof window !== 'undefined') {
      // Define SpeechRecognition with proper type handling
      const SpeechRecognitionAPI = (window as any).SpeechRecognition || 
                                   (window as any).webkitSpeechRecognition || 
                                   null;
      
      if (!SpeechRecognitionAPI) {
        console.error("SpeechRecognition API not available in this browser");
        return { userRecognition: null, interviewerRecognition: null };
      }
      
      console.log("SpeechRecognition API found, creating instances");
      
      try {
        // For the user's speech
        const recognition = new SpeechRecognitionAPI();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US'; // Set language to English
        
        recognition.onstart = () => {
          console.log("User speech recognition started");
          isListeningRef.current = true;
          recognitionStartingRef.current = false;
        };
        
        recognition.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          if (event.error === 'aborted') {
            console.log("Recognition was deliberately aborted, not restarting");
            isListeningRef.current = false;
            return;
          }
          
          // Auto-restart on error if we were supposed to be listening
          if (isListeningRef.current && event.error !== 'no-speech') {
            console.log("Attempting to restart user recognition after error");
            setTimeout(() => {
              if (isListeningRef.current && !recognitionStartingRef.current) {
                try {
                  recognitionStartingRef.current = true;
                  recognition.start();
                } catch (e) {
                  console.error("Failed to restart recognition:", e);
                  recognitionStartingRef.current = false;
                  isListeningRef.current = false;
                }
              }
            }, 1000);
          }
        };
        
        recognition.onend = () => {
          console.log("User speech recognition ended");
          // Auto-restart if we were supposed to be listening
          if (isListeningRef.current && !recognitionStartingRef.current) {
            console.log("Restarting user recognition as it ended unexpectedly");
            setTimeout(() => {
              if (isListeningRef.current && !recognitionStartingRef.current) {
                try {
                  recognitionStartingRef.current = true;
                  recognition.start();
                } catch (e) {
                  console.error("Failed to restart recognition:", e);
                  recognitionStartingRef.current = false;
                  isListeningRef.current = false;
                }
              }
            }, 1000);
          }
        };
        
        recognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
              // Add to full transcript with speaker identification
              addToTranscript("You: " + event.results[i][0].transcript);
              
              // Update the last processed time
              setLastProcessedTime(new Date());
            } else {
              interimTranscript += event.results[i][0].transcript;
              setInterimText(interimTranscript);
              setInterimSpeaker('user');
            }
          }
        };
        
        // For the interviewer's speech (second recognition instance)
        const interviewerRecognition = new SpeechRecognitionAPI();
        interviewerRecognition.continuous = true;
        interviewerRecognition.interimResults = true;
        interviewerRecognition.lang = 'en-US';
        
        interviewerRecognition.onstart = () => {
          console.log("Interviewer speech recognition started");
          isInterviewerListeningRef.current = true;
        };
        
        interviewerRecognition.onerror = (event: any) => {
          console.error('Interviewer speech recognition error', event.error);
          if (event.error === 'aborted') {
            console.log("Interviewer recognition deliberately aborted, not restarting");
            isInterviewerListeningRef.current = false;
            return;
          }
          
          // Auto-restart on error if still supposed to be listening
          if (isInterviewerListeningRef.current && event.error !== 'no-speech') {
            setTimeout(() => {
              if (isInterviewerListeningRef.current) {
                try {
                  interviewerRecognition.start();
                } catch (e) {
                  console.error("Failed to restart interviewer recognition:", e);
                  isInterviewerListeningRef.current = false;
                }
              }
            }, 1000);
          }
        };
        
        interviewerRecognition.onend = () => {
          console.log("Interviewer speech recognition ended");
          // Auto-restart if we were supposed to be listening
          if (isInterviewerListeningRef.current) {
            console.log("Restarting interviewer recognition as it ended unexpectedly");
            setTimeout(() => {
              if (isInterviewerListeningRef.current) {
                try {
                  interviewerRecognition.start();
                } catch (e) {
                  console.error("Failed to restart interviewer recognition:", e);
                  isInterviewerListeningRef.current = false;
                }
              }
            }, 1000);
          }
        };
        
        interviewerRecognition.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript + ' ';
              // Add to full transcript with speaker identification
              addToTranscript("Interviewer: " + event.results[i][0].transcript);
              
              // Update the last processed time
              setLastProcessedTime(new Date());
            } else {
              interimTranscript += event.results[i][0].transcript;
              setInterimText(interimTranscript);
              setInterimSpeaker('interviewer');
            }
          }
        };
        
        return {
          userRecognition: recognition,
          interviewerRecognition: interviewerRecognition
        };
      } catch (error) {
        console.error("Error creating speech recognition instances:", error);
        return { userRecognition: null, interviewerRecognition: null };
      }
    }
    return { userRecognition: null, interviewerRecognition: null };
  }, []);

  // Add a line to the transcript
  const addToTranscript = (text: string) => {
    setFullTranscript(prev => [...prev, text]);
    
    // If this is the first line, start tracking the context time
    if (!recentContextStartTime.current) {
      recentContextStartTime.current = new Date();
    }
  };

  // Initialize speech recognition - only call once
  useEffect(() => {
    // Setup speech recognition if not already set up
    if (!recognitionRef.current && !interviewerRecognitionRef.current) {
      const { userRecognition, interviewerRecognition } = setupSpeechRecognition();
      recognitionRef.current = userRecognition;
      interviewerRecognitionRef.current = interviewerRecognition;
    }
  }, [setupSpeechRecognition]);

  const startRecording = () => {
    if (!recognitionRef.current) {
      console.error("Speech recognition not initialized");
      return false;
    }
    
    if (isListeningRef.current) {
      console.log("Already listening, not starting again");
      return true;
    }
    
    try {
      // Start user's speech recognition first
      console.log("Starting user speech recognition");
      recognitionStartingRef.current = true;
      recognitionRef.current.start();
      
      // Start interviewer recognition after a short delay
      setTimeout(() => {
        if (interviewerRecognitionRef.current) {
          try {
            console.log("Starting interviewer speech recognition");
            interviewerRecognitionRef.current.start();
          } catch (err) {
            console.error("Failed to start interviewer recognition:", err);
            // Continue even if interviewer recognition fails
          }
        } else {
          console.warn("Interviewer recognition ref is not available");
        }
      }, 1000);
      
      setIsRecording(true);
      return true;
    } catch (error) {
      console.error("Error starting user recognition:", error);
      recognitionStartingRef.current = false;
      return false;
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
        isListeningRef.current = false;
      } catch (e) {
        console.warn("Error stopping user recognition:", e);
      }
      
      // Stop the interviewer recognition as well
      if (interviewerRecognitionRef.current && isInterviewerListeningRef.current) {
        try {
          interviewerRecognitionRef.current.stop();
          isInterviewerListeningRef.current = false;
        } catch (e) {
          console.warn("Error stopping interviewer recognition:", e);
        }
      }
      
      setIsRecording(false);
      return true;
    }
    return false;
  };

  // Get recent transcript for context (last 30 seconds)
  const getRecentTranscript = () => {
    if (!lastProcessedTime) {
      return fullTranscript; // Return all if no time tracking
    }
    
    // Get transcript from the last 30 seconds
    const thirtySecondsAgo = new Date();
    thirtySecondsAgo.setSeconds(thirtySecondsAgo.getSeconds() - 30);
    
    // Find the index of the first line in the last 30 seconds
    // This is a simplified approach - in reality, each line should have a timestamp
    const recentLines = Math.min(5, fullTranscript.length);
    return fullTranscript.slice(-recentLines);
  };

  // Get AI response from the transcript
  const getAIResponseFromTranscript = async () => {
    if (isProcessingAI || fullTranscript.length === 0 || !user) return;
    
    setIsProcessingAI(true);
    
    try {
      // Get only recent context (last 30 seconds or last 5 lines as fallback)
      const recentTranscript = getRecentTranscript();
      
      const payload: any = {
        transcript: recentTranscript,
        company,
        position: position || interviewType,
        interviewType,
        contextLines: 5
      };
      
      // Add CV content if available
      if (cv && cv.content) {
        payload.cvContent = cv.content;
      }
      
      const response = await fetch('/api/interviewpage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setCurrentAIResponse(data.aiResponse || "");
      setShowAIResponse(true);
      
      // Store the AI suggestion with the question
      if (currentInterviewId && data.aiResponse) {
        // Extract the last question from the interviewer
        const lastInterviewerQuestion = recentTranscript
          .filter(line => line.startsWith("Interviewer:"))
          .pop()
          ?.replace("Interviewer:", "")
          .trim();
          
        // Extract the last answer from the user
        const lastUserAnswer = recentTranscript
          .filter(line => line.startsWith("You:"))
          .pop()
          ?.replace("You:", "")
          .trim();
        
        if (lastInterviewerQuestion) {
          await addInterviewQuestion(currentInterviewId, {
            question: lastInterviewerQuestion,
            answer: lastUserAnswer || "",
            aiSuggestion: data.aiResponse
          });
        }
      }
      
      // Increment AI usage counter
      setAiUsageCount(prev => prev + 1);
      
    } catch (error) {
      console.error("Error getting AI response:", error);
      setCurrentAIResponse("Sorry, I couldn't generate a response at this time.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Function to take a screenshot and analyze it
  const captureAndAnalyzeScreenshot = async () => {
    if (isProcessingAI || !user) return;
    
    setIsProcessingAI(true);
    
    try {
      // Hide AI response while taking screenshot to avoid recursive analysis
      const wasAIResponseVisible = showAIResponse;
      setShowAIResponse(false);
      
      // Wait a moment for UI to update
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Use html2canvas to capture the screen
      const canvas = await html2canvas(document.body);
      const screenshotDataUrl = canvas.toDataURL('image/png');
      
      // Restore AI response visibility
      if (wasAIResponseVisible) {
        setShowAIResponse(true);
      }
      
      // Prepare payload
      const payload: any = {
        screenshotData: screenshotDataUrl,
        company,
        position: position || interviewType,
        interviewType
      };
      
      // Add CV content if available
      if (cv && cv.content) {
        payload.cvContent = cv.content;
      }
      
      // Send screenshot to API for analysis
      const response = await fetch('/api/interviewpage', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Update AI response
      setCurrentAIResponse(data.aiResponse || "No insights could be generated from the screenshot.");
      setShowAIResponse(true);
      
      // Increment AI usage counter
      setAiUsageCount(prev => prev + 1);
      
      // Log this activity in the transcript
      addToTranscript("System: Screenshot taken and analyzed by AI");
      
    } catch (error) {
      console.error("Error taking or analyzing screenshot:", error);
      setCurrentAIResponse("Sorry, I couldn't analyze the screenshot at this time.");
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Handle CV file upload
  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Check if file is a PDF, DOC, or DOCX
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a PDF, DOC, DOCX, or TXT file');
      return;
    }
    
    // File size check (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size should be less than 5MB');
      return;
    }
    
    try {
      setUploadProgress(10);
      
      // Read the file
      const reader = new FileReader();
      
      reader.onprogress = (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 50);
          setUploadProgress(progress);
        }
      };
      
      reader.onload = async (e) => {
        setUploadProgress(60);
        
        if (!e.target?.result) {
          throw new Error('Failed to read file');
        }
        
        // Extract text from the file
        let fileContent = '';
        
        if (file.type === 'text/plain') {
          // For plain text files
          fileContent = e.target.result as string;
        } else {
          // For other document types, we would typically use a server-side service
          // For this example, we'll just use the first 2000 characters as dummy content
          const content = e.target.result as string;
          fileContent = `Content from ${file.name} (showing first 2000 chars): ${content.substring(0, 2000)}`;
        }
        
        setUploadProgress(90);
        
        // Create CV data object
        const cvData: CVData = {
          fileName: file.name,
          fileSize: file.size,
          content: fileContent,
          uploadedAt: new Date()
        };
        
        setCV(cvData);
        setUploadProgress(100);
        
        // Reset progress after a delay
        setTimeout(() => {
          setUploadProgress(0);
        }, 1000);
      };
      
      reader.onerror = () => {
        throw new Error('Error reading file');
      };
      
      // Read the file as text
      reader.readAsText(file);
      
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('Failed to upload CV. Please try again.');
      setUploadProgress(0);
    }
  };

  // Proceed to next step in the interview process
  const proceedToNextStep = () => {
    switch (currentStep) {
      case 'setup':
        setCurrentStep('permission');
        startInterview();
        break;
      case 'permission':
        setCurrentStep('cvUpload');
        break;
      case 'cvUpload':
        setCurrentStep('interview');
        setIsInterviewStarted(true);
        break;
      case 'interview':
        setCurrentStep('feedback');
        break;
      default:
        break;
    }
  };

  // Handle the continue button click after permission is granted
  const handleContinueAfterPermission = async () => {
    if (!user) {
      alert("You need to be logged in to start an interview!");
      setShowMicPermissionDialog(false);
      return;
    }

    try {
      console.log("Continue button clicked - proceeding with interview start");

      // Ensure mic stream is stopped before starting
      if (micStream) {
        console.log("Stopping existing microphone stream");
        micStream.getTracks().forEach(track => track.stop());
        setMicStream(null);
      }

      // Validate interview data
      const interviewData = {
        company: company || "Practice Interview",
        position: position || interviewType,
        interviewType
      };

      console.log("Creating interview session with data:", interviewData);
      
      let interviewId;
      try {
        interviewId = await createInterviewSession(user.uid, interviewData);
        console.log("Interview session created with ID:", interviewId);
      } catch (error: any) {
        console.error("Error creating interview session:", error);
        alert(`Failed to create interview session: ${error?.message ?? 'Unknown error'}. Please try again.`);
        setShowMicPermissionDialog(false);
        return;
      }

      setCurrentInterviewId(interviewId);
      setFullTranscript([]);
      setAiUsageCount(0);
      setInterviewStartTime(new Date());

      // Proceed to CV upload step
      setShowMicPermissionDialog(false);
      setMicPermissionGranted(false); // Reset for next time
      proceedToNextStep(); // Move from permission to CV upload
      
    } catch (error: any) {
      console.error("Unexpected error in handleContinueAfterPermission:", error);
      alert(`Error starting interview: ${error?.message ?? 'Unknown error'}. Please try again.`);
      setShowMicPermissionDialog(false);
      setMicPermissionGranted(false);
    }
  };

  // Start the interview
  const startInterview = async () => {
    if (!user) {
      alert("You need to be logged in to start an interview!");
      router.push('/signin');
      return;
    }
    
    // Check if speech recognition is supported
    const isSpeechRecognitionSupported = !!(
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    );
    
    if (!isSpeechRecognitionSupported) {
      alert("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
      return;
    }
    
    try {
      console.log("Starting interview process...");
      setShowMicPermissionDialog(true);
      
      // Check connection status
      const isOnline = navigator.onLine;
      console.log(`Network status: ${isOnline ? 'Online' : 'Offline'}`);
      
      // Modified approach: First request permission but wait for user to click continue
      try {
        console.log("Requesting microphone access...");
        // This will trigger the browser's permission dialog
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // If we get here, permission was granted
        console.log("Microphone permission granted");
        
        setMicPermissionGranted(true);
        setMicStream(stream);
        
        // We'll proceed with the interview start in handleContinueAfterPermission()
      } catch (permissionError) {
        console.error("Microphone permission error:", permissionError);
        setShowMicPermissionDialog(false);
        alert("Microphone access was denied. Please allow microphone access in your browser settings and try again.");
        return;
      }
    } catch (error) {
      console.error("Error starting interview:", error);
      setShowMicPermissionDialog(false);
      alert("Error starting interview. Please try again.");
    }
  };

  // Start the actual interview (after CV upload)
  const startActualInterview = async () => {
    console.log("Starting the actual interview with recognition...");
    
    // Start recording with proper delay to avoid aborted errors
    setTimeout(() => {
      const recordingStarted = startRecording();
      
      if (recordingStarted) {
        console.log("Recording started successfully");
        addToTranscript(`System: Interview started for ${position || interviewType} at ${company || "Practice Interview"}`);
      } else {
        console.error("Failed to start recording");
        alert("Failed to start recording. Please check your microphone settings and try again.");
      }
    }, 500);
  };

  // End the interview
  const endInterview = async () => {
    setShowEndInterviewDialog(true);
    
    // Stop recording
    stopRecording();
    
    if (!currentInterviewId || !interviewStartTime || !user) {
      setShowEndInterviewDialog(false);
      return;
    }
    
    try {
      // Calculate duration
      const endTime = new Date();
      const durationMs = endTime.getTime() - interviewStartTime.getTime();
      const durationMinutes = Math.round(durationMs / 60000);
      
      // Get interview feedback
      let feedback = "Interview completed successfully";
      let calculatedScore = 75; // Default score
      
      try {
        console.log("Requesting interview feedback...");
        const payload: any = {
          fullTranscript,
          company,
          position: position || interviewType,
          interviewType,
          duration: durationMinutes
        };
        
        // Add CV content if available
        if (cv && cv.content) {
          payload.cvContent = cv.content;
        }
        
        const response = await fetch('/api/interview/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });
        
        if (response.ok) {
          const data = await response.json();
          feedback = data.feedback || feedback;
          calculatedScore = data.score || calculatedScore;
          console.log("Received feedback:", feedback);
          console.log("Calculated score:", calculatedScore);
        }
      } catch (error) {
        console.error("Error generating interview feedback:", error);
      }
      
      setInterviewFeedback({
        score: calculatedScore,
        feedback: feedback
      });
      
      // Prepare results with proper validation
      const results = {
        duration: `${durationMinutes} minutes`,
        aiUsage: aiUsageCount,
        score: calculatedScore,
        feedback: feedback,
        transcript: fullTranscript.join("\n"),
        cvUsed: cv ? true : false
      };
      
      console.log("Completing interview with results:", JSON.stringify(results));
      
      // Update the interview session with final details
      try {
        await completeInterviewSession(currentInterviewId, results);
        console.log("Interview completed successfully");
      } catch (error) {
        console.error("Error completing interview:", error);
        // Continue to show completion dialog even if save fails
        alert("Warning: There was an issue saving your complete results, but the interview was recorded.");
      }
      
      setShowEndInterviewDialog(false);
      setShowCompletionDialog(true);
      
    } catch (error) {
      console.error("Error ending interview:", error);
      setShowEndInterviewDialog(false);
      alert("Error saving interview results. Please try again.");
    }
  };

  // Handle completion dialog close
  const handleCompletionDialogClose = () => {
    setShowCompletionDialog(false);
    setIsInterviewStarted(false);
    
    console.log("Navigating to history page...");
    // Navigate to history page with explicit error handling
    try {
      router.push('/dashboard/history');
    } catch (error) {
      console.error("Navigation error:", error);
      // Fallback navigation using window.location as a last resort
      window.location.href = '/dashboard/history';
    }
  };

  // Check if speech recognition is supported
  const isSpeechRecognitionSupported = typeof window !== 'undefined' && !!(
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
  );

  console.log("Current interview state:", { currentStep, isInterviewStarted, showMicPermissionDialog, micPermissionGranted });

  // CV Upload Form Component
  const CVUploadForm = () => (
    <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/40 rounded-xl p-8 border border-gray-800/80 shadow-xl backdrop-blur-sm hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
      <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-600/5 rounded-full blur-3xl"></div>
      <div className="absolute top-20 -left-20 w-40 h-40 bg-indigo-600/5 rounded-full blur-2xl"></div>
      
      <div className="relative z-10">
        <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Upload Your CV (Optional)
        </h2>
        
        <p className="text-indigo-200/70 mb-6">
          Uploading your CV will help our AI provide more personalized suggestions based on your skills and experience.
        </p>
        
        {cv ? (
          <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <div>
                  <p className="text-white font-medium">{cv.fileName}</p>
                  <p className="text-gray-400 text-sm">
                    {(cv.fileSize / 1024).toFixed(1)} KB • Uploaded {cv.uploadedAt.toLocaleTimeString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setShowCVPreview(!showCVPreview)}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  {showCVPreview ? 'Hide Preview' : 'Preview'}
                </button>
                <button 
                  onClick={() => setCV(null)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
            
            {showCVPreview && cv.content && (
              <div className="mt-4 p-3 bg-gray-800 rounded border border-gray-700 max-h-40 overflow-y-auto">
                <p className="text-gray-300 text-sm whitespace-pre-line">{cv.content.substring(0, 500)}...</p>
              </div>
            )}
          </div>
        ) : (
          <div className="bg-gray-800/30 border-2 border-dashed border-gray-700/50 rounded-lg p-8 text-center mb-6">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleCVUpload}
              accept=".pdf,.doc,.docx,.txt"
              className="hidden"
            />
            
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-indigo-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <p className="text-gray-300 mb-2">Drag and drop your CV here, or</p>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Browse Files
            </button>
            <p className="text-gray-500 text-sm mt-2">Support PDF, DOC, DOCX, TXT (max 5MB)</p>
          </div>
        )}
        
        {uploadProgress > 0 && (
          <div className="w-full bg-gray-800 rounded-full h-2.5 mb-6">
            <div 
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        
        <div className="flex flex-col space-y-4">
          <button
            onClick={() => {
              proceedToNextStep(); // Move to interview step
              // Start the actual interview with recognition
              startActualInterview();
            }}
            className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 text-lg font-medium flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {cv ? 'Continue with CV' : 'Skip & Continue'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-950 h-screen w-screen overflow-hidden">
      {/* Interview Setup, Permission, or CV Upload Steps */}
      {!isInterviewStarted ? (
        <div className="flex h-full w-full">
          {/* Sidebar - only shown before interview starts */}
          <Sidebar />
          
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto w-full">
              {/* Page Heading */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-white to-indigo-200 bg-clip-text text-transparent">
                  Start Interview
                </h1>
                <p className="text-indigo-200/70 text-lg">
                  Begin your interview with AI-powered assistance
                </p>
              </div>

              {/* Different Steps Based on Current Step */}
              {currentStep === 'setup' && (
                <div className="bg-gradient-to-b from-gray-900/80 to-gray-900/40 rounded-xl p-8 border border-gray-800/80 shadow-xl backdrop-blur-sm hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
                  {/* Background blobs */}
                  <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-indigo-600/5 rounded-full blur-3xl"></div>
                  <div className="absolute top-20 -left-20 w-40 h-40 bg-indigo-600/5 rounded-full blur-2xl"></div>
                  
                  <div className="relative z-10">
                    <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Interview Setup
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                      {/* Interview Type Selection */}
                      <div>
                        <label htmlFor="interview-type" className="block text-sm font-medium text-indigo-200 mb-2">
                          Interview Type
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                          </div>
                          <select 
                            id="interview-type"
                            value={interviewType}
                            onChange={(e) => setInterviewType(e.target.value as InterviewType)}
                            className="w-full pl-10 form-select bg-gray-800/70 border-gray-700/80 rounded-lg text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm appearance-none pr-10"
                          >
                            {INTERVIEW_TYPES.map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                          <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      
                      {/* Position/Role Input */}
                      <div>
                        <label htmlFor="position" className="block text-sm font-medium text-indigo-200 mb-2">
                          Position/Role
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          <input 
                            type="text" 
                            id="position"
                            value={position}
                            onChange={(e) => setPosition(e.target.value)}
                            placeholder="Software Engineer, Product Manager, etc."
                            className="w-full pl-10 form-input bg-gray-800/70 border-gray-700/80 rounded-lg text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                          />
                        </div>
                      </div>
                      
                      {/* Company Input */}
                      <div>
                        <label htmlFor="company" className="block text-sm font-medium text-indigo-200 mb-2">
                          Company (Optional)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                          </div>
                          <input 
                            type="text" 
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Google, Amazon, etc. (Optional)"
                            className="w-full pl-10 form-input bg-gray-800/70 border-gray-700/80 rounded-lg text-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
                          />
                        </div>
                      </div>
                    </div>
                    
                    {/* Note about recording both sides */}
                    <div className="mt-6 bg-yellow-900/20 rounded-lg p-4 border border-yellow-800/30">
                      <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2h2a1 1 0 000-2H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-sm text-yellow-200/80">
                          This tool uses speech recognition capabilities to transcribe both sides of the conversation. 
                          For best results, ensure your microphone can clearly pick up both your voice and the interviewer's voice 
                          from your speakers. In virtual interviews (Zoom, Teams, etc.), this works best with headphones.
                        </p>
                      </div>
                    </div>
                    
                    {/* Start Button & Status Indicators */}
                    <div className="space-y-4 mt-8">
                      <button 
                        onClick={proceedToNextStep}
                        className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-4 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 text-lg font-medium flex items-center justify-center"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Start Interview
                      </button>
                      
                      <div className="flex justify-center gap-6">
                        <div className="flex items-center">
                          <div className={`h-3 w-3 ${isSpeechRecognitionSupported ? 'bg-blue-500' : 'bg-red-500'} rounded-full mr-2`}></div>
                          <span className="text-sm text-gray-400">
                            {isSpeechRecognitionSupported ? 'Microphone Supported' : 'Microphone Not Supported'}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-400">AI Ready</span>
                        </div>
                        <div className="flex items-center">
                          <div className="h-3 w-3 bg-indigo-500 rounded-full mr-2"></div>
                          <span className="text-sm text-gray-400">Secure Session</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* How It Works Section */}
                    <div className="mt-8">
                      <div className="bg-indigo-900/20 rounded-lg p-5 border border-indigo-800/30 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
                        
                        <h3 className="text-lg font-semibold text-indigo-300 mb-3">How It Works</h3>
                        <div className="text-indigo-200/85 space-y-3">
                          <p>
                            When you start the interview, we'll use your microphone to listen to both you and your interviewer. Our AI will analyze the dialogue in real-time to provide optimal responses.
                          </p>
                          <div className="flex flex-wrap gap-4 mt-2">
                            <div className="flex items-center bg-gray-800/70 px-3 py-1.5 rounded-lg border border-gray-700/50">
                              <span className="bg-gray-700 text-gray-300 w-16 text-center text-xs py-1 px-2 rounded mr-2 font-mono font-bold">{hotkeys.activateAI}</span>
                              <span className="text-sm">Activate AI assistance</span>
                            </div>
                            <div className="flex items-center bg-gray-800/70 px-3 py-1.5 rounded-lg border border-gray-700/50">
                              <span className="bg-gray-700 text-gray-300 w-16 text-center text-xs py-1 px-2 rounded mr-2 font-mono font-bold">{hotkeys.hideOverlay}</span>
                              <span className="text-sm">Hide AI overlay</span>
                            </div>
                            <div className="flex items-center bg-gray-800/70 px-3 py-1.5 rounded-lg border border-gray-700/50">
                              <span className="bg-gray-700 text-gray-300 w-16 text-center text-xs py-1 px-2 rounded mr-2 font-mono font-bold">{hotkeys.takeScreenshot}</span>
                              <span className="text-sm">Take screenshot</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CV Upload Step */}
              {currentStep === 'cvUpload' && <CVUploadForm />}
            </div>
          </div>
        </div>
      ) : (
        /* Interview In Progress UI - Full Screen (without sidebar) */
        <div className="h-full w-full flex flex-col">
          {/* Interview Controls */}
          <div className="bg-gray-900 border-b border-gray-800 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <div className={`h-3 w-3 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gray-500'} rounded-full mr-2`}></div>
              <span className="text-sm text-gray-300">{isRecording ? 'Recording' : 'Paused'}</span>
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={getAIResponseFromTranscript}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${isProcessingAI ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}
                disabled={isProcessingAI}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get AI Assistance
              </button>
              <button 
                onClick={captureAndAnalyzeScreenshot}
                className={`px-3 py-1.5 rounded-lg text-sm flex items-center ${isProcessingAI ? 'bg-gray-800 text-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-500 text-white'}`}
                disabled={isProcessingAI}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Screenshot
              </button>
              <button 
                onClick={endInterview}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-500 rounded-lg text-sm text-white flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                End Interview
              </button>
            </div>
          </div>
          
          {/* Transcript Testing Area */}
          <div className="bg-gray-900/80 border-b border-gray-800 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-white font-medium">Speech Recognition Testing</h3>
              <div className="flex items-center">
                <div className={`h-2 w-2 ${isRecording ? 'bg-green-500' : 'bg-red-500'} rounded-full mr-2`}></div>
                <span className="text-sm text-gray-400">{isRecording ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
            <div className="bg-gray-800/80 rounded-lg p-3 text-sm text-indigo-200">
              <p className="mb-2 text-xs text-gray-400">Last detected speech:</p>
              {interimText ? (
                <div className="flex items-center">
                  <div className={`h-2 w-2 ${interimSpeaker === 'interviewer' ? 'bg-blue-500' : 'bg-indigo-500'} rounded-full mr-2`}></div>
                  <span className={`${interimSpeaker === 'interviewer' ? 'text-blue-300' : 'text-indigo-300'}`}>
                    {interimSpeaker === 'interviewer' ? 'Interviewer' : 'You'}: {interimText}
                  </span>
                  <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1"></span>
                </div>
              ) : (
                <p className="text-gray-500 italic">No speech detected. Please speak to test.</p>
              )}
              
              <div className="mt-3 pt-3 border-t border-gray-700">
                <p className="text-xs text-gray-400 mb-2">Last processed at: {lastProcessedTime ? lastProcessedTime.toLocaleTimeString() : 'Never'}</p>
                <p className="text-xs text-gray-400">Total transcript lines: {fullTranscript.length}</p>
              </div>
            </div>
          </div>
          
          {/* Transcript Area */}
          <div ref={transcriptContainerRef} className="flex-1 p-6 overflow-auto">
            <div className="space-y-3">
              {fullTranscript.map((line, index) => {
                if (line.startsWith("System:")) {
                  return (
                    <div key={index} className="bg-gray-800/50 text-gray-400 text-sm rounded px-3 py-2 italic">
                      {line}
                    </div>
                  );
                } else if (line.startsWith("Interviewer:")) {
                  return (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="bg-blue-900/30 rounded-xl rounded-tl-none px-4 py-3 text-blue-100">
                        {line.replace("Interviewer:", "")}
                      </div>
                    </div>
                  );
                } else if (line.startsWith("You:")) {
                  return (
                    <div key={index} className="flex items-start space-x-3 justify-end">
                      <div className="bg-indigo-900/30 rounded-xl rounded-tr-none px-4 py-3 text-indigo-100">
                        {line.replace("You:", "")}
                      </div>
                      <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                  );
                }
                
                return null;
              })}
              
              {/* Interim Text */}
              {interimText && interimSpeaker && (
                <div className={`flex items-start space-x-3 ${interimSpeaker === 'interviewer' ? '' : 'justify-end'}`}>
                  {interimSpeaker === 'interviewer' && (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                  )}
                  <div className={`${interimSpeaker === 'interviewer' ? 'bg-blue-900/30 rounded-xl rounded-tl-none text-blue-100' : 'bg-indigo-900/30 rounded-xl rounded-tr-none text-indigo-100'} px-4 py-3 opacity-70`}>
                    {interimText}
                    <span className="inline-block w-2 h-4 bg-current animate-pulse ml-1"></span>
                  </div>
                  {interimSpeaker === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* AI Response Overlay */}
          {showAIResponse && currentAIResponse && (
            <div className="bg-gray-950/95 border-t border-gray-800 p-4">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <span className="text-purple-300 text-sm font-medium">AI Suggestion</span>
                </div>
                <button 
                  onClick={() => setShowAIResponse(false)}
                  className="text-gray-400 hover:text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <div className="text-white bg-purple-950/30 border border-purple-800/30 rounded-lg p-3 max-h-40 overflow-y-auto">
                {currentAIResponse}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Microphone Permission Dialog */}
      {showMicPermissionDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-indigo-900/50 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Microphone Access</h3>
              <p className="text-gray-300">
                {micPermissionGranted
                  ? "Microphone access granted! Ready to start the interview."
                  : "We need microphone access to transcribe the interview. Please allow access when prompted by your browser."}
              </p>
            </div>
            
            {micPermissionGranted ? (
              <button
                onClick={() => {
                  console.log("Continue button clicked");
                  handleContinueAfterPermission();
                }}
                className="w-full bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all duration-300 font-medium"
              >
                Continue to Interview
              </button>
            ) : (
              <div className="flex flex-col space-y-4">
                <div className="animate-pulse flex justify-center">
                  <div className="h-10 w-10 bg-indigo-600/30 rounded-full flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                </div>
                <p className="text-center text-sm text-gray-400">Waiting for microphone permission...</p>
                <button
                  onClick={() => setShowMicPermissionDialog(false)}
                  className="bg-gray-800 text-gray-300 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* End Interview Dialog */}
      {showEndInterviewDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center mr-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white">End Interview</h3>
                <p className="text-gray-400 text-sm">Your interview recording will be stopped.</p>
              </div>
            </div>
            
            <div className="flex justify-between space-x-4">
              <button
                onClick={() => setShowEndInterviewDialog(false)}
                className="flex-1 bg-gray-800 text-gray-300 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={endInterview}
                className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-500 transition-colors"
              >
                End Interview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interview Completion Dialog */}
      {showCompletionDialog && interviewFeedback && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-950/80 backdrop-blur-sm z-50">
          <div className="bg-gray-900 border border-gray-800 rounded-lg shadow-xl max-w-lg w-full p-6">
            <div className="text-center mb-6">
              <div className="mx-auto w-20 h-20 bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Interview Complete!</h3>
              <p className="text-gray-300 mb-6">
                Your interview has been successfully recorded and analyzed.
              </p>
              
              <div className="bg-gradient-to-b from-gray-800/60 to-gray-800/40 rounded-lg p-5 mb-6 border border-gray-700/50 text-left">
                <div className="flex items-center mb-4">
                  <div className="mr-4 bg-green-900/20 h-20 w-20 rounded-full flex items-center justify-center border-4 border-green-600/30">
                    <span className="text-3xl font-bold text-green-400">{interviewFeedback.score}</span>
                  </div>
                  <div>
                    <h4 className="text-lg font-medium text-white mb-1">Your Performance Score</h4>
                    <p className="text-sm text-gray-400">Based on content, structure, and delivery</p>
                  </div>
                </div>
                
                <h5 className="text-indigo-300 font-medium mb-2">Performance Feedback:</h5>
                <p className="text-gray-300 text-sm whitespace-pre-line">{interviewFeedback.feedback}</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button
                onClick={() => {
                  console.log("View Detailed Results button clicked");
                  handleCompletionDialogClose();
                }}
                className="flex-1 bg-gradient-to-r from-indigo-600 to-indigo-500 text-white py-3 rounded-lg hover:from-indigo-500 hover:to-indigo-400 transition-all font-medium"
              >
                View Detailed Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}