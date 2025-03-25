// functions/index.js
const { onCall } = require("firebase-functions/v2/https");
const { OpenAI } = require("openai");
const logger = require("firebase-functions/logger");

// Initialize OpenAI with the API key from Firebase environment
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY // Make sure this is set in your Firebase environment
});

exports.generateAIResponse = onCall(async (request) => {
  try {
    // Get data from the request
    const { question, userContext } = request.data;
    
    // Create a prompt for the OpenAI API
    const prompt = createInterviewPrompt(question, userContext);
    
    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-4", // or any model you prefer
      messages: [
        {
          role: "system",
          content: "You are an AI interview assistant. Provide concise, professional responses."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    // Return the response
    return {
      text: response.choices[0].message.content.trim(),
      metadata: {
        model: "gpt-4",
        promptTokens: response.usage.prompt_tokens,
        completionTokens: response.usage.completion_tokens
      }
    };
  } catch (error) {
    logger.error("Error generating AI response:", error);
    throw new Error(`Failed to generate response: ${error.message}`);
  }
});

// Create a well-formed prompt for interview assistance
function createInterviewPrompt(question, userContext) {
  return `
You are an AI interview assistant helping with a job interview. 
The interview candidate has the following background:
- Name: ${userContext.name || 'Unknown'}
- Target Position: ${userContext.jobTitle || 'Unknown'}
- Industry: ${userContext.industry || 'Unknown'}
- Years of Experience: ${userContext.experience || 0}
- Key Skills: ${(userContext.skills || []).join(', ')}

Resume Summary:
${userContext.resumeText ? (userContext.resumeText.substring(0, 500) + (userContext.resumeText.length > 500 ? '...' : '')) : 'No resume provided.'}

The interviewer has asked the following question:
"${question}"

Please generate a professional and effective response for this interview question. The response should:
1. Be concise but comprehensive (about 3-4 sentences)
2. Include specific examples from the candidate's background when relevant
3. Highlight relevant skills and experiences
4. Follow the STAR method (Situation, Task, Action, Result) when applicable
5. Sound natural and conversational, not robotic or over-formal
`;
}