import { JobDetailsHeader } from "@/components/jobSeeker/job-details-header";
import {
    BulletList,
    JobSection,
    Paragraph,
} from "@/components/jobSeeker/job-section";
import { mockJobs } from "@/data/mock-jobs";
import type { Job } from "@/types/job";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
    AlertCircle,
    BookOpen,
    Briefcase,
    Building2,
    CheckCircle,
    ClipboardList,
} from "lucide-react-native";
import React, { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    Share,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function JobDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [isApplying, setIsApplying] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [job, setJob] = useState<Job | undefined>(() =>
    mockJobs.find((j) => j.id === id),
  );

  // Handle back navigation
  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(jobSeeker)/jobs");
    }
  }, [router]);

  // Handle share
  const handleShare = useCallback(async () => {
    if (!job) return;

    try {
      await Share.share({
        title: job.title,
        message: `Check out this job opportunity: ${job.title} at ${job.company}.\n\nLocation: ${job.location}\nType: ${job.contractType}${job.salary ? `\nSalary: ${job.salary}` : ""}`,
      });
    } catch (error) {
      console.log("Error sharing:", error);
    }
  }, [job]);

  // Handle bookmark toggle
  const handleBookmark = useCallback(() => {
    setJob((prevJob) =>
      prevJob ? { ...prevJob, isBookmarked: !prevJob.isBookmarked } : prevJob,
    );
  }, []);

  // Handle apply
  const handleApply = useCallback(() => {
    setIsApplying(true);

    // Simulate API call
    setTimeout(() => {
      setIsApplying(false);
      setShowSuccessModal(true);
    }, 1500);
  }, []);

  // Close success modal
  const handleCloseSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
  }, []);

  // If job not found
  if (!job) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
        <View className="flex-1 items-center justify-center">
          <AlertCircle size={64} color="#ef4444" />
          <Text className="text-xl font-bold text-gray-900 mt-4">
            Job Not Found
          </Text>
          <Text className="text-base text-gray-500 mt-2">
            This job posting may have been removed.
          </Text>
          <Pressable
            onPress={handleBack}
            className="mt-6 bg-[#8B2635] px-6 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={["top", "bottom"]}>
      {/* Header with company info */}
      <JobDetailsHeader
        job={job}
        onBack={handleBack}
        onShare={handleShare}
        onBookmark={handleBookmark}
      />

      {/* Scrollable Content */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Job Description */}
        <JobSection title="Description" icon={BookOpen}>
          <Paragraph text={job.description} />
        </JobSection>

        {/* Requirements */}
        <JobSection title="Requirements" icon={ClipboardList}>
          <BulletList items={job.requirements} />
        </JobSection>

        {/* Responsibilities */}
        <JobSection title="Responsibilities" icon={Briefcase}>
          <BulletList items={job.responsibilities} />
        </JobSection>

        {/* Company Info */}
        <JobSection
          title="About Company"
          icon={Building2}
          collapsible
          defaultExpanded={false}
        >
          <Paragraph text={job.companyInfo} />
        </JobSection>
      </ScrollView>

      {/* Bottom Fixed Section - Apply Button */}
      <View className="bg-white border-t border-gray-100 px-4 py-3">
        <Pressable
          onPress={handleApply}
          disabled={isApplying}
          className="overflow-hidden rounded-2xl"
          style={({ pressed }) => ({
            opacity: pressed || isApplying ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
          })}
        >
          <LinearGradient
            colors={["#8B2635", "#A03040", "#8B2635"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            className="py-4 items-center justify-center"
          >
            {isApplying ? (
              <View className="flex-row items-center">
                <ActivityIndicator color="#fff" size="small" />
                <Text className="text-white text-lg font-bold ml-3">
                  Applying...
                </Text>
              </View>
            ) : (
              <Text className="text-white text-lg font-bold">
                Apply for Job
              </Text>
            )}
          </LinearGradient>
        </Pressable>
      </View>

      {/* Success Modal */}
      <Modal
        visible={showSuccessModal}
        transparent
        animationType="fade"
        onRequestClose={handleCloseSuccessModal}
      >
        <Pressable
          onPress={handleCloseSuccessModal}
          className="flex-1 bg-black/50 items-center justify-center px-6"
        >
          <View className="bg-white rounded-3xl p-8 items-center w-full max-w-sm">
            {/* Success Icon */}
            <View className="w-20 h-20 rounded-full bg-emerald-100 items-center justify-center mb-4">
              <CheckCircle size={48} color="#059669" />
            </View>

            {/* Title */}
            <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
              Application Submitted!
            </Text>

            {/* Message */}
            <Text className="text-base text-gray-500 text-center mb-6">
              Your application for{" "}
              <Text className="font-semibold text-gray-700">{job.title}</Text>{" "}
              at{" "}
              <Text className="font-semibold text-gray-700">{job.company}</Text>{" "}
              has been successfully submitted.
            </Text>

            {/* Info */}
            <View className="bg-blue-50 rounded-xl p-4 w-full mb-6">
              <Text className="text-sm text-blue-700 text-center">
                The employer will review your profile and contact you if you're
                a good match. Good luck! 🍀
              </Text>
            </View>

            {/* Close Button */}
            <Pressable
              onPress={handleCloseSuccessModal}
              className="bg-[#8B2635] py-4 px-8 rounded-xl w-full"
              style={({ pressed }) => ({
                opacity: pressed ? 0.9 : 1,
              })}
            >
              <Text className="text-white text-base font-bold text-center">
                Continue Browsing
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
