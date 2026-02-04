import { Tabs, usePathname } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

import { HapticTab } from "@/components/haptic-tab";
import { EmployerTopHeader } from "@/components/ui/employer-top-header";
import { Colors } from "@/constants/theme";
import { mockEmployer, mockEmployerNotifications } from "@/data/mock-employer";
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
    mockEmployerNotifications.filter((n) => !n.isRead).length,
  );

  // Main tab pages where navigation should always be visible
  const mainTabPages = ["/", "/index", "/jobs", "/messages", "/settings"];

  // Check if current page is a main tab page
  const isMainTabPage = mainTabPages.some(
    (page) => pathname === page || pathname.endsWith(page),
  );

  // Show navigation only on main tab pages
  // For main pages, also check context (for chat screens etc.)
  const shouldShowNavigation = isMainTabPage && isNavigationVisible;

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
        <EmployerTopHeader
          companyName={mockEmployer.companyName}
          companyLogo={mockEmployer.logo}
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
          name="settings"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="applicants"
          options={{
            href: null,
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="analytics"
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
