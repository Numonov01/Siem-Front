// services/translation.ts
const API_KEY = 'AIzaSyBWEzqtH7W9dbsrX4-IPl_DT_gFIsvzMv4';

export const translateText = async (text: string, targetLanguage: string) => {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
        }),
      }
    );

    const data = await response.json();
    return data.data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
};

export const detectLanguage = async (text: string) => {
  try {
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2/detect?key=${API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          q: text,
        }),
      }
    );

    const data = await response.json();
    return data.data.detections[0][0].language;
  } catch (error) {
    console.error('Language detection error:', error);
    return 'en'; // Default to English if detection fails
  }
};
