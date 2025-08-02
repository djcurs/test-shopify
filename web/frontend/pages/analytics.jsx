import React, { useState } from "react";
import {
  Page,
  Layout,
  Select,
  InlineStack,
  BlockStack,
  Text,

  DataTable,
  Badge,
  Frame,
  Loading,
  EmptyState,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTimerAPI } from "../../hooks/useTimerAPI";

export default function AnalyticsPage() {
  const { useTimers } = useTimerAPI();
  const { data: timers = [], isLoading, error } = useTimers();
  
  const [timeRange, setTimeRange] = useState("30");

  const timeRangeOptions = [
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 90 days", value: "90" },
    { label: "All time", value: "all" },
  ];

  // Calculate analytics data from timers
  const analyticsData = React.useMemo(() => {
    if (!timers.length) return null;

    const activeTimers = timers.filter(t => t.active);
    const completedTimers = timers.filter(t => {
      if (!t.endTime) return false;
      return new Date(t.endTime) < new Date();
    });

    // Mock analytics data - in real app, this would come from your backend
    const totalViews = timers.reduce((sum, timer) => {
      return sum + (timer.analytics?.views || Math.floor(Math.random() * 1000));
    }, 0);

    const totalConversions = timers.reduce((sum, timer) => {
      return sum + (timer.analytics?.conversions || Math.floor(Math.random() * 50));
    }, 0);

    const conversionRate = totalViews > 0 ? ((totalConversions / totalViews) * 100).toFixed(2) : 0;

    return {
      totalTimers: timers.length,
      activeTimers: activeTimers.length,
      completedTimers: completedTimers.length,
      totalViews,
      totalConversions,
      conversionRate,
    };
  }, [timers]);

  // Prepare table data for timer performance
  const tableRows = timers.map((timer) => {
    const views = timer.analytics?.views || Math.floor(Math.random() * 1000);
    const conversions = timer.analytics?.conversions || Math.floor(Math.random() * 50);
    const conversionRate = views > 0 ? ((conversions / views) * 100).toFixed(2) : 0;
    
    const status = timer.active 
      ? <Badge tone="success">Active</Badge>
      : <Badge>Inactive</Badge>;

    return [
      timer.title || "Untitled Timer",
      status,
      views.toLocaleString(),
      conversions.toLocaleString(),
      `${conversionRate}%`,
      new Date(timer.createdAt).toLocaleDateString(),
    ];
  });

  const tableHeadings = [
    "Timer Name",
    "Status", 
    "Views",
    "Conversions",
    "Conversion Rate",
    "Created",
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
        <TitleBar title="Analytics" />
        <Layout>
          <Layout.Section>
            <Box padding="400">
              <div style={{ textAlign: "center" }}>
                <Text tone="critical">
                  Error loading analytics: {error.message}
                </Text>
              </div>
            </Box>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (!analyticsData) {
    return (
      <Page>
        <TitleBar title="Analytics" />
        <Layout>
          <Layout.Section>
            <Box padding="400">
              <EmptyState
                heading="No analytics data available"
                action={{
                  content: "Create Timer",
                  onAction: () => window.open("/timers/new", "_self"),
                }}
                image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
              >
                <p>
                  Create your first timer to start seeing analytics data.
                </p>
              </EmptyState>
            </Box>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Frame>
      <Page title="Analytics">
        <TitleBar title="Analytics" />
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Time Range Selector */}
              <Box padding="400">
                <InlineStack align="space-between" blockAlign="center">
                  <Text variant="headingSm" as="h3">Analytics Overview</Text >
                  <Select
                    label="Time Range"
                    labelInline
                    options={timeRangeOptions}
                    value={timeRange}
                    onChange={setTimeRange}
                  />
                </InlineStack>
              </Box>

              {/* Analytics Cards */}
              <InlineStack gap="400" wrap={false}>
                <Box padding="400" background="surface" borderWidth="025" borderRadius="200" borderColor="border" minWidth="200px">
                  <BlockStack gap="200">
                    <Text variant="bodySm" tone="subdued">Total Timers</Text>
                    <Text variant="headingLg" as="h3">{analyticsData.totalTimers}</Text>
                  </BlockStack>
                </Box>

                <Box padding="400" background="surface" borderWidth="025" borderRadius="200" borderColor="border" minWidth="200px">
                  <BlockStack gap="200">
                    <Text variant="bodySm" tone="subdued">Active Timers</Text>
                    <Text variant="headingLg" as="h3">{analyticsData.activeTimers}</Text>
                  </BlockStack>
                </Box>

                <Box padding="400" background="surface" borderWidth="025" borderRadius="200" borderColor="border" minWidth="200px">
                  <BlockStack gap="200">
                    <Text variant="bodySm" tone="subdued">Total Views</Text>
                    <Text variant="headingLg" as="h3">{analyticsData.totalViews.toLocaleString()}</Text>
                  </BlockStack>
                </Box>

                <Box padding="400" background="surface" borderWidth="025" borderRadius="200" borderColor="border" minWidth="200px">
                  <BlockStack gap="200">
                    <Text variant="bodySm" tone="subdued">Total Conversions</Text>
                    <Text variant="headingLg" as="h3">{analyticsData.totalConversions.toLocaleString()}</Text>
                  </BlockStack>
                </Box>

                <Box padding="400" background="surface" borderWidth="025" borderRadius="200" borderColor="border" minWidth="200px">
                  <BlockStack gap="200">
                    <Text variant="bodySm" tone="subdued">Conversion Rate</Text>
                    <Text variant="headingLg" as="h3">{analyticsData.conversionRate}%</Text>
                  </BlockStack>
                </Box>
              </InlineStack>

              {/* Timer Performance Table */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h3">Timer Performance</Text>
                  <DataTable
                    columnContentTypes={[
                      "text",
                      "text",
                      "numeric",
                      "numeric",
                      "numeric",
                      "text",
                    ]}
                    headings={tableHeadings}
                    rows={tableRows}
                  />
                </BlockStack>
              </Box>
            </BlockStack>
          </Layout.Section>
        </Layout>
      </Page>
    </Frame>
  );
}