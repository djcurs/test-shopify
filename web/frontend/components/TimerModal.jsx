import React, { useState, useCallback, useEffect } from "react";
import {
  Modal,
  Form,
  FormLayout,
  TextField,
  Select,
  Checkbox,
  Button,
  InlineStack,
  BlockStack,
  Text,
  Box,
  Divider,
} from "@shopify/polaris";
import { HexColorPicker } from "react-colorful";
import { useTimerAPI } from "../../hooks/useTimerAPI";
import LiveCountdown from "./LiveCountdown";

export default function TimerModal({
  open,
  onClose,
  timer = null,
  onSuccess
}) {
  const isEdit = !!timer;
  const { useCreateTimer, useUpdateTimer } = useTimerAPI();
  const createTimerMutation = useCreateTimer();
  const updateTimerMutation = useUpdateTimer();
  
  const [formData, setFormData] = useState({
    title: "",
    productIds: [],
    collectionIds: [],
    startTime: "",
    endTime: "",
    duration: null,
    beforeMessage: "Limited time offer!",
    afterMessage: "Offer has ended",
    loop: false,
    hideAfterCompletion: false,
    active: true,
    style: {
      backgroundColor: "#000000",
      textColor: "#ffffff",
      fontSize: 16,
      fontFamily: "Arial",
      borderRadius: 4,
      padding: 12,
    },
    urgencySettings: {
      enabled: false,
      triggerMinutes: 5,
      pulseColor: "#ff0000",
      showBanner: false,
      bannerMessage: "Hurry! Time is running out!"
    },
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    console.log("Effect triggered - timer:", timer, "isEdit:", isEdit, "open:", open);
    
    if (timer && isEdit) {
      console.log("Loading timer data for edit:", timer.style);
      setFormData({
        title: timer.title || "",
        productIds: timer.productIds || [],
        collectionIds: timer.collectionIds || [],
        startTime: timer.startTime ? new Date(timer.startTime).toISOString().slice(0, 16) : "",
        endTime: timer.endTime ? new Date(timer.endTime).toISOString().slice(0, 16) : "",
        duration: timer.duration || null,
        beforeMessage: timer.beforeMessage || "Limited time offer!",
        afterMessage: timer.afterMessage || "Offer has ended",
        loop: timer.loop || false,
        hideAfterCompletion: timer.hideAfterCompletion || false,
        active: timer.active ?? true,
        style: {
          backgroundColor: timer.style?.backgroundColor || "#000000",
          textColor: timer.style?.textColor || "#ffffff",
          fontSize: timer.style?.fontSize || 16,
          fontFamily: timer.style?.fontFamily || "Arial",
          borderRadius: timer.style?.borderRadius || 4,
          padding: timer.style?.padding || 12,
        },
        urgencySettings: {
          enabled: timer.urgencySettings?.enabled || false,
          triggerMinutes: timer.urgencySettings?.triggerMinutes || 5,
          pulseColor: timer.urgencySettings?.pulseColor || "#ff0000",
          showBanner: timer.urgencySettings?.showBanner || false,
          bannerMessage: timer.urgencySettings?.bannerMessage || "Hurry! Time is running out!"
        },
      });
    } else {
      console.log("Resetting form for new timer");
      setFormData({
        title: "",
        productIds: [],
        collectionIds: [],
        startTime: "",
        endTime: "",
        duration: null,
        beforeMessage: "Limited time offer!",
        afterMessage: "Offer has ended",
        loop: false,
        hideAfterCompletion: false,
        active: true,
        style: {
          backgroundColor: "#000000",
          textColor: "#ffffff",
          fontSize: 16,
          fontFamily: "Arial",
          borderRadius: 4,
          padding: 12,
        },
        urgencySettings: {
          enabled: false,
          triggerMinutes: 5,
          pulseColor: "#ff0000",
          showBanner: false,
          bannerMessage: "Hurry! Time is running out!"
        },
      });
    }
    setErrors({});
  }, [timer, isEdit, open]);

  const handleInputChange = useCallback((field) => (value) => {
    console.log(`Input change - ${field}:`, value);
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const handleColorChange = useCallback((colorField) => (color) => {
    console.log(`Color change - ${colorField}:`, color);
    
    setFormData((prev) => ({
      ...prev,
      style: { ...prev.style, [colorField]: color },
    }));
  }, []);

  const handleStyleChange = useCallback((styleField) => (value) => {
    console.log(`Style change - ${styleField}:`, value);
    setFormData((prev) => ({
      ...prev,
      style: { ...prev.style, [styleField]: value },
    }));
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.endTime && !formData.duration) {
      newErrors.endTime = "Either end time or duration must be specified";
      newErrors.duration = "Either end time or duration must be specified";
    }

    if (formData.startTime && formData.endTime) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      if (start >= end) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    if (formData.urgencySettings.enabled) {
      if (formData.urgencySettings.triggerMinutes < 1 || formData.urgencySettings.triggerMinutes > 60) {
        newErrors.urgencyTrigger = "Trigger minutes must be between 1 and 60";
      }
      
      const hexColorRegex = /^#[0-9A-F]{6}$/i;
      if (!hexColorRegex.test(formData.urgencySettings.pulseColor)) {
        newErrors.urgencyColor = "Pulse color must be a valid hex color (e.g., #ff0000)";
      }
      
      if (formData.urgencySettings.showBanner && !formData.urgencySettings.bannerMessage.trim()) {
        newErrors.urgencyBanner = "Banner message is required when banner is enabled";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;

    try {
      const submitData = {
        ...formData,
        productIds: formData.productIds.filter(id => id.trim()),
        collectionIds: formData.collectionIds.filter(id => id.trim()),
        startTime: formData.startTime || null,
        endTime: formData.endTime || null,
      };

      console.log("Submitting timer data:", submitData);

      if (isEdit) {
        await updateTimerMutation.mutateAsync({ id: timer.id, ...submitData });
      } else {
        await createTimerMutation.mutateAsync(submitData);
      }

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error(`Failed to ${isEdit ? "update" : "create"} timer:`, error);
    }
  }, [formData, validateForm, isEdit, updateTimerMutation, createTimerMutation, onSuccess, onClose, timer?.id]);

  const fontFamilyOptions = [
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
  ];

  const isLoading = createTimerMutation.isLoading || updateTimerMutation.isLoading;

  const previewTimer = {
    ...formData,
    style: formData.style,
    urgencySettings: formData.urgencySettings,
    startTime: formData.startTime ? new Date(formData.startTime).toISOString() : null,
    endTime: formData.endTime ? new Date(formData.endTime).toISOString() : null,
  };

  console.log("Preview timer style:", previewTimer.style);

  return (
    <Modal
        open={open}
        onClose={onClose}
        title={isEdit ? "Edit Timer" : "Create Timer"}
        primaryAction={{
          content: isEdit ? "Update Timer" : "Create Timer",
          loading: isLoading,
          onAction: handleSubmit,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: onClose,
          },
        ]}
        size="large"
        style={{ maxWidth: "1200px" }}
      >
      <Modal.Section>
        <div style={{ display: "flex", gap: "48px" }}>
          <div style={{ flex: 1, minWidth: "0" }}>
            <Form onSubmit={handleSubmit}>
              <FormLayout>
                <TextField
                  label="Timer Title"
                  value={formData.title}
                  onChange={handleInputChange("title")}
                  error={errors.title}
                  placeholder="e.g., Black Friday Sale"
                />

                <InlineStack gap="400">
                  <TextField
                    label="Start Time (Optional)"
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={handleInputChange("startTime")}
                  />

                  <TextField
                    label="End Time"
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={handleInputChange("endTime")}
                    error={errors.endTime}
                  />
                </InlineStack>

                <TextField
                  label="Duration (minutes, optional)"
                  type="number"
                  value={formData.duration || ""}
                  onChange={handleInputChange("duration")}
                  error={errors.duration}
                />

                <TextField
                  label="Product IDs (comma-separated)"
                  value={formData.productIds.join(", ")}
                  onChange={(value) =>
                    handleInputChange("productIds")(
                      value.split(",").map(id => id.trim()).filter(Boolean)
                    )
                  }
                  placeholder="123456789, 987654321"
                />

                <TextField
                  label="Collection IDs (comma-separated)"
                  value={formData.collectionIds.join(", ")}
                  onChange={(value) =>
                    handleInputChange("collectionIds")(
                      value.split(",").map(id => id.trim()).filter(Boolean)
                    )
                  }
                  placeholder="123456789, 987654321"
                />

                <Divider />

                <InlineStack gap="400">
                  <TextField
                    label="Before Message"
                    value={formData.beforeMessage}
                    onChange={handleInputChange("beforeMessage")}
                    placeholder="Limited time offer!"
                  />

                  <TextField
                    label="After Message"
                    value={formData.afterMessage}
                    onChange={handleInputChange("afterMessage")}
                    placeholder="Offer has ended"
                  />
                </InlineStack>

                <InlineStack gap="400">
                  <Checkbox
                    label="Loop Timer"
                    checked={formData.loop}
                    onChange={handleInputChange("loop")}
                  />

                  <Checkbox
                    label="Hide After Completion"
                    checked={formData.hideAfterCompletion}
                    onChange={handleInputChange("hideAfterCompletion")}
                  />

                  <Checkbox
                    label="Active"
                    checked={formData.active}
                    onChange={handleInputChange("active")}
                  />
                </InlineStack>

                <Divider />

                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Urgency Notification Settings</Text>
                  
                  <Checkbox
                    label="Enable urgency notifications"
                    checked={formData.urgencySettings.enabled}
                    onChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        urgencySettings: { ...prev.urgencySettings, enabled: checked }
                      }))
                    }
                  />

                  {formData.urgencySettings.enabled && (
                    <BlockStack gap="400">
                      <TextField
                        label="Trigger minutes before expiry"
                        type="number"
                        value={formData.urgencySettings.triggerMinutes.toString()}
                        onChange={(value) => 
                          setFormData(prev => ({
                            ...prev,
                            urgencySettings: { 
                              ...prev.urgencySettings, 
                              triggerMinutes: parseInt(value) || 5 
                            }
                          }))
                        }
                        min={1}
                        max={60}
                        helpText="Timer will show urgency effects when this many minutes remain"
                        error={errors.urgencyTrigger}
                      />

                      <BlockStack gap="300">
                        <Text variant="bodySm" tone="subdued">Pulse Color</Text>
                        <div style={{ 
                          border: '2px solid #ddd', 
                          borderRadius: '8px',
                          padding: '12px',
                          background: '#fff'
                        }}>
                          <HexColorPicker
                            color={formData.urgencySettings.pulseColor}
                            onChange={(color) => 
                              setFormData(prev => ({
                                ...prev,
                                urgencySettings: { ...prev.urgencySettings, pulseColor: color }
                              }))
                            }
                            style={{ width: '100%', height: '150px' }}
                          />
                        </div>
                        <TextField
                          label="Pulse Color (Hex)"
                          value={formData.urgencySettings.pulseColor}
                          onChange={(color) => 
                            setFormData(prev => ({
                              ...prev,
                              urgencySettings: { ...prev.urgencySettings, pulseColor: color }
                            }))
                          }
                          placeholder="#ff0000"
                          error={errors.urgencyColor}
                        />
                      </BlockStack>

                      <Checkbox
                        label="Show urgency banner"
                        checked={formData.urgencySettings.showBanner}
                        onChange={(checked) => 
                          setFormData(prev => ({
                            ...prev,
                            urgencySettings: { ...prev.urgencySettings, showBanner: checked }
                          }))
                        }
                      />

                      {formData.urgencySettings.showBanner && (
                        <TextField
                          label="Banner message"
                          value={formData.urgencySettings.bannerMessage}
                          onChange={(value) => 
                            setFormData(prev => ({
                              ...prev,
                              urgencySettings: { ...prev.urgencySettings, bannerMessage: value }
                            }))
                          }
                          placeholder="Hurry! Time is running out!"
                          error={errors.urgencyBanner}
                        />
                      )}
                    </BlockStack>
                  )}
                </BlockStack>
              </FormLayout>
            </Form>
          </div>

          <div style={{ width: "360px", position: "sticky", top: "0" }}>
            <BlockStack gap="400">
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Live Preview</Text>
                  <div style={{
                    border: "1px solid #e1e3e5",
                    borderRadius: "8px",
                    padding: "16px",
                    background: "#f6f6f7"
                  }}>
                    <LiveCountdown
                      timer={previewTimer}
                      showPreview={false}
                      compact={true}
                    />
                  </div>
                  <div style={{ fontSize: '10px', color: '#666', wordBreak: 'break-all' }}>
                    <div>BG: {formData.style.backgroundColor}</div>
                    <div>Text: {formData.style.textColor}</div>
                  </div>
                </BlockStack>
              </Box>

              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Style Settings</Text>

                  <BlockStack gap="300">
                    <Text variant="bodySm" tone="subdued">Background Color</Text>
                    <div style={{ 
                      border: '2px solid #ddd', 
                      borderRadius: '8px',
                      padding: '12px',
                      background: '#fff'
                    }}>
                      <HexColorPicker
                        color={formData.style.backgroundColor}
                        onChange={handleColorChange('backgroundColor')}
                        style={{ width: '100%', height: '200px' }}
                      />
                    </div>
                    <TextField
                      label="Background Color (Hex)"
                      value={formData.style.backgroundColor}
                      onChange={handleColorChange('backgroundColor')}
                      placeholder="#000000"
                    />
                  </BlockStack>

                  <BlockStack gap="300">
                    <Text variant="bodySm" tone="subdued">Text Color</Text>
                    <div style={{ 
                      border: '2px solid #ddd', 
                      borderRadius: '8px',
                      padding: '12px',
                      background: '#fff'
                    }}>
                      <HexColorPicker
                        color={formData.style.textColor}
                        onChange={handleColorChange('textColor')}
                        style={{ width: '100%', height: '200px' }}
                      />
                    </div>
                    <TextField
                      label="Text Color (Hex)"
                      value={formData.style.textColor}
                      onChange={handleColorChange('textColor')}
                      placeholder="#ffffff"
                    />
                  </BlockStack>

                  <InlineStack gap="200">
                    <TextField
                      label="Font Size (px)"
                      type="number"
                      value={formData.style.fontSize.toString()}
                      onChange={(value) => handleStyleChange("fontSize")(parseInt(value) || 16)}
                      min={10}
                      max={32}
                    />
                    <Select
                      label="Font Family"
                      options={fontFamilyOptions}
                      value={formData.style.fontFamily}
                      onChange={handleStyleChange("fontFamily")}
                    />
                  </InlineStack>

                  <TextField
                    label="Border Radius (px)"
                    type="number"
                    value={formData.style.borderRadius.toString()}
                    onChange={(value) => handleStyleChange("borderRadius")(parseInt(value) || 4)}
                    min={0}
                    max={20}
                  />
                </BlockStack>
              </Box>
            </BlockStack>
          </div>
        </div>
      </Modal.Section>
    </Modal>
  );
}