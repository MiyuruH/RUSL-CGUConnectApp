import { MenuDivider, MenuItem, MenuSection } from "@/components/ui/menu-item";
import { mockEmployer } from "@/data/mock-employer";
import { useRouter } from "expo-router";
import {
  Bell,
  Building2,
  Camera,
  Check,
  ChevronLeft,
  CircleHelp,
  Edit3,
  Globe,
  Info,
  Lock,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Settings,
  Users,
  X,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Profile Field Component
interface ProfileFieldProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  onEdit?: () => void;
  editable?: boolean;
}

const ProfileField = ({
  icon,
  label,
  value,
  onEdit,
  editable = true,
}: ProfileFieldProps) => (
  <View className="flex-row items-center py-3">
    <View
      className="w-9 h-9 rounded-xl justify-center items-center mr-3"
      style={{ backgroundColor: "rgba(139, 38, 53, 0.08)" }}
    >
      {icon}
    </View>
    <View className="flex-1">
      <Text className="text-xs text-gray-400 mb-0.5">{label}</Text>
      <Text className="text-[15px] text-gray-900 font-medium">{value}</Text>
    </View>
    {editable && onEdit && (
      <TouchableOpacity
        className="p-2 rounded-lg"
        style={{ backgroundColor: "rgba(139, 38, 53, 0.08)" }}
        onPress={onEdit}
      >
        <Edit3 size={16} color="#8B2635" />
      </TouchableOpacity>
    )}
  </View>
);

// Settings Toggle Item Component
interface SettingsToggleItemProps {
  icon: React.ReactNode;
  label: string;
  value: boolean;
  onToggle: (value: boolean) => void;
}

const SettingsToggleItem = ({
  icon,
  label,
  value,
  onToggle,
}: SettingsToggleItemProps) => (
  <View className="flex-row items-center justify-between bg-white py-3.5 px-4 rounded-xl mb-2">
    <View className="flex-row items-center gap-3">
      <View
        className="w-9 h-9 rounded-xl justify-center items-center"
        style={{ backgroundColor: "rgba(139, 38, 53, 0.08)" }}
      >
        {icon}
      </View>
      <Text className="text-[15px] text-gray-900 font-medium">{label}</Text>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: "#E0E0E0", true: "#FFCDD2" }}
      thumbColor={value ? "#8B2635" : "#fff"}
    />
  </View>
);

// Edit Modal Component
interface EditModalProps {
  visible: boolean;
  title: string;
  value: string;
  onClose: () => void;
  onSave: (value: string) => void;
  multiline?: boolean;
  keyboardType?: "default" | "email-address" | "phone-pad" | "url";
}

