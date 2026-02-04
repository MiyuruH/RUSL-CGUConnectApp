import { Plus, X } from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import {
    CONTRACT_TYPES,
    type EmployerJobFormData
} from "./types";

interface JobFormModalProps {
  visible: boolean;
  isEditMode: boolean;
  formData: EmployerJobFormData;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (data: EmployerJobFormData) => void;
}

export const JobFormModal = ({
  visible,
  isEditMode,
  formData,
  onClose,
  onSave,
  onFormChange,
}: JobFormModalProps) => {
  const [requirementInput, setRequirementInput] = useState("");
  const [responsibilityInput, setResponsibilityInput] = useState("");

  // Add requirement
  const handleAddRequirement = useCallback(() => {
    if (requirementInput.trim()) {
      onFormChange({
        ...formData,
        requirements: [...formData.requirements, requirementInput.trim()],
      });
      setRequirementInput("");
    }
  }, [requirementInput, formData, onFormChange]);

  // Remove requirement
  const handleRemoveRequirement = useCallback(
    (index: number) => {
      onFormChange({
        ...formData,
        requirements: formData.requirements.filter((_, i) => i !== index),
      });
    },
    [formData, onFormChange],
  );

  // Add responsibility
  const handleAddResponsibility = useCallback(() => {
    if (responsibilityInput.trim()) {
      onFormChange({
        ...formData,
        responsibilities: [
          ...formData.responsibilities,
          responsibilityInput.trim(),
        ],
      });
      setResponsibilityInput("");
    }
  }, [responsibilityInput, formData, onFormChange]);

  // Remove responsibility
  const handleRemoveResponsibility = useCallback(
    (index: number) => {
      onFormChange({
        ...formData,
        responsibilities: formData.responsibilities.filter(
          (_, i) => i !== index,
        ),
      });
    },
    [formData, onFormChange],
  );

  const updateField = <K extends keyof EmployerJobFormData>(
    field: K,
    value: EmployerJobFormData[K],
  ) => {
    onFormChange({ ...formData, [field]: value });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-white"
      >
        {/* Modal Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
          <TouchableOpacity onPress={onClose}>
            <X size={24} color="#666" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-900">
            {isEditMode ? "Edit Job" : "Post New Job"}
          </Text>
          <TouchableOpacity onPress={onSave}>
            <Text className="text-base font-semibold text-[#8B2635]">
              {isEditMode ? "Save" : "Post"}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
        >
          {/* Job Title */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Job Title *
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="e.g. Software Engineer"
              placeholderTextColor="#9ca3af"
              value={formData.title}
              onChangeText={(text) => updateField("title", text)}
            />
          </View>

          {/* Location */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Location *
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="e.g. Colombo, Sri Lanka or Remote"
              placeholderTextColor="#9ca3af"
              value={formData.location}
              onChangeText={(text) => updateField("location", text)}
            />
          </View>

          {/* Contract Type */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Contract Type
            </Text>
            <View className="flex-row flex-wrap gap-2">
              {CONTRACT_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`px-4 py-2 rounded-full ${
                    formData.contractType === type
                      ? "bg-[#8B2635]"
                      : "bg-gray-100"
                  }`}
                  onPress={() => updateField("contractType", type)}
                >
                  <Text
                    className={`text-sm font-medium ${
                      formData.contractType === type
                        ? "text-white"
                        : "text-gray-600"
                    }`}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Salary */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Salary Range
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="e.g. LKR 200,000 - 300,000"
              placeholderTextColor="#9ca3af"
              value={formData.salary}
              onChangeText={(text) => updateField("salary", text)}
            />
          </View>

          {/* Description */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="Describe the role and what you're looking for..."
              placeholderTextColor="#9ca3af"
              value={formData.description}
              onChangeText={(text) => updateField("description", text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
          </View>

          {/* Requirements */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Requirements
            </Text>
            <View className="flex-row items-center gap-2 mb-2">
              <TextInput
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
                placeholder="Add a requirement..."
                placeholderTextColor="#9ca3af"
                value={requirementInput}
                onChangeText={setRequirementInput}
                onSubmitEditing={handleAddRequirement}
              />
              <TouchableOpacity
                className="bg-[#8B2635] p-3 rounded-xl"
                onPress={handleAddRequirement}
              >
                <Plus size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            {formData.requirements.map((req, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-2"
              >
                <Text className="flex-1 text-sm text-gray-700 mr-2">
                  • {req}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveRequirement(index)}
                >
                  <X size={16} color="#E53935" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Responsibilities */}
          <View className="mb-4">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Responsibilities
            </Text>
            <View className="flex-row items-center gap-2 mb-2">
              <TextInput
                className="flex-1 bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
                placeholder="Add a responsibility..."
                placeholderTextColor="#9ca3af"
                value={responsibilityInput}
                onChangeText={setResponsibilityInput}
                onSubmitEditing={handleAddResponsibility}
              />
              <TouchableOpacity
                className="bg-[#8B2635] p-3 rounded-xl"
                onPress={handleAddResponsibility}
              >
                <Plus size={18} color="#fff" />
              </TouchableOpacity>
            </View>
            {formData.responsibilities.map((resp, index) => (
              <View
                key={index}
                className="flex-row items-center justify-between bg-gray-50 rounded-lg px-3 py-2 mb-2"
              >
                <Text className="flex-1 text-sm text-gray-700 mr-2">
                  • {resp}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveResponsibility(index)}
                >
                  <X size={16} color="#E53935" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          {/* Company Info */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Company Info
            </Text>
            <TextInput
              className="bg-gray-100 rounded-xl px-4 py-3 text-base text-gray-800"
              placeholder="Brief description about your company..."
              placeholderTextColor="#9ca3af"
              value={formData.companyInfo}
              onChangeText={(text) => updateField("companyInfo", text)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              style={{ minHeight: 80 }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Modal>
  );
};
