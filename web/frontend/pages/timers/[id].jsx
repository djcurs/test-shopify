// pages/timers/[id].jsx (or new.jsx for create)
import React, { useState, useCallback, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Loading,
  Text,
  Box,
} from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";
import { useTimerAPI } from "../../../hooks/useTimerAPI";
import LiveCountdown from "../../components/LiveCountdown";

export default function TimerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = id && id !== "new";
  
  const { useTimer, useCreateTimer, useUpdateTimer } = useTimerAPI();
  const { data: timer, isLoading: timerLoading } = useTimer(isEdit ? id : null);
  const createTimerMutation = useCreateTimer();
  const updateTimerMutation = useUpdateTimer();

  // Form state
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
  });

  const [toastActive, setToastActive] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [errors, setErrors] = useState({});

  // Load timer data for editing
  useEffect(() => {
    if (timer && isEdit) {
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
          backgroundColor: "#000000",
          textColor: "#ffffff",
          fontSize: 16,
          fontFamily: "Arial",
          borderRadius: 4,
          padding: 12,
          ...timer.style,
        },
      });
    }
  }, [timer, isEdit]);

  const handleInputChange = useCallback((field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  }, [errors]);

  const handleStyleChange = useCallback((styleField) => (value) => {
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

      if (isEdit) {
        await updateTimerMutation.mutateAsync({ id, ...submitData });
        setToastMessage("Timer updated successfully!");
      } else {
        await createTimerMutation.mutateAsync(submitData);
        setToastMessage("Timer created successfully!");
      }
      
      setToastActive(true);
      setTimeout(() => navigate("/timers"), 1500);
    } catch (error) {
      setToastMessage(`Failed to ${isEdit ? "update" : "create"} timer: ${error.message}`);
      setToastActive(true);
    }
  }, [formData, validateForm, isEdit, updateTimerMutation, createTimerMutation, navigate, id]);

  const fontFamilyOptions = [
    { label: "Arial", value: "Arial" },
    { label: "Helvetica", value: "Helvetica" },
    { label: "Times New Roman", value: "Times New Roman" },
    { label: "Georgia", value: "Georgia" },
    { label: "Verdana", value: "Verdana" },
  ];

  if (isEdit && timerLoading) {
    return (
      <Frame>
        <Loading />
      </Frame>
    );
  }

  const isLoading = createTimerMutation.isLoading || updateTimerMutation.isLoading;

  return (
    <Frame>
      <Page
        title={isEdit ? "Edit Timer" : "Create Timer"}
        breadcrumbs={[{ content: "Timers", url: "/timers" }]}
        primaryAction={{
          content: isEdit ? "Update Timer" : "Create Timer",
          loading: isLoading,
          onAction: handleSubmit,
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: () => navigate("/timers"),
          },
        ]}
      >
        <TitleBar title={isEdit ? "Edit Timer" : "Create Timer"} />
        
        <Layout>
          <Layout.Section>
            <Box padding="400">
              <Form onSubmit={handleSubmit}>
                <FormLayout>
                  <TextField
                    label="Timer Title"
                    value={formData.title}
                    onChange={handleInputChange("title")}
                    error={errors.title}
                    placeholder="e.g., Black Friday Sale"
                    helpText="Give your timer a descriptive name"
                  />

                  <InlineStack gap="400">
                    <TextField
                      label="Start Time (Optional)"
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={handleInputChange("startTime")}
                      helpText="When should the timer start? Leave empty to start immediately"
                    />
                    
                    <TextField
                      label="End Time"
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={handleInputChange("endTime")}
                      error={errors.endTime}
                      helpText="When should the timer end?"
                    />
                  </InlineStack>

                  <TextField
                    label="Duration (minutes, optional)"
                    type="number"
                    value={formData.duration || ""}
                    onChange={handleInputChange("duration")}
                    error={errors.duration}
                    helpText="Alternative to end time - how long should the timer run?"
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
                    helpText="Specific products to show this timer on"
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
                    helpText="Collections to show this timer on"
                  />
                </FormLayout>
              </Form>
            </Box>
          </Layout.Section>

          <Layout.Section secondary>
            <BlockStack gap="400">
              {/* Timer Messages */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Timer Messages</Text>
                  <FormLayout>
                    <TextField
                      label="Before Message"
                      value={formData.beforeMessage}
                      onChange={handleInputChange("beforeMessage")}
                      placeholder="Limited time offer!"
                      helpText="Message shown before the countdown"
                    />

                    <TextField
                      label="After Message"
                      value={formData.afterMessage}
                      onChange={handleInputChange("afterMessage")}
                      placeholder="Offer has ended"
                      helpText="Message shown after timer expires"
                    />
                  </FormLayout>
                </BlockStack>
              </Box>

              {/* Timer Behavior */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Timer Behavior</Text>
                  <FormLayout>
                    <Checkbox
                      label="Loop Timer"
                      checked={formData.loop}
                      onChange={handleInputChange("loop")}
                      helpText="Restart the timer when it expires"
                    />

                    <Checkbox
                      label="Hide After Completion"
                      checked={formData.hideAfterCompletion}
                      onChange={handleInputChange("hideAfterCompletion")}
                      helpText="Hide the timer completely when it expires"
                    />

                    <Checkbox
                      label="Active"
                      checked={formData.active}
                      onChange={handleInputChange("active")}
                      helpText="Whether this timer is currently active"
                    />
                  </FormLayout>
                </BlockStack>
              </Box>

              {/* Timer Style */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Timer Style</Text>
                  <FormLayout>
                    <InlineStack gap="400">
                      <TextField
                        label="Background Color"
                        value={formData.style.backgroundColor}
                        onChange={handleStyleChange("backgroundColor")}
                        placeholder="#000000"
                      />
                      <TextField
                        label="Text Color"
                        value={formData.style.textColor}
                        onChange={handleStyleChange("textColor")}
                        placeholder="#ffffff"
                      />
                    </InlineStack>

                    <InlineStack gap="400">
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

                    <InlineStack gap="400">
                      <TextField
                        label="Border Radius (px)"
                        type="number"
                        value={formData.style.borderRadius.toString()}
                        onChange={(value) => handleStyleChange("borderRadius")(parseInt(value) || 4)}
                        min={0}
                        max={20}
                      />
                      <TextField
                        label="Padding (px)"
                        type="number"
                        value={formData.style.padding.toString()}
                        onChange={(value) => handleStyleChange("padding")(parseInt(value) || 12)}
                        min={4}
                        max={32}
                      />
                    </InlineStack>
                  </FormLayout>
                </BlockStack>
              </Box>

              {/* Live Timer Preview */}
              <Box padding="400">
                <BlockStack gap="400">
                  <Text variant="headingSm" as="h3">Live Preview</Text>
                  <LiveCountdown 
                    timer={{
                      ...formData,
                      startTime: formData.startTime ? new Date(formData.startTime).toISOString() : null,
                      endTime: formData.endTime ? new Date(formData.endTime).toISOString() : null,
                    }}
                    showPreview={true}
                  />
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