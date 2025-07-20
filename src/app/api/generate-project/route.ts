import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'OpenAI API key not configured. Please set OPENAI_API_KEY in your environment variables.' },
      { status: 500 }
    );
  }

  const { userInput } = await request.json();

  if (!userInput) {
    return NextResponse.json({ error: 'User input is required.' }, { status: 400 });
  }

  const prompt = `
    You are an expert startup consultant and copywriter. A user will provide an idea for a startup or project.
    Your task is to generate a complete configuration for a waitlist landing page based on this idea.
    The output must be a valid JSON object that strictly follows the structure provided below. Do not include any extra text or explanations outside of the JSON object.

    User's Idea: "${userInput}"

    Generate the following fields:
    - name: A catchy and short name for the project.
    - title: A powerful headline (max 10 words).
    - subtitle: An engaging sub-headline (max 15 words).
    - description: A short paragraph explaining the value proposition.
    - formFields: An object with booleans for 'name', 'email', 'phone'. Enable 'name' and 'email' by default.
    - buttonText: A compelling call-to-action for the signup button.
    - thankYouMessage: A friendly confirmation message after signup.
    - targetAudience: An object with a 'title' (e.g., "Who is this for?") and a 'description' of the ideal user.
    - benefits: An array of 3 objects, each with an 'icon' (a single relevant emoji), a 'title', and a 'description' highlighting a key benefit.
    - features: An array of 3 objects, each with an 'icon' (a single relevant emoji), a 'title', and a 'description' explaining a core feature.
    - faqSections: An object containing two sections: 'whoIsItFor' and 'whatCanItDo'. Each section should have a 'title' and an array of 'items' (strings) answering common questions.
    - footerText: A professional footer text, including the current year and the project name.

    JSON Structure to follow:
    {
      "name": "string",
      "title": "string",
      "subtitle": "string",
      "description": "string",
      "formFields": {
        "name": boolean,
        "email": boolean,
        "phone": boolean
      },
      "buttonText": "string",
      "thankYouMessage": "string",
      "targetAudience": {
        "title": "string",
        "description": "string"
      },
      "benefits": [
        { "icon": "string", "title": "string", "description": "string" },
        { "icon": "string", "title": "string", "description": "string" },
        { "icon": "string", "title": "string", "description": "string" }
      ],
      "features": [
        { "icon": "string", "title": "string", "description": "string" },
        { "icon": "string", "title": "string", "description": "string" },
        { "icon": "string", "title": "string", "description": "string" }
      ],
      "faqSections": {
        "whoIsItFor": { "title": "string", "items": ["string"] },
        "whatCanItDo": { "title": "string", "items": ["string"] }
      },
      "footerText": "string"
    }
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' },
    });

    const generatedConfig = JSON.parse(completion.choices[0].message.content || '{}');

    return NextResponse.json(generatedConfig);
  } catch (error) {
    console.error('OpenAI API error:', error);
    return NextResponse.json({ error: 'Failed to generate project configuration from AI.' }, { status: 500 });
  }
}
