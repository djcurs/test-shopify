
import React, { useState, useCallback, useMemo } from "react";
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
  TextField,
  Select,
  Modal,
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
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [timerToDelete, setTimerToDelete] = useState(null);

  const handleCreateTimer = useCallback(() => {
    setEditingTimer(null);
    setModalOpen(true);
  }, []);

  const handleEditTimer = useCallback((timer) => {
    setEditingTimer(timer);
    setModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((timer) => {
    setTimerToDelete(timer);
    setShowDeleteConfirm(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!timerToDelete) return;
    
    try {
      await deleteTimerMutation.mutateAsync(timerToDelete.id);
      setToastMessage("Timer deleted successfully!");
      setToastActive(true);
      setShowDeleteConfirm(false);
      setTimerToDelete(null);
    } catch (error) {
      setToastMessage("Failed to delete timer");
      setToastActive(true);
    }
  }, [deleteTimerMutation, timerToDelete]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteConfirm(false);
    setTimerToDelete(null);
  }, []);

  const handleModalSuccess = useCallback(() => {
    setToastMessage(editingTimer ? "Timer updated successfully!" : "Timer created successfully!");
    setToastActive(true);
    refetch();
  }, [editingTimer, refetch]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
    setEditingTimer(null);
  }, []);

  // Filter and sort timers
  const filteredAndSortedTimers = useMemo(() => {
    let filtered = timers;

    // Apply search filter
    if (searchQuery.trim()) {
      filtered = timers.filter(timer => 
        timer.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        timer.beforeMessage?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        timer.afterMessage?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sorting (always newest first for dates, alphabetical for text)
    filtered.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "title":
          aValue = a.title || "";
          bValue = b.title || "";
          return aValue.localeCompare(bValue);
        case "status":
          aValue = a.active ? 1 : 0;
          bValue = b.active ? 1 : 0;
          return bValue - aValue; // Active first
        case "startTime":
          aValue = a.startTime ? new Date(a.startTime).getTime() : 0;
          bValue = b.startTime ? new Date(b.startTime).getTime() : 0;
          return bValue - aValue; // Newest first
        case "endTime":
          aValue = a.endTime ? new Date(a.endTime).getTime() : 0;
          bValue = b.endTime ? new Date(b.endTime).getTime() : 0;
          return bValue - aValue; // Newest first
        case "createdAt":
        default:
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          return bValue - aValue; // Newest first
      }
    });

    return filtered;
  }, [timers, searchQuery, sortBy]);

  // Prepare table data
  const tableRows = filteredAndSortedTimers.map((timer) => {
    const status = timer.active 
      ? <Badge tone="success">Active</Badge>
      : <Badge>Inactive</Badge>;

    return [
      <Text variant="bodyMd" fontWeight="bold">{timer.title || "Untitled Timer"}</Text>,
      status,
      timer.beforeMessage || "No message",
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
          onClick={() => handleDeleteClick(timer)}
        >
          Delete
        </Button>
      </InlineStack>,
    ];
  });

  const tableHeadings = [
    "Timer Name",
    "Status",
    "Message",
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
        <TitleBar title="Countdown-Timer" />
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
        title="Countdown-Timer"
        primaryAction={{
          content: "Create Timer",
          onAction: handleCreateTimer,
        }}
      >
        <TitleBar title="Countdown-Timer" />
        
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
                <Box padding="600">
                  <BlockStack gap="400">
                    <InlineStack align="space-between" blockAlign="center">
                      <BlockStack gap="200">
                        <Text variant="headingLg" as="h2" fontWeight="bold">
                          Timer Overview
                        </Text>
                        <Text variant="bodyMd" tone="subdued">
                          Manage your countdown timers
                        </Text>
                      </BlockStack>
                      <InlineStack gap="400" align="center">
                        <Badge tone="info">
                          Total: {timers.length}
                        </Badge>
                        <Badge tone="success">
                          Active: {timers.filter(t => t.active).length}
                        </Badge>
                        {searchQuery.trim() && (
                          <Badge tone="warning">
                            Filtered: {filteredAndSortedTimers.length}
                          </Badge>
                        )}
                      </InlineStack>
                    </InlineStack>
                  </BlockStack>
                </Box>

                {/* Search and Sort Controls */}
                <Box padding="600">
                  <BlockStack gap="400">
                    <InlineStack gap="400" align="space-between">
                      <div style={{ flex: 1, maxWidth: "400px" }}>
                        <TextField
                          label="Search timers"
                          value={searchQuery}
                          onChange={setSearchQuery}
                          placeholder="Search by title or message..."
                          clearButton
                          onClearButtonClick={() => setSearchQuery("")}
                        />
                      </div>
                      <div style={{ minWidth: "200px" }}>
                        <Select
                          label="Sort by"
                          options={[
                            { label: "Created Date", value: "createdAt" },
                            { label: "Title", value: "title" },
                            { label: "Status", value: "status" },
                            { label: "Start Time", value: "startTime" },
                            { label: "End Time", value: "endTime" },
                          ]}
                          value={sortBy}
                          onChange={setSortBy}
                        />
                      </div>
                    </InlineStack>
                    
                    {searchQuery.trim() && (
                      <Text variant="bodySm" tone="subdued">
                        Showing {filteredAndSortedTimers.length} of {timers.length} timers
                      </Text>
                    )}
                  </BlockStack>
                </Box>

                {/* Timer Table */}
                <Box padding="600">
                  <DataTable
                    columnContentTypes={[
                      "text",
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

        {/* Delete Confirmation Modal */}
        <Modal
          open={showDeleteConfirm}
          onClose={handleDeleteCancel}
          title="Delete Timer"
          primaryAction={{
            content: "Delete",
            destructive: true,
            onAction: handleDeleteConfirm,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: handleDeleteCancel,
            },
          ]}
        >
          <Modal.Section>
            <BlockStack gap="400">
              <Text variant="bodyMd">
                Are you sure you want to delete the timer "{timerToDelete?.title || 'Untitled Timer'}"?
              </Text>
              <Text variant="bodySm" tone="subdued">
                This action cannot be undone.
              </Text>
            </BlockStack>
          </Modal.Section>
        </Modal>

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