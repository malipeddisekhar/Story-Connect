
// Option 1: Hugging Face API (Free - 30k characters/month)
const HUGGINGFACE_API_KEY = import.meta.env.VITE_HUGGINGFACE_API_KEY || '';

// Option 2: Groq API (Free - Very Fast)
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
// Available Groq models to try (updated with current supported models)
const GROQ_MODELS = [
  'llama-3.1-70b-versatile', 
  'llama-3.1-8b-instant',
  'llama3-groq-70b-8192-tool-use-preview',
  'gemma2-9b-it'
];
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Debug API keys on load
console.log('🔑 API Keys Status:');
console.log('- Hugging Face:', HUGGINGFACE_API_KEY ? 'Available ✅' : 'Missing ❌');
console.log('- Groq:', GROQ_API_KEY ? 'Available ✅' : 'Missing ❌');
if (GROQ_API_KEY) {
  console.log('- Groq Key Preview:', GROQ_API_KEY.substring(0, 10) + '...');
}

export const isAiAvailable = () => !!(GROQ_API_KEY || HUGGINGFACE_API_KEY);

export const generateContentFromTitle = async (title, category = 'General') => {
  console.log('🔍 Starting AI generation for title:', title, 'category:', category);
  console.log('🔑 Available APIs:', { 
    huggingface: !!HUGGINGFACE_API_KEY, 
    groq: !!GROQ_API_KEY 
  });
  
  // Prioritize Groq (primary choice with your key)
  if (GROQ_API_KEY) {
    console.log('🚀 Using Groq API');
    return await generateWithGroq(title, category);
  }
  
  // Try Hugging Face as backup
  if (HUGGINGFACE_API_KEY) {
    console.log('📱 Using Hugging Face API');
    return await generateWithHuggingFace(title, category);
  }
  
  console.error('❌ No AI API key configured');
  throw new Error('NO_API_KEY');
};

// Hugging Face Implementation
const generateWithHuggingFace = async (title, category) => {
  try {
    const prompt = `Title: "${title}"\nCategory: ${category}\n\nWrite a creative story with vivid descriptions, compelling characters, and a satisfying conclusion (500-800 words):\n\n`;
    
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.8,
          do_sample: true,
          return_full_text: false
        }
      })
    });
    
    const result = await response.json();
    return result[0]?.generated_text || '';
  } catch (error) {
    console.error("Hugging Face Error:", error);
    return '';
  }
};

// Groq Implementation (Very Fast & Free)
const generateWithGroq = async (title, category) => {
  console.log('🚀 Groq API - Generating story for:', title);
  try {
    const prompt = `Write a creative ${category.toLowerCase()} story titled "${title}". Make it engaging with vivid descriptions, compelling characters, and a satisfying conclusion. Length: 500-800 words.`;
    console.log('📝 Prompt:', prompt);
    
    const requestBody = {
      model: 'llama-3.1-8b-instant',  // Updated to current supported model
      messages: [{
        role: 'user',
        content: prompt
      }],
      temperature: 0.8,
      max_tokens: 1000,
      stream: false
    };
    
    console.log('📤 Request body:', requestBody);
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });
    
    console.log('🌐 Response status:', response.status);
    console.log('🌐 Response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('🌐 Raw response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ JSON Parse Error:', parseError);
      alert('Failed to parse API response. Check console for details.');
      return '';
    }
    
    console.log('📋 Parsed API Response:', result);
    
    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, result);
      if (result.error) {
        alert(`API Error (${response.status}): ${result.error.message || JSON.stringify(result.error)}`);
      } else {
        alert(`API Error (${response.status}): ${responseText}`);
      }
      return '';
    }
    
    if (result.error) {
      console.error('❌ Groq API Error:', result.error);
      alert(`Groq API Error: ${result.error.message || JSON.stringify(result.error)}`);
      return '';
    }
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error('❌ Unexpected response format:', result);
      alert('Unexpected API response format. Check console for details.');
      return '';
    }
    
    const generatedContent = result.choices[0].message.content || '';
    console.log('✅ Generated content length:', generatedContent.length);
    console.log('✅ Generated content preview:', generatedContent.substring(0, 100) + '...');
    return generatedContent;
  } catch (error) {
    console.error("❌ Groq Error:", error);
    alert(`Network error: ${error.message}. Check your internet connection and API key.`);
    return '';
  }
};

