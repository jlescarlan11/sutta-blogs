import { Flex, Text } from "@radix-ui/themes";
import { FC } from "react";

const Footer: FC = () => {
  const currentYear: number = new Date().getFullYear();

  return (
    <footer className="bg-[var(--purple-2)] border-t border-[var(--purple-6)]">
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="py-6 px-4 sm:px-6 lg:px-8 space-y-4"
      >
        <Text size="2" className="text-[var(--purple-11)] text-center">
          &copy; {currentYear} John Lester Escarlan. All rights reserved.
        </Text>
      </Flex>
    </footer>
  );
};

export default Footer;
