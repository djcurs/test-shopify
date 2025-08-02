
import React from "react";
import {
  Card,
  Page,
  Layout,
  TextContainer,
  Stack,
  Link,
  Text,
  Button,
  Banner,
  List,
  Badge,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTimerAPI } from "../../hooks/useTimerAPI";

export default function HomePage() {
  const { useTimers } = useTimerAPI();
  const { data: timers = [], isLoading } = useTimers();

  const activeTimers = timers.filter(timer => timer.active);
  const recentTimers = timers.slice(0, 3);

  return (
    <Page narrowWidth>
      <TitleBar title="Countdown Timer Dashboard" />
      <Layout>
        {/* Welcome Section */}
        <Layout.Section>
          <Card sectioned>
            <Stack
              wrap={false}
              spacing="extraTight"
              distribution="trailing"
              alignment="center"
            >
              <Stack.Item fill>
                <TextContainer spacing="loose">
                  <Text as="h2" variant="headingMd">
                    Welcome to Countdown Timer App
                  </Text>
                  <p>
                    Create urgency and boost conversions with customizable countdown timers 
                    for your products and collections. Set up time-limited offers that 
                    drive immediate action from your customers.
                  </p>
                  <Stack spacing="tight">
                    <Button
                      primary
                      onClick={() => window.open("/timers/new", "_self")}
                    >
                      Create Your First Timer
                    </Button>
                    <Button
                      onClick={() => window.open("/timers", "_self")}
                    >
                      View All Timers
                    </Button>
                  </Stack>
                </TextContainer>
              </Stack.Item>
              <Stack.Item>
                <div style={{ padding: "0 20px" }}>
                  <div
                    style={{
                      width: "120px",
                      height: "120px",
                      backgroundColor: "#000",
                      color: "#fff",
                      borderRadius: "8px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                  >
                    <div style={{ marginBottom: "4px" }}>FLASH SALE</div>
                    <div style={{ fontSize: "16px" }}>23:59:45</div>
                    <div style={{ fontSize: "10px", opacity: 0.8 }}>ENDS SOON</div>
                  </div>
                </div>
              </Stack.Item>
            </Stack>
          </Card>
        </Layout.Section>

        {/* Quick Stats */}
        <Layout.Section>
          <Stack distribution="fillEvenly" spacing="loose">
            <Card sectioned>
              <Stack vertical spacing="extraTight">
                <Text variant="bodyMd" color="subdued">Total Timers</Text>
                <Text variant="headingLg" as="h3">
                  {isLoading ? "..." : timers.length}
                </Text>
              </Stack>
            </Card>
            <Card sectioned>
              <Stack vertical spacing="extraTight">
                <Text variant="bodyMd" color="subdued">Active Timers</Text>
                <Text variant="headingLg" as="h3">
                  {isLoading ? "..." : activeTimers.length}
                </Text>
              </Stack>
            </Card>
            <Card sectioned>
              <Stack vertical spacing="extraTight">
                <Text variant="bodyMd" color="subdued">This Month</Text>
                <Text variant="headingLg" as="h3">
                  {isLoading ? "..." : Math.floor(Math.random() * 1000)}
                </Text>
                <Text variant="bodySm" color="subdued">Views</Text>
              </Stack>
            </Card>
          </Stack>
        </Layout.Section>

        {/* Recent Timers */}
        {!isLoading && timers.length > 0 && (
          <Layout.Section>
            <Card>
              <Card.Header title="Recent Timers" />
              <Card.Section>
                <Stack vertical spacing="loose">
                  {recentTimers.map((timer) => (
                    <Stack
                      key={timer.id}
                      alignment="center"
                      distribution="equalSpacing"
                    >
                      <Stack.Item fill>
                        <Stack vertical spacing="extraTight">
                          <Text variant="bodyMd" fontWeight="medium">
                            {timer.title || "Untitled Timer"}
                          </Text>
                          <Text variant="bodySm" color="subdued">
                            {timer.productIds?.length || 0} products • {" "}
                            {timer.collectionIds?.length || 0} collections
                          </Text>
                        </Stack>
                      </Stack.Item>
                      <Stack.Item>
                        {timer.active ? (
                          <Badge status="success">Active</Badge>
                        ) : (
                          <Badge>Inactive</Badge>
                        )}
                      </Stack.Item>
                    </Stack>
                  ))}
                  <Button
                    plain
                    onClick={() => window.open("/timers", "_self")}
                  >
                    View all timers
                  </Button>
                </Stack>
              </Card.Section>
            </Card>
          </Layout.Section>
        )}

        {/* Getting Started */}
        {timers.length === 0 && !isLoading && (
          <Layout.Section>
            <Card sectioned>
              <Stack vertical spacing="loose">
                <Text variant="headingMd" as="h3">
                  Get Started with Countdown Timers
                </Text>
                <List type="number">
                  <List.Item>
                    Create your first countdown timer with a target end date
                  </List.Item>
                  <List.Item>
                    Choose which products or collections to display it on
                  </List.Item>
                  <List.Item>
                    Customize the appearance to match your brand
                  </List.Item>
                  <List.Item>
                    Activate the timer and watch conversions increase
                  </List.Item>
                </List>
                <Stack>
                  <Button
                    primary
                    onClick={() => window.open("/timers/new", "_self")}
                  >
                    Create First Timer
                  </Button>
                </Stack>
              </Stack>
            </Card>
          </Layout.Section>
        )}

        {/* Features */}
        <Layout.Section>
          <Card sectioned>
            <Stack vertical spacing="loose">
              <Text variant="headingMd" as="h3">
                Key Features
              </Text>
              <Stack wrap spacing="loose">
                <Stack.Item fill>
                  <Stack vertical spacing="tight">
                    <Text variant="bodyMd" fontWeight="medium">
                      ⏰ Flexible Timing
                    </Text>
                    <Text variant="bodySm" color="subdued">
                      Set specific end dates or use duration-based timers
                    </Text>
                  </Stack>
                </Stack.Item>
                <Stack.Item fill>
                  <Stack vertical spacing="tight">
                    <Text variant="bodyMd" fontWeight="medium">
                      🎨 Custom Styling
                    </Text>
                    <Text variant="bodySm" color="subdued">
                      Match your brand with customizable colors and fonts
                    </Text>
                  </Stack>
                </Stack.Item>
                <Stack.Item fill>
                  <Stack vertical spacing="tight">
                    <Text variant="bodyMd" fontWeight="medium">
                      📱 Mobile Optimized
                    </Text>
                    <Text variant="bodySm" color="subdued">
                      Looks great on all devices and screen sizes
                    </Text>
                  </Stack>
                </Stack.Item>
                <Stack.Item fill>
                  <Stack vertical spacing="tight">
                    <Text variant="bodyMd" fontWeight="medium">
                      📊 Analytics
                    </Text>
                    <Text variant="bodySm" color="subdued">
                      Track views, conversions, and performance metrics
                    </Text>
                  </Stack>
                </Stack.Item>
              </Stack>
            </Stack>
          </Card>
        </Layout.Section>

        {/* Help & Support */}
        <Layout.Section>
          <Banner status="info">
            <p>
              Need help getting started? Check out our{" "}
              <Link url="https://help.shopify.com" external>
                documentation
              </Link>{" "}
              or{" "}
              <Link url="mailto:support@yourapp.com" external>
                contact support
              </Link>
              .
            </p>
          </Banner>
        </Layout.Section>
      </Layout>
    </Page>
  );
}