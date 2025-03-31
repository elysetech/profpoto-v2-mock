import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { sendSlackNotification } from '@/lib/slack';

export async function POST(request: NextRequest) {
  try {
    const { documentId, text, mathExpressions } = await request.json();

    if (!documentId || !text) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key is not configured' },
        { status: 500 }
      );
    }

    // Get the document from Firestore
    const docRef = doc(db, 'documents', documentId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Document not found' },
        { status: 404 }
      );
    }

    const documentData = docSnap.data();

    // Generate exercise explanation using OpenAI
    const exerciseExplanation = await generateExerciseExplanation(text, mathExpressions);

    // Store the exercise explanation in Firestore
    await updateDoc(docRef, {
      exerciseExplanation: exerciseExplanation,
      exerciseExplanationGeneratedAt: new Date(),
    });

    // Send notification to Slack
    await sendSlackNotification('new_document', {
      userName: 'User',
      documentType: 'exercise_explanation',
      fileType: documentData.fileType,
    });

    return NextResponse.json({ success: true, exerciseExplanation });
  } catch (error) {
    console.error('Error generating exercise explanation:', error);
    return NextResponse.json(
      { error: 'Failed to generate exercise explanation' },
      { status: 500 }
    );
  }
}

async function generateExerciseExplanation(text: string, mathExpressions?: string[]) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    // Prepare the prompt
    let prompt = `Explique les concepts mathématiques nécessaires pour résoudre l'exercice suivant. Identifie les théorèmes, formules et méthodes qui s'appliquent à cet exercice, et explique comment les utiliser dans ce contexte spécifique. N'inclus pas la résolution complète de l'exercice, mais fournis les connaissances théoriques nécessaires.\n\nExercice:\n${text}`;

    if (mathExpressions && mathExpressions.length > 0) {
      prompt += `\n\nExpressions mathématiques détectées:\n${mathExpressions.join('\n')}`;
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4-turbo',
        messages: [
          {
            role: 'system',
            content: 'Tu es un professeur de mathématiques expert, spécialisé dans l\'explication des concepts mathématiques nécessaires pour résoudre des exercices pour les élèves du collège et du lycée.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
  } catch (error) {
    console.error('Error in OpenAI processing:', error);
    throw error;
  }
}
