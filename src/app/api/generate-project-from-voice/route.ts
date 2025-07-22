import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import formidable from 'formidable';
import fs from 'fs';
import { Writable } from 'stream';
import { auth } from '~/lib/firebase-admin'; // Use admin SDK for server-side auth
import { getUserProfile, decrementVoiceCredits } from '~/lib/firestore';
import { getPlanBySlug } from '~/lib/plans';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

const formidableParse = async (req: Request): Promise<{ fields: formidable.Fields; files: formidable.Files }> => {
    return new Promise((resolve, reject) => {
        const form = formidable({ 
            maxFileSize: 10 * 1024 * 1024, // 10MB
            filter: (part: formidable.Part) => part.name === 'audio' && (part.mimetype?.startsWith('audio/') || false),
        });
        form.parse(req as any, (err: any, fields: formidable.Fields, files: formidable.Files) => {
            if (err) reject(err);
            resolve({ fields, files });
        });
    });
};


const generateProjectConfig = async (prompt: string) => {
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
    
    return {
      ...generatedConfig,
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      accentColor: "#3b82f6",
      formFields: { name: true, email: true, phone: false },
    };
}


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
    const voiceCredits = currentPlan?.features.find(f => f.includes("Sesle Proje Oluşturma"))?.split(" ")[0] ? parseInt(currentPlan?.features.find(f => f.includes("Sesle Proje Oluşturma"))?.split(" ")[0] as string) : 0;

    if (!currentPlan || voiceCredits === 0 || userProfile.voiceCreditsUsed >= voiceCredits) {
        return NextResponse.json({ error: 'Insufficient credits or plan does not support voice generation.' }, { status: 403 });
    }

    const { files } = await formidableParse(req);
    const audioFile = files.audio;

    if (!audioFile) {
        return NextResponse.json({ error: 'No audio file found.' }, { status: 400 });
    }

    const firstAudioFile = Array.isArray(audioFile) ? audioFile[0] : audioFile;

    const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(firstAudioFile.filepath),
        model: 'whisper-1',
    });

    const projectConfig = await generateProjectConfig(transcription.text);

    await decrementVoiceCredits(uid);

    // Clean up the uploaded file
    fs.unlinkSync(firstAudioFile.filepath);

    return NextResponse.json(projectConfig);

  } catch (error) {
    console.error('[VOICE_PROJECT_ERROR]', error);
    return NextResponse.json({ error: 'Failed to generate project from voice.' }, { status: 500 });
  }
} 