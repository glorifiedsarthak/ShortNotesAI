import { NoteContent } from '../types';

const NOTES_CACHE_KEY = 'shortnotex_notes_cache';
const BOOKMARKS_KEY = 'shortnotex_bookmarks';

export const saveNoteToCache = (chapterId: string, content: string) => {
  try {
    const existingCache = getCachedNotes();
    const newCache = {
      ...existingCache,
      [chapterId]: {
        chapterId,
        content,
        lastUpdated: Date.now()
      }
    };
    localStorage.setItem(NOTES_CACHE_KEY, JSON.stringify(newCache));
  } catch (e) {
    console.error("Storage limit reached or error", e);
  }
};

export const getCachedNotes = (): Record<string, NoteContent> => {
  try {
    const raw = localStorage.getItem(NOTES_CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

export const getCachedNote = (chapterId: string): NoteContent | null => {
  const cache = getCachedNotes();
  return cache[chapterId] || null;
};

export const toggleBookmark = (chapterId: string): boolean => {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    let bookmarks: string[] = raw ? JSON.parse(raw) : [];
    
    const isBookmarked = bookmarks.includes(chapterId);
    if (isBookmarked) {
      bookmarks = bookmarks.filter(id => id !== chapterId);
    } else {
      bookmarks.push(chapterId);
    }
    
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarks));
    return !isBookmarked;
  } catch (e) {
    return false;
  }
};

export const getBookmarks = (): string[] => {
  try {
    const raw = localStorage.getItem(BOOKMARKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};