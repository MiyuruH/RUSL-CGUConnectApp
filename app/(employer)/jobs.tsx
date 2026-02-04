import {
  CloseJobConfirmationModal,
  DeleteConfirmationModal,
  EmployerJob,
  EmployerJobCard,
  EmployerJobFormData,
  emptyJobTemplate,
  JobDetailModal,
  JobFormModal,
  JobTabs,
  JobTabType,
  PauseJobConfirmationModal,
  SuccessModal,
} from "@/components/employer";
import { mockEmployerJobs } from "@/data/mock-employer-jobs";
import { Briefcase, Plus, Search, X } from "lucide-react-native";
import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function EmployerJobsScreen() {
  // Jobs state
  const [jobs, setJobs] = useState<EmployerJob[]>(mockEmployerJobs);
  const [activeTab, setActiveTab] = useState<JobTabType>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal visibility states
  const [showJobModal, setShowJobModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showJobDetailModal, setShowJobDetailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);
  const [showPauseModal, setShowPauseModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Current job being edited/viewed/deleted
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Get current job from jobs array to keep it in sync
  const currentJob = useMemo(() => {
    if (!currentJobId) return null;
    return jobs.find((j) => j.id === currentJobId) || null;
  }, [currentJobId, jobs]);

  // Form state for add/edit
  const [formData, setFormData] = useState<EmployerJobFormData>({
    ...emptyJobTemplate,
  });

  // Calculate job counts for tabs
  const jobCounts = useMemo(
    () => ({
      all: jobs.length,
      active: jobs.filter((j) => j.status === "active").length,
      paused: jobs.filter((j) => j.status === "paused").length,
      closed: jobs.filter((j) => j.status === "closed").length,
    }),
    [jobs],
  );

  // Filtered jobs based on search and tab
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch = job.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesTab = activeTab === "all" || job.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [jobs, searchQuery, activeTab]);

  // Clear search
  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  // Open add job modal
  const handleAddJob = useCallback(() => {
    setFormData({ ...emptyJobTemplate });
    setIsEditMode(false);
    setShowJobModal(true);
  }, []);

  // Open edit job modal
  const handleEditJob = useCallback((job: EmployerJob) => {
    setCurrentJobId(job.id);
    setFormData({
      title: job.title,
      company: job.company,
      location: job.location,
      contractType: job.contractType,
      salary: job.salary || "",
      postedDate: job.postedDate,
      description: job.description,
      requirements: [...job.requirements],
      responsibilities: [...job.responsibilities],
      companyInfo: job.companyInfo,
      applicants: job.applicants,
      views: job.views,
      status: job.status,
    });
    setIsEditMode(true);
    setShowJobModal(true);
  }, []);

  // Open delete confirmation modal
  const handleDeletePrompt = useCallback((job: EmployerJob) => {
    setCurrentJobId(job.id);
    setShowDeleteModal(true);
  }, []);

  // Confirm delete job
  const handleConfirmDelete = useCallback(() => {
    if (currentJob) {
      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== currentJob.id));
      setShowDeleteModal(false);
      setCurrentJobId(null);
      setSuccessMessage("Job deleted successfully!");
      setShowSuccessModal(true);
    }
  }, [currentJob]);

  // Open pause confirmation modal
  const handlePausePrompt = useCallback((job: EmployerJob) => {
    setCurrentJobId(job.id);
    setShowPauseModal(true);
  }, []);

  // Confirm pause job
  const handleConfirmPause = useCallback(() => {
    if (currentJob) {
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === currentJob.id ? { ...j, status: "paused" as const } : j,
        ),
      );
      setShowPauseModal(false);
      setShowJobDetailModal(false);
      setCurrentJobId(null);
      setSuccessMessage("Job paused successfully!");
      setShowSuccessModal(true);
    }
  }, [currentJob]);

  // Resume job (set to active)
  const handleResumeJob = useCallback((job: EmployerJob) => {
    setJobs((prevJobs) =>
      prevJobs.map((j) =>
        j.id === job.id ? { ...j, status: "active" as const } : j,
      ),
    );
    setShowJobDetailModal(false);
    setCurrentJobId(null);
    setSuccessMessage(
      job.status === "closed"
        ? "Job reopened successfully!"
        : "Job resumed successfully!",
    );
    setShowSuccessModal(true);
  }, []);

  // Open close job confirmation modal
  const handleClosePrompt = useCallback((job: EmployerJob) => {
    setCurrentJobId(job.id);
    setShowCloseModal(true);
  }, []);

  // Confirm close job
  const handleConfirmClose = useCallback(() => {
    if (currentJob) {
      setJobs((prevJobs) =>
        prevJobs.map((j) =>
          j.id === currentJob.id ? { ...j, status: "closed" as const } : j,
        ),
      );
      setShowCloseModal(false);
      setShowJobDetailModal(false);
      setCurrentJobId(null);
      setSuccessMessage("Job closed successfully!");
      setShowSuccessModal(true);
    }
  }, [currentJob]);

  // View job details
  const handleViewJob = useCallback((job: EmployerJob) => {
    setCurrentJobId(job.id);
    setShowJobDetailModal(true);
  }, []);

  // Save job (add or edit)
  const handleSaveJob = useCallback(() => {
    if (
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.description.trim()
    ) {
      Alert.alert(
        "Error",
        "Please fill in all required fields (Title, Location, Description)",
      );
      return;
    }

    if (isEditMode && currentJob) {
      // Update existing job
      setJobs((prevJobs) =>
        prevJobs.map((job) => {
          if (job.id === currentJob.id) {
            return {
              ...job,
              ...formData,
            };
          }
          return job;
        }),
      );
      setSuccessMessage("Job updated successfully!");
    } else {
      // Add new job
      const newJob: EmployerJob = {
        id: Date.now().toString(),
        ...formData,
      };
      setJobs((prevJobs) => [newJob, ...prevJobs]);
      setSuccessMessage("Job posted successfully!");
    }

    setShowJobModal(false);
    setCurrentJobId(null);
    setShowSuccessModal(true);
  }, [formData, isEditMode, currentJob]);

  // Handle form data change
  const handleFormChange = useCallback((data: EmployerJobFormData) => {
    setFormData(data);
  }, []);

  // Handle edit from detail modal
  const handleEditFromDetail = useCallback(() => {
    if (currentJob) {
      setShowJobDetailModal(false);
      handleEditJob(currentJob);
    }
  }, [currentJob, handleEditJob]);

  // Handle delete from detail modal
  const handleDeleteFromDetail = useCallback(() => {
    if (currentJob) {
      setShowJobDetailModal(false);
      handleDeletePrompt(currentJob);
    }
  }, [currentJob, handleDeletePrompt]);

  // Handle pause from detail modal
  const handlePauseFromDetail = useCallback(() => {
    if (currentJob) {
      handlePausePrompt(currentJob);
    }
  }, [currentJob, handlePausePrompt]);

  // Handle resume from detail modal
  const handleResumeFromDetail = useCallback(() => {
    if (currentJob) {
      handleResumeJob(currentJob);
    }
  }, [currentJob, handleResumeJob]);

  // Handle close from detail modal
  const handleCloseFromDetail = useCallback(() => {
    if (currentJob) {
      handleClosePrompt(currentJob);
    }
  }, [currentJob, handleClosePrompt]);

  // Render job card
  const renderJobCard = useCallback(
    ({ item }: { item: EmployerJob }) => (
      <EmployerJobCard
        job={item}
        onPress={() => handleViewJob(item)}
        onEdit={() => handleEditJob(item)}
        onDelete={() => handleDeletePrompt(item)}
        onPause={() => handlePausePrompt(item)}
        onResume={() => handleResumeJob(item)}
        onClose={() => handleClosePrompt(item)}
      />
    ),
    [
      handleViewJob,
      handleEditJob,
      handleDeletePrompt,
      handlePausePrompt,
      handleResumeJob,
      handleClosePrompt,
    ],
  );

  // Key extractor
  const keyExtractor = useCallback((item: EmployerJob) => item.id, []);

  // Empty list component
  const ListEmptyComponent = (
    <View className="flex-1 justify-center items-center py-16">
      <Briefcase size={48} color="#ccc" />
      <Text className="text-base text-gray-400 mt-3">No jobs found</Text>
      <Pressable
        onPress={handleAddJob}
        className="mt-4 bg-[#8B2635] px-6 py-3 rounded-xl"
      >
        <Text className="text-white font-semibold">Post Your First Job</Text>
      </Pressable>
    </View>
  );

  // Header component
  const ListHeaderComponent = (
    <View className="mb-2">
      <Text className="text-sm text-gray-500">
        {filteredJobs.length} {filteredJobs.length === 1 ? "job" : "jobs"} found
      </Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Header */}
      <View className="bg-white px-4 py-3 border-b border-gray-100">
        {/* Title */}
        <Text className="text-xl font-bold text-gray-900 mb-3">
          My Job Posts
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center gap-3">
          <View className="flex-1 flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
            <Search size={20} color="#9ca3af" />
            <TextInput
              className="flex-1 text-base text-gray-800 ml-3"
              placeholder="Search your jobs..."
              placeholderTextColor="#9ca3af"
              value={searchQuery}
              onChangeText={setSearchQuery}
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <Pressable onPress={handleClearSearch} className="p-1">
                <X size={18} color="#9ca3af" />
              </Pressable>
            )}
          </View>

          {/* Add Job Button */}
          <Pressable
            className="bg-[#8B2635] p-3.5 rounded-xl"
            style={({ pressed }) => ({
              opacity: pressed ? 0.8 : 1,
            })}
            onPress={handleAddJob}
          >
            <Plus size={20} color="#fff" />
          </Pressable>
        </View>
      </View>

      {/* Tabs */}
      <JobTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        jobCounts={jobCounts}
      />

      {/* Jobs List */}
      <FlatList
        data={filteredJobs}
        renderItem={renderJobCard}
        keyExtractor={keyExtractor}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={ListHeaderComponent}
        ListEmptyComponent={ListEmptyComponent}
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={5}
        initialNumToRender={6}
      />

      {/* Add/Edit Job Modal */}
      <JobFormModal
        visible={showJobModal}
        isEditMode={isEditMode}
        formData={formData}
        onClose={() => setShowJobModal(false)}
        onSave={handleSaveJob}
        onFormChange={handleFormChange}
      />

      {/* Job Detail Modal */}
      <JobDetailModal
        visible={showJobDetailModal}
        job={currentJob}
        onClose={() => setShowJobDetailModal(false)}
        onEdit={handleEditFromDetail}
        onDelete={handleDeleteFromDetail}
        onPause={handlePauseFromDetail}
        onResume={handleResumeFromDetail}
        onCloseJob={handleCloseFromDetail}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        visible={showDeleteModal}
        jobTitle={currentJob?.title}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
      />

      {/* Pause Confirmation Modal */}
      <PauseJobConfirmationModal
        visible={showPauseModal}
        jobTitle={currentJob?.title}
        onCancel={() => setShowPauseModal(false)}
        onConfirm={handleConfirmPause}
      />

      {/* Close Job Confirmation Modal */}
      <CloseJobConfirmationModal
        visible={showCloseModal}
        jobTitle={currentJob?.title}
        onCancel={() => setShowCloseModal(false)}
        onConfirm={handleConfirmClose}
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
