import { Box, Container, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

export default function NotFound() {
  return (
    <Container size="3" className="py-8">
      <Flex
        direction="column"
        align="center"
        justify="center"
        className="min-h-[50vh]"
      >
        <Box className="text-center">
          <Text size="6" weight="bold" className="mb-4">
            No Search Query
          </Text>
          <Text color="purple" className="mb-6">
            Please enter a search term to find blogs.
          </Text>
          <Link
            href="/"
            className="text-[var(--purple-11)] hover:text-[var(--purple-12)] transition-colors"
          >
            <Text>Return to Home</Text>
          </Link>
        </Box>
      </Flex>
    </Container>
  );
}
