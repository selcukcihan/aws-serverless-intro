import { Word, WordDetail } from "./types";

const API_BASE_URL = "https://wvehuw4cld.execute-api.us-east-1.amazonaws.com/dev/words";

export const fetchAllWords = async (): Promise<Word[]> => {
  try {
    const response = await fetch(API_BASE_URL);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching words:", error);
    throw error;
  }
};

export const fetchWordDetails = async (word: string): Promise<WordDetail> => {
  try {
    const response = await fetch(`${API_BASE_URL}?word=${encodeURIComponent(word)}`);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`Error fetching details for word "${word}":`, error);
    throw error;
  }
};