export const polishStoryContent = async (content) => {
  // Try Groq for content polishing
  if (GROQ_API_KEY) {
    return await polishWithGroq(content);
  }
  
  // Fallback to Hugging Face
  if (HUGGINGFACE_API_KEY) {
    return await polishWithHuggingFace(content);
  }
  
  console.warn('No AI API key configured for polishing');
  return content;
};

// Polish content using Groq
const polishWithGroq = async (content) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [{
          role: 'user',
          content: `You are a professional editor. Please improve the following story content for better flow, vocabulary, and engagement while keeping the original meaning intact:\n\n${content}`
        }],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      })
    });
    
    console.log('🌐 Polish response status:', response.status);
    
    const responseText = await response.text();
    console.log('🌐 Polish raw response:', responseText);
    
    let result;
    try {
      result = JSON.parse(responseText);
    } catch (parseError) {
      console.error('❌ Polish JSON Parse Error:', parseError);
      return content; // Return original on parse error
    }
    
    console.log('📋 Polish API Response:', result);
    
    if (!response.ok) {
      console.error('❌ Polish HTTP Error:', response.status, result);
      return content; // Return original on error
    }
    
    if (result.error) {
      console.error('❌ Polish API Error:', result.error);
      return content; // Return original on error
    }
    
    if (!result.choices || !result.choices[0] || !result.choices[0].message) {
      console.error('❌ Polish unexpected response format:', result);
      return content; // Return original on unexpected format
    }
    
    return result.choices[0].message.content || content;
  } catch (error) {
    console.error("❌ Groq Polish Error:", error);
    return content; // Return original on any error
  }
};

// Poland content using Hugging Face
const polishWithHuggingFace = async (content) => {
  try {
    const prompt = `Improve this story for better flow and engagement:\n\n${content}`;
    
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 800,
          temperature: 0.7,
          return_full_text: false
        }
      })
    });
    
    const result = await response.json();
    return result[0]?.generated_text || content;
  } catch (error) {
    console.error("Hugging Face Polish Error:", error);
    return content;
  }
};

export const generateExcerpt = async (content) => {
  // Try Groq for excerpt generation
  if (GROQ_API_KEY) {
    return await generateExcerptWithGroq(content);
  }
  
  // Fallback to Hugging Face
  if (HUGGINGFACE_API_KEY) {
    return await generateExcerptWithHuggingFace(content);
  }
  
  // Final fallback to simple substring
  return content.substring(0, 150) + "...";
};

// Generate excerpt using Groq
const generateExcerptWithGroq = async (content) => {
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [{
          role: 'user',
          content: `Summarize the following story in exactly one compelling sentence (maximum 150 characters):\n\n${content}`
        }],
        temperature: 0.5,
        max_tokens: 50,
      })
    });
    
    const result = await response.json();
    return result.choices[0]?.message?.content?.trim() || content.substring(0, 150) + "...";
  } catch (error) {
    console.error("Groq Excerpt Error:", error);
    return content.substring(0, 150) + "...";
  }
};

// Generate excerpt using Hugging Face
const generateExcerptWithHuggingFace = async (content) => {
  try {
    const prompt = `Summarize this story in one compelling sentence (max 150 chars):\n\n${content}`;
    
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HUGGINGFACE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          max_new_tokens: 60,
          temperature: 0.5,
          return_full_text: false
        }
      })
    });
    
    const result = await response.json();
    return result[0]?.generated_text?.trim() || content.substring(0, 150) + "...";
  } catch (error) {
    console.error("Hugging Face Excerpt Error:", error);
    return content.substring(0, 150) + "...";
  }
};