import React, { useState } from 'react';
import styles from './PostComments.module.css';

const PostComments = ({ postId }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!newComment.trim() || !name.trim() || !email.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    const newCommentObj = {
      id: comments.length + 1,
      name,
      email,
      content: newComment,
      date: new Date().toLocaleDateString('vi-VN'),
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      likes: 0,
    };

    setComments([newCommentObj, ...comments]);
    setNewComment('');
    setName('');
    setEmail('');
  };

  const handleLike = (commentId) => {
    setComments(comments.map(comment => 
      comment.id === commentId 
        ? { ...comment, likes: comment.likes + 1 }
        : comment
    ));
  };

  return (
    <div className={styles.commentsSection}>
      <h3 className={styles.commentsTitle}>Bình luận ({comments.length})</h3>
      
      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <h4 className={styles.formTitle}>Để lại bình luận</h4>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>Tên *</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email *</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="comment" className={styles.label}>Bình luận *</label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={styles.textarea}
            rows="4"
            required
          />
        </div>
        
        <button type="submit" className={styles.submitButton}>
          Gửi bình luận
        </button>
      </form>
      
      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <div className={styles.commentAuthor}>
                <div className={styles.commentAvatar}>
                  {comment.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className={styles.commentName}>{comment.name}</h4>
                  <span className={styles.commentDate}>
                    {comment.date} lúc {comment.time}
                  </span>
                </div>
              </div>
              <button 
                className={styles.likeButton}
                onClick={() => handleLike(comment.id)}
              >
                <svg className={styles.likeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{comment.likes}</span>
              </button>
            </div>
            <div className={styles.commentContent}>
              <p>{comment.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComments;