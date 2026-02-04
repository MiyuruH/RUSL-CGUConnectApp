import { mockApplicants } from "@/data/mock-applicants";
import { mockEmployerJobs } from "@/data/mock-employer-jobs";
import { useRouter } from "expo-router";
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Briefcase,
  CheckCircle,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react-native";
import React, { useMemo } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

// Stats Card Component
interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: number;
  changeLabel?: string;
  color: string;
  bgColor: string;
}

const StatsCard = ({
  title,
  value,
  icon,
  change,
  changeLabel,
  color,
  bgColor,
}: StatsCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <View
      className="bg-white rounded-2xl p-4 border border-gray-100"
      style={{ width: (width - 48 - 12) / 2 }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View
          className="w-10 h-10 rounded-xl justify-center items-center"
          style={{ backgroundColor: bgColor }}
        >
          {icon}
        </View>
        {change !== undefined && (
          <View
            className="flex-row items-center px-2 py-1 rounded-full"
            style={{
              backgroundColor: isPositive
                ? "#D1FAE5"
                : isNegative
                  ? "#FEE2E2"
                  : "#F3F4F6",
            }}
          >
            {isPositive ? (
              <ArrowUp size={12} color="#10B981" />
            ) : isNegative ? (
              <ArrowDown size={12} color="#EF4444" />
            ) : null}
            <Text
              className="text-xs font-medium ml-0.5"
              style={{
                color: isPositive
                  ? "#10B981"
                  : isNegative
                    ? "#EF4444"
                    : "#6B7280",
              }}
            >
              {Math.abs(change)}%
            </Text>
          </View>
        )}
      </View>
      <Text className="text-2xl font-bold text-gray-900 mb-1">{value}</Text>
      <Text className="text-sm text-gray-500">{title}</Text>
      {changeLabel && (
        <Text className="text-xs text-gray-400 mt-1">{changeLabel}</Text>
      )}
    </View>
  );
};

// Progress Bar Component
interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  color: string;
}

const ProgressBar = ({ label, value, total, color }: ProgressBarProps) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <View className="mb-4">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-sm text-gray-600">{label}</Text>
        <Text className="text-sm font-semibold text-gray-900">
          {value} ({percentage.toFixed(0)}%)
        </Text>
      </View>
      <View className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        />
      </View>
    </View>
  );
};

// Job Performance Card
interface JobPerformanceCardProps {
  job: {
    id: string;
    title: string;
    views: number;
    applicants: number;
    status: string;
  };
  onPress: () => void;
}

