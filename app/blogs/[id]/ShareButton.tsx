'use client';

import { FaShareAlt } from 'react-icons/fa';

interface Props {
  blogId: string;
}

const ShareButton = ({ blogId }: Props) => {
  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/blogs/${blogId}`;
      
      if (navigator.share) {
        await navigator.share({
          title: 'Check out this blog post',
          url: url,
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing blog:', error);
    }
  };

  return (
    <FaShareAlt 
      className="cursor-pointer" 
      onClick={handleShare}
    />
  );
};

export default ShareButton; 