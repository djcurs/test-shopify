// pages/settings.jsx
import React, { useState, useCallback } from "react";
import {
  Page,
  Layout,
  Card,
  Form,
  FormLayout,
  TextField,
  Select,
  Checkbox,
  Button,
  Stack,
  Toast,
  Frame,
  Subheading,
  TextStyle,
  Banner,
  ChoiceList,
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
    { label: "Floating", value: "floating" },
    { label: "In product description", value: "product" },
  ];

  const animationOptions = [
    { label: "Fade", value: "fade" },
    { label: "Slide", value: "slide" },
    { label: "Bounce", value: "bounce" },
    { label: "None", value: "none" },
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
          loading: isSaving,
          onAction: handleSave,
        }}
      >
        <TitleBar title="Settings" />
        
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Subheading>Default Timer Style</Subheading>
              <FormLayout>
                <FormLayout.Group>
                  <TextField
                    label="Background Color"
                    value={settings.defaultStyle.backgroundColor}
                    onChange={handleStyleChange("backgroundColor")}
                    prefix="#"
                  />
                  <TextField
                    label="Text Color"
                    value={settings.defaultStyle.textColor}
                    onChange={handleStyleChange("textColor")}
                    prefix="#"
                  />
                </FormLayout.Group>

                <FormLayout.Group>
                  <TextField
                    label="Font Size (px)"
                    type="number"
                    value={settings.defaultStyle.fontSize}
                    onChange={handleStyleChange("fontSize")}
                    min={10}
                    max={32}
                  />
                  <Select
                    label="Font Family"
                    options={fontFamilyOptions}
                    value={settings.defaultStyle.fontFamily}
                    onChange={handleStyleChange("fontFamily")}
                  />
                </FormLayout.Group>

                <FormLayout.Group>
                  <TextField
                    label="Border Radius (px)"
                    type="number"
                    value={settings.defaultStyle.borderRadius}
                    onChange={handleStyleChange("borderRadius")}
                    min={0}
                    max={20}
                  />
                  <TextField
                    label="Padding (px)"
                    type="number"
                    value={settings.defaultStyle.padding}
                    onChange={handleStyleChange("padding")}
                    min={4}
                    max={32}
                  />
                </FormLayout.Group>
              </FormLayout>
            </Card>
          </Layout.Section>

          <Layout.Section>
            <Card sectioned>
              <Subheading>Default Messages</Subheading>
              <FormLayout>
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
              </FormLayout>
            </Card>
          </Layout.Section>

          <Layout.Section secondary>
            <Card sectioned>
              <Subheading>Display Settings</Subheading>
              <FormLayout>
                <Select
                  label="Default Position"
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
              </FormLayout>
            </Card>

            <Card sectioned>
              <Subheading>Notifications</Subheading>
              <FormLayout>
                <Checkbox
                  label="Email Alerts"
                  checked={settings.notifications.emailAlerts}
                  onChange={handleSettingChange("notifications", "emailAlerts")}
                  helpText="Receive email notifications for important events"
                />

                <Checkbox
                  label="Timer Expiry Notifications"
                  checked={settings.notifications.timerExpiry}
                  onChange={handleSettingChange("notifications", "timerExpiry")}
                  helpText="Get notified when timers expire"
                />

                <Checkbox
                  label="Low Conversion Alerts"
                  checked={settings.notifications.lowConversion}
                  onChange={handleSettingChange("notifications", "lowConversion")}
                  helpText="Alert when timer conversion rates are low"
                />
              </FormLayout>
            </Card>

            <Card sectioned>
              <Subheading>Advanced Settings</Subheading>
              <FormLayout>
                <TextField
                  label="Custom CSS"
                  value={settings.advanced.customCSS}
                  onChange={handleSettingChange("advanced", "customCSS")}
                  multiline={4}
                  helpText="Add custom CSS for timer styling"
                  placeholder=".timer-widget { /* your styles */ }"
                />

                <TextField
                  label="Custom Tracking Code"
                  value={settings.advanced.trackingCode}
                  onChange={handleSettingChange("advanced", "trackingCode")}
                  helpText="Add custom tracking or analytics code"
                  placeholder="<!-- tracking code -->"
                />

                <TextField
                  label="Cache Duration (seconds)"
                  type="number"
                  value={settings.advanced.cacheTimer}
                  onChange={handleSettingChange("advanced", "cacheTimer")}
                  helpText="How long to cache timer data"
                  min={60}
                  max={3600}
                />
              </FormLayout>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Preview */}
        <Layout>
          <Layout.Section>
            <Card sectioned>
              <Subheading>Preview</Subheading>
              <div style={{ marginTop: "16px" }}>
                <div
                  style={{
                    backgroundColor: settings.defaultStyle.backgroundColor,
                    color: settings.defaultStyle.textColor,
                    fontSize: `${settings.defaultStyle.fontSize}px`,
                    fontFamily: settings.defaultStyle.fontFamily,
                    borderRadius: `${settings.defaultStyle.borderRadius}px`,
                    padding: `${settings.defaultStyle.padding}px`,
                    textAlign: "center",
                    border: "1px solid #e1e3e5",
                    maxWidth: "300px",
                  }}
                >
                  <div style={{ marginBottom: "8px" }}>
                    {settings.defaultMessages.before}
                  </div>
                  <div style={{ fontWeight: "bold", fontSize: "1.2em" }}>
                    2d 14h 32m 45s
                  </div>
                </div>
              </div>
            </Card>
          </Layout.Section>
        </Layout>

        <Layout>
          <Layout.Section>
            <Banner status="info">
              <p>
                These settings will be applied as defaults for new timers. 
                Existing timers will retain their current settings unless manually updated.
              </p>
            </Banner>
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