const JobPerformanceCard = ({ job, onPress }: JobPerformanceCardProps) => {
  const conversionRate =
    job.views > 0 ? ((job.applicants / job.views) * 100).toFixed(1) : "0";

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 border border-gray-100"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-start mb-3">
        <Text
          className="text-base font-semibold text-gray-900 flex-1"
          numberOfLines={1}
        >
          {job.title}
        </Text>
        <View
          className={`px-2 py-1 rounded-full ${
            job.status === "active" ? "bg-green-100" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-xs font-medium ${
              job.status === "active" ? "text-green-600" : "text-gray-500"
            }`}
          >
            {job.status === "active" ? "Active" : "Inactive"}
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between">
        <View className="flex-row items-center gap-1.5">
          <Eye size={14} color="#2196F3" />
          <Text className="text-sm text-gray-600">{job.views} views</Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <Users size={14} color="#8B2635" />
          <Text className="text-sm text-gray-600">
            {job.applicants} applicants
          </Text>
        </View>
        <View className="flex-row items-center gap-1.5">
          <TrendingUp size={14} color="#4CAF50" />
          <Text className="text-sm text-gray-600">{conversionRate}% rate</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Time Period Selector
interface TimePeriodSelectorProps {
  selected: string;
  onSelect: (period: string) => void;
}

const TimePeriodSelector = ({
  selected,
  onSelect,
}: TimePeriodSelectorProps) => {
  const periods = ["7d", "30d", "90d", "All"];

  return (
    <View className="flex-row gap-2">
      {periods.map((period) => (
        <TouchableOpacity
          key={period}
          className={`px-3 py-1.5 rounded-lg ${
            selected === period ? "bg-[#8B2635]" : "bg-gray-100"
          }`}
          onPress={() => onSelect(period)}
        >
          <Text
            className={`text-sm font-medium ${
              selected === period ? "text-white" : "text-gray-600"
            }`}
          >
            {period}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default function AnalyticsScreen() {
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = React.useState("30d");

  // Calculate stats from mock data
  const stats = useMemo(() => {
    const jobs = mockEmployerJobs;
    const applicants = mockApplicants;

    const totalJobs = jobs.length;
    const activeJobs = jobs.filter((j) => j.status === "active").length;
    const totalViews = jobs.reduce((sum, j) => sum + j.views, 0);
    const totalApplicants = applicants.length;
    const pendingApplicants = applicants.filter(
      (a) => a.status === "pending",
    ).length;
    const shortlistedApplicants = applicants.filter(
      (a) => a.status === "shortlisted",
    ).length;
    const interviewApplicants = applicants.filter(
      (a) => a.status === "interview",
    ).length;
    const hiredApplicants = applicants.filter(
      (a) => a.status === "hired",
    ).length;
    const rejectedApplicants = applicants.filter(
      (a) => a.status === "rejected",
    ).length;

    const avgApplicantsPerJob =
      totalJobs > 0 ? (totalApplicants / totalJobs).toFixed(1) : "0";
    const conversionRate =
      totalViews > 0 ? ((totalApplicants / totalViews) * 100).toFixed(1) : "0";
    const hireRate =
      totalApplicants > 0
        ? ((hiredApplicants / totalApplicants) * 100).toFixed(1)
        : "0";

    return {
      totalJobs,
      activeJobs,
      totalViews,
      totalApplicants,
      pendingApplicants,
      shortlistedApplicants,
      interviewApplicants,
      hiredApplicants,
      rejectedApplicants,
      avgApplicantsPerJob,
      conversionRate,
      hireRate,
    };
  }, []);

  // Job performance data
  const jobPerformance = useMemo(() => {
    return mockEmployerJobs.map((job) => ({
      id: job.id,
      title: job.title,
      views: job.views,
      applicants: job.applicants,
      status: job.status,
    }));
  }, []);

  // Handle job card press - navigate to jobs page
  const handleJobPress = (jobId: string) => {
    router.push("/(employer)/jobs" as any);
  };

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
            <Text className="text-xl font-bold text-gray-900">Analytics</Text>
            <Text className="text-sm text-gray-500">
              Track your recruitment performance
            </Text>
          </View>
        </View>

        {/* Time Period Selector */}
        <View className="px-4 pb-4">
          <TimePeriodSelector
            selected={selectedPeriod}
            onSelect={setSelectedPeriod}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Key Metrics */}
        <View className="flex-row flex-wrap gap-3 mb-6">
          <StatsCard
            title="Active Jobs"
            value={stats.activeJobs}
            icon={<Briefcase size={20} color="#8B2635" />}
            change={12}
            changeLabel="vs last period"
            color="#8B2635"
            bgColor="rgba(139, 38, 53, 0.08)"
          />
          <StatsCard
            title="Total Views"
            value={stats.totalViews}
            icon={<Eye size={20} color="#2196F3" />}
            change={8}
            changeLabel="vs last period"
            color="#2196F3"
            bgColor="rgba(33, 150, 243, 0.08)"
          />
          <StatsCard
            title="Applicants"
            value={stats.totalApplicants}
            icon={<Users size={20} color="#4CAF50" />}
            change={15}
            changeLabel="vs last period"
            color="#4CAF50"
            bgColor="rgba(76, 175, 80, 0.08)"
          />
          <StatsCard
            title="Hired"
            value={stats.hiredApplicants}
            icon={<CheckCircle size={20} color="#FF9800" />}
            change={-5}
            changeLabel="vs last period"
            color="#FF9800"
            bgColor="rgba(255, 152, 0, 0.08)"
          />
        </View>

        {/* Performance Metrics */}
        <View className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Performance Metrics
          </Text>
          <View className="flex-row justify-between mb-6">
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold" style={{ color: "#8B2635" }}>
                {stats.avgApplicantsPerJob}
              </Text>
              <Text className="text-xs text-gray-500 text-center mt-1">
                Avg. Applicants{"\n"}per Job
              </Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold" style={{ color: "#2196F3" }}>
                {stats.conversionRate}%
              </Text>
              <Text className="text-xs text-gray-500 text-center mt-1">
                View to{"\n"}Application Rate
              </Text>
            </View>
            <View className="w-px bg-gray-200" />
            <View className="items-center flex-1">
              <Text className="text-2xl font-bold" style={{ color: "#4CAF50" }}>
                {stats.hireRate}%
              </Text>
              <Text className="text-xs text-gray-500 text-center mt-1">
                Application to{"\n"}Hire Rate
              </Text>
            </View>
          </View>
        </View>

        {/* Applicant Pipeline */}
        <View className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Applicant Pipeline
          </Text>
          <ProgressBar
            label="Pending Review"
            value={stats.pendingApplicants}
            total={stats.totalApplicants}
            color="#F59E0B"
          />
          <ProgressBar
            label="Shortlisted"
            value={stats.shortlistedApplicants}
            total={stats.totalApplicants}
            color="#8B2635"
          />
          <ProgressBar
            label="Interview Stage"
            value={stats.interviewApplicants}
            total={stats.totalApplicants}
            color="#2196F3"
          />
          <ProgressBar
            label="Hired"
            value={stats.hiredApplicants}
            total={stats.totalApplicants}
            color="#10B981"
          />
          <ProgressBar
            label="Rejected"
            value={stats.rejectedApplicants}
            total={stats.totalApplicants}
            color="#EF4444"
          />
        </View>

        {/* Job Performance */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-900">
              Job Performance
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/(employer)/jobs" as any)}
            >
              <Text className="text-sm text-[#8B2635] font-medium">
                View All
              </Text>
            </TouchableOpacity>
          </View>
          {jobPerformance.slice(0, 4).map((job) => (
            <JobPerformanceCard
              key={job.id}
              job={job}
              onPress={() => handleJobPress(job.id)}
            />
          ))}
        </View>

        {/* Activity Summary */}
        <View className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
          <Text className="text-lg font-bold text-gray-900 mb-4">
            Recent Activity
          </Text>
          <View className="flex-row items-center gap-3 mb-3">
            <View
              className="w-10 h-10 rounded-full justify-center items-center"
              style={{ backgroundColor: "rgba(139, 38, 53, 0.08)" }}
            >
              <Users size={18} color="#8B2635" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-900">
                3 new applications received
              </Text>
              <Text className="text-xs text-gray-400">Today</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3 mb-3">
            <View
              className="w-10 h-10 rounded-full justify-center items-center"
              style={{ backgroundColor: "rgba(33, 150, 243, 0.08)" }}
            >
              <Eye size={18} color="#2196F3" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-900">
                45 job views this week
              </Text>
              <Text className="text-xs text-gray-400">+12% from last week</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-3">
            <View
              className="w-10 h-10 rounded-full justify-center items-center"
              style={{ backgroundColor: "rgba(76, 175, 80, 0.08)" }}
            >
              <CheckCircle size={18} color="#4CAF50" />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-gray-900">
                1 candidate hired this month
              </Text>
              <Text className="text-xs text-gray-400">
                Senior Software Engineer
              </Text>
            </View>
          </View>
        </View>

        <View className="h-5" />
      </ScrollView>
    </SafeAreaView>
  );
}
