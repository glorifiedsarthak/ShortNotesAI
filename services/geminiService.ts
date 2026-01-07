import { GoogleGenAI } from "@google/genai";
import { Chapter, SubjectId, Subject } from '../types';
import { SUBJECTS } from '../constants';

const API_KEY = process.env.API_KEY || '';

// Initialize client
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateNoteContent = async (chapter: Chapter): Promise<string> => {
  const subject = SUBJECTS.find(s => s.id === chapter.subjectId);
  const subjectName = subject ? subject.name : 'Unknown Subject';

  const prompt = `
    You are an expert Class 10 teacher. Create a concise, exam-oriented revision note for the Class 10 NCERT ${subjectName} chapter titled "${chapter.title}".
    
    Format the output in clean, structured Markdown.
    
    Structure the note exactly as follows:
    # ${chapter.title} (Class 10 ${subjectName})
    
    ## 1. Quick Overview
    (A 2-3 sentence summary of the chapter's central theme)

    ## 2. Key Definitions & Terms
    (List 3-5 critical definitions or terms with simple explanations)

    ## 3. Important Formulas / Dates / Events
    (If Math/Science: Formulas; If History: Dates; If English: Character sketch or Themes. Use tables if appropriate.)

    ## 4. Key Concepts (Exam Points)
    *   **Concept 1**: Description
    *   **Concept 2**: Description
    *   (Focus on high-yield topics often asked in exams)

    ## 5. Quick Revision Mnemonics / Tips
    (One or two tips to remember this chapter easily)

    Do not use complex jargon. Keep language student-friendly. Keep the length suitable for a 5-minute read.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // fast response
        temperature: 0.7,
      }
    });
    
    return response.text || "Failed to generate content. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    if (!API_KEY) {
      return "# API Key Missing\n\nPlease provide a valid `API_KEY` in the environment variables to generate notes.";
    }
    return "# Error Generating Note\n\nThere was an error connecting to the AI service. Please check your connection and try again.";
  }
};