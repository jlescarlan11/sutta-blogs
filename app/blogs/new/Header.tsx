"use client";

import { Button, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

const Header = () => {
  return (
    <Flex
      justify="between"
      align="center"
      className=" mb-6"
      wrap="wrap-reverse"
      gap="4"
    >
      <Flex direction="column" gap="2">
        <Text size="6" weight="bold">
          Create New Blog
        </Text>
        <Text>Create new blog and share it to people</Text>
      </Flex>
      <Link href="/blogs">
        <Button variant="soft" size="3">
          Navigate Back
        </Button>
      </Link>
    </Flex>
  );
};

export default Header;
