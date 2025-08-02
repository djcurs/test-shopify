import { Box, Page, Layout, Text, BlockStack } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTranslation } from "react-i18next";

export default function PageName() {
  const { t } = useTranslation();
  return (
    <Page>
      <TitleBar title={t("PageName.title")}>
        <button variant="primary" onClick={() => console.log("Primary action")}>
          {t("PageName.primaryAction")}
        </button>
        <button onClick={() => console.log("Secondary action")}>
          {t("PageName.secondaryAction")}
        </button>
      </TitleBar>
      <Layout>
        <Layout.Section>
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Page name
              </Text>
              <Text variant="bodyMd">
                Use this page to build your app to the specifications in the
                project brief found within the README.md file in this workspace.
              </Text>
            </BlockStack>
          </Box>
        </Layout.Section>
        <Layout.Section>
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Resources
              </Text>
              <Text variant="bodyMd">
                Ready to get started? Check out{" "}
                <a
                  target="_blank"
                  href="https://shopify.dev/docs/apps/getting-started"
                  rel="noreferrer"
                >
                  Shopify app development
                </a>
                .
              </Text>
            </BlockStack>
          </Box>
        </Layout.Section>
        <Layout.Section>
          <Box padding="400">
            <BlockStack gap="400">
              <Text variant="headingMd" as="h2">
                Next steps
              </Text>
              <Text variant="bodyMd">
                Explore the codebase to understand how the different parts work,
                from the UI components in the web/frontend directory to the
                Shopify CLI commands that power the backend.
              </Text>
            </BlockStack>
          </Box>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
