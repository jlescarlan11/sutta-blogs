'use client';

import { useEffect } from 'react';

interface Props {
  blogId: string;
}

const ViewCounter = ({ blogId }: Props) => {
  useEffect(() => {
    const recordView = async () => {
      try {
        await fetch(`/api/blogs/${blogId}/view`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error recording view:', error);
      }
    };

    recordView();
  }, [blogId]);

  return null;
};

export default ViewCounter; 