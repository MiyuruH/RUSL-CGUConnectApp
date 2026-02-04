import {
    Briefcase,
    Clock,
    DollarSign,
    Edit2,
    Eye,
    MapPin,
    MoreVertical,
    Pause,
    Play,
    Trash2,
    Users,
    XCircle,
} from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import type { EmployerJob } from "./types";

interface EmployerJobCardProps {
  job: EmployerJob;
  onPress: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPause: () => void;
  onResume: () => void;
  onClose: () => void;
}

export const EmployerJobCard = ({
  job,
  onPress,
  onEdit,
  onDelete,
  onPause,
  onResume,
  onClose,
}: EmployerJobCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusColor = () => {
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
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1 mr-2">
          <Text className="text-base font-semibold text-gray-900 mb-1">
            {job.title}
          </Text>
          <View className="flex-row items-center gap-2 flex-wrap">
            <View className="flex-row items-center gap-1">
              <MapPin size={12} color="#999" />
              <Text className="text-xs text-gray-400">{job.location}</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Briefcase size={12} color="#999" />
              <Text className="text-xs text-gray-400">{job.contractType}</Text>
            </View>
            {job.salary && (
              <View className="flex-row items-center gap-1">
                <DollarSign size={12} color="#059669" />
                <Text className="text-xs text-emerald-600">{job.salary}</Text>
              </View>
            )}
          </View>
        </View>
        <View className="flex-row items-center gap-2">
          <View className={`px-2 py-1 rounded-full ${statusColors.bg}`}>
            <Text
              className={`text-xs font-medium capitalize ${statusColors.text}`}
            >
              {job.status}
            </Text>
          </View>
          <TouchableOpacity
            className="p-1"
            onPress={() => setShowMenu(!showMenu)}
          >
            <MoreVertical size={18} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-row items-center gap-4 mb-3">
        <View className="flex-row items-center gap-1.5">
          <Users size={14} color="#8B2635" />
          <Text className="text-sm text-gray-600">
            {job.applicants} applicants
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Eye size={14} color="#2196F3" />
          <Text className="text-sm text-gray-600">{job.views} views</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Clock size={14} color="#999" />
          <Text className="text-sm text-gray-400">{job.postedDate}</Text>
        </View>
      </View>

      {showMenu && (
        <View className="pt-2 border-t border-gray-100">
          {/* Edit and Delete Row */}
          <View className="flex-row gap-2 mb-2">
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg bg-blue-50"
              onPress={() => {
                setShowMenu(false);
                onEdit();
              }}
            >
              <Edit2 size={14} color="#2196F3" />
              <Text className="text-sm font-medium text-blue-500">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg bg-red-50"
              onPress={() => {
                setShowMenu(false);
                onDelete();
              }}
            >
              <Trash2 size={14} color="#E53935" />
              <Text className="text-sm font-medium text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>

          {/* Status Actions Row */}
          <View className="flex-row gap-2">
            {/* Pause/Resume Button - only for active or paused jobs */}
            {job.status !== "closed" && (
              <TouchableOpacity
                className={`flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg ${
                  job.status === "active" ? "bg-yellow-50" : "bg-green-50"
                }`}
                onPress={() => {
                  setShowMenu(false);
                  if (job.status === "active") {
                    onPause();
                  } else {
                    onResume();
                  }
                }}
              >
                {job.status === "active" ? (
                  <>
                    <Pause size={14} color="#CA8A04" />
                    <Text className="text-sm font-medium text-yellow-600">
                      Pause
                    </Text>
                  </>
                ) : (
                  <>
                    <Play size={14} color="#16A34A" />
                    <Text className="text-sm font-medium text-green-600">
                      Resume
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}

            {/* Close Button - only for active or paused jobs */}
            {job.status !== "closed" && (
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg bg-gray-100"
                onPress={() => {
                  setShowMenu(false);
                  onClose();
                }}
              >
                <XCircle size={14} color="#6B7280" />
                <Text className="text-sm font-medium text-gray-600">
                  Close Job
                </Text>
              </TouchableOpacity>
            )}

            {/* Reopen Button - only for closed jobs */}
            {job.status === "closed" && (
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 py-2 rounded-lg bg-green-50"
                onPress={() => {
                  setShowMenu(false);
                  onResume();
                }}
              >
                <Play size={14} color="#16A34A" />
                <Text className="text-sm font-medium text-green-600">
                  Reopen Job
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
