import React from 'react';
import Image from 'next/image';
import styles from './AuthorBio.module.css';

const AuthorBio = ({ authorName, authorAvatar, bio }) => {
  return (
    <div className={styles.authorBio}>
      <div className={styles.avatarContainer}>
        <Image
          src={authorAvatar || '/images/avatar-default.png'}
          alt={authorName}
          width={80}
          height={80}
          className={styles.avatar}
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{authorName}</h3>
        <p className={styles.bio}>{bio}</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>42</span>
            <span className={styles.statLabel}>Bài viết</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>1.2K</span>
            <span className={styles.statLabel}>Followers</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>350</span>
            <span className={styles.statLabel}>Following</span>
          </div>
        </div>
        <button className={styles.followButton}>Follow</button>
      </div>
    </div>
  );
};

export default AuthorBio;