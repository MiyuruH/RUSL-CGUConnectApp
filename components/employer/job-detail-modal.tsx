import {
    Briefcase,
    Building2,
    Clock,
    DollarSign,
    Edit2,
    Eye,
    MapPin,
    Pause,
    Play,
    Trash2,
    Users,
    X,
    XCircle,
} from "lucide-react-native";
import React from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import type { EmployerJob } from "./types";

interface JobDetailModalProps {
  visible: boolean;
  job: EmployerJob | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPause: () => void;
  onResume: () => void;
  onCloseJob: () => void;
}

export const JobDetailModal = ({
  visible,
  job,
  onClose,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onCloseJob,
}: JobDetailModalProps) => {
  const getStatusColor = () => {
    if (!job) return { bg: "bg-gray-100", text: "text-gray-500" };
    switch (job.status) {
      case "active":
        return { bg: "bg-green-100", text: "text-green-600" };
      case "paused":
        return { bg: "bg-yellow-100", text: "text-yellow-600" };
      case "closed":
        return { bg: "bg-gray-100", text: "text-gray-500" };
    }
  };

  const statusColors = getStatusColor();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      {job ? (
        <View className="flex-1 bg-white">
          {/* Modal Header */}
          <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text className="text-lg font-bold text-gray-900">Job Details</Text>
            <TouchableOpacity onPress={onEdit}>
              <Edit2 size={20} color="#8B2635" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="flex-1 px-4 py-4"
            showsVerticalScrollIndicator={false}
          >
            {/* Job Header */}
            <View className="mb-4">
              <View className="flex-row items-start justify-between mb-2">
                <Text className="text-xl font-bold text-gray-900 flex-1 mr-2">
                  {job.title}
                </Text>
                <View className={`px-3 py-1.5 rounded-full ${statusColors.bg}`}>
                  <Text
                    className={`text-xs font-semibold capitalize ${statusColors.text}`}
                  >
                    {job.status}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3 flex-wrap">
                <View className="flex-row items-center gap-1">
                  <MapPin size={14} color="#666" />
                  <Text className="text-sm text-gray-600">{job.location}</Text>
                </View>
                <View className="flex-row items-center gap-1">
                  <Briefcase size={14} color="#666" />
                  <Text className="text-sm text-gray-600">
                    {job.contractType}
                  </Text>
                </View>
                {job.salary && (
                  <View className="flex-row items-center gap-1">
                    <DollarSign size={14} color="#059669" />
                    <Text className="text-sm text-emerald-600">
                      {job.salary}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Stats */}
            <View className="flex-row gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
              <View className="flex-1 items-center">
                <View className="flex-row items-center gap-1 mb-1">
                  <Users size={16} color="#8B2635" />
                  <Text className="text-lg font-bold text-gray-900">
                    {job.applicants}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">Applicants</Text>
              </View>
              <View className="flex-1 items-center">
                <View className="flex-row items-center gap-1 mb-1">
                  <Eye size={16} color="#2196F3" />
                  <Text className="text-lg font-bold text-gray-900">
                    {job.views}
                  </Text>
                </View>
                <Text className="text-xs text-gray-500">Views</Text>
              </View>
              <View className="flex-1 items-center">
                <View className="flex-row items-center gap-1 mb-1">
                  <Clock size={16} color="#666" />
                </View>
                <Text className="text-xs text-gray-500">{job.postedDate}</Text>
              </View>
            </View>

            {/* Description */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                Description
              </Text>
              <Text className="text-sm text-gray-600 leading-6">
                {job.description}
              </Text>
            </View>

            {/* Requirements */}
            {job.requirements.length > 0 && (
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Requirements
                </Text>
                {job.requirements.map((req, index) => (
                  <View key={index} className="flex-row items-start mb-2">
                    <Text className="text-sm text-[#8B2635] mr-2">•</Text>
                    <Text className="flex-1 text-sm text-gray-600">{req}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Responsibilities */}
            {job.responsibilities.length > 0 && (
              <View className="mb-6">
                <Text className="text-base font-semibold text-gray-900 mb-2">
                  Responsibilities
                </Text>
                {job.responsibilities.map((resp, index) => (
                  <View key={index} className="flex-row items-start mb-2">
                    <Text className="text-sm text-[#8B2635] mr-2">•</Text>
                    <Text className="flex-1 text-sm text-gray-600">{resp}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Company Info */}
            <View className="mb-8">
              <Text className="text-base font-semibold text-gray-900 mb-2">
                About Company
              </Text>
              <View className="flex-row items-start gap-2">
                <Building2 size={16} color="#8B2635" />
                <Text className="flex-1 text-sm text-gray-600">
                  {job.companyInfo}
                </Text>
              </View>
            </View>
          </ScrollView>

          {/* Bottom Actions */}
          <View className="px-4 py-4 border-t border-gray-200">
            {/* Primary Actions */}
            <View className="flex-row gap-3 mb-3">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-blue-50"
                onPress={onEdit}
              >
                <Edit2 size={18} color="#2196F3" />
                <Text className="text-base font-semibold text-blue-500">
                  Edit Job
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-red-50"
                onPress={onDelete}
              >
                <Trash2 size={18} color="#E53935" />
                <Text className="text-base font-semibold text-red-500">
                  Delete
                </Text>
              </TouchableOpacity>
            </View>

            {/* Status Actions */}
            <View className="flex-row gap-3">
              {job.status === "active" && (
                <>
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-yellow-50"
                    onPress={onPause}
                  >
                    <Pause size={18} color="#CA8A04" />
                    <Text className="text-base font-semibold text-yellow-600">
                      Pause
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-gray-100"
                    onPress={onCloseJob}
                  >
                    <XCircle size={18} color="#6B7280" />
                    <Text className="text-base font-semibold text-gray-600">
                      Close Job
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {job.status === "paused" && (
                <>
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-green-50"
                    onPress={onResume}
                  >
                    <Play size={18} color="#16A34A" />
                    <Text className="text-base font-semibold text-green-600">
                      Resume
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-gray-100"
                    onPress={onCloseJob}
                  >
                    <XCircle size={18} color="#6B7280" />
                    <Text className="text-base font-semibold text-gray-600">
                      Close Job
                    </Text>
                  </TouchableOpacity>
                </>
              )}
              {job.status === "closed" && (
                <TouchableOpacity
                  className="flex-1 flex-row items-center justify-center gap-2 py-3 rounded-xl bg-green-50"
                  onPress={onResume}
                >
                  <Play size={18} color="#16A34A" />
                  <Text className="text-base font-semibold text-green-600">
                    Reopen Job
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      ) : null}
    </Modal>
  );
};
