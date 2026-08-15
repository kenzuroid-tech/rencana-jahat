import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';

const WelcomeScreen = ({ onSelectUser }) => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate random hearts
    const newHearts = Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      fontSize: `${Math.random() * 15 + 10}px`
    }));
    setHearts(newHearts);
  }, []);

  const handleSelectUser = (user) => {
    // Trigger confetti
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: user === 'Nisho' ? ['#fb7185', '#f43f5e', '#fff'] : ['#38bdf8', '#0284c7', '#fff']
    });

    // Wait a bit before transitioning
    setTimeout(() => {
      onSelectUser(user);
    }, 1200);
  };

  return (
    <div className="welcome-screen">
      {/* Floating Hearts */}
      {hearts.map(heart => (
        <div 
          key={heart.id} 
          className="floating-heart"
          style={{
            left: heart.left,
            animationDuration: heart.animationDuration,
            animationDelay: heart.animationDelay,
            fontSize: heart.fontSize
          }}
        >
          ☆
        </div>
      ))}

      <div className="welcome-card">
        <h1 className="typing-effect">Alphabet Date</h1>
        <p className="typing-effect-delayed">A to Z of our memories.</p>
        
        <div className="user-selection">
          <h3 style={{color: '#cbd5e1', marginBottom: '1.5rem', fontWeight: '500'}}>Kamu siapa????</h3>
          <div className="user-buttons" style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <button className="btn-user btn-playful" onClick={() => handleSelectUser('Nisho')} style={{ flex: 1, padding: '1.25rem', fontSize: '1.2rem' }}>
              Nisho
            </button>
            <button className="btn-user haydar btn-playful" onClick={() => handleSelectUser('Haydar')} style={{ flex: 1, padding: '1.25rem', fontSize: '1.2rem' }}>
              Haydar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
