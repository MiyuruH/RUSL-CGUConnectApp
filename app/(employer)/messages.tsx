import ChatScreen from "@/components/jobSeeker/chat-screen";
import NewMessageScreen, {
    Contact,
} from "@/components/jobSeeker/new-message-screen";
import { useNavigationVisibility } from "@/hooks/use-navigation-visibility";
import { Check, CheckCheck, PenSquare, Search } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// Conversation data type
interface Conversation {
  id: string;
  user: {
    name: string;
    avatar: string;
    isOnline: boolean;
    role: string;
  };
  lastMessage: string;
  time: string;
  unread: number;
  isRead: boolean;
}

// Sample conversations for employers (with job seekers/candidates)
const conversations: Conversation[] = [
  {
    id: "1",
    user: {
      name: "Kamal Perera",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/png?seed=kamal&backgroundColor=b6e3f4",
      isOnline: true,
      role: "Software Engineer Applicant",
    },
    lastMessage:
      "Thank you for considering my application. I am available for an interview.",
    time: "5m",
    unread: 2,
    isRead: false,
  },
  {
    id: "2",
    user: {
      name: "Nimal Silva",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/png?seed=nimal&backgroundColor=ffd5dc",
      isOnline: true,
      role: "UI/UX Designer Applicant",
    },
    lastMessage: "I have attached my updated portfolio as requested.",
    time: "30m",
    unread: 1,
    isRead: false,
  },
  {
    id: "3",
    user: {
      name: "Sithara Fernando",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/png?seed=sithara&backgroundColor=c0aede",
      isOnline: false,
      role: "Project Manager Applicant",
    },
    lastMessage:
      "Looking forward to hearing from you regarding the next steps.",
    time: "2h",
    unread: 0,
    isRead: true,
  },
  {
    id: "4",
    user: {
      name: "Amali Wickramasinghe",
      avatar:
        "https://api.dicebear.com/7.x/avataaars/png?seed=amali&backgroundColor=d1d4f9",
      isOnline: false,
      role: "Data Analyst Applicant",
    },
    lastMessage: "Yes, I can start from next month.",
    time: "1d",
    unread: 0,
    isRead: true,
  },
  {
    id: "5",
    user: {
      name: "CGUConnect Support",
      avatar:
        "https://api.dicebear.com/7.x/initials/png?seed=CGU&backgroundColor=8B2635",
      isOnline: true,
      role: "Support Team",
    },
    lastMessage: "Your job post has been approved and is now live!",
    time: "2d",
    unread: 0,
    isRead: true,
  },
];

// Conversation Item Component
interface ConversationItemProps {
  conversation: Conversation;
  onPress: () => void;
}

const ConversationItem = ({ conversation, onPress }: ConversationItemProps) => (
  <TouchableOpacity
    className={`flex-row px-4 py-3.5 border-b border-gray-100 ${conversation.unread > 0 ? "bg-pink-50" : ""}`}
    style={conversation.unread > 0 ? { backgroundColor: "#FFF5F6" } : {}}
    onPress={onPress}
  >
    <View className="relative">
      <Image
        source={{ uri: conversation.user.avatar }}
        className="w-14 h-14 rounded-full"
      />
      {conversation.user.isOnline && (
        <View className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-green-500 border-2 border-white" />
      )}
    </View>
    <View className="flex-1 ml-3.5 justify-center">
      <View className="flex-row justify-between items-center mb-0.5">
        <Text
          className={`text-base ${conversation.unread > 0 ? "font-semibold text-black" : "font-medium text-gray-900"}`}
        >
          {conversation.user.name}
        </Text>
        <Text className="text-xs text-gray-400">{conversation.time}</Text>
      </View>
      <Text className="text-xs text-gray-400 mb-1">
        {conversation.user.role}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text
          className={`flex-1 text-sm mr-2 ${conversation.unread > 0 ? "font-semibold text-black" : "text-gray-500"}`}
          numberOfLines={1}
        >
          {conversation.lastMessage}
        </Text>
        {conversation.unread > 0 ? (
          <View
            className="rounded-full min-w-[24px] h-6 justify-center items-center px-2"
            style={{ backgroundColor: "#8B2635" }}
          >
            <Text className="text-white text-xs font-semibold">
              {conversation.unread}
            </Text>
          </View>
        ) : conversation.isRead ? (
          <CheckCheck size={16} color="#8B2635" />
        ) : (
          <Check size={16} color="#999" />
        )}
      </View>
    </View>
  </TouchableOpacity>
);

