
import React from 'react';

interface AvatarProps {
  name: string;
  imageUrl: string | null;
  sizeClassName?: string;
  textClassName?: string;
}

const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, sizeClassName = 'w-24 h-24', textClassName = 'text-5xl' }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`${name}'s profile picture`}
        className={`${sizeClassName} rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClassName} rounded-full bg-accent-primary flex items-center justify-center`}
      aria-label={`Profile picture for ${name}`}
    >
      <span className={`${textClassName} text-accent-text font-bold`}>
        {initial}
      </span>
    </div>
  );
};

export default Avatar;
