import { Tabs, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { TopHeader } from "@/components/ui/top-header";
import { Colors } from "@/constants/theme";
import { mockNotifications, mockUser } from "@/data/mock-user";
import { useColorScheme } from "@/hooks/use-color-scheme";
import {
    NavigationVisibilityProvider,
    useNavigationVisibility,
} from "@/hooks/use-navigation-visibility";
import * as NavigationBar from "expo-navigation-bar";
import { Briefcase, Home, MessageSquareText } from "lucide-react-native";
import { Platform } from "react-native";

function TabLayoutContent() {
  const colorScheme = useColorScheme();
  const pathname = usePathname();
  const { isNavigationVisible } = useNavigationVisibility();
  const [unreadCount, setUnreadCount] = useState(
    mockNotifications.filter((n) => !n.isRead).length,
  );

  // Pages where top header and bottom tabs should be visible
  const mainPages = ["/", "/index", "/jobs", "/messages", "/profile"];
  const isMainPage = mainPages.includes(pathname);

  // Hide navigation on job-details and notifications page (notifications has its own header)
  const isJobDetailsPage = pathname.includes("job-details");
  const isNotificationsPage = pathname.includes("notifications");

  // Show navigation only on main pages and when context allows it
  const shouldShowNavigation =
    isMainPage &&
    !isJobDetailsPage &&
    !isNotificationsPage &&
    isNavigationVisible;

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setBackgroundColorAsync(
        Colors[colorScheme ?? "light"].background,
      );
      NavigationBar.setButtonStyleAsync(
        colorScheme === "dark" ? "light" : "dark",
      );
    }
  }, [colorScheme]);

  return (
    <View className="flex-1">
      {/* Fixed Top Header - only show on main pages */}
      {shouldShowNavigation && (
        <TopHeader
          userName={mockUser.name}
          userAvatar={mockUser.avatar}
          notificationCount={unreadCount}
        />
      )}

      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: shouldShowNavigation
            ? {
                backgroundColor: Colors[colorScheme ?? "light"].background,
                borderTopColor: colorScheme === "dark" ? "#333" : "#eee",
              }
            : { display: "none" },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => <Home size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="jobs"
          options={{
            title: "Jobs",
            tabBarIcon: ({ color }) => <Briefcase size={28} color={color} />,
          }}
        />
        <Tabs.Screen
          name="messages"
          options={{
            title: "Messages",
            tabBarIcon: ({ color }) => (
              <MessageSquareText size={28} color={color} />
            ),
          }}
        />

        {/* Hidden screens - not shown in tab bar */}
        <Tabs.Screen
          name="notifications"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="job-details"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            href: null,
            headerShown: false,
          }}
        />
      </Tabs>
    </View>
  );
}

export default function TabLayout() {
  return (
    <NavigationVisibilityProvider>
      <TabLayoutContent />
    </NavigationVisibilityProvider>
  );
}
