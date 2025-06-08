'use client';

import { useState } from 'react';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import { Flex, Text } from '@radix-ui/themes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Props {
  blogId: string;
  initialLikes: number;
  isLiked: boolean;
}

const LikeButton = ({ blogId, initialLikes, isLiked: initialIsLiked }: Props) => {
  const { data: session } = useSession();
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const router = useRouter();

  const handleLike = async () => {
    if (!session) {
      router.push('/api/auth/signin');
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.likes);
        setIsLiked(data.isLiked);
      }
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  return (
    <Flex
      gap="1"
      align="center"
      className="cursor-pointer"
      onClick={handleLike}
    >
      {isLiked ? (
        <FaHeart className="text-red-500" />
      ) : (
        <FaRegHeart />
      )}
      <Text size="2">{likes}</Text>
    </Flex>
  );
};

export default LikeButton; 