
import React, { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Button,
  InlineStack,
  BlockStack,
  Text,
  Badge,
  Box,
  EmptyState,
  Frame,
  Loading,
  DataTable,
  Toast,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTimerAPI } from "../../hooks/useTimerAPI";
import TimerModal from "../components/TimerModal";

export default function HomePage() {
  const { useTimers, useDeleteTimer } = useTimerAPI();
  const { data: timers = [], isLoading, error, refetch } = useTimers();
  const deleteTimerMutation = useDeleteTimer();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTimer, setEditingTimer] = useState(null);
  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleCreateTimer = useCallback(() => {
    setEditingTimer(null);
    setModalOpen(true);
  }, []);

  const handleEditTimer = useCallback((timer) => {
    setEditingTimer(timer);
    setModalOpen(true);
  }, []);

  const handleDeleteTimer = useCallback(async (timerId) => {
    try {
      await deleteTimerMutation.mutateAsync(timerId);
      setToastMessage("Timer deleted successfully!");
      setToastActive(true);
    } catch (error) {
      setToastMessage("Failed to delete timer");
      setToastActive(true);
    }
  }, [deleteTimerMutation]);

  const handleModalSuccess = useCallback(() => {
    setToastMessage(editingTimer ? "Timer updated successfully!" : "Timer created successfully!");
    setToastActive(true);
    refetch();
  }, [editingTimer, refetch]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEditingTimer(null);
  }, []);

  // Prepare table data
  const tableRows = timers.map((timer) => {
    const status = timer.active 
      ? <Badge tone="success">Active</Badge>
      : <Badge>Inactive</Badge>;

    return [
      timer.title || "Untitled Timer",
      status,
      timer.startTime ? new Date(timer.startTime).toLocaleDateString() : "Immediate",
      timer.endTime ? new Date(timer.endTime).toLocaleDateString() : "Duration-based",
      new Date(timer.createdAt).toLocaleDateString(),
      <InlineStack gap="200">
        <Button
          size="slim"
          onClick={() => handleEditTimer(timer)}
        >
          Edit
        </Button>
        <Button
          size="slim"
          tone="critical"
          onClick={() => handleDeleteTimer(timer.id)}
        >
          Delete
        </Button>
      </InlineStack>,
    ];
  });

  const tableHeadings = [
    "Timer Name",
    "Status",
    "Start Time",
    "End Time", 
    "Created",
    "Actions",
  ];

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
        <TitleBar title="Countdown Timers" />
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

  return (
    <Frame>
      <Page
        title="Countdown Timers"
        primaryAction={{
          content: "Create Timer",
          onAction: handleCreateTimer,
        }}
      >
        <TitleBar title="Countdown Timers" />
        
        <Layout>
          <Layout.Section>
            {timers.length === 0 ? (
              <Box padding="400">
                <EmptyState
                  heading="Create your first countdown timer"
                  action={{
                    content: "Create Timer",
                    onAction: handleCreateTimer,
                  }}
                  image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                >
                  <p>
                    Start creating countdown timers to boost your sales with urgency.
                  </p>
                </EmptyState>
              </Box>
            ) : (
              <BlockStack gap="400">
                {/* Timer Stats */}
                <Box padding="400">
                  <BlockStack gap="300">
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="100">
                        <Text variant="headingMd" as="h3">
                          Timer Overview
                        </Text>
                        <Text variant="bodyMd" tone="subdued">
                          Manage your countdown timers
                        </Text>
                      </BlockStack>
                      <InlineStack gap="200" align="center">
                        <Text variant="bodyMd">
                          Total Timers: <strong>{timers.length}</strong>
                        </Text>
                        <Text variant="bodyMd">
                          Active: <strong>{timers.filter(t => t.active).length}</strong>
                        </Text>
                      </InlineStack>
                    </InlineStack>
                  </BlockStack>
                </Box>

                {/* Timer Table */}
                <Box padding="400">
                  <DataTable
                    columnContentTypes={[
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                      "text",
                    ]}
                    headings={tableHeadings}
                    rows={tableRows}
                  />
                </Box>
              </BlockStack>
            )}
          </Layout.Section>
        </Layout>

        {/* Timer Modal */}
        <TimerModal
          open={modalOpen}
          onClose={handleModalClose}
          timer={editingTimer}
          onSuccess={handleModalSuccess}
        />

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