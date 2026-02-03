import { useRouter } from "expo-router";
import {
  Bell,
  CheckCircle,
  ChevronLeft,
  MessageCircle,
  Star,
  UserPlus,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Notification data type for employers
interface Notification {
  id: string;
  type: "application" | "message" | "approval" | "review" | "system";
  user?: {
    name: string;
    avatar: string;
  };
  message: string;
  time: string;
  isRead: boolean;
  jobTitle?: string;
}

// Initial notifications for employers
const initialNotifications: Notification[] = [
  {
    id: "1",
    type: "application",
    user: {
      name: "Kamal Perera",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/png?seed=kamal&backgroundColor=b6e3f4",
    },
    message: "applied for",
    jobTitle: "Software Engineer",
    time: "5m ago",
    isRead: false,
  },
  {
    id: "2",
    type: "application",
    user: {
      name: "Nimal Silva",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/png?seed=nimal&backgroundColor=ffd5dc",
    },
    message: "applied for",
    jobTitle: "UI/UX Designer",
    time: "30m ago",
    isRead: false,
  },
  {
    id: "3",
    type: "approval",
    message:
      'Your job post "DevOps Engineer" has been approved and is now live!',
    time: "1h ago",
    isRead: false,
  },
  {
    id: "4",
    type: "message",
    user: {
      name: "Sithara Fernando",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/png?seed=sithara&backgroundColor=c0aede",
    },
    message: "sent you a message regarding",
    jobTitle: "Project Manager",
    time: "2h ago",
    isRead: true,
  },
  {
    id: "5",
    type: "review",
    user: {
      name: "Amali Wickramasinghe",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/png?seed=amali&backgroundColor=d1d4f9",
    },
    message: "completed the assessment for",
    jobTitle: "Data Analyst",
    time: "3h ago",
    isRead: true,
  },
  {
    id: "6",
    type: "system",
    message:
      "Your Software Engineer position has received 20+ applications! 🎉",
    time: "5h ago",
    isRead: true,
  },
  {
    id: "7",
    type: "application",
    user: {
      name: "Ruwan Bandara",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/png?seed=ruwan&backgroundColor=ffeaa7",
    },
    message: "applied for",
    jobTitle: "Software Engineer",
    time: "1d ago",
    isRead: true,
  },
];

// Get icon for notification type
const getNotificationIcon = (type: Notification["type"]) => {
  switch (type) {
    case "application":
      return <UserPlus size={18} color="#fff" />;
    case "message":
      return <MessageCircle size={18} color="#fff" />;
    case "approval":
      return <CheckCircle size={18} color="#fff" />;
    case "review":
      return <Star size={18} color="#fff" />;
    case "system":
      return <Bell size={18} color="#fff" />;
    default:
      return <Bell size={18} color="#fff" />;
  }
};

// Get background color for notification icon
const getIconBackground = (type: Notification["type"]) => {
  switch (type) {
    case "application":
      return "#4CAF50";
    case "message":
      return "#2196F3";
    case "approval":
      return "#8B2635";
    case "review":
      return "#FF9800";
    case "system":
      return "#9C27B0";
    default:
      return "#666";
  }
};

// Notification Item Component
interface NotificationItemProps {
  notification: Notification;
  onPress: () => void;
}

const NotificationItem = ({ notification, onPress }: NotificationItemProps) => (
  <TouchableOpacity
    className={`flex-row items-start px-4 py-3.5 bg-white border-b border-gray-100 ${!notification.isRead ? "bg-pink-50" : ""}`}
    style={!notification.isRead ? { backgroundColor: "#FFF5F6" } : {}}
    onPress={onPress}
  >
    <View className="mr-3.5">
      {notification.user ? (
        <View className="relative">
          <Image
            source={{ uri: notification.user.avatar }}
            className="w-[50px] h-[50px] rounded-full"
          />
          <View
            className="absolute -bottom-0.5 -right-0.5 w-6 h-6 rounded-full justify-center items-center border-2 border-white"
            style={{ backgroundColor: getIconBackground(notification.type) }}
          >
            {getNotificationIcon(notification.type)}
          </View>
        </View>
      ) : (
        <View
          className="w-[50px] h-[50px] rounded-full justify-center items-center"
          style={{ backgroundColor: getIconBackground(notification.type) }}
        >
          {getNotificationIcon(notification.type)}
        </View>
      )}
    </View>
    <View className="flex-1">
      <Text
        className={`text-[15px] leading-[21px] text-gray-800 mb-1 ${!notification.isRead ? "font-medium" : ""}`}
      >
        {notification.user && (
          <Text className="font-semibold text-gray-900">
            {notification.user.name}{" "}
          </Text>
        )}
        {notification.message}
        {notification.jobTitle && (
          <Text className="font-semibold" style={{ color: "#8B2635" }}>
            {" "}
            {notification.jobTitle}
          </Text>
        )}
      </Text>
      <Text className="text-[13px] text-gray-400">{notification.time}</Text>
    </View>
    {!notification.isRead && (
      <View
        className="w-2.5 h-2.5 rounded-full ml-2 self-center"
        style={{ backgroundColor: "#8B2635" }}
      />
    )}
  </TouchableOpacity>
);

export default function EmployerNotificationsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"all" | "applications">("all");
  const [notifications, setNotifications] =
    useState<Notification[]>(initialNotifications);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(employer)");
    }
  };

  // Mark a single notification as read
  const handleMarkAsRead = useCallback((notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, isRead: true }
          : notification,
      ),
    );
  }, []);

  // Mark all notifications as read
  const handleMarkAllAsRead = useCallback(() => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, isRead: true })),
    );
  }, []);

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === "application");

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const applicationCount = notifications.filter(
    (n) => n.type === "application",
  ).length;

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      {/* Header with Back Button */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <Pressable
          onPress={handleBack}
          className="w-10 h-10 items-center justify-center rounded-full"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-800">
          Notifications
        </Text>
        <View className="w-10" />
      </View>

      <View className="flex-1 bg-gray-50">
        {/* Tabs */}
        <View className="flex-row bg-white px-4 py-1 border-b border-gray-200">
          <TouchableOpacity
            className={`flex-row items-center py-3.5 px-4 mr-2 gap-2 ${activeTab === "all" ? "border-b-[3px]" : ""}`}
            style={activeTab === "all" ? { borderBottomColor: "#8B2635" } : {}}
            onPress={() => setActiveTab("all")}
          >
            <Text
              className={`text-[15px] font-medium ${activeTab === "all" ? "font-semibold" : "text-gray-500"}`}
              style={activeTab === "all" ? { color: "#8B2635" } : {}}
            >
              All
            </Text>
            {unreadCount > 0 && (
              <View
                className="rounded-full px-2 py-0.5"
                style={{ backgroundColor: "#8B2635" }}
              >
                <Text className="text-white text-xs font-semibold">
                  {unreadCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-row items-center py-3.5 px-4 mr-2 gap-2 ${activeTab === "applications" ? "border-b-[3px]" : ""}`}
            style={
              activeTab === "applications"
                ? { borderBottomColor: "#8B2635" }
                : {}
            }
            onPress={() => setActiveTab("applications")}
          >
            <Text
              className={`text-[15px] font-medium ${activeTab === "applications" ? "font-semibold" : "text-gray-500"}`}
              style={activeTab === "applications" ? { color: "#8B2635" } : {}}
            >
              Applications
            </Text>
            <View className="rounded-full px-2 py-0.5 bg-green-100">
              <Text className="text-green-600 text-xs font-semibold">
                {applicationCount}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Mark all as read button */}
        {unreadCount > 0 && (
          <TouchableOpacity
            className="bg-white py-3 px-4 border-b border-gray-200"
            onPress={handleMarkAllAsRead}
          >
            <Text
              className="text-sm font-semibold text-right"
              style={{ color: "#8B2635" }}
            >
              Mark all as read
            </Text>
          </TouchableOpacity>
        )}

        {/* Notifications List */}
        <ScrollView
          className="flex-1 bg-white"
          showsVerticalScrollIndicator={false}
        >
          {/* Today Section */}
          <View className="px-4 py-3 bg-gray-100">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Today
            </Text>
          </View>
          {filteredNotifications.slice(0, 3).map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onPress={() => handleMarkAsRead(notification.id)}
            />
          ))}

          {/* Earlier Section */}
          <View className="px-4 py-3 bg-gray-100">
            <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              Earlier
            </Text>
          </View>
          {filteredNotifications.slice(3).map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onPress={() => handleMarkAsRead(notification.id)}
            />
          ))}

          {filteredNotifications.length === 0 && (
            <View className="flex-1 justify-center items-center py-16 gap-3">
              <Bell size={48} color="#ccc" />
              <Text className="text-base text-gray-400">No notifications</Text>
            </View>
          )}

          <View className="h-5" />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
