// components/ui/logo.tsx

export default function Logo() {
  return (
    <div className="inline-flex shrink-0" aria-label="InterviewAce AI">
      <svg 
        width="32" 
        height="32" 
        viewBox="0 0 32 32" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect width="32" height="32" rx="8" fill="#4F46E5" />
        <path 
          d="M10 8H12V24H10V8Z" 
          fill="white"
        />
        <path 
          d="M16 8H22C23.1046 8 24 8.89543 24 10V22C24 23.1046 23.1046 24 22 24H16V22H22V10H16V8Z" 
          fill="white" 
          fillOpacity="0.8"
        />
        <path 
          d="M16 13H20V15H16V13Z" 
          fill="white" 
          fillOpacity="0.6"
        />
        <path 
          d="M16 17H20V19H16V17Z" 
          fill="white" 
          fillOpacity="0.6"
        />
        <path 
          d="M7 16C7 14.3431 8.34315 13 10 13V19C8.34315 19 7 17.6569 7 16Z" 
          fill="#A5B4FC" 
          fillOpacity="0.8"
        />
      </svg>
    </div>
  );
}