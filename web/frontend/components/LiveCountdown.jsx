import React from "react";
import { Text, Badge, Box, InlineStack, BlockStack } from "@shopify/polaris";
import { useLiveCountdown } from "../../hooks/useLiveCountdown";

export default function LiveCountdown({ timer, showPreview = true, compact = false }) {
  const { timeLeft, timerState, formatTimeLeft, getTimerMessage, shouldHide, isUrgencyMode } = useLiveCountdown(timer);

  if (!timer) {
    return (
      <Box padding="400">
        <Text variant="bodyMd" tone="subdued">No timer data</Text>
      </Box>
    );
  }

  if (shouldHide()) {
    return null;
  }

  const formattedTime = formatTimeLeft(timeLeft || 0);
  const isExpired = timerState === "expired";
  const isActive = timerState === "active";
  const isPending = timerState === "before";

  const textColor = timer.style?.textColor || "#ffffff";

  console.log("Text color:", timer.style?.textColor);


  if (compact) {
    const urgencyActive = isUrgencyMode() || (timer.urgencySettings?.enabled && timer.urgencySettings?.showBanner);
    
    return (
      <div
        style={{
          backgroundColor: timer.style?.backgroundColor || "#000000",
          color: textColor,
          fontSize: `${timer.style?.fontSize || 16}px`,
          fontFamily: timer.style?.fontFamily || "Arial",
          borderRadius: `${timer.style?.borderRadius || 4}px`,
          padding: `${timer.style?.padding || 12}px`,
          textAlign: "center",
          minWidth: "200px",
          animation: urgencyActive ? 'pulse 1s infinite' : 'none',
          border: urgencyActive ? `2px solid ${timer.urgencySettings?.pulseColor || '#ff0000'}` : 'none',
        }}
      >
        <div style={{ marginBottom: "8px", color: textColor, fontSize: "inherit" }}>
          {getTimerMessage()}
        </div>

        {!isExpired && formattedTime && (
          <div style={{ display: "flex", gap: "8px", justifyContent: "center", alignItems: "center" }}>
            {formattedTime.days > 0 && (
              <div style={{ color: textColor, fontSize: "inherit" }}>
                {formattedTime.days}d
              </div>
            )}
            {formattedTime.hours > 0 && (
              <div style={{ color: textColor, fontSize: "inherit" }}>
                {formattedTime.hours}h
              </div>
            )}
            <div style={{ color: textColor, fontSize: "inherit" }}>
              {formattedTime.minutes}m
            </div>
            <div style={{ color: textColor, fontSize: "inherit" }}>
              {formattedTime.seconds}s
            </div>
          </div>
        )}

        {urgencyActive && timer.urgencySettings?.showBanner && (
          <div style={{ 
            marginTop: "8px", 
            padding: "4px 8px", 
            backgroundColor: timer.urgencySettings.pulseColor,
            color: "#ffffff",
            fontSize: "0.8em",
            borderRadius: "4px",
            fontWeight: "bold"
          }}>
            {timer.urgencySettings.bannerMessage}
          </div>
        )}
      </div>
    );
  }

  return (
    <Box
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
            <InlineStack gap="200" align="center">
              {isActive ? (
                <Badge tone="success">Active</Badge>
              ) : isPending ? (
                <Badge tone="warning">Pending</Badge>
              ) : (
                <Badge>Inactive</Badge>
              )}
              {timer.loop && <Badge>Looping</Badge>}
            </InlineStack>
          </BlockStack>
        </InlineStack>

        <div
          style={{
            backgroundColor: timer.style?.backgroundColor || "#000000",
            color: textColor,
            fontSize: `${timer.style?.fontSize || 16}px`,
            fontFamily: timer.style?.fontFamily || "Arial",
            borderRadius: `${timer.style?.borderRadius || 4}px`,
            padding: `${timer.style?.padding || 12}px`,
            textAlign: "center",
            animation: isUrgencyMode() ? 'pulse 1s infinite' : 'none',
            border: isUrgencyMode() ? `2px solid ${timer.urgencySettings?.pulseColor || '#ff0000'}` : 'none',
          }}
        >
          <div style={{ marginBottom: "12px", color: textColor, fontSize: "inherit" }}>
            {getTimerMessage()}
          </div>

          {!isExpired && formattedTime && (
            <div style={{ display: "flex", gap: "16px", justifyContent: "center", alignItems: "center" }}>
              {formattedTime.days > 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ color: textColor, fontSize: "inherit", fontWeight: "bold" }}>
                    {formattedTime.days}
                  </div>
                  <div style={{ color: textColor, fontSize: "inherit", fontSize: "0.8em" }}>
                    Days
                  </div>
                </div>
              )}
              {formattedTime.hours > 0 && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                  <div style={{ color: textColor, fontSize: "inherit", fontWeight: "bold" }}>
                    {formattedTime.hours}
                  </div>
                  <div style={{ color: textColor, fontSize: "inherit", fontSize: "0.8em" }}>
                    Hours
                  </div>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ color: textColor, fontSize: "inherit", fontWeight: "bold" }}>
                  {formattedTime.minutes}
                </div>
                <div style={{ color: textColor, fontSize: "inherit", fontSize: "0.8em" }}>
                  Minutes
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                <div style={{ color: textColor, fontSize: "inherit", fontWeight: "bold" }}>
                  {formattedTime.seconds}
                </div>
                <div style={{ color: textColor, fontSize: "inherit", fontSize: "0.8em" }}>
                  Seconds
                </div>
              </div>
            </div>
          )}
        </div>

        {isUrgencyMode() && timer.urgencySettings?.showBanner && (
          <div style={{ 
            marginTop: "12px", 
            padding: "8px 12px", 
            backgroundColor: timer.urgencySettings.pulseColor,
            color: "#ffffff",
            fontSize: "0.9em",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center"
          }}>
            {timer.urgencySettings.bannerMessage}
          </div>
        )}

        {showPreview && (
          <BlockStack gap="200">
            <Text variant="bodySm" tone="subdued">Preview</Text>
            <Text variant="bodySm">
              This is how your timer will appear on your store. The countdown updates in real-time.
            </Text>
          </BlockStack>
        )}
      </BlockStack>
    </Box>
  );
}
