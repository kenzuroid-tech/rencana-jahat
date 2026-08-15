import React from 'react';
import { Camera, CheckCircle2, Lock } from 'lucide-react';

const DateCard = ({ date, isCompleted, isLocked, photo, onClick }) => {
  const handleClick = () => {
    if (!isLocked) {
      onClick(date);
    }
  };
  return (
    <div 
      className={`date-card ${isCompleted ? 'completed' : ''} ${isLocked ? 'locked' : ''}`}
      onClick={handleClick}
    >
      {photo && (
        <div className="card-bg" style={{ backgroundImage: `url(${photo})` }} />
      )}
      <div className="card-content">
        {isLocked ? (
          <div className="locked-content">
            <Lock size={48} className="lock-icon" />
            <h3>Locked</h3>
          </div>
        ) : (
          <>
            <div className="card-header">
              <span className="card-letter">{date.id}</span>
              <span className="card-icon">{date.icon}</span>
            </div>
            <h3 className="card-title">{date.title}</h3>
            
            {isCompleted && (
              <div className="completed-badge">
                <CheckCircle2 size={16} />
                <span>Done</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DateCard;
