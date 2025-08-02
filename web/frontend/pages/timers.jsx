// pages/timers.jsx
import React, { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  Button,
  DataTable,
  Badge,
  Stack,
  TextStyle,
  Toast,
  Frame,
  Loading,
  EmptyState,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTimerAPI } from "../../hooks/useTimerAPI";

export default function TimersPage() {
  const { useTimers, useDeleteTimer, useToggleTimer } = useTimerAPI();
  const { data: timers = [], isLoading, error } = useTimers();
  const deleteTimerMutation = useDeleteTimer();
  const toggleTimerMutation = useToggleTimer();

  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [deleteModalActive, setDeleteModalActive] = useState(false);
  const [timerToDelete, setTimerToDelete] = useState(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
    setToastActive(true);
  }, []);

  const handleDeleteClick = useCallback((timer) => {
    setTimerToDelete(timer);
    setDeleteModalActive(true);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    try {
      await deleteTimerMutation.mutateAsync(timerToDelete.id);
      showToast("Timer deleted successfully");
      setDeleteModalActive(false);
      setTimerToDelete(null);
    } catch (error) {
      showToast("Failed to delete timer");
    }
  }, [deleteTimerMutation, timerToDelete, showToast]);

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
    if (!timer.active) return <Badge status="critical">Inactive</Badge>;
    
    const now = new Date();
    const startTime = timer.startTime ? new Date(timer.startTime) : null;
    const endTime = timer.endTime ? new Date(timer.endTime) : null;

    if (startTime && now < startTime) {
      return <Badge status="attention">Scheduled</Badge>;
    }
    if (endTime && now > endTime) {
      return <Badge>Completed</Badge>;
    }
    return <Badge status="success">Active</Badge>;
  };

  const rows = timers.map((timer) => [
    timer.title || "Untitled Timer",
    getTimerStatus(timer),
    formatDate(timer.startTime),
    formatDate(timer.endTime),
    timer.productIds?.length || 0,
    timer.collectionIds?.length || 0,
    <Stack spacing="tight" key={timer.id}>
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
        destructive
        onClick={() => handleDeleteClick(timer)}
        loading={deleteTimerMutation.isLoading}
      >
        Delete
      </Button>
    </Stack>,
  ]);

  const headings = [
    "Title",
    "Status",
    "Start Time",
    "End Time",
    "Products",
    "Collections",
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
            <Card sectioned>
              <TextContainer>
                <TextStyle variation="negative">
                  Error loading timers: {error.message}
                </TextStyle>
              </TextContainer>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  const emptyStateMarkup = (
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
  );

  return (
    <Frame>
      <Page
        title="Countdown Timers"
        primaryAction={{
          content: "Create Timer",
          onAction: () => window.open("/timers/new", "_self"),
        }}
      >
        <TitleBar title="Countdown Timers" />
        <Layout>
          <Layout.Section>
            {timers.length === 0 ? (
              <Card sectioned>{emptyStateMarkup}</Card>
            ) : (
              <Card>
                <DataTable
                  columnContentTypes={[
                    "text",
                    "text",
                    "text",
                    "text",
                    "numeric",
                    "numeric",
                    "text",
                  ]}
                  headings={headings}
                  rows={rows}
                />
              </Card>
            )}
          </Layout.Section>
        </Layout>

        {/* Delete Confirmation Modal */}
        <Modal
          open={deleteModalActive}
          onClose={() => setDeleteModalActive(false)}
          title="Delete Timer"
          primaryAction={{
            content: "Delete",
            destructive: true,
            loading: deleteTimerMutation.isLoading,
            onAction: handleDeleteConfirm,
          }}
          secondaryActions={[
            {
              content: "Cancel",
              onAction: () => setDeleteModalActive(false),
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <p>
                Are you sure you want to delete "{timerToDelete?.title || 'this timer'}"? 
                This action cannot be undone.
              </p>
            </TextContainer>
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