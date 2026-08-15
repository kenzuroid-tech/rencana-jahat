import React, { useState, useRef } from 'react';
import { X, Upload, Check, Image as ImageIcon, Star } from 'lucide-react';
import { uploadPhoto } from '../utils/storage';

const DateModal = ({ date, data, currentUser, onClose, onUpdateData }) => {
  const fileInputRef = useRef(null);
  const [isUploading, setIsUploading] = useState(false);
  const [rating, setRating] = useState(data.rating || 0);
  const [review, setReview] = useState(data.review || '');

  const isCompleted = data.is_completed;
  const photo = data.photo_url;

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const publicUrl = await uploadPhoto(date.id, file);
      if (publicUrl) {
        onUpdateData(date.id, { photo_url: publicUrl });
      }
      setIsUploading(false);
    }
  };

  const handleComplete = () => {
    onUpdateData(date.id, { 
      is_completed: true, 
      posted_by: currentUser 
    });
  };

  const handleSaveReview = () => {
    onUpdateData(date.id, { rating, review });
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
              
              <div className="photo-upload-section">
                {photo ? (
                  <div className="photo-preview">
                    <img src={photo} alt="Memory" />
                    <button className="btn-secondary" onClick={() => fileInputRef.current.click()}>
                      <Upload size={16} /> Change Photo
                    </button>
                  </div>
                ) : (
                  <div className="photo-placeholder" onClick={() => fileInputRef.current.click()}>
                    <ImageIcon size={32} />
                    <span>Upload a memory from this date</span>
                    <button className="btn-secondary mt-2">
                       <Upload size={16} /> Select Photo
                    </button>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  ref={fileInputRef} 
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                {isUploading && <span className="upload-status">Uploading...</span>}
              </div>

              {/* Rating & Review Section */}
              <div className="review-section">
                <h3>Rate this Date</h3>
                <div className="star-rating">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star} 
                      size={24} 
                      className={star <= rating ? "star filled" : "star"} 
                      onClick={() => setRating(star)}
                    />
                  ))}
                </div>
                
                <textarea 
                  className="review-input"
                  placeholder="Ceritakan momen terbaik dari kencan ini..."
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                />
                
                {(rating !== data.rating || review !== data.review) && (
                  <button className="btn-secondary save-review-btn" onClick={handleSaveReview}>
                    Save Review
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DateModal;
