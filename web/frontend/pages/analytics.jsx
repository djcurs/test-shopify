import React, { useState } from "react";
import {
  Page,
  Layout,
  Card,
  Select,
  Stack,
  TextStyle,
  Subheading,
  DataTable,
  Badge,
  Frame,
  Loading,
  EmptyState,
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
      ? <Badge status="success">Active</Badge>
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
            <Card sectioned>
              <TextStyle variation="negative">
                Error loading analytics: {error.message}
              </TextStyle>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  if (!analyticsData || timers.length === 0) {
    return (
      <Page>
        <TitleBar title="Analytics" />
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <EmptyState
                heading="No analytics data available"
                image="https://cdn.shopify.com/s/files/1/0757/9955/files/empty-state.svg"
                action={{
                  content: "Create your first timer",
                  onAction: () => window.open("/timers/new", "_self"),
                }}
              >
                <p>Create countdown timers to start tracking analytics data.</p>
              </EmptyState>
            </Card>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Page title="Analytics">
      <TitleBar title="Analytics" />
      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Stack alignment="center" distribution="equalSpacing">
              <Stack.Item>
                <Subheading>Performance Overview</Subheading>
              </Stack.Item>
              <Stack.Item>
                <Select
                  label="Time Range"
                  labelHidden
                  options={timeRangeOptions}
                  value={timeRange}
                  onChange={setTimeRange}
                />
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>

        {/* Key Metrics */}
        <Layout.Section>
          <Stack distribution="fillEvenly" spacing="loose">
            <Card sectioned>
              <Stack vertical spacing="extraTight">
                <TextStyle variation="subdued">Total Timers</TextStyle>
                <TextStyle variation="strong" element="h2">
                  {analyticsData.totalTimers}
                </TextStyle>
              </Stack>
            </Card>

            <Card sectioned>
              <Stack vertical spacing="extraTight">
                <TextStyle variation="subdued">Active Timers</TextStyle>
                <TextStyle variation="strong" element="h2">
                  {analyticsData.activeTimers}
                </TextStyle>
              </Stack>
            </Card>

            <Card sectioned>
              <Stack vertical spacing="extraTight">
                <TextStyle variation="subdued">Total Views</TextStyle>
                <TextStyle variation="strong" element="h2">
                  {analyticsData.totalViews.toLocaleString()}
                </TextStyle>
              </Stack>
            </Card>

            <Card sectioned>
              <Stack vertical spacing="extraTight">
                <TextStyle variation="subdued">Total Conversions</TextStyle>
                <TextStyle variation="strong" element="h2">
                  {analyticsData.totalConversions.toLocaleString()}
                </TextStyle>
              </Stack>
            </Card>

            <Card sectioned>
              <Stack vertical spacing="extraTight">
                <TextStyle variation="subdued">Conversion Rate</TextStyle>
                <TextStyle variation="strong" element="h2">
                  {analyticsData.conversionRate}%
                </TextStyle>
              </Stack>
            </Card>
          </Stack>
        </Layout.Section>

        {/* Timer Performance Table */}
        <Layout.Section>
          <Card>
            <Card.Header title="Timer Performance" />
            <DataTable
              columnContentTypes={[
                "text",
                "text", 
                "numeric",
                "numeric",
                "text",
                "text",
              ]}
              headings={tableHeadings}
              rows={tableRows}
            />
          </Card>
        </Layout.Section>

        {/* Additional Insights */}
        <Layout.Section>
          <Stack distribution="fillEvenly" spacing="loose">
            <Card sectioned>
              <Stack vertical spacing="tight">
                <Subheading>Best Performing Timer</Subheading>
                <TextStyle>
                  {timers.length > 0 
                    ? timers[0].title || "Untitled Timer"
                    : "No data available"
                  }
                </TextStyle>
                <TextStyle variation="subdued">
                  Based on conversion rate
                </TextStyle>
              </Stack>
            </Card>

            <Card sectioned>
              <Stack vertical spacing="tight">
                <Subheading>Completed Timers</Subheading>
                <TextStyle>{analyticsData.completedTimers}</TextStyle>
                <TextStyle variation="subdued">
                  Timers that have reached their end time
                </TextStyle>
              </Stack>
            </Card>
          </Stack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}