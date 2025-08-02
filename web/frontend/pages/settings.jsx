// pages/settings.jsx
import React, { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Form,
  FormLayout,
  TextField,
  Select,
  Checkbox,
  Button,
  InlineStack,
  BlockStack,
  Toast,
  Frame,
  Text,
  Banner,
  ChoiceList,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Global timer settings
    defaultStyle: {
      backgroundColor: "#000000",
      textColor: "#ffffff", 
      fontSize: 16,
      fontFamily: "Arial",
      borderRadius: 4,
      padding: 12,
    },
    defaultMessages: {
      before: "Limited time offer!",
      after: "Offer has ended",
    },
    // Display settings
    displaySettings: {
      position: "top",
      showOnMobile: true,
      showOnDesktop: true,
      animation: "fade",
    },
    // Notification settings
    notifications: {
      emailAlerts: true,
      timerExpiry: true,
      lowConversion: false,
    },
    // Advanced settings
    advanced: {
      customCSS: "",
      trackingCode: "",
      cacheTimer: 300,
    },
  });

  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handleSettingChange = useCallback((section, field) => (value) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  }, []);

  const handleStyleChange = useCallback((styleField) => (value) => {
    setSettings((prev) => ({
      ...prev,
      defaultStyle: {
        ...prev.defaultStyle,
        [styleField]: value,
      },
    }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      // In a real app, you would save settings to your backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setToastMessage("Settings saved successfully!");
      setToastActive(true);
    } catch (error) {
      setToastMessage("Failed to save settings");
      setToastActive(true);
    } finally {
      setIsSaving(false);
    }
  }, [settings]);

  const positionOptions = [
    { label: "Top of page", value: "top" },
    { label: "Bottom of page", value: "bottom" },
    { label: "Fixed overlay", value: "overlay" },
  ];

  const animationOptions = [
    { label: "Fade in/out", value: "fade" },
    { label: "Slide in/out", value: "slide" },
    { label: "No animation", value: "none" },
  ];

  const fontFamilyOptions = [
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
  ];

  return (
    <Frame>
      <Page
        title="Settings"
        primaryAction={{
          content: "Save Settings",
          onAction: handleSave,
          loading: isSaving,
        }}
      >
        <TitleBar title="Settings" />
        <Layout>
          <Layout.Section>
            <BlockStack gap="400">
              {/* Default Timer Settings */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Default Timer Settings</Text>
                  
                  <FormLayout>
                    <InlineStack gap="400">
                      <TextField
                        label="Default Before Message"
                        value={settings.defaultMessages.before}
                        onChange={handleSettingChange("defaultMessages", "before")}
                        placeholder="Limited time offer!"
                      />
                      <TextField
                        label="Default After Message"
                        value={settings.defaultMessages.after}
                        onChange={handleSettingChange("defaultMessages", "after")}
                        placeholder="Offer has ended"
                      />
                    </InlineStack>
                  </FormLayout>
                </BlockStack>
              </Box>

              {/* Default Style Settings */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Default Style Settings</Text>
                  
                  <FormLayout>
                    <InlineStack gap="400">
                      <TextField
                        label="Background Color"
                        value={settings.defaultStyle.backgroundColor}
                        onChange={handleStyleChange("backgroundColor")}
                        placeholder="#000000"
                      />
                      <TextField
                        label="Text Color"
                        value={settings.defaultStyle.textColor}
                        onChange={handleStyleChange("textColor")}
                        placeholder="#ffffff"
                      />
                    </InlineStack>
                    
                    <InlineStack gap="400">
                      <TextField
                        label="Font Size (px)"
                        type="number"
                        value={settings.defaultStyle.fontSize.toString()}
                        onChange={(value) => handleStyleChange("fontSize")(parseInt(value) || 16)}
                      />
                      <Select
                        label="Font Family"
                        options={fontFamilyOptions}
                        value={settings.defaultStyle.fontFamily}
                        onChange={handleStyleChange("fontFamily")}
                      />
                    </InlineStack>
                    
                    <InlineStack gap="400">
                      <TextField
                        label="Border Radius (px)"
                        type="number"
                        value={settings.defaultStyle.borderRadius.toString()}
                        onChange={(value) => handleStyleChange("borderRadius")(parseInt(value) || 4)}
                      />
                      <TextField
                        label="Padding (px)"
                        type="number"
                        value={settings.defaultStyle.padding.toString()}
                        onChange={(value) => handleStyleChange("padding")(parseInt(value) || 12)}
                      />
                    </InlineStack>
                  </FormLayout>
                </BlockStack>
              </Box>

              {/* Display Settings */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Display Settings</Text>
                  
                  <FormLayout>
                    <InlineStack gap="400">
                      <Select
                        label="Timer Position"
                        options={positionOptions}
                        value={settings.displaySettings.position}
                        onChange={handleSettingChange("displaySettings", "position")}
                      />
                      <Select
                        label="Animation"
                        options={animationOptions}
                        value={settings.displaySettings.animation}
                        onChange={handleSettingChange("displaySettings", "animation")}
                      />
                    </InlineStack>
                    
                    <InlineStack gap="400">
                      <Checkbox
                        label="Show on Mobile"
                        checked={settings.displaySettings.showOnMobile}
                        onChange={handleSettingChange("displaySettings", "showOnMobile")}
                      />
                      <Checkbox
                        label="Show on Desktop"
                        checked={settings.displaySettings.showOnDesktop}
                        onChange={handleSettingChange("displaySettings", "showOnDesktop")}
                      />
                    </InlineStack>
                  </FormLayout>
                </BlockStack>
              </Box>

              {/* Notification Settings */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Notification Settings</Text>
                  
                  <FormLayout>
                    <Checkbox
                      label="Email alerts for timer expiry"
                      checked={settings.notifications.timerExpiry}
                      onChange={handleSettingChange("notifications", "timerExpiry")}
                    />
                    <Checkbox
                      label="Email alerts for low conversion rates"
                      checked={settings.notifications.lowConversion}
                      onChange={handleSettingChange("notifications", "lowConversion")}
                    />
                  </FormLayout>
                </BlockStack>
              </Box>

              {/* Advanced Settings */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Advanced Settings</Text>
                  
                  <FormLayout>
                    <TextField
                      label="Custom CSS"
                      value={settings.advanced.customCSS}
                      onChange={handleSettingChange("advanced", "customCSS")}
                      multiline={4}
                      placeholder="/* Add custom CSS here */"
                    />
                    
                    <TextField
                      label="Tracking Code"
                      value={settings.advanced.trackingCode}
                      onChange={handleSettingChange("advanced", "trackingCode")}
                      multiline={3}
                      placeholder="<!-- Add tracking code here -->"
                    />
                    
                    <TextField
                      label="Cache Timer (seconds)"
                      type="number"
                      value={settings.advanced.cacheTimer.toString()}
                      onChange={(value) => handleSettingChange("advanced", "cacheTimer")(parseInt(value) || 300)}
                    />
                  </FormLayout>
                </BlockStack>
              </Box>
            </BlockStack>
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