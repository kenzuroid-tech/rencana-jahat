import React from 'react';
import { Heart } from 'lucide-react';

const WelcomeScreen = ({ onSelectUser }) => {
  return (
    <div className="welcome-screen">
      <div className="welcome-card">
        <Heart size={48} className="welcome-icon" />
        <h1>Alphabet Date</h1>
        <p>A to Z of our memories.</p>
        
        <div className="user-selection">
          <h3>Siapa kamu hari ini?</h3>
          <div className="user-buttons">
            <button className="btn-user" onClick={() => onSelectUser('Nisho')}>
              👧 Nisho
            </button>
            <button className="btn-user haydar" onClick={() => onSelectUser('Haydar')}>
              👦 Haydar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
