import React, { useState, useEffect } from 'react';
import { dates } from './data/dates';
import DateCard from './components/DateCard';
import DateModal from './components/DateModal';
import WelcomeScreen from './components/WelcomeScreen';
import { saveDateData, getAllDateData } from './utils/storage';
import { Heart, Sparkles, Star } from 'lucide-react';

function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('currentUser') || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [dateDataMap, setDateDataMap] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const dataMap = await getAllDateData();
      setDateDataMap(dataMap);
      setIsLoading(false);
    };

    if (currentUser) {
      document.documentElement.className = `theme-${currentUser.toLowerCase()}`;
      loadData();
    } else {
      document.documentElement.className = '';
    }
  }, [currentUser]);

  const handleSelectUser = (name) => {
    localStorage.setItem('currentUser', name);
    setCurrentUser(name);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  }

  const handleCardClick = (date) => {
    setSelectedDate(date);
  };

  const handleCloseModal = () => {
    setSelectedDate(null);
  };

  const handleUpdateDateData = async (id, dataToUpdate) => {
    const existingData = dateDataMap[id] || {};
    const newData = { ...existingData, ...dataToUpdate };
    
    // Optimistic UI update
    setDateDataMap(prev => ({ ...prev, [id]: newData }));
    
    // Save to DB
    await saveDateData(id, newData);
  };

  if (!currentUser) {
    return <WelcomeScreen onSelectUser={handleSelectUser} />;
  }

  if (isLoading) {
    return <div className="app-container"><div className="header"><h1>Loading Memories...</h1></div></div>;
  }

  return (
    <div className="app-container">
      {/* Background Ornaments */}
      <div className="ornaments-container">
        <Heart className="ornament o-1" size={32} />
        <Sparkles className="ornament o-2" size={48} />
        <Star className="ornament o-3" size={24} />
        <Heart className="ornament o-4" size={40} />
        <Sparkles className="ornament o-5" size={28} />
      </div>

      <header className="header">
        <div className="header-top">
          <span className="user-badge">Hello, {currentUser} 👋</span>
          <button className="btn-text" onClick={handleLogout}>Switch User</button>
        </div>
        <h1>Alphabet Date A-Z</h1>
        <p>A beautifully curated journey of romance and memories.</p>
      </header>

      <main className="date-grid">
        {(() => {
          let isPreviousCompleted = true;
          return dates.map((date, index) => {
            const data = dateDataMap[date.id] || {};
            const isCompleted = data.is_completed;
            const hasReview = !!data.nisho_review || !!data.haydar_review || !!data.review;
            
            const isLocked = index > 0 ? !isPreviousCompleted : false;
            
            // Only unlock the next if current is completed AND has a review
            isPreviousCompleted = isCompleted && hasReview;

            const nishoPhoto = data.nisho_photo_url;
            const haydarPhoto = data.haydar_photo_url;
            const fallbackPhoto = data.photo_url;

            const displayPhoto = currentUser === 'Nisho' 
              ? (nishoPhoto || haydarPhoto || fallbackPhoto) 
              : (haydarPhoto || nishoPhoto || fallbackPhoto);

            return (
              <DateCard
                key={date.id}
                date={date}
                isCompleted={isCompleted}
                isLocked={isLocked}
                photo={displayPhoto}
                onClick={handleCardClick}
              />
            );
          });
        })()}
      </main>

      {selectedDate && (
        <DateModal
          date={selectedDate}
          data={dateDataMap[selectedDate.id] || {}}
          currentUser={currentUser}
          onClose={handleCloseModal}
          onUpdateData={handleUpdateDateData}
        />
      )}
    </div>
  );
}

export default App;
