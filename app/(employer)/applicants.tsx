import {
  Applicant,
  APPLICATION_STATUS_CONFIG,
  ApplicationStatus,
  getApplicantStats,
  mockApplicants,
} from "@/data/mock-applicants";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  CheckCircle,
  Clock,
  Filter,
  GraduationCap,
  Mail,
  MoreVertical,
  Phone,
  Search,
  Star,
  User,
  X,
} from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Tab Types
type ApplicantTabType = "all" | ApplicationStatus;

const APPLICANT_TABS: { key: ApplicantTabType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "reviewed", label: "Reviewed" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interview", label: "Interview" },
  { key: "hired", label: "Hired" },
  { key: "rejected", label: "Rejected" },
];

// Status Badge Component
const StatusBadge = ({ status }: { status: ApplicationStatus }) => {
  const config = APPLICATION_STATUS_CONFIG[status];
  return (
    <View
      className="px-2.5 py-1 rounded-full"
      style={{ backgroundColor: config.bgColor }}
    >
      <Text className="text-xs font-medium" style={{ color: config.color }}>
        {config.label}
      </Text>
    </View>
  );
};

// Match Score Badge
const MatchScoreBadge = ({ score }: { score: number }) => {
  const color = score >= 85 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444";
  const bgColor = score >= 85 ? "#D1FAE5" : score >= 70 ? "#FEF3C7" : "#FEE2E2";

  return (
    <View
      className="flex-row items-center gap-1 px-2 py-1 rounded-full"
      style={{ backgroundColor: bgColor }}
    >
      <Star size={12} color={color} fill={color} />
      <Text className="text-xs font-medium" style={{ color }}>
        {score}%
      </Text>
    </View>
  );
};

// Applicant Card Component
interface ApplicantCardProps {
  applicant: Applicant;
  onPress: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
}

