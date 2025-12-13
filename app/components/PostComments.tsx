// app/components/PostComments.tsx
'use client';

import React, { useState } from 'react';
import styles from './PostComments.module.css';
import { useAddComment, useComments } from '../lib/hooks/useComment';

interface PostCommentsProps {
  postId: string;
}

const PostComments: React.FC<PostCommentsProps> = ({ postId }) => {
  const [newComment, setNewComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  // ✅ Fetch comments từ API
  const { data: comments = [], isLoading, error } = useComments(postId);
  
  // ✅ Mutation để thêm comment
  const addCommentMutation = useAddComment(postId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || !name.trim() || !email.trim()) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    try {
      await addCommentMutation.mutateAsync({
        content: newComment,
        authorName: name,
        authorEmail: email,
      });
      
      // Reset form
      setNewComment('');
      setName('');
      setEmail('');
      
      alert('Bình luận của bạn đã được gửi!');
    } catch (error) {
      alert('Có lỗi xảy ra khi gửi bình luận. Vui lòng thử lại!');
    }
  };

  if (isLoading) {
    return <div className={styles.loading}>Đang tải bình luận...</div>;
  }

  if (error) {
    return <div className={styles.error}>Không thể tải bình luận</div>;
  }

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
            rows={4}
            required
          />
        </div>
        
        <button 
          type="submit" 
          className={styles.submitButton}
          disabled={addCommentMutation.isPending}
        >
          {addCommentMutation.isPending ? 'Đang gửi...' : 'Gửi bình luận'}
        </button>
      </form>
      
      <div className={styles.commentsList}>
        {comments.map((comment) => (
          <div key={comment.id} className={styles.comment}>
            <div className={styles.commentHeader}>
              <div className={styles.commentAuthor}>
                <div className={styles.commentAvatar}>
                  {comment.authorName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className={styles.commentName}>{comment.authorName}</h4>
                  <span className={styles.commentDate}>
                    {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
            <div className={styles.commentContent}>
              <p>{comment.content}</p>
            </div>
            
            {/* Hiển thị replies nếu có */}
            {comment.replies && comment.replies.length > 0 && (
              <div className={styles.replies}>
                {comment.replies.map((reply) => (
                  <div key={reply.id} className={styles.reply}>
                    <div className={styles.commentAuthor}>
                      <div className={styles.commentAvatar}>
                        {reply.authorName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className={styles.commentName}>{reply.authorName}</h4>
                        <span className={styles.commentDate}>
                          {new Date(reply.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    </div>
                    <div className={styles.commentContent}>
                      <p>{reply.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PostComments;