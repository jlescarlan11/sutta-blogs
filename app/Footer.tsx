import { Flex, Text } from "@radix-ui/themes";

export default function Footer() {
  return (
    <footer className="bg-[var(--purple-2)] border-t border-[var(--purple-6)] flex items-center justify-center">
      <Flex className="py-6 px-4 sm:px-6 lg:px-8">
        <Text size="2" className="text-[var(--purple-11)] text-center">
          &copy; {new Date().getFullYear()} John Lester Escarlan. All rights
          reserved.
        </Text>
      </Flex>
    </footer>
  );
}
