import {
    AboutScreen,
    AccountSettingsScreen,
    ApplicationHistoryScreen,
    FavoriteCompaniesScreen,
    HelpSupportScreen,
    NotificationPreferencesScreen,
    PersonalInfoScreen,
    PrivacySettingsScreen,
    ResumeScreen,
    SavedJobsScreen,
} from "@/components/profile";
import { MenuDivider, MenuItem, MenuSection } from "@/components/ui/menu-item";
import { ProfileAvatar } from "@/components/ui/profile-avatar";
import { mockUser } from "@/data/mock-user";
import { useNavigationVisibility } from "@/hooks/use-navigation-visibility";
import { useRouter } from "expo-router";
import {
    Bell,
    Bookmark,
    ChevronLeft,
    CircleHelp,
    FileText,
    Heart,
    History,
    Info,
    Lock,
    LogOut,
    Pencil,
    Settings,
    User,
} from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Define screen types for navigation
type ProfileSubScreen =
  | "main"
  | "personal-info"
  | "resume"
  | "saved-jobs"
  | "favorite-companies"
  | "application-history"
  | "account-settings"
  | "privacy-settings"
  | "notification-preferences"
  | "help-support"
  | "about";

export default function ProfileScreen() {
  const router = useRouter();
  const [user] = useState(mockUser);
  const [activeScreen, setActiveScreen] = useState<ProfileSubScreen>("main");
  const { setNavigationVisible } = useNavigationVisibility();

  // Update navigation visibility when activeScreen changes
  useEffect(() => {
    setNavigationVisible(activeScreen === "main");
  }, [activeScreen, setNavigationVisible]);

  const handleBack = () => {
    if (activeScreen !== "main") {
      setActiveScreen("main");
    } else {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/(jobSeeker)");
      }
    }
  };

  const handleEditProfile = () => {
    setActiveScreen("personal-info");
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Navigate to auth screen
            router.replace("/(auth)");
          },
        },
      ],
      { cancelable: true },
    );
  };

  // Get screen title based on active screen
  const getScreenTitle = (): string => {
    switch (activeScreen) {
      case "personal-info":
        return "Personal Information";
      case "resume":
        return "Resume / CV";
      case "saved-jobs":
        return "Saved Jobs";
      case "favorite-companies":
        return "Favorite Companies";
      case "application-history":
        return "Application History";
      case "account-settings":
        return "Account Settings";
      case "privacy-settings":
        return "Privacy Settings";
      case "notification-preferences":
        return "Notifications";
      case "help-support":
        return "Help & Support";
      case "about":
        return "About CGUConnect";
      default:
        return "Profile";
    }
  };

  // Render the appropriate sub-screen
  const renderScreen = () => {
    switch (activeScreen) {
      case "personal-info":
        return <PersonalInfoScreen onBack={() => setActiveScreen("main")} />;
      case "resume":
        return <ResumeScreen onBack={() => setActiveScreen("main")} />;
      case "saved-jobs":
        return <SavedJobsScreen onBack={() => setActiveScreen("main")} />;
      case "favorite-companies":
        return (
          <FavoriteCompaniesScreen onBack={() => setActiveScreen("main")} />
        );
      case "application-history":
        return (
          <ApplicationHistoryScreen onBack={() => setActiveScreen("main")} />
        );
      case "account-settings":
        return <AccountSettingsScreen onBack={() => setActiveScreen("main")} />;
      case "privacy-settings":
        return <PrivacySettingsScreen onBack={() => setActiveScreen("main")} />;
      case "notification-preferences":
        return (
          <NotificationPreferencesScreen
            onBack={() => setActiveScreen("main")}
          />
        );
      case "help-support":
        return <HelpSupportScreen onBack={() => setActiveScreen("main")} />;
      case "about":
        return <AboutScreen onBack={() => setActiveScreen("main")} />;
      default:
        return renderMainProfile();
    }
  };

  const renderMainProfile = () => (
    <>
      {/* Profile Info Card */}
      <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
        <View className="items-center">
          {/* Avatar with Edit Button */}
          <View className="relative mb-4">
            <ProfileAvatar
              uri={user.avatar}
              name={user.name}
              size="xl"
              showBorder
            />
            <Pressable
              onPress={handleEditProfile}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center shadow-md"
              style={({ pressed }) => ({
                backgroundColor: "#8B2635",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Pencil size={16} color="#fff" />
            </Pressable>
          </View>

          {/* User Name */}
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {user.name}
          </Text>

          {/* Role */}
          <Text className="text-base text-gray-600 mb-1">{user.role}</Text>

          {/* Email */}
          <Text className="text-sm text-gray-400">{user.email}</Text>
        </View>
      </View>

      {/* Menu Sections */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Section */}
        <MenuSection title="Profile">
          <MenuItem
            title="Personal Information"
            subtitle="Name, email, phone number"
            icon={User}
            onPress={() => setActiveScreen("personal-info")}
          />
          <MenuDivider />
          <MenuItem
            title="Resume / CV"
            subtitle="Manage your resume"
            icon={FileText}
            onPress={() => setActiveScreen("resume")}
          />
        </MenuSection>

        {/* Activity Section */}
        <MenuSection title="Activity">
          <MenuItem
            title="Saved Jobs"
            subtitle="Jobs you bookmarked"
            icon={Bookmark}
            onPress={() => setActiveScreen("saved-jobs")}
          />
          <MenuDivider />
          <MenuItem
            title="Favorite Companies"
            subtitle="Companies you follow"
            icon={Heart}
            onPress={() => setActiveScreen("favorite-companies")}
          />
          <MenuDivider />
          <MenuItem
            title="Application History"
            subtitle="Track your applications"
            icon={History}
            onPress={() => setActiveScreen("application-history")}
          />
        </MenuSection>

        {/* Settings Section */}
        <MenuSection title="Settings">
          <MenuItem
            title="Account Settings"
            subtitle="Password, security"
            icon={Settings}
            onPress={() => setActiveScreen("account-settings")}
          />
          <MenuDivider />
          <MenuItem
            title="Privacy Settings"
            subtitle="Manage your privacy"
            icon={Lock}
            onPress={() => setActiveScreen("privacy-settings")}
          />
          <MenuDivider />
          <MenuItem
            title="Notification Preferences"
            subtitle="Email, push notifications"
            icon={Bell}
            onPress={() => setActiveScreen("notification-preferences")}
          />
        </MenuSection>

        {/* Support Section */}
        <MenuSection title="Support">
          <MenuItem
            title="Help & Support"
            subtitle="FAQs, contact us"
            icon={CircleHelp}
            onPress={() => setActiveScreen("help-support")}
          />
          <MenuDivider />
          <MenuItem
            title="About CGUConnect"
            subtitle="Version 1.0.0"
            icon={Info}
            onPress={() => setActiveScreen("about")}
          />
        </MenuSection>

        {/* Logout */}
        <MenuSection>
          <MenuItem
            title="Logout"
            icon={LogOut}
            onPress={handleLogout}
            destructive
            showChevron={false}
          />
        </MenuSection>
      </ScrollView>
    </>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Sub-page Header - only show when in a sub-screen */}
      {activeScreen !== "main" && (
        <SafeAreaView edges={["top"]} className="bg-white">
          <View className="px-4 py-3 border-b border-gray-100">
            <View className="flex-row items-center">
              <Pressable
                onPress={handleBack}
                className="w-10 h-10 items-center justify-center -ml-2"
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <ChevronLeft size={28} color="#333" />
              </Pressable>
              <Text className="text-xl font-bold text-gray-900 ml-2">
                {getScreenTitle()}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      )}

      {/* Screen Content */}
      {renderScreen()}
    </View>
  );
}
