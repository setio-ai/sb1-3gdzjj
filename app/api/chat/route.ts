import OpenAI from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Create or load the assistant
const getAssistant = async () => {
  const assistantId = process.env.OPENAI_ASSISTANT_ID;
  
  if (assistantId) {
    return await openai.beta.assistants.retrieve(assistantId);
  }

  // Create a new assistant if no ID exists
  const assistant = await openai.beta.assistants.create({
    name: "Financial Advisor",
    instructions: `You are a knowledgeable financial advisor assistant. Your role is to:
      1. Provide clear, concise financial advice
      2. Explain complex financial concepts in simple terms
      3. Focus on educational content rather than specific investment recommendations
      4. Always remind users to consult with professional financial advisors for personalized advice
      5. Stay within the scope of general financial education and guidance`,
    model: "gpt-4-turbo-preview",
    tools: [{ type: "code_interpreter" }],
  });

  return assistant;
};

export async function POST(req: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured' },
      { status: 500 }
    );
  }

  try {
    const { messages } = await req.json();
    const assistant = await getAssistant();

    // Create a thread
    const thread = await openai.beta.threads.create();

    // Add the user's message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: messages[messages.length - 1].content,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistant.id,
    });

    // Poll for the response
    let response;
    while (true) {
      const runStatus = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      
      if (runStatus.status === 'completed') {
        const messages = await openai.beta.threads.messages.list(thread.id);
        response = messages.data[0].content[0];
        break;
      } else if (runStatus.status === 'failed') {
        throw new Error('Assistant run failed');
      }
      
      // Wait for 1 second before polling again
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    if ('text' in response) {
      return NextResponse.json({
        content: response.text.value,
      });
    } else {
      return NextResponse.json({
        content: "I'm sorry, I couldn't process your request in the expected format.",
      });
    }
  } catch (error: any) {
    console.error('OpenAI API error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to get response from AI',
        details: error.message 
      },
      { status: 500 }
    );
  }
}