import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { auth } from '~/lib/firebase-admin';
import { getUserProfile, createProject } from '~/lib/firestore'; // Import createProject
import { getPlanBySlug } from '~/lib/plans';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const authToken = req.headers.get('Authorization')?.split('Bearer ')[1];
    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(authToken);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid auth token' }, { status: 401 });
    }
    const { uid } = decodedToken;

    const userProfile = await getUserProfile(uid);
    if (!userProfile) {
      return NextResponse.json({ error: 'User profile not found' }, { status: 404 });
    }

    const currentPlan = getPlanBySlug(userProfile.plan);
    const maxProjects = currentPlan ? (currentPlan.features.find(f => f.includes("Proje"))?.split(" ")[0] ? parseInt(currentPlan.features.find(f => f.includes("Proje"))?.split(" ")[0] as string) : 0) : 0;

    if (!currentPlan || (currentPlan.name !== "Sınırsız" && userProfile.projectsCount >= maxProjects)) {
      return NextResponse.json({ error: 'Project limit reached.' }, { status: 403 });
    }
    
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [
        {
          role: "system",
          content: `You are an expert startup founder and marketer. A user will give you a basic idea for a project. Your task is to flesh out this idea into a compelling landing page. Generate a JSON object with the following structure. Make sure all text is in Turkish.

          {
            "name": "Proje Adı",
            "title": "Ana Başlık",
            "subtitle": "Alt Başlık",
            "description": "Açıklama",
            "buttonText": "Eyleme Çağrı Butonu Metni",
            "thankYouMessage": "Teşekkür Mesajı",
            "targetAudience": {
              "title": "Hedef Kitle Başlığı",
              "description": "Hedef Kitle Açıklaması"
            },
            "benefits": [
              { "title": "Değer Vaadi 1 Başlık", "description": "Değer Vaadi 1 Açıklama", "icon": "" },
              { "title": "Değer Vaadi 2 Başlık", "description": "Değer Vaadi 2 Açıklama", "icon": "" },
              { "title": "Değer Vaadi 3 Başlık", "description": "Değer Vaadi 3 Açıklama", "icon": "" }
            ],
            "features": [
              { "title": "Özellik 1 Başlık", "description": "Özellik 1 Açıklama", "icon": "" },
              { "title": "Özellik 2 Başlık", "description": "Özellik 2 Açıklama", "icon": "" },
              { "title": "Özellik 3 Başlık", "description": "Özellik 3 Açıklama", "icon": "" }
            ],
            "faqSections": {
              "whoIsItFor": {
                "title": "Kimler İçin?",
                "items": ["Hedef Kitle 1", "Hedef Kitle 2", "Hedef Kitle 3"]
              },
              "whatCanItDo": {
                "title": "Neler Yapabilir?",
                "items": ["Yetenek 1", "Yetenek 2", "Yetenek 3"]
              }
            },
            "footerText": "Alt Bilgi Metni"
          }`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
    });

    const generatedConfig = JSON.parse(completion.choices[0].message.content || '{}');
    
    // You might want to add default values for colors here
    const fullConfig = {
      ...generatedConfig,
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      accentColor: "#3b82f6",
      formFields: { name: true, email: true, phone: false },
    };

    // Create the project in Firestore
    const projectId = await createProject(uid, {
      name: fullConfig.name,
      slug: fullConfig.name.toLowerCase().replace(/\s+/g, '-').slice(0, 50), // Generate a simple slug
      config: fullConfig,
    });

    return NextResponse.json({ ...fullConfig, projectId }); // Return projectId

  } catch (error) {
    console.error('[GENERATE_PROJECT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate project configuration.' }, { status: 500 });
  }
}
