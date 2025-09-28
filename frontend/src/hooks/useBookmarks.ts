import { useState, useEffect } from 'react';

const BOOKMARKS_KEY = 'pminsight_bookmarks';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  // Load bookmarks from localStorage on mount
  useEffect(() => {
    try {
      const savedBookmarks = localStorage.getItem(BOOKMARKS_KEY);
      if (savedBookmarks) {
        const bookmarkArray = JSON.parse(savedBookmarks);
        setBookmarks(new Set(bookmarkArray));
        console.log('Loaded bookmarks from localStorage:', bookmarkArray);
      }
      setIsInitialized(true);
    } catch (error) {
      console.error('Error loading bookmarks from localStorage:', error);
      setIsInitialized(true);
    }
  }, []);

  // Save bookmarks to localStorage whenever bookmarks change (but not on initial load)
  useEffect(() => {
    if (!isInitialized) return; // Don't save on initial load
    
    try {
      const bookmarkArray = Array.from(bookmarks);
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(bookmarkArray));
      console.log('Saved bookmarks to localStorage:', bookmarkArray);
    } catch (error) {
      console.error('Error saving bookmarks to localStorage:', error);
    }
  }, [bookmarks, isInitialized]);

  const toggleBookmark = (sectionId: string | number) => {
    const sectionIdStr = sectionId.toString();
    setBookmarks(prev => {
      const newBookmarks = new Set(prev);
      if (newBookmarks.has(sectionIdStr)) {
        newBookmarks.delete(sectionIdStr);
        console.log('Removed bookmark:', sectionIdStr);
      } else {
        newBookmarks.add(sectionIdStr);
        console.log('Added bookmark:', sectionIdStr);
      }
      console.log('Current bookmarks:', Array.from(newBookmarks));
      return newBookmarks;
    });
  };

  const isBookmarked = (sectionId: string | number) => {
    const sectionIdStr = sectionId.toString();
    const isBooked = bookmarks.has(sectionIdStr);
    console.log(`Checking bookmark for ${sectionIdStr}:`, isBooked, 'Current bookmarks:', Array.from(bookmarks));
    return isBooked;
  };

  const clearAllBookmarks = () => {
    setBookmarks(new Set());
  };

  const getBookmarkCount = () => {
    return bookmarks.size;
  };

  return {
    bookmarks,
    toggleBookmark,
    isBookmarked,
    clearAllBookmarks,
    getBookmarkCount
  };
};
