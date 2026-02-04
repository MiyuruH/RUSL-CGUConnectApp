import { useRouter } from "expo-router";
import { Bell } from "lucide-react-native";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { NotificationBadge } from "./notification-badge";

interface EmployerTopHeaderProps {
  companyName?: string;
  companyLogo?: string;
  notificationCount?: number;
}

export const EmployerTopHeader = ({
  companyName = "Company",
  companyLogo,
  notificationCount = 0,
}: EmployerTopHeaderProps) => {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleNotificationPress = () => {
    router.push("/(employer)/notifications");
  };

  const handleSettingsPress = () => {
    router.push("/(employer)/settings");
  };

  return (
    <View className="bg-[#8B2635]" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 h-[56px]">
        {/* Left Side - Notification Button */}
        <Pressable
          onPress={handleNotificationPress}
          className="relative p-2"
          style={({ pressed }) => ({
            opacity: pressed ? 0.7 : 1,
          })}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Bell size={24} color="#fff" />
          <NotificationBadge count={notificationCount} size="sm" />
        </Pressable>

        {/* Center - Company Name */}
        <Text className="text-lg font-semibold text-white" numberOfLines={1}>
          {companyName}
        </Text>

        {/* Right Side - Company Logo */}
        <Pressable
          onPress={handleSettingsPress}
          style={({ pressed }) => ({
            opacity: pressed ? 0.8 : 1,
          })}
        >
          <Image
            source={{
              uri:
                companyLogo ||
                `https://api.dicebear.com/7.x/initials/png?seed=${companyName}&backgroundColor=fff`,
            }}
            className="w-10 h-10 rounded-xl border-2 border-white/30"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default EmployerTopHeader;