const ApplicantCard = ({
  applicant,
  onPress,
  onStatusChange,
}: ApplicantCardProps) => {
  const [showMenu, setShowMenu] = useState(false);

  const allStatusActions: { status: ApplicationStatus; label: string }[] = [
    { status: "pending" as ApplicationStatus, label: "Mark as Pending" },
    { status: "reviewed" as ApplicationStatus, label: "Mark as Reviewed" },
    { status: "shortlisted" as ApplicationStatus, label: "Shortlist" },
    { status: "interview" as ApplicationStatus, label: "Schedule Interview" },
    { status: "hired" as ApplicationStatus, label: "Mark as Hired" },
    { status: "rejected" as ApplicationStatus, label: "Reject" },
  ];
  const statusActions = allStatusActions.filter(
    (a) => a.status !== applicant.status,
  );

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-3 border border-gray-100"
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View className="flex-row items-start">
        <Image
          source={{ uri: applicant.avatar }}
          className="w-14 h-14 rounded-full mr-3"
        />
        <View className="flex-1">
          <View className="flex-row justify-between items-start">
            <View className="flex-1 mr-2">
              <Text className="text-base font-semibold text-gray-900">
                {applicant.name}
              </Text>
              <Text className="text-sm text-gray-500">
                {applicant.position}
              </Text>
            </View>
            <TouchableOpacity
              className="p-1.5 -mr-1.5 -mt-1"
              onPress={() => setShowMenu(true)}
            >
              <MoreVertical size={18} color="#666" />
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center gap-3 mt-2">
            <StatusBadge status={applicant.status} />
            <MatchScoreBadge score={applicant.matchScore} />
          </View>

          <View className="flex-row items-center gap-4 mt-3">
            <View className="flex-row items-center gap-1">
              <Briefcase size={14} color="#8B2635" />
              <Text className="text-xs text-gray-500">
                {applicant.experience}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Clock size={14} color="#666" />
              <Text className="text-xs text-gray-500">
                {applicant.appliedDate}
              </Text>
            </View>
          </View>

          <View className="flex-row items-center gap-1.5 mt-2">
            <Briefcase size={12} color="#999" />
            <Text className="text-xs text-gray-400" numberOfLines={1}>
              Applied for: {applicant.jobTitle}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Menu Modal */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/40 justify-end"
          activeOpacity={1}
          onPress={() => setShowMenu(false)}
        >
          <View className="bg-white rounded-t-3xl px-4 py-6">
            <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Change Status
            </Text>
            {statusActions.map((action) => (
              <TouchableOpacity
                key={action.status}
                className="flex-row items-center py-3.5 border-b border-gray-100"
                onPress={() => {
                  onStatusChange(action.status);
                  setShowMenu(false);
                }}
              >
                <View
                  className="w-8 h-8 rounded-full mr-3 justify-center items-center"
                  style={{
                    backgroundColor:
                      APPLICATION_STATUS_CONFIG[action.status].bgColor,
                  }}
                >
                  <View
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor:
                        APPLICATION_STATUS_CONFIG[action.status].color,
                    }}
                  />
                </View>
                <Text className="text-base text-gray-700">{action.label}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              className="mt-4 py-3 items-center"
              onPress={() => setShowMenu(false)}
            >
              <Text className="text-base text-gray-500">Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

// Applicant Detail Modal
interface ApplicantDetailModalProps {
  visible: boolean;
  applicant: Applicant | null;
  onClose: () => void;
  onStatusChange: (status: ApplicationStatus) => void;
}

const ApplicantDetailModal = ({
  visible,
  applicant,
  onClose,
  onStatusChange,
}: ApplicantDetailModalProps) => {
  if (!applicant) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-white border-b border-gray-100">
          <TouchableOpacity
            className="p-2 -ml-2 rounded-full"
            onPress={onClose}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">
            Applicant Details
          </Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Profile Header */}
          <View className="bg-white px-4 py-6 items-center border-b border-gray-100">
            <Image
              source={{ uri: applicant.avatar }}
              className="w-24 h-24 rounded-full mb-4"
            />
            <Text className="text-xl font-bold text-gray-900 mb-1">
              {applicant.name}
            </Text>
            <Text className="text-base text-gray-500 mb-3">
              {applicant.position}
            </Text>
            <View className="flex-row items-center gap-3">
              <StatusBadge status={applicant.status} />
              <MatchScoreBadge score={applicant.matchScore} />
            </View>
          </View>

          <View className="p-4">
            {/* Contact Info */}
            <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
              <Text className="text-base font-semibold text-gray-900 mb-4">
                Contact Information
              </Text>
              <View className="flex-row items-center gap-3 mb-3">
                <View
                  className="w-10 h-10 rounded-xl justify-center items-center"
                  style={{ backgroundColor: "rgba(139, 38, 53, 0.08)" }}
                >
                  <Mail size={18} color="#8B2635" />
                </View>
                <Text className="text-sm text-gray-700">{applicant.email}</Text>
              </View>
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-xl justify-center items-center"
                  style={{ backgroundColor: "rgba(139, 38, 53, 0.08)" }}
                >
                  <Phone size={18} color="#8B2635" />
                </View>
                <Text className="text-sm text-gray-700">{applicant.phone}</Text>
              </View>
            </View>

            {/* Application Info */}
            <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
              <Text className="text-base font-semibold text-gray-900 mb-4">
                Application Details
              </Text>
              <View className="flex-row items-center gap-3 mb-3">
                <View
                  className="w-10 h-10 rounded-xl justify-center items-center"
                  style={{ backgroundColor: "rgba(33, 150, 243, 0.08)" }}
                >
                  <Briefcase size={18} color="#2196F3" />
                </View>
                <View>
                  <Text className="text-xs text-gray-400">Applied For</Text>
                  <Text className="text-sm text-gray-700 font-medium">
                    {applicant.jobTitle}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-xl justify-center items-center"
                  style={{ backgroundColor: "rgba(76, 175, 80, 0.08)" }}
                >
                  <Calendar size={18} color="#4CAF50" />
                </View>
                <View>
                  <Text className="text-xs text-gray-400">Applied Date</Text>
                  <Text className="text-sm text-gray-700 font-medium">
                    {applicant.appliedDate}
                  </Text>
                </View>
              </View>
            </View>

            {/* Experience & Education */}
            <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
              <Text className="text-base font-semibold text-gray-900 mb-4">
                Background
              </Text>
              <View className="flex-row items-center gap-3 mb-3">
                <View
                  className="w-10 h-10 rounded-xl justify-center items-center"
                  style={{ backgroundColor: "rgba(255, 152, 0, 0.08)" }}
                >
                  <Briefcase size={18} color="#FF9800" />
                </View>
                <View>
                  <Text className="text-xs text-gray-400">Experience</Text>
                  <Text className="text-sm text-gray-700 font-medium">
                    {applicant.experience}
                  </Text>
                </View>
              </View>
              <View className="flex-row items-center gap-3">
                <View
                  className="w-10 h-10 rounded-xl justify-center items-center"
                  style={{ backgroundColor: "rgba(156, 39, 176, 0.08)" }}
                >
                  <GraduationCap size={18} color="#9C27B0" />
                </View>
                <View className="flex-1">
                  <Text className="text-xs text-gray-400">Education</Text>
                  <Text className="text-sm text-gray-700 font-medium">
                    {applicant.education}
                  </Text>
                </View>
              </View>
            </View>

            {/* Skills */}
            <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
              <Text className="text-base font-semibold text-gray-900 mb-4">
                Skills
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {applicant.skills.map((skill, index) => (
                  <View
                    key={index}
                    className="px-3 py-1.5 rounded-full"
                    style={{ backgroundColor: "#FFE8EC" }}
                  >
                    <Text
                      className="text-xs font-medium"
                      style={{ color: "#8B2635" }}
                    >
                      {skill}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Cover Letter */}
            {applicant.coverLetter && (
              <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                  Cover Letter
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  {applicant.coverLetter}
                </Text>
              </View>
            )}

            {/* Notes */}
            {applicant.notes && (
              <View className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
                <Text className="text-base font-semibold text-gray-900 mb-3">
                  Notes
                </Text>
                <Text className="text-sm text-gray-600">{applicant.notes}</Text>
              </View>
            )}
          </View>

          <View className="h-24" />
        </ScrollView>

        {/* Bottom Actions */}
        <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-4">
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 py-3.5 rounded-xl items-center border border-gray-200"
              onPress={() => {
                onStatusChange("rejected");
                onClose();
              }}
            >
              <Text className="text-base font-medium text-gray-600">
                Reject
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3.5 rounded-xl items-center"
              style={{ backgroundColor: "#8B2635" }}
              onPress={() => {
                if (applicant.status === "pending") {
                  onStatusChange("shortlisted");
                } else if (applicant.status === "shortlisted") {
                  onStatusChange("interview");
                } else if (applicant.status === "interview") {
                  onStatusChange("hired");
                }
                onClose();
              }}
            >
              <Text className="text-base font-medium text-white">
                {applicant.status === "pending"
                  ? "Shortlist"
                  : applicant.status === "shortlisted"
                    ? "Schedule Interview"
                    : applicant.status === "interview"
                      ? "Hire"
                      : "Update Status"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

// Filter Modal
interface FilterModalProps {
  visible: boolean;
  onClose: () => void;
  selectedJob: string;
  onSelectJob: (jobId: string) => void;
  jobs: { id: string; title: string }[];
}

const FilterModal = ({
  visible,
  onClose,
  selectedJob,
  onSelectJob,
  jobs,
}: FilterModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/40 justify-end">
        <View className="bg-white rounded-t-3xl px-4 py-6 max-h-[70%]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Filter by Job
            </Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#666" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity
              className={`flex-row items-center justify-between py-3.5 border-b border-gray-100`}
              onPress={() => {
                onSelectJob("all");
                onClose();
              }}
            >
              <Text
                className={`text-base ${selectedJob === "all" ? "text-[#8B2635] font-semibold" : "text-gray-700"}`}
              >
                All Jobs
              </Text>
              {selectedJob === "all" && (
                <CheckCircle size={20} color="#8B2635" />
              )}
            </TouchableOpacity>

            {jobs.map((job) => (
              <TouchableOpacity
                key={job.id}
                className="flex-row items-center justify-between py-3.5 border-b border-gray-100"
                onPress={() => {
                  onSelectJob(job.id);
                  onClose();
                }}
              >
                <Text
                  className={`text-base ${selectedJob === job.id ? "text-[#8B2635] font-semibold" : "text-gray-700"}`}
                >
                  {job.title}
                </Text>
                {selectedJob === job.id && (
                  <CheckCircle size={20} color="#8B2635" />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function ApplicantsScreen() {
  const router = useRouter();
  const [applicants, setApplicants] = useState<Applicant[]>(mockApplicants);
  const [activeTab, setActiveTab] = useState<ApplicantTabType>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedApplicant, setSelectedApplicant] = useState<Applicant | null>(
    null,
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState("all");

  // Get unique jobs
  const uniqueJobs = useMemo(() => {
    const jobMap = new Map<string, { id: string; title: string }>();
    applicants.forEach((a) => {
      if (!jobMap.has(a.jobId)) {
        jobMap.set(a.jobId, { id: a.jobId, title: a.jobTitle });
      }
    });
    return Array.from(jobMap.values());
  }, [applicants]);

  // Stats
  const stats = useMemo(() => getApplicantStats(), [applicants]);

  // Filtered applicants
  const filteredApplicants = useMemo(() => {
    let result = applicants;

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter((a) => a.status === activeTab);
    }

    // Filter by job
    if (selectedJob !== "all") {
      result = result.filter((a) => a.jobId === selectedJob);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.position.toLowerCase().includes(query) ||
          a.jobTitle.toLowerCase().includes(query) ||
          a.skills.some((s) => s.toLowerCase().includes(query)),
      );
    }

    return result;
  }, [applicants, activeTab, selectedJob, searchQuery]);

  // Handle status change
  const handleStatusChange = useCallback(
    (applicantId: string, newStatus: ApplicationStatus) => {
      setApplicants((prev) =>
        prev.map((a) =>
          a.id === applicantId ? { ...a, status: newStatus } : a,
        ),
      );
    },
    [],
  );

  // Tab count
  const getTabCount = (tab: ApplicantTabType): number => {
    if (tab === "all") return applicants.length;
    return applicants.filter((a) => a.status === tab).length;
  };

  const renderApplicant = ({ item }: { item: Applicant }) => (
    <ApplicantCard
      applicant={item}
      onPress={() => {
        setSelectedApplicant(item);
        setShowDetailModal(true);
      }}
      onStatusChange={(status) => handleStatusChange(item.id, status)}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top"]}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="bg-white border-b border-gray-100">
        <View className="flex-row items-center px-4 py-3">
          <TouchableOpacity
            className="p-2 -ml-2 mr-2 rounded-full"
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#333" />
          </TouchableOpacity>
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-900">Applicants</Text>
            <Text className="text-sm text-gray-500">
              {filteredApplicants.length} applicants found
            </Text>
          </View>
          <TouchableOpacity
            className="p-2 rounded-xl"
            style={{ backgroundColor: "rgba(139, 38, 53, 0.08)" }}
            onPress={() => setShowFilterModal(true)}
          >
            <Filter size={20} color="#8B2635" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View className="px-4 pb-3">
          <View className="flex-row items-center bg-gray-100 rounded-xl px-3.5 py-2.5 gap-2.5">
            <Search size={20} color="#999" />
            <TextInput
              className="flex-1 text-base text-gray-800"
              placeholder="Search applicants..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <X size={18} color="#999" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 12 }}
        >
          {APPLICANT_TABS.map((tab) => {
            const count = getTabCount(tab.key);
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                className={`mr-2 px-4 py-2 rounded-full flex-row items-center gap-1.5 ${
                  isActive ? "bg-[#8B2635]" : "bg-gray-100"
                }`}
                onPress={() => setActiveTab(tab.key)}
              >
                <Text
                  className={`text-sm font-medium ${
                    isActive ? "text-white" : "text-gray-600"
                  }`}
                >
                  {tab.label}
                </Text>
                <View
                  className={`px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-white/20" : "bg-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Stats Summary */}
      <View className="bg-white mx-4 mt-4 rounded-2xl p-4 border border-gray-100">
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-xl font-bold" style={{ color: "#F59E0B" }}>
              {stats.pending}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">Pending</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-xl font-bold" style={{ color: "#8B2635" }}>
              {stats.shortlisted}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">Shortlisted</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-xl font-bold" style={{ color: "#2196F3" }}>
              {stats.interview}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">Interview</Text>
          </View>
          <View className="w-px bg-gray-200" />
          <View className="items-center flex-1">
            <Text className="text-xl font-bold" style={{ color: "#10B981" }}>
              {stats.hired}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5">Hired</Text>
          </View>
        </View>
      </View>

      {/* Applicants List */}
      <FlatList
        data={filteredApplicants}
        keyExtractor={(item) => item.id}
        renderItem={renderApplicant}
        contentContainerStyle={{ padding: 16, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center py-12">
            <User size={48} color="#ccc" />
            <Text className="text-base text-gray-400 mt-4">
              No applicants found
            </Text>
            <Text className="text-sm text-gray-300 mt-1">
              Try adjusting your filters
            </Text>
          </View>
        }
      />

      {/* Applicant Detail Modal */}
      <ApplicantDetailModal
        visible={showDetailModal}
        applicant={selectedApplicant}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedApplicant(null);
        }}
        onStatusChange={(status) => {
          if (selectedApplicant) {
            handleStatusChange(selectedApplicant.id, status);
          }
        }}
      />

      {/* Filter Modal */}
      <FilterModal
        visible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        selectedJob={selectedJob}
        onSelectJob={setSelectedJob}
        jobs={uniqueJobs}
      />
    </SafeAreaView>
  );
}
