import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

// Simple AI agent logic with context awareness
function generateResponse(message: string, history: Message[]): string {
  const lowerMessage = message.toLowerCase();

  // Greetings
  if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
    return "Hello! I'm here to assist you. What would you like to know or discuss?";
  }

  // About the agent
  if (lowerMessage.includes('who are you') || lowerMessage.includes('what are you')) {
    return "I'm an AI agent designed to help you with various tasks and answer your questions. I can assist with information, problem-solving, creative tasks, and general conversation.";
  }

  // Capabilities
  if (lowerMessage.includes('what can you do') || lowerMessage.includes('your capabilities')) {
    return "I can help you with:\n\n• Answering questions and providing information\n• Solving problems and offering advice\n• Creative writing and brainstorming\n• Explaining complex topics\n• General conversation\n• Task planning and organization\n\nWhat would you like help with?";
  }

  // Math operations
  const mathMatch = lowerMessage.match(/(?:what is |calculate |solve )?(\d+)\s*([\+\-\*\/])\s*(\d+)/);
  if (mathMatch) {
    const [, num1, operator, num2] = mathMatch;
    const a = parseInt(num1);
    const b = parseInt(num2);
    let result;

    switch (operator) {
      case '+': result = a + b; break;
      case '-': result = a - b; break;
      case '*': result = a * b; break;
      case '/': result = b !== 0 ? a / b : 'undefined (division by zero)'; break;
    }

    return `The answer is ${result}`;
  }

  // Time/Date
  if (lowerMessage.includes('time') || lowerMessage.includes('date') || lowerMessage.includes('today')) {
    const now = new Date();
    return `The current date and time is: ${now.toLocaleString()}`;
  }

  // Help
  if (lowerMessage.includes('help')) {
    return "I'm here to help! You can ask me questions, have a conversation, request calculations, or get information on various topics. Just type your question or request.";
  }

  // Creative writing
  if (lowerMessage.includes('write a story') || lowerMessage.includes('tell me a story')) {
    return "Once upon a time, in a world where AI and humans worked together harmoniously, there was a curious individual who wanted to learn everything they could. Each day brought new questions and discoveries, and with the help of their AI companion, they explored the vast landscape of knowledge, one conversation at a time.";
  }

  // Jokes
  if (lowerMessage.includes('joke') || lowerMessage.includes('funny')) {
    const jokes = [
      "Why did the AI go to therapy? It had too many unresolved issues!",
      "What do you call an AI that loves music? An algorithm!",
      "Why don't AIs ever get lost? They always have their path mapped out!",
    ];
    return jokes[Math.floor(Math.random() * jokes.length)];
  }

  // Context-aware responses
  const lastUserMessage = history.slice().reverse().find(m => m.role === 'user');
  if (lastUserMessage && history.length > 2) {
    if (lowerMessage.includes('more') || lowerMessage.includes('tell me more') || lowerMessage.includes('elaborate')) {
      return "I'd be happy to provide more details! Could you specify which aspect you'd like me to expand on? Feel free to ask a more specific question.";
    }
  }

  // Default intelligent responses
  const responses = [
    `That's an interesting question about "${message}". While I'm a demonstration AI agent, I can engage in thoughtful conversation. Could you provide more context or ask a specific question?`,
    `I understand you're asking about "${message}". I'm designed to be helpful and conversational. What specific information would be most useful to you?`,
    `Thanks for your message! While I may not have real-time knowledge, I can help you think through problems, discuss ideas, or provide general information. What would you like to explore?`,
    `Interesting! "${message}" is a great topic. I'm here to assist with various tasks. Would you like me to help you break this down or approach it from a different angle?`,
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Invalid message' },
        { status: 400 }
      );
    }

    const response = generateResponse(message, history || []);

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
