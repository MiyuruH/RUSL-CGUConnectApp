import { AlertCircle, CheckCircle, Pause, XCircle } from "lucide-react-native";
import React from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

// Delete Confirmation Modal
interface DeleteModalProps {
  visible: boolean;
  jobTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const DeleteConfirmationModal = ({
  visible,
  jobTitle,
  onCancel,
  onConfirm,
}: DeleteModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-red-100 items-center justify-center mb-3">
              <AlertCircle size={32} color="#E53935" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center">
              Delete Job?
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              Are you sure you want to delete "{jobTitle}"? This action cannot
              be undone.
            </Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl bg-gray-100"
              onPress={onCancel}
            >
              <Text className="text-base font-semibold text-gray-700 text-center">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl bg-red-500"
              onPress={onConfirm}
            >
              <Text className="text-base font-semibold text-white text-center">
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Close Job Confirmation Modal
interface CloseJobModalProps {
  visible: boolean;
  jobTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const CloseJobConfirmationModal = ({
  visible,
  jobTitle,
  onCancel,
  onConfirm,
}: CloseJobModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-gray-100 items-center justify-center mb-3">
              <XCircle size={32} color="#6B7280" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center">
              Close Job?
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              Are you sure you want to close "{jobTitle}"? The job will no
              longer be visible to job seekers. You can reopen it later.
            </Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl bg-gray-100"
              onPress={onCancel}
            >
              <Text className="text-base font-semibold text-gray-700 text-center">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl bg-gray-600"
              onPress={onConfirm}
            >
              <Text className="text-base font-semibold text-white text-center">
                Close Job
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Pause Job Confirmation Modal
interface PauseJobModalProps {
  visible: boolean;
  jobTitle?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export const PauseJobConfirmationModal = ({
  visible,
  jobTitle,
  onCancel,
  onConfirm,
}: PauseJobModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm">
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-yellow-100 items-center justify-center mb-3">
              <Pause size={32} color="#CA8A04" />
            </View>
            <Text className="text-lg font-bold text-gray-900 text-center">
              Pause Job?
            </Text>
            <Text className="text-sm text-gray-500 text-center mt-2">
              Are you sure you want to pause "{jobTitle}"? The job will be
              temporarily hidden from job seekers.
            </Text>
          </View>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl bg-gray-100"
              onPress={onCancel}
            >
              <Text className="text-base font-semibold text-gray-700 text-center">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl bg-yellow-500"
              onPress={onConfirm}
            >
              <Text className="text-base font-semibold text-white text-center">
                Pause
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// Success Modal
interface SuccessModalProps {
  visible: boolean;
  message: string;
  onClose: () => void;
}

export const SuccessModal = ({
  visible,
  message,
  onClose,
}: SuccessModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center px-6">
        <View className="bg-white rounded-2xl p-6 w-full max-w-sm items-center">
          <View className="w-16 h-16 rounded-full bg-green-100 items-center justify-center mb-3">
            <CheckCircle size={32} color="#16A34A" />
          </View>
          <Text className="text-lg font-bold text-gray-900 text-center mb-2">
            Success!
          </Text>
          <Text className="text-sm text-gray-500 text-center mb-4">
            {message}
          </Text>
          <TouchableOpacity
            className="w-full py-3 rounded-xl bg-[#8B2635]"
            onPress={onClose}
          >
            <Text className="text-base font-semibold text-white text-center">
              Done
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
