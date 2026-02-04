import { JobFormModal, SuccessModal } from "@/components/employer";
import {
    EmployerJobFormData,
    emptyJobTemplate
} from "@/components/employer/types";
import { mockEmployer } from "@/data/mock-employer";
import { mockEmployerJobs } from "@/data/mock-employer-jobs";
import { useRouter } from "expo-router";
import {
    Briefcase,
    CheckCircle,
    ChevronRight,
    Clock,
    Eye,
    Plus,
    Search,
    TrendingUp,
    Users,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StatusBar,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48 - 12) / 2;

// Quick Actions for Employers
const quickActions = [
  { id: "1", name: "Post a Job", icon: Plus, color: "#8B2635" },
  { id: "2", name: "View Applicants", icon: Users, color: "#2196F3" },
  { id: "3", name: "My Job Posts", icon: Briefcase, color: "#4CAF50" },
  { id: "4", name: "Analytics", icon: TrendingUp, color: "#FF9800" },
];

// Recent Job Posts - use actual mock data
const recentJobPosts = mockEmployerJobs.slice(0, 3).map((job) => ({
  id: job.id,
  title: job.title,
  applicants: job.applicants,
  views: job.views,
  status: job.status,
  postedDate: job.postedDate,
}));

// Top Applicants
const topApplicants = [
  {
    id: "1",
    name: "Kamal Perera",
    position: "Software Engineer",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=kamal&backgroundColor=b6e3f4",
    matchScore: 95,
  },
  {
    id: "2",
    name: "Nimal Silva",
    position: "UI/UX Designer",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=nimal&backgroundColor=ffd5dc",
    matchScore: 88,
  },
  {
    id: "3",
    name: "Sithara Fernando",
    position: "Software Engineer",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/png?seed=sithara&backgroundColor=c0aede",
    matchScore: 82,
  },
];

// Quick Action Card Component
interface QuickActionCardProps {
  action: (typeof quickActions)[0];
  onPress: () => void;
}

