"use client";

import { Flex, Text } from "@radix-ui/themes";

const Header = () => {
  return (
    <Flex direction="column" gap="2" className="mb-6">
      <Text size="6" weight="bold">
        Blogs
      </Text>
      <Text>Manage your blog posts and articles</Text>
    </Flex>
  );
};

export default Header;
