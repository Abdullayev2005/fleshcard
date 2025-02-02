import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const Flashcard = () => {
  const { lesson } = useParams(); // URL-dan dars nomini olish
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUzbekToJapanese, setIsUzbekToJapanese] = useState(true); // Tilni aniqlash
  const [isFinished, setIsFinished] = useState(false); // So'zlar tugagach, tugma ko'rsatiladi

  // JSON faylini o'qish va URL-ga mos darsni olish
  useEffect(() => {
    fetch('/flashcards.json') // JSON faylini yuklash
      .then(response => response.json())
      .then(json => {
        if (json[lesson]) {
          const randomizedFlashcards = randomizeCards(json[lesson]); // So'zlarni tasodifiy tartibda olish
          setFlashcards(randomizedFlashcards); // URL ga mos darsni olish
        } else {
          alert("Bunday dars topilmadi!");
        }
      })
      .catch(error => console.error("Xatolik:", error));
  }, [lesson]);

  // So'zlarni tasodifiy tartibda aralashtirish
  const randomizeCards = (cards) => {
    return cards.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    if (currentIndex + 1 < flashcards.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1); // Keyingi so'zni ko'rsatish
    } else {
      setIsFinished(true); // So'zlar tugadi, "Restart" tugmasini ko'rsatish
    }
  };

  const toggleLanguage = () => {
    setIsUzbekToJapanese(!isUzbekToJapanese); // Tilni o'zgartirish
  };

  const handleRestart = () => {
    setIsFinished(false); // "Restart" tugmasi ko'rinmasligi uchun
    setCurrentIndex(0); // So'zlarni boshidan boshlash
    setFlashcards(randomizeCards(flashcards)); // So'zlarni yana randomlashtirish
  };

  if (flashcards.length === 0) return <p>⏳ Ma'lumot yuklanmoqda...</p>;

  const currentCard = flashcards[currentIndex] || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-sm w-full p-4 bg-gray-600 rounded-lg shadow-md">
        <div className="relative bg-gray-500 rounded-lg cursor-pointer" onClick={handleCardClick}>
          <div className="p-6 rounded-lg bg-white text-black text-center">
            <h2 className="text-xl font-medium">
              {isFlipped ? (isUzbekToJapanese ? currentCard.back : currentCard.front) : (isUzbekToJapanese ? currentCard.front : currentCard.back)}
            </h2>
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <button onClick={handleNext} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300">
            Keyingi
          </button>
          <button onClick={toggleLanguage} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300">
            Tilni o'zgartirish
          </button>
        </div>
        {isFinished && (
          <div className="mt-4 flex justify-center">
            <button onClick={handleRestart} className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-300">
              Restart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Flashcard;
