export type Subject = 'Mathematics' | 'Science' | 'IT';
export type PaperType = 'Past Paper' | 'Model Paper';

export interface Paper {
  id: string;
  subject: Subject;
  type: PaperType;
  title: string;          // e.g. "2023 O/L Mathematics Paper I"
  year: string;           // e.g. "2023"
  fileUrl: string;        // question paper PDF (Firebase Storage URL)
  answerUrl: string;      // answers / marking scheme PDF (optional)
  solutionNotes: string;  // free-text solution method / walkthrough (optional)
  createdAt: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];      // exactly 4 options
  correctIndex: number;   // 0-3
  explanation: string;    // why the answer is correct / method
}

export interface Quiz {
  id: string;
  subject: Subject;
  title: string;
  description: string;
  questions: QuizQuestion[];
  createdAt: number;
}

export interface SpecialQuestion {
  id: string;
  subject: Subject;
  questionText: string;   // optional if questionImage is set
  questionImage: string;  // base64 data URL (compressed), optional if questionText is set
  explanationText: string;   // optional if explanationImage is set
  explanationImage: string;  // base64 data URL (compressed), optional
  createdAt: number;
}
