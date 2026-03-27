// Simple test to verify Gemini API is working
import { GoogleGenerativeAI } from '@google/generative-ai';

export const testGeminiAPI = async () => {
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  
  if (!API_KEY) {
    console.error('No API key found');
    return false;
  }

  try {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const result = await model.generateContent('Say hello in JSON format');
    const response = await result.response;
    const text = response.text();
    
    console.log('Gemini API test successful:', text);
    return true;
  } catch (error) {
    console.error('Gemini API test failed:', error);
    return false;
  }
};