export default function EmployerMessagesScreen() {
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedConversation, setSelectedConversation] = useState<
    string | null
  >(null);
  const [showNewMessage, setShowNewMessage] = useState(false);
  const [newConversationUser, setNewConversationUser] =
    useState<Contact | null>(null);
  const { setNavigationVisible } = useNavigationVisibility();

  // Hide navigation when viewing chat screen or new message screen
  useEffect(() => {
    setNavigationVisible(selectedConversation === null && !showNewMessage);
  }, [selectedConversation, showNewMessage, setNavigationVisible]);

  const filteredConversations = conversations.filter((conv) => {
    const matchesSearch = conv.user.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || conv.unread > 0;
    return matchesSearch && matchesTab;
  });

  const handleConversationPress = (conversationId: string) => {
    setSelectedConversation(conversationId);
  };

  const handleBackFromChat = () => {
    setSelectedConversation(null);
    setNewConversationUser(null);
  };

  const handleCreateNewMessage = () => {
    setShowNewMessage(true);
  };

  const handleSelectContact = (contact: Contact) => {
    setNewConversationUser(contact);
    setShowNewMessage(false);
    setSelectedConversation(contact.id);
  };

  const handleBackFromNewMessage = () => {
    setShowNewMessage(false);
  };

  // Show new message screen if user wants to create a new message
  if (showNewMessage) {
    return (
      <NewMessageScreen
        onBack={handleBackFromNewMessage}
        onSelectContact={handleSelectContact}
      />
    );
  }

  // Show chat screen if a conversation is selected
  if (selectedConversation) {
    return (
      <ChatScreen
        conversationId={selectedConversation}
        onBack={handleBackFromChat}
        newUser={newConversationUser}
      />
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#8B2635" />

      {/* Page Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-2xl font-bold text-gray-900">Messages</Text>
          <TouchableOpacity
            className="w-10 h-10 rounded-full items-center justify-center"
            style={{ backgroundColor: "rgba(139, 38, 53, 0.1)" }}
            onPress={handleCreateNewMessage}
          >
            <PenSquare size={20} color="#8B2635" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-3.5 py-3 gap-2.5">
          <Search size={20} color="#999" />
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder="Search candidates..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Online Users Section */}
      <View className="bg-white py-3 border-b border-gray-100">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 12 }}
        >
          {conversations
            .filter((conv) => conv.user.isOnline)
            .map((conv) => (
              <TouchableOpacity
                key={conv.id}
                className="items-center mx-2"
                onPress={() => handleConversationPress(conv.id)}
              >
                <View className="relative">
                  <Image
                    source={{ uri: conv.user.avatar }}
                    className="w-16 h-16 rounded-full border-2 border-gray-100"
                  />
                  <View className="absolute bottom-0.5 right-0.5 w-4 h-4 rounded-full bg-green-500 border-[3px] border-white" />
                </View>
                <Text
                  className="text-xs text-gray-700 mt-1.5 text-center font-medium"
                  numberOfLines={1}
                  style={{ maxWidth: 70 }}
                >
                  {conv.user.name.split(" ")[0]}
                </Text>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>

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
            All Messages
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-row items-center py-3.5 px-4 mr-2 gap-2 ${activeTab === "unread" ? "border-b-[3px]" : ""}`}
          style={activeTab === "unread" ? { borderBottomColor: "#8B2635" } : {}}
          onPress={() => setActiveTab("unread")}
        >
          <Text
            className={`text-[15px] font-medium ${activeTab === "unread" ? "font-semibold" : "text-gray-500"}`}
            style={activeTab === "unread" ? { color: "#8B2635" } : {}}
          >
            Unread
          </Text>
          <View
            className="rounded-full px-2 py-0.5"
            style={{ backgroundColor: "#8B2635" }}
          >
            <Text className="text-white text-xs font-semibold">
              {conversations.filter((c) => c.unread > 0).length}
            </Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Conversations List */}
      <ScrollView
        className="flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        {filteredConversations.map((conversation) => (
          <ConversationItem
            key={conversation.id}
            conversation={conversation}
            onPress={() => handleConversationPress(conversation.id)}
          />
        ))}

        {filteredConversations.length === 0 && (
          <View className="flex-1 justify-center items-center py-16">
            <Text className="text-base text-gray-400">No messages found</Text>
          </View>
        )}

        <View className="h-5" />
      </ScrollView>
    </View>
  );
}
