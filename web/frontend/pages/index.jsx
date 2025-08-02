
import React, { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Button,
  Text,
  Badge,
  ButtonGroup,
  EmptyState,
  Frame,
  Loading,
  Toast,
  Box,
  InlineStack,
  BlockStack,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTimerAPI } from "../../hooks/useTimerAPI";

export default function HomePage() {
  const { useTimers, useDeleteTimer, useToggleTimer } = useTimerAPI();
  const { data: timers = [], isLoading, error } = useTimers();
  const deleteTimerMutation = useDeleteTimer();
  const toggleTimerMutation = useToggleTimer();

  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setToastActive(true);
  }, []);

  const handleToggleActive = useCallback(async (timer) => {
    try {
      await toggleTimerMutation.mutateAsync({
        id: timer.id,
        active: !timer.active,
      });
      showToast(
        timer.active
          ? "Timer deactivated successfully"
          : "Timer activated successfully"
      );
    } catch (error) {
      showToast("Failed to update timer status");
    }
  }, [toggleTimerMutation, showToast]);

  const handleDelete = useCallback(async (timer) => {
    try {
      await deleteTimerMutation.mutateAsync(timer.id);
      showToast("Timer deleted successfully");
    } catch (error) {
      showToast("Failed to delete timer");
    }
  }, [deleteTimerMutation, showToast]);

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimerStatus = (timer) => {
    if (!timer.active) return <Badge tone="critical">Inactive</Badge>;
    
    const now = new Date();
    const startTime = timer.startTime ? new Date(timer.startTime) : null;
    const endTime = timer.endTime ? new Date(timer.endTime) : null;

    if (startTime && now < startTime) {
      return <Badge tone="warning">Scheduled</Badge>;
    }
    if (endTime && now > endTime) {
      return <Badge>Completed</Badge>;
    }
    return <Badge tone="success">Active</Badge>;
  };

  if (isLoading) {
    return (
      <Frame>
        <Loading />
      </Frame>
    );
  }

  if (error) {
    return (
      <Page>
        <TitleBar title="Countdown Timer Dashboard" />
        <Layout>
          <Layout.Section>
            <Box padding="400">
              <div style={{ textAlign: "center" }}>
                <Text tone="critical">
                  Error loading timers: {error.message}
                </Text>
              </div>
            </Box>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const activeTimers = timers.filter(timer => timer.active);

  return (
    <Frame>
      <Page
        title="Countdown Timers"
        primaryAction={{
          content: "Create Timer",
          onAction: () => window.open("/timers/new", "_self"),
        }}
      >
        <TitleBar title="Countdown Timer Dashboard" />
        
        <Layout>
          <Layout.Section>
            {timers.length === 0 ? (
              <Box padding="400">
                <EmptyState
                  heading="Create your first countdown timer"
                  action={{
                    content: "Create Timer",
                    onAction: () => window.open("/timers/new", "_self"),
                  }}
                  image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                >
                  <p>
                    Countdown timers help create urgency and boost conversions. Start by
                    creating your first timer.
                  </p>
                </EmptyState>
              </Box>
            ) : (
              <Box padding="400">
                <BlockStack gap="400">
                  {timers.map((timer) => (
                    <Box
                      key={timer.id}
                      padding="400"
                      background="surface"
                      borderWidth="025"
                      borderRadius="200"
                      borderColor="border"
                    >
                      <BlockStack gap="300">
                        <InlineStack align="space-between" blockAlign="center">
                          <BlockStack gap="100">
                            <Text variant="headingMd" as="h3">
                              {timer.title || "Untitled Timer"}
                            </Text>
                            <Text tone="subdued" variant="bodySm">
                              {timer.productIds?.length || 0} products • {timer.collectionIds?.length || 0} collections
                            </Text>
                          </BlockStack>
                          <InlineStack gap="200" align="center">
                            {getTimerStatus(timer)}
                            <ButtonGroup>
                              <Button
                                size="slim"
                                onClick={() => window.open(`/timers/${timer.id}`, "_self")}
                              >
                                Edit
                              </Button>
                              <Button
                                size="slim"
                                onClick={() => handleToggleActive(timer)}
                                loading={toggleTimerMutation.isLoading}
                              >
                                {timer.active ? "Deactivate" : "Activate"}
                              </Button>
                              <Button
                                size="slim"
                                tone="critical"
                                onClick={() => handleDelete(timer)}
                                loading={deleteTimerMutation.isLoading}
                              >
                                Delete
                              </Button>
                            </ButtonGroup>
                          </InlineStack>
                        </InlineStack>
                        
                        <InlineStack align="space-between" blockAlign="center">
                          <InlineStack gap="400">
                            <div>
                              <Text variant="bodySm" tone="subdued">Start Time</Text>
                              <Text variant="bodyMd">{formatDate(timer.startTime)}</Text>
                            </div>
                            <div>
                              <Text variant="bodySm" tone="subdued">End Time</Text>
                              <Text variant="bodyMd">{formatDate(timer.endTime)}</Text>
                            </div>
                            {timer.duration && (
                              <div>
                                <Text variant="bodySm" tone="subdued">Duration</Text>
                                <Text variant="bodyMd">{timer.duration} minutes</Text>
                              </div>
                            )}
                          </InlineStack>
                          <div>
                            <Text variant="bodySm" tone="subdued">Message</Text>
                            <Text variant="bodyMd">{timer.beforeMessage || "No message"}</Text>
                          </div>
                        </InlineStack>
                      </BlockStack>
                    </Box>
                  ))}
                </BlockStack>
              </Box>
            )}
          </Layout.Section>
        </Layout>

        {/* Toast */}
        {toastActive && (
          <Toast
            content={toastMessage}
            onDismiss={() => setToastActive(false)}
          />
        )}
      </Page>
    </Frame>
  );
}