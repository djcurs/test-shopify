import { Box, EmptyState, Page, BlockStack } from "@shopify/polaris";

export default function NotFound() {
  return (
    <Page>
      <Box padding="400">
        <EmptyState
          heading="Page not found"
          action={{
            content: "Back to home",
            onAction: () => window.location.href = "/",
          }}
          image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
        >
          <p>The page you're looking for doesn't exist.</p>
        </EmptyState>
      </Box>
    </Page>
  );
}
