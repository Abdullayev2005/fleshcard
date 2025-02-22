import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Volume2 } from 'lucide-react';

const Flashcard = () => {
  const { lesson } = useParams();
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isUzbekToJapanese, setIsUzbekToJapanese] = useState(true);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    fetch('/flashcards.json')
      .then(response => response.json())
      .then(json => {
        if (json[lesson]) {
          const randomizedFlashcards = randomizeCards(json[lesson]);
          setFlashcards(randomizedFlashcards);
        } else {
          alert("Bunday dars topilmadi!");
        }
      })
      .catch(error => console.error("Xatolik:", error));
  }, [lesson]);

  const randomizeCards = (cards) => {
    return cards.sort(() => Math.random() - 0.5);
  };

  const handleCardClick = () => setIsFlipped(!isFlipped);

  const handleNext = () => {
    if (currentIndex + 1 < flashcards.length) {
      setIsFlipped(false);
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const toggleLanguage = () => {
    setIsUzbekToJapanese(!isUzbekToJapanese);
  };

  const handleRestart = () => {
    setIsFinished(false);
    setCurrentIndex(0);
    setFlashcards(randomizeCards(flashcards));
  };

  const speakJapanese = () => {
    const utterance = new SpeechSynthesisUtterance();
    utterance.lang = 'ja-JP';
    const currentCard = flashcards[currentIndex] || {};

    // Yapon yozuvidagi belgilarni ajratib olish
    const japaneseText = (currentCard.front.match(/[\u3040-\u30FF\u4E00-\u9FFF]+/g) || []).join(' ');

    if (japaneseText) {
      utterance.text = japaneseText;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (flashcards.length === 0) return <p>⏳ Ma'lumot yuklanmoqda...</p>;

  const currentCard = flashcards[currentIndex] || {};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="max-w-sm w-full p-4 bg-gray-800 shadow-md">
        <div className="relative bg-gray-500 cursor-pointer" onClick={handleCardClick}>
          <div className="p-6 bg-white text-black text-center">
            <h2 className="text-xl font-medium">
              {isFlipped ? (isUzbekToJapanese ? currentCard.back : currentCard.front) : (isUzbekToJapanese ? currentCard.front : currentCard.back)}
            </h2>
          </div>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button onClick={handleNext} className="px-4 py-2 bg-white text-black hover:bg-gray-300">
            Keyingi
          </button>
          <button onClick={toggleLanguage} className="px-4 py-2 bg-white text-black hover:bg-gray-300 items-center">
            Tilni o'zgartirish
          </button>
          <button onClick={speakJapanese} className="px-4 py-2 bg-white text-black hover:bg-gray-300 flex">
            <Volume2 className="mr-2" />
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
