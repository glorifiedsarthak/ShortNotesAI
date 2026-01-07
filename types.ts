export enum SubjectId {
  SCIENCE = 'science',
  MATHS = 'maths',
  SOCIAL_SCIENCE = 'social_science',
  ENGLISH = 'english'
}

export interface Chapter {
  id: string;
  title: string;
  subjectId: SubjectId;
}

export interface Subject {
  id: SubjectId;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface NoteContent {
  chapterId: string;
  content: string; // Markdown content
  lastUpdated: number;
}

export interface CachedNote {
  [chapterId: string]: NoteContent;
}

export interface UserPreferences {
  bookmarks: string[]; // List of chapter IDs
}