const QuickActionCard = ({ action, onPress }: QuickActionCardProps) => {
  const IconComponent = action.icon;
  return (
    <TouchableOpacity
      className="rounded-2xl overflow-hidden shadow-sm"
      style={{ width: CARD_WIDTH, backgroundColor: "#FFE8EC" }}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="h-20 justify-center items-center bg-white/60">
        <View
          className="w-12 h-12 rounded-full justify-center items-center"
          style={{ backgroundColor: `${action.color}20` }}
        >
          <IconComponent size={24} color={action.color} />
        </View>
      </View>
      <View className="py-2.5 px-3" style={{ backgroundColor: action.color }}>
        <Text
          className="text-[13px] font-semibold text-white text-center"
          numberOfLines={1}
        >
          {action.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Job Post Card Component
interface JobPostCardProps {
  job: (typeof recentJobPosts)[0];
  onPress: () => void;
}

const JobPostCard = ({ job, onPress }: JobPostCardProps) => (
  <TouchableOpacity
    className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-100"
    onPress={onPress}
    activeOpacity={0.8}
  >
    <View className="flex-row justify-between items-start mb-3">
      <View className="flex-1">
        <Text className="text-base font-semibold text-gray-900 mb-1">
          {job.title}
        </Text>
        <View className="flex-row items-center gap-1">
          <Clock size={12} color="#999" />
          <Text className="text-xs text-gray-400">{job.postedDate}</Text>
        </View>
      </View>
      <View
        className={`px-2 py-1 rounded-full ${job.status === "active" ? "bg-green-100" : "bg-gray-100"}`}
      >
        <Text
          className={`text-xs font-medium ${job.status === "active" ? "text-green-600" : "text-gray-500"}`}
        >
          {job.status === "active" ? "Active" : "Closed"}
        </Text>
      </View>
    </View>
    <View className="flex-row gap-4">
      <View className="flex-row items-center gap-1.5">
        <Users size={16} color="#8B2635" />
        <Text className="text-sm text-gray-600">
          {job.applicants} applicants
        </Text>
      </View>
      <View className="flex-row items-center gap-1.5">
        <Eye size={16} color="#2196F3" />
        <Text className="text-sm text-gray-600">{job.views} views</Text>
      </View>
    </View>
  </TouchableOpacity>
);

// Applicant Card Component
interface ApplicantCardProps {
  applicant: (typeof topApplicants)[0];
  onPress: () => void;
}

const ApplicantCard = ({ applicant, onPress }: ApplicantCardProps) => (
  <TouchableOpacity
    className="bg-white rounded-2xl p-4 mr-3 shadow-sm items-center border border-gray-100"
    style={{ width: 140 }}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Image
      source={{ uri: applicant.avatar }}
      className="w-14 h-14 rounded-full mb-2"
    />
    <Text
      className="text-sm font-semibold text-gray-900 text-center mb-0.5"
      numberOfLines={1}
    >
      {applicant.name}
    </Text>
    <Text className="text-xs text-gray-500 text-center mb-2" numberOfLines={1}>
      {applicant.position}
    </Text>
    <View
      className="flex-row items-center gap-1 px-2 py-1 rounded-full"
      style={{ backgroundColor: "#E8F5E9" }}
    >
      <CheckCircle size={12} color="#4CAF50" />
      <Text className="text-xs font-medium text-green-600">
        {applicant.matchScore}% match
      </Text>
    </View>
  </TouchableOpacity>
);

export default function EmployerHomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [showPostJobModal, setShowPostJobModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [newJob, setNewJob] = useState<EmployerJobFormData>(emptyJobTemplate);

  const handleQuickAction = (actionId: string) => {
    switch (actionId) {
      case "1":
        // Open Post Job modal
        setNewJob(emptyJobTemplate);
        setShowPostJobModal(true);
        break;
      case "2":
        // Navigate to view applicants
        router.push("/(employer)/applicants" as any);
        break;
      case "3":
        router.push("/(employer)/jobs" as any);
        break;
      case "4":
        // Navigate to analytics
        router.push("/(employer)/analytics" as any);
        break;
    }
  };

  const handleJobPress = (jobId: string) => {
    // Navigate to jobs page with job selected
    router.push("/(employer)/jobs" as any);
  };

  const handleApplicantPress = (applicantId: string) => {
    // Navigate to applicants page
    router.push("/(employer)/applicants" as any);
  };

  const handleViewAllApplicants = () => {
    router.push("/(employer)/applicants" as any);
  };

  const handleSaveJob = useCallback((jobData: EmployerJobFormData) => {
    // In a real app, this would save to the backend
    console.log("New job posted:", jobData);
    setShowPostJobModal(false);
    setSuccessMessage(`"${jobData.title}" has been posted successfully!`);
    setShowSuccessModal(true);
  }, []);

  // Calculate stats from mock data
  const activeJobsCount = mockEmployerJobs.filter(
    (j) => j.status === "active",
  ).length;
  const totalApplicants = mockEmployerJobs.reduce(
    (sum, j) => sum + j.applicants,
    0,
  );
  const interviewsCount = 8; // Mock value

  return (
    <View className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#8B2635" />

      {/* Welcome Card */}
      <View className="bg-white px-4 py-4 border-b border-gray-100">
        <View className="flex-row items-center">
          <Image
            source={{ uri: mockEmployer.logo }}
            className="w-14 h-14 rounded-xl mr-3.5"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 mb-1">
              Welcome, {mockEmployer.companyName}
            </Text>
            <Text className="text-sm text-gray-500">
              Find the best talent for your team!
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Search Bar */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3.5 mb-6 border border-gray-200 gap-3">
          <Search size={20} color="#999" />
          <TextInput
            className="flex-1 text-base text-gray-800"
            placeholder="Search candidates..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Quick Actions Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">
              Quick Actions
            </Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {quickActions.map((action) => (
              <QuickActionCard
                key={action.id}
                action={action}
                onPress={() => handleQuickAction(action.id)}
              />
            ))}
          </View>
        </View>

        {/* Stats Overview */}
        <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">Overview</Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              className="items-center flex-1"
              onPress={() => router.push("/(employer)/jobs" as any)}
            >
              <Text className="text-2xl font-bold" style={{ color: "#8B2635" }}>
                {activeJobsCount}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Active Jobs</Text>
            </TouchableOpacity>
            <View className="w-px bg-gray-200" />
            <TouchableOpacity
              className="items-center flex-1"
              onPress={() => router.push("/(employer)/applicants" as any)}
            >
              <Text className="text-2xl font-bold" style={{ color: "#2196F3" }}>
                {totalApplicants}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Applicants</Text>
            </TouchableOpacity>
            <View className="w-px bg-gray-200" />
            <TouchableOpacity
              className="items-center flex-1"
              onPress={() => router.push("/(employer)/applicants" as any)}
            >
              <Text className="text-2xl font-bold" style={{ color: "#4CAF50" }}>
                {interviewsCount}
              </Text>
              <Text className="text-xs text-gray-500 mt-1">Interviews</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Top Applicants Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">
              Top Applicants
            </Text>
            <TouchableOpacity
              className="flex-row items-center gap-1"
              onPress={handleViewAllApplicants}
            >
              <Text className="text-sm text-gray-500 font-medium">
                View all
              </Text>
              <ChevronRight size={16} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16 }}
          >
            {topApplicants.map((applicant) => (
              <ApplicantCard
                key={applicant.id}
                applicant={applicant}
                onPress={() => handleApplicantPress(applicant.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Recent Job Posts Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-900">
              Recent Job Posts
            </Text>
            <TouchableOpacity
              className="flex-row items-center gap-1"
              onPress={() => router.push("/(employer)/jobs" as any)}
            >
              <Text className="text-sm text-gray-500 font-medium">
                View all
              </Text>
              <ChevronRight size={16} color="#666" />
            </TouchableOpacity>
          </View>

          {recentJobPosts.map((job) => (
            <JobPostCard
              key={job.id}
              job={job}
              onPress={() => handleJobPress(job.id)}
            />
          ))}
        </View>

        <View className="h-5" />
      </ScrollView>

      {/* Post Job Modal */}
      <JobFormModal
        visible={showPostJobModal}
        isEditMode={false}
        formData={newJob}
        onFormChange={setNewJob}
        onClose={() => setShowPostJobModal(false)}
        onSave={() => handleSaveJob(newJob)}
      />

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />
    </View>
  );
}
