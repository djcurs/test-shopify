import React from "react";
import { Text, Badge, Box, InlineStack, BlockStack } from "@shopify/polaris";
import { useLiveCountdown } from "../../hooks/useLiveCountdown";

export default function LiveCountdown({ timer, showPreview = true }) {
  const { timerState, getTimerMessage, formattedTime, shouldHide, loopCount, timeLeft, formatTimeLeft } = useLiveCountdown(timer);

  // Get status badge
  const getStatusBadge = () => {
    switch (timerState) {
      case "before":
        return <Badge tone="warning">Scheduled</Badge>;
      case "active":
        return <Badge tone="success">Active</Badge>;
      case "expired":
        return <Badge>Expired</Badge>;
      default:
        return <Badge>Loading</Badge>;
    }
  };

  if (!timer) {
    return (
      <Box padding="400">
        <Text>No timer data available</Text>
      </Box>
    );
  }

  // Hide timer if it should be hidden
  if (shouldHide()) {
    return null;
  }

  const { days, hours, minutes, seconds } = formattedTime;

  return (
    <Box padding="400">
      <BlockStack gap="300">
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="headingMd" as="h3">
            {timer.title || "Untitled Timer"}
          </Text>
          {getStatusBadge()}
        </InlineStack>

        <Box
          padding="400"
          background="surface"
          borderWidth="025"
          borderRadius="200"
          borderColor="border"
          style={{
            backgroundColor: timer.style?.backgroundColor || "#000000",
            color: timer.style?.textColor || "#ffffff",
            fontSize: `${timer.style?.fontSize || 16}px`,
            fontFamily: timer.style?.fontFamily || "Arial",
            borderRadius: `${timer.style?.borderRadius || 4}px`,
            padding: `${timer.style?.padding || 12}px`,
            textAlign: "center",
          }}
        >
          <Text variant="headingLg" as="h2" style={{ color: timer.style?.textColor || "#ffffff" }}>
            {getTimerMessage()}
          </Text>

          {timerState === "active" && timeLeft > 0 && (
            <InlineStack gap="400" align="center" blockAlign="center">
              {days > 0 && (
                <div>
                  <Text variant="headingLg" style={{ color: timer.style?.textColor || "#ffffff" }}>
                    {days.toString().padStart(2, "0")}
                  </Text>
                  <Text variant="bodySm" style={{ color: timer.style?.textColor || "#ffffff", opacity: 0.8 }}>
                    Days
                  </Text>
                </div>
              )}
              <div>
                <Text variant="headingLg" style={{ color: timer.style?.textColor || "#ffffff" }}>
                  {hours.toString().padStart(2, "0")}
                </Text>
                <Text variant="bodySm" style={{ color: timer.style?.textColor || "#ffffff", opacity: 0.8 }}>
                  Hours
                </Text>
              </div>
              <div>
                <Text variant="headingLg" style={{ color: timer.style?.textColor || "#ffffff" }}>
                  {minutes.toString().padStart(2, "0")}
                </Text>
                <Text variant="bodySm" style={{ color: timer.style?.textColor || "#ffffff", opacity: 0.8 }}>
                  Minutes
                </Text>
              </div>
              <div>
                <Text variant="headingLg" style={{ color: timer.style?.textColor || "#ffffff" }}>
                  {seconds.toString().padStart(2, "0")}
                </Text>
                <Text variant="bodySm" style={{ color: timer.style?.textColor || "#ffffff", opacity: 0.8 }}>
                  Seconds
                </Text>
              </div>
            </InlineStack>
          )}

          {timerState === "before" && (
            <Text variant="bodyMd" style={{ color: timer.style?.textColor || "#ffffff", opacity: 0.8 }}>
              Timer starts in {formatTimeLeft(timeLeft).days}d {formatTimeLeft(timeLeft).hours}h {formatTimeLeft(timeLeft).minutes}m
            </Text>
          )}

          {timerState === "expired" && (
            <Text variant="bodyMd" style={{ color: timer.style?.textColor || "#ffffff", opacity: 0.8 }}>
              This offer has ended
            </Text>
          )}
        </Box>

        {showPreview && (
          <BlockStack gap="200">
            <Text variant="bodySm" tone="subdued">
              Preview Mode - This is how your timer will appear on your store
            </Text>
            <Text variant="bodySm" tone="subdued">
              State: {timerState} | Loop: {timer.loop ? "Yes" : "No"} | Hide after completion: {timer.hideAfterCompletion ? "Yes" : "No"}
              {loopCount > 0 && ` | Loop #${loopCount}`}
            </Text>
          </BlockStack>
        )}
      </BlockStack>
    </Box>
  );
}   