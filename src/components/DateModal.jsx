import React, { useState, useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon, Star } from 'lucide-react';
import { uploadPhoto } from '../utils/storage';

const DateModal = ({ date, data, currentUser, onClose, onUpdateData }) => {
  const nishoFileInputRef = useRef(null);
  const haydarFileInputRef = useRef(null);
  const [isUploadingNisho, setIsUploadingNisho] = useState(false);
  const [isUploadingHaydar, setIsUploadingHaydar] = useState(false);
  const [nishoRating, setNishoRating] = useState(data.nisho_rating || data.rating || 0);
  const [nishoReview, setNishoReview] = useState(data.nisho_review || data.review || '');
  const [haydarRating, setHaydarRating] = useState(data.haydar_rating || 0);
  const [haydarReview, setHaydarReview] = useState(data.haydar_review || '');

  const isCompleted = data.is_completed;
  const nishoPhoto = data.nisho_photo_url || data.photo_url; // fallback to old photo for Nisho if needed
  const haydarPhoto = data.haydar_photo_url;

  const handleFileChange = async (e, username) => {
    const file = e.target.files[0];
    if (file) {
      if (username === 'Nisho') setIsUploadingNisho(true);
      else setIsUploadingHaydar(true);

      const publicUrl = await uploadPhoto(date.id, file, username);
      
      if (publicUrl) {
        if (username === 'Nisho') onUpdateData(date.id, { nisho_photo_url: publicUrl });
        else onUpdateData(date.id, { haydar_photo_url: publicUrl });
      }
      
      if (username === 'Nisho') setIsUploadingNisho(false);
      else setIsUploadingHaydar(false);
    }
  };

  const handleComplete = () => {
    onUpdateData(date.id, { 
      is_completed: true, 
      posted_by: currentUser 
    });
  };

  const handleSaveReview = () => {
    if (currentUser === 'Nisho') {
      onUpdateData(date.id, { nisho_rating: nishoRating, nisho_review: nishoReview });
    } else {
      onUpdateData(date.id, { haydar_rating: haydarRating, haydar_review: haydarReview });
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-icon">{date.icon}</div>
          <h2>{date.title}</h2>
          <span className="modal-letter">Letter {date.id}</span>
        </div>

        <p className="modal-description">{date.description}</p>

        <div className="modal-actions">
          {!isCompleted ? (
            <button className="btn-primary" onClick={handleComplete}>
              <Check size={20} />
              Mark as Completed by {currentUser}
            </button>
          ) : (
            <div className="completed-section">
              <div className="status-badge success">
                <Check size={18} /> Completed {data.posted_by ? `with ${data.posted_by}` : ''}
              </div>
              
              <div className="photos-container">
                {/* Nisho's Photo */}
                <div className="photo-upload-section">
                  <h4>👧 Nisho's Memory</h4>
                  {nishoPhoto ? (
                    <div className="photo-preview">
                      <img src={nishoPhoto} alt="Nisho Memory" />
                      {currentUser === 'Nisho' && (
                        <button className="btn-secondary" onClick={() => nishoFileInputRef.current.click()}>
                          <Upload size={16} /> Change Photo
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={`photo-placeholder ${currentUser !== 'Nisho' ? 'disabled' : ''}`} onClick={() => currentUser === 'Nisho' && nishoFileInputRef.current.click()}>
                      <ImageIcon size={32} />
                      {currentUser === 'Nisho' ? (
                        <>
                          <span>Upload your memory</span>
                          <button className="btn-secondary mt-2">
                             <Upload size={16} /> Select Photo
                          </button>
                        </>
                      ) : <span>Nisho belum upload foto</span>}
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={nishoFileInputRef} 
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'Nisho')}
                    disabled={isUploadingNisho}
                  />
                  {isUploadingNisho && <span className="upload-status">Uploading...</span>}
                </div>

                {/* Haydar's Photo */}
                <div className="photo-upload-section">
                  <h4>👦 Haydar's Memory</h4>
                  {haydarPhoto ? (
                    <div className="photo-preview">
                      <img src={haydarPhoto} alt="Haydar Memory" />
                      {currentUser === 'Haydar' && (
                        <button className="btn-secondary" onClick={() => haydarFileInputRef.current.click()}>
                          <Upload size={16} /> Change Photo
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className={`photo-placeholder ${currentUser !== 'Haydar' ? 'disabled' : ''}`} onClick={() => currentUser === 'Haydar' && haydarFileInputRef.current.click()}>
                      <ImageIcon size={32} />
                      {currentUser === 'Haydar' ? (
                        <>
                          <span>Upload your memory</span>
                          <button className="btn-secondary mt-2">
                             <Upload size={16} /> Select Photo
                          </button>
                        </>
                      ) : <span>Haydar belum upload foto</span>}
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={haydarFileInputRef} 
                    style={{ display: 'none' }}
                    onChange={(e) => handleFileChange(e, 'Haydar')}
                    disabled={isUploadingHaydar}
                  />
                  {isUploadingHaydar && <span className="upload-status">Uploading...</span>}
                </div>
              </div>

              {/* Rating & Review Section */}
              <div className="review-container">
                
                {/* Nisho's Review */}
                <div className={`review-box ${currentUser === 'Nisho' ? 'active-user' : ''}`}>
                  <h3>👧 Nisho's Review</h3>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={20} 
                        className={star <= nishoRating ? "star filled" : "star"} 
                        onClick={() => currentUser === 'Nisho' && setNishoRating(star)}
                      />
                    ))}
                  </div>
                  {currentUser === 'Nisho' ? (
                    <textarea 
                      className="review-input"
                      placeholder="Ceritakan momen terbaik dari kencan ini..."
                      value={nishoReview}
                      onChange={(e) => setNishoReview(e.target.value)}
                    />
                  ) : (
                    <div className="read-only-review">
                      {nishoReview ? <p>{nishoReview}</p> : <p className="empty-text">Nisho belum menulis review.</p>}
                    </div>
                  )}
                  
                  {currentUser === 'Nisho' && (nishoRating !== (data.nisho_rating || data.rating || 0) || nishoReview !== (data.nisho_review || data.review || '')) && (
                    <button className="btn-secondary save-review-btn" onClick={handleSaveReview}>
                      Save Review
                    </button>
                  )}
                </div>

                {/* Haydar's Review */}
                <div className={`review-box ${currentUser === 'Haydar' ? 'active-user' : ''}`}>
                  <h3>👦 Haydar's Review</h3>
                  <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={20} 
                        className={star <= haydarRating ? "star filled" : "star"} 
                        onClick={() => currentUser === 'Haydar' && setHaydarRating(star)}
                      />
                    ))}
                  </div>
                  {currentUser === 'Haydar' ? (
                    <textarea 
                      className="review-input"
                      placeholder="Ceritakan momen terbaik dari kencan ini..."
                      value={haydarReview}
                      onChange={(e) => setHaydarReview(e.target.value)}
                    />
                  ) : (
                    <div className="read-only-review">
                      {haydarReview ? <p>{haydarReview}</p> : <p className="empty-text">Haydar belum menulis review.</p>}
                    </div>
                  )}
                  
                  {currentUser === 'Haydar' && (haydarRating !== (data.haydar_rating || 0) || haydarReview !== (data.haydar_review || '')) && (
                    <button className="btn-secondary save-review-btn" onClick={handleSaveReview}>
                      Save Review
                    </button>
                  )}
                </div>

              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateModal;