const EditModal = ({
  visible,
  title,
  value,
  onClose,
  onSave,
  multiline,
  keyboardType = "default",
}: EditModalProps) => {
  const [inputValue, setInputValue] = useState(value);

  React.useEffect(() => {
    setInputValue(value);
  }, [value, visible]);

  const handleSave = () => {
    onSave(inputValue);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 justify-center items-center p-6"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      >
        <View className="bg-white rounded-2xl p-6 w-full max-w-[360px]">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-xl font-bold text-gray-900">
              Edit {title}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <Text className="text-sm font-medium text-gray-500 mb-2">
            {title}
          </Text>
          <TextInput
            className={`border border-gray-200 rounded-xl px-4 py-3.5 text-base text-gray-900 bg-gray-50 ${multiline ? "h-[100px]" : ""}`}
            style={multiline ? { textAlignVertical: "top" } : {}}
            value={inputValue}
            onChangeText={setInputValue}
            multiline={multiline}
            numberOfLines={multiline ? 3 : 1}
            keyboardType={keyboardType}
            autoFocus
          />

          <View className="flex-row gap-3 mt-6">
            <TouchableOpacity
              className="flex-1 py-3.5 rounded-xl bg-gray-100 items-center"
              onPress={onClose}
            >
              <Text className="text-[15px] font-semibold text-gray-500">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 flex-row gap-1.5 py-3.5 rounded-xl items-center justify-center"
              style={{ backgroundColor: "#8B2635" }}
              onPress={handleSave}
            >
              <Check size={18} color="#fff" />
              <Text className="text-[15px] font-semibold text-white">Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// Define screen types for navigation
type SettingsSubScreen =
  | "main"
  | "company-info"
  | "contact-info"
  | "account-settings"
  | "privacy-settings"
  | "help-support"
  | "about";

export default function EmployerSettingsScreen() {
  const router = useRouter();
  const [activeScreen, setActiveScreen] = useState<SettingsSubScreen>("main");

  // Company Profile State
  const [profile, setProfile] = useState({
    companyName: mockEmployer.companyName,
    registrationNo: mockEmployer.registrationNo,
    logo: mockEmployer.logo,
    industry: mockEmployer.industry,
    companySize: mockEmployer.companySize,
    address: mockEmployer.address,
    phone: mockEmployer.phone,
    email: mockEmployer.email,
    website: mockEmployer.website,
  });

  // Settings State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  // Modal States
  const [editModal, setEditModal] = useState<{
    visible: boolean;
    field: string;
    value: string;
    multiline?: boolean;
    keyboardType?: "default" | "email-address" | "phone-pad" | "url";
  }>({ visible: false, field: "", value: "" });

  const handleBack = () => {
    if (activeScreen !== "main") {
      setActiveScreen("main");
    } else {
      router.back();
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out of your company account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            router.replace("/(auth)" as any);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const openEditModal = (
    field: string,
    value: string,
    multiline = false,
    keyboardType: "default" | "email-address" | "phone-pad" | "url" = "default",
  ) => {
    setEditModal({ visible: true, field, value, multiline, keyboardType });
  };

  const handleSaveField = (newValue: string) => {
    const fieldMap: Record<string, keyof typeof profile> = {
      "Company Name": "companyName",
      Industry: "industry",
      "Company Size": "companySize",
      Address: "address",
      Phone: "phone",
      Email: "email",
      Website: "website",
    };

    const profileKey = fieldMap[editModal.field];
    if (profileKey) {
      setProfile((prev) => ({ ...prev, [profileKey]: newValue }));
    }
  };

  // Get screen title based on active screen
  const getScreenTitle = (): string => {
    switch (activeScreen) {
      case "company-info":
        return "Company Information";
      case "contact-info":
        return "Contact Information";
      case "account-settings":
        return "Account Settings";
      case "privacy-settings":
        return "Privacy Settings";
      case "help-support":
        return "Help & Support";
      case "about":
        return "About CGUConnect";
      default:
        return "Company Profile";
    }
  };

  // Render Company Info Screen
  const renderCompanyInfoScreen = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <ProfileField
          icon={<Building2 size={20} color="#8B2635" />}
          label="Company Name"
          value={profile.companyName}
          onEdit={() => openEditModal("Company Name", profile.companyName)}
        />
        <View className="h-px bg-gray-100 ml-12" />

        <ProfileField
          icon={<Users size={20} color="#8B2635" />}
          label="Industry"
          value={profile.industry}
          onEdit={() => openEditModal("Industry", profile.industry)}
        />
        <View className="h-px bg-gray-100 ml-12" />

        <ProfileField
          icon={<Users size={20} color="#8B2635" />}
          label="Company Size"
          value={profile.companySize}
          onEdit={() => openEditModal("Company Size", profile.companySize)}
        />
      </View>
    </ScrollView>
  );

  // Render Contact Info Screen
  const renderContactInfoScreen = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <ProfileField
          icon={<MapPin size={20} color="#8B2635" />}
          label="Address"
          value={profile.address}
          onEdit={() => openEditModal("Address", profile.address, true)}
        />
        <View className="h-px bg-gray-100 ml-12" />

        <ProfileField
          icon={<Phone size={20} color="#8B2635" />}
          label="Phone"
          value={profile.phone}
          onEdit={() =>
            openEditModal("Phone", profile.phone, false, "phone-pad")
          }
        />
        <View className="h-px bg-gray-100 ml-12" />

        <ProfileField
          icon={<Mail size={20} color="#8B2635" />}
          label="Email"
          value={profile.email}
          onEdit={() =>
            openEditModal("Email", profile.email, false, "email-address")
          }
        />
        <View className="h-px bg-gray-100 ml-12" />

        <ProfileField
          icon={<Globe size={20} color="#8B2635" />}
          label="Website"
          value={profile.website}
          onEdit={() => openEditModal("Website", profile.website, false, "url")}
        />
      </View>
    </ScrollView>
  );

  // Render Account Settings Screen
  const renderAccountSettingsScreen = () => (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      <SettingsToggleItem
        icon={<Bell size={20} color="#8B2635" />}
        label="Push Notifications"
        value={notificationsEnabled}
        onToggle={setNotificationsEnabled}
      />

      <SettingsToggleItem
        icon={<Mail size={20} color="#8B2635" />}
        label="Email Notifications"
        value={emailNotifications}
        onToggle={setEmailNotifications}
      />

      <View className="mt-4">
        <MenuItem
          title="Change Password"
          subtitle="Update your password"
          icon={Lock}
          onPress={() => {}}
        />
      </View>
    </ScrollView>
  );

  // Render screen based on active screen
  const renderScreen = () => {
    switch (activeScreen) {
      case "company-info":
        return renderCompanyInfoScreen();
      case "contact-info":
        return renderContactInfoScreen();
      case "account-settings":
        return renderAccountSettingsScreen();
      default:
        return renderMainProfile();
    }
  };

  const renderMainProfile = () => (
    <>
      {/* Profile Info Card */}
      <View className="bg-white mx-4 mt-4 rounded-2xl p-5 shadow-sm border border-gray-100">
        <View className="items-center">
          {/* Company Logo with Edit Button */}
          <View className="relative mb-4">
            <Image
              source={{ uri: profile.logo }}
              className="w-24 h-24 rounded-2xl border-[3px]"
              style={{ borderColor: "#FFE8EC" }}
            />
            <Pressable
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full items-center justify-center shadow-md"
              style={({ pressed }) => ({
                backgroundColor: "#8B2635",
                opacity: pressed ? 0.8 : 1,
              })}
            >
              <Camera size={16} color="#fff" />
            </Pressable>
          </View>

          {/* Company Name */}
          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {profile.companyName}
          </Text>

          {/* Registration Number */}
          <Text className="text-sm text-gray-400">
            {profile.registrationNo}
          </Text>
        </View>
      </View>

      {/* Menu Sections */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Company Section */}
        <MenuSection title="Company">
          <MenuItem
            title="Company Information"
            subtitle="Name, industry, size"
            icon={Building2}
            onPress={() => setActiveScreen("company-info")}
          />
          <MenuDivider />
          <MenuItem
            title="Contact Information"
            subtitle="Address, phone, email"
            icon={Phone}
            onPress={() => setActiveScreen("contact-info")}
          />
        </MenuSection>

        {/* Settings Section */}
        <MenuSection title="Settings">
          <MenuItem
            title="Account Settings"
            subtitle="Notifications, password"
            icon={Settings}
            onPress={() => setActiveScreen("account-settings")}
          />
          <MenuDivider />
          <MenuItem
            title="Privacy Settings"
            subtitle="Manage your privacy"
            icon={Lock}
            onPress={() => {}}
          />
        </MenuSection>

        {/* Support Section */}
        <MenuSection title="Support">
          <MenuItem
            title="Help & Support"
            subtitle="FAQs, contact us"
            icon={CircleHelp}
            onPress={() => {}}
          />
          <MenuDivider />
          <MenuItem
            title="About CGUConnect"
            subtitle="Version 1.0.0"
            icon={Info}
            onPress={() => {}}
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

      {/* Edit Modal */}
      <EditModal
        visible={editModal.visible}
        title={editModal.field}
        value={editModal.value}
        onClose={() => setEditModal((prev) => ({ ...prev, visible: false }))}
        onSave={handleSaveField}
        multiline={editModal.multiline}
        keyboardType={editModal.keyboardType}
      />
    </View>
  );
}
