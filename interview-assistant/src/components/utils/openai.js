import { httpsCallable } from 'firebase/functions';
import { functions } from '../../firebase/config';

export const generateAIResponse = async (question, userContext) => {
  try {
    const generateResponse = httpsCallable(functions, 'generateAIResponse');
    
    const result = await generateResponse({
      question,
      userContext
    });
    
    return result.data;
  } catch (error) {
    console.error('Error generating AI response:', error);
    throw error;
  }
};

// Prepare user context from profile data
export const prepareUserContext = (userProfile) => {
  if (!userProfile) return {};
  
  return {
    name: userProfile.displayName || '',
    jobTitle: userProfile.jobTitle || '',
    industry: userProfile.industry || '',
    experience: userProfile.yearsExperience || 0,
    skills: userProfile.skills || [],
    resumeText: userProfile.resumeData?.plainText || ''
  };
};

// Create a well-formed prompt for interview assistance
export const createInterviewPrompt = (question, userContext) => {
  return `
You are an AI interview assistant helping with a job interview. 
The interview candidate has the following background:
- Name: ${userContext.name}
- Target Position: ${userContext.jobTitle}
- Industry: ${userContext.industry}
- Years of Experience: ${userContext.experience}
- Key Skills: ${userContext.skills.join(', ')}

Resume Summary:
${userContext.resumeText.substring(0, 500)}${userContext.resumeText.length > 500 ? '...' : ''}

The interviewer has asked the following question:
"${question}"

Please generate a professional and effective response for this interview question. The response should:
1. Be concise but comprehensive (about 3-4 sentences)
2. Include specific examples from the candidate's background when relevant
3. Highlight relevant skills and experiences
4. Follow the STAR method (Situation, Task, Action, Result) when applicable
5. Sound natural and conversational, not robotic or over-formal
`;
};