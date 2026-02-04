import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { JOB_TABS, type JobTabType } from "./types";

interface JobTabsProps {
  activeTab: JobTabType;
  onTabChange: (tab: JobTabType) => void;
  jobCounts?: {
    all: number;
    active: number;
    paused: number;
    closed: number;
  };
}

export const JobTabs = ({
  activeTab,
  onTabChange,
  jobCounts,
}: JobTabsProps) => {
  return (
    <View className="bg-white border-b border-gray-200">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        {JOB_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = jobCounts?.[tab.key];

          return (
            <TouchableOpacity
              key={tab.key}
              className={`py-3.5 px-4 mr-1 ${isActive ? "border-b-[3px]" : ""}`}
              style={isActive ? { borderBottomColor: "#8B2635" } : {}}
              onPress={() => onTabChange(tab.key)}
            >
              <View className="flex-row items-center gap-1.5">
                <Text
                  className={`text-[15px] font-medium ${
                    isActive ? "font-semibold" : "text-gray-500"
                  }`}
                  style={isActive ? { color: "#8B2635" } : {}}
                >
                  {tab.label}
                </Text>
                {count !== undefined && count > 0 && (
                  <View
                    className={`px-1.5 py-0.5 rounded-full min-w-[20px] items-center ${
                      isActive ? "bg-[#8B2635]" : "bg-gray-200"
                    }`}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isActive ? "text-white" : "text-gray-600"
                      }`}
                    >
                      {count}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};
