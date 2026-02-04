import { AvatarPicker } from "@/components/ui/avatar-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

// Validation helpers
const validateFullName = (name: string): string | undefined => {
  if (!name.trim()) {
    return "Full name is required";
  }
  if (name.trim().length < 2) {
    return "Name must be at least 2 characters";
  }
  if (!/^[a-zA-Z\s]+$/.test(name.trim())) {
    return "Name can only contain letters and spaces";
  }
  return undefined;
};

const validateEmail = (email: string): string | undefined => {
  if (!email.trim()) {
    return "Email is required";
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return "Please enter a valid email address";
  }
  return undefined;
};

const validatePhone = (phone: string): string | undefined => {
  if (!phone.trim()) {
    return "Phone number is required";
  }
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
    return "Please enter a valid 10-digit phone number";
  }
  return undefined;
};

const validatePassword = (
  password: string,
): { isValid: boolean; checks: PasswordCheck[] } => {
  const checks: PasswordCheck[] = [
    { label: "At least 8 characters", passed: password.length >= 8 },
    { label: "Contains uppercase letter", passed: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", passed: /[a-z]/.test(password) },
    { label: "Contains a number", passed: /[0-9]/.test(password) },
    {
      label: "Contains special character",
      passed: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  const isValid = checks.every((check) => check.passed);
  return { isValid, checks };
};

const validateConfirmPassword = (
  password: string,
  confirmPassword: string,
): string | undefined => {
  if (!confirmPassword) {
    return "Please confirm your password";
  }
  if (password !== confirmPassword) {
    return "Passwords do not match";
  }
  return undefined;
};

interface PasswordCheck {
  label: string;
  passed: boolean;
}

export default function RegisterScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();

  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  // Validation states
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [showPasswordRequirements, setShowPasswordRequirements] =
    useState(false);

  const passwordValidation = validatePassword(password);

  const handleFieldChange = (field: keyof typeof touched, value: string) => {
    switch (field) {
      case "fullName":
        setFullName(value);
        if (touched.fullName) {
          setErrors((prev) => ({
            ...prev,
            fullName: validateFullName(value) || "",
          }));
        }
        break;
      case "email":
        setEmail(value);
        if (touched.email) {
          setErrors((prev) => ({ ...prev, email: validateEmail(value) || "" }));
        }
        break;
      case "phone":
        setPhone(value);
        if (touched.phone) {
          setErrors((prev) => ({ ...prev, phone: validatePhone(value) || "" }));
        }
        break;
      case "password":
        setPassword(value);
        if (touched.password && !passwordValidation.isValid) {
          setErrors((prev) => ({
            ...prev,
            password: "Password doesn't meet requirements",
          }));
        } else {
          setErrors((prev) => ({ ...prev, password: "" }));
        }
        // Also validate confirm password if it's been touched
        if (touched.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword:
              validateConfirmPassword(value, confirmPassword) || "",
          }));
        }
        break;
      case "confirmPassword":
        setConfirmPassword(value);
        if (touched.confirmPassword) {
          setErrors((prev) => ({
            ...prev,
            confirmPassword: validateConfirmPassword(password, value) || "",
          }));
        }
        break;
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    switch (field) {
      case "fullName":
        setErrors((prev) => ({
          ...prev,
          fullName: validateFullName(fullName) || "",
        }));
        break;
      case "email":
        setErrors((prev) => ({ ...prev, email: validateEmail(email) || "" }));
        break;
      case "phone":
        setErrors((prev) => ({ ...prev, phone: validatePhone(phone) || "" }));
        break;
      case "password":
        setShowPasswordRequirements(false);
        if (!passwordValidation.isValid) {
          setErrors((prev) => ({
            ...prev,
            password: "Password doesn't meet requirements",
          }));
        }
        break;
      case "confirmPassword":
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            validateConfirmPassword(password, confirmPassword) || "",
        }));
        break;
    }
  };

  const validateForm = (): boolean => {
    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const passwordError = !passwordValidation.isValid
      ? "Password doesn't meet requirements"
      : "";
    const confirmPasswordError = validateConfirmPassword(
      password,
      confirmPassword,
    );

    setErrors({
      fullName: fullNameError || "",
      email: emailError || "",
      phone: phoneError || "",
      password: passwordError,
      confirmPassword: confirmPasswordError || "",
    });

    setTouched({
      fullName: true,
      email: true,
      phone: true,
      password: true,
      confirmPassword: true,
    });

    return (
      !fullNameError &&
      !emailError &&
      !phoneError &&
      passwordValidation.isValid &&
      !confirmPasswordError &&
      agreeToTerms
    );
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // TODO: Implement actual registration logic
    setTimeout(() => {
      setLoading(false);
      // Navigate based on role selection
      if (role === "employer") {
        router.replace("/(employer)" as any);
      } else {
        router.replace("/(jobSeeker)" as any);
      }
    }, 1500);
  };

  const isFormValid =
    !validateFullName(fullName) &&
    !validateEmail(email) &&
    !validatePhone(phone) &&
    passwordValidation.isValid &&
    !validateConfirmPassword(password, confirmPassword) &&
    agreeToTerms;

  const getRoleInfo = () => {
    if (role === "employer") {
      return { label: "Employer", color: "#D4A843", bgColor: "#fffbeb" };
    }
    return { label: "Job Seeker", color: "#8B2735", bgColor: "#fdf2f4" };
  };

  const roleInfo = getRoleInfo();

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-surface-dark" : "bg-slate-50"}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingTop: 8 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header with back button */}
          <Animated.View entering={FadeInDown.delay(100).duration(400)}>
            <Pressable
              onPress={() => router.back()}
              className={`self-start mb-6 p-2 rounded-xl ${isDark ? "bg-slate-800" : "bg-white"}`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <ArrowLeft size={22} color={isDark ? "#fff" : "#334155"} />
            </Pressable>
          </Animated.View>

          {/* Title Section */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="mb-6"
          >
            <View
              className="self-start px-3 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: isDark ? "#3d1a1f" : roleInfo.bgColor }}
            >
              <Text
                style={{ color: roleInfo.color }}
                className="text-xs font-semibold"
              >
                {roleInfo.label} Account
              </Text>
            </View>
            <Text
              className={`text-3xl font-bold mb-2 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Create Account
            </Text>
            <Text
              className={`text-base ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Join the CGU Connect community
            </Text>
          </Animated.View>

          {/* Avatar Section */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            className="items-center mb-6"
          >
            <View
              className={`p-4 rounded-3xl ${isDark ? "bg-surface-card" : "bg-white"}`}
              style={{
                shadowColor: "#8B2735",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.1,
                shadowRadius: 12,
                elevation: 4,
              }}
            >
              <AvatarPicker
                uri={avatarUri}
                onImageSelected={setAvatarUri}
                size={100}
              />
            </View>
            <Text
              className={`mt-3 text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Add profile photo (optional)
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(500)}
            className={`rounded-3xl p-6 mb-6 ${isDark ? "bg-surface-card" : "bg-white"}`}
            style={{
              shadowColor: "#8B2735",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: isDark ? 0.3 : 0.08,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Input
              label="Full Name"
              value={fullName}
              onChangeText={(value) => handleFieldChange("fullName", value)}
              onBlur={() => handleBlur("fullName")}
              placeholder="Enter your full name"
              autoComplete="name"
              error={touched.fullName ? errors.fullName : undefined}
              leftIcon={
                <User size={20} color={isDark ? "#64748b" : "#94a3b8"} />
              }
            />

            <Input
              label="Email Address"
              value={email}
              onChangeText={(value) => handleFieldChange("email", value)}
              onBlur={() => handleBlur("email")}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={touched.email ? errors.email : undefined}
              leftIcon={
                <Mail size={20} color={isDark ? "#64748b" : "#94a3b8"} />
              }
            />

            <Input
              label="Phone Number"
              value={phone}
              onChangeText={(value) => handleFieldChange("phone", value)}
              onBlur={() => handleBlur("phone")}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              autoComplete="tel"
              error={touched.phone ? errors.phone : undefined}
              leftIcon={
                <Phone size={20} color={isDark ? "#64748b" : "#94a3b8"} />
              }
            />

            <Input
              label="Password"
              value={password}
              onChangeText={(value) => handleFieldChange("password", value)}
              onFocus={() => setShowPasswordRequirements(true)}
              onBlur={() => handleBlur("password")}
              placeholder="Create a strong password"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
              error={
                touched.password && !showPasswordRequirements
                  ? errors.password
                  : undefined
              }
              leftIcon={
                <Lock size={20} color={isDark ? "#64748b" : "#94a3b8"} />
              }
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <EyeOff size={20} color={isDark ? "#64748b" : "#94a3b8"} />
                  ) : (
                    <Eye size={20} color={isDark ? "#64748b" : "#94a3b8"} />
                  )}
                </Pressable>
              }
            />

            {/* Password Requirements */}
            {showPasswordRequirements && (
              <Animated.View
                entering={FadeInDown.duration(200)}
                className={`mb-4 p-4 rounded-xl ${isDark ? "bg-surface-elevated" : "bg-slate-50"}`}
              >
                <Text
                  className={`text-xs font-semibold mb-2 ${isDark ? "text-slate-300" : "text-slate-600"}`}
                >
                  Password Requirements:
                </Text>
                {passwordValidation.checks.map((check, index) => (
                  <View
                    key={index}
                    className="flex-row items-center gap-2 mb-1"
                  >
                    {check.passed ? (
                      <Check size={14} color="#22c55e" />
                    ) : (
                      <X size={14} color="#ef4444" />
                    )}
                    <Text
                      className={`text-xs ${
                        check.passed
                          ? "text-green-500"
                          : isDark
                            ? "text-slate-400"
                            : "text-slate-500"
                      }`}
                    >
                      {check.label}
                    </Text>
                  </View>
                ))}
              </Animated.View>
            )}

            <Input
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={(value) =>
                handleFieldChange("confirmPassword", value)
              }
              onBlur={() => handleBlur("confirmPassword")}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              autoComplete="new-password"
              error={
                touched.confirmPassword ? errors.confirmPassword : undefined
              }
              leftIcon={
                <ShieldCheck size={20} color={isDark ? "#64748b" : "#94a3b8"} />
              }
              rightIcon={
                <Pressable
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={isDark ? "#64748b" : "#94a3b8"} />
                  ) : (
                    <Eye size={20} color={isDark ? "#64748b" : "#94a3b8"} />
                  )}
                </Pressable>
              }
            />

            {/* Terms and Conditions */}
            <Pressable
              onPress={() => setAgreeToTerms(!agreeToTerms)}
              className="flex-row items-start gap-3 mt-2"
            >
              <View
                className={`w-5 h-5 rounded-md border-2 items-center justify-center ${
                  agreeToTerms
                    ? "bg-primary-500 border-primary-500"
                    : isDark
                      ? "border-slate-600"
                      : "border-slate-300"
                }`}
              >
                {agreeToTerms && <Check size={14} color="#fff" />}
              </View>
              <Text
                className={`flex-1 text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                I agree to the{" "}
                <Text className="text-primary-500 font-semibold">
                  Terms of Service
                </Text>{" "}
                and{" "}
                <Text className="text-primary-500 font-semibold">
                  Privacy Policy
                </Text>
              </Text>
            </Pressable>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(500)}
            className="gap-5 pb-8"
          >
            <Button
              title="Create Account"
              onPress={handleRegister}
              loading={loading}
              disabled={!isFormValid}
            />

            {/* Divider */}
            <View className="flex-row items-center gap-4 my-2">
              <View
                className={`flex-1 h-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
              />
              <Text
                className={`text-xs ${isDark ? "text-slate-500" : "text-slate-400"}`}
              >
                OR
              </Text>
              <View
                className={`flex-1 h-px ${isDark ? "bg-slate-700" : "bg-slate-200"}`}
              />
            </View>

            {/* Social Signup Buttons */}
            <View className="flex-row gap-3">
              <Pressable
                className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl ${isDark ? "bg-surface-card" : "bg-white"}`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text
                  className={`font-semibold ${isDark ? "text-white" : "text-slate-700"}`}
                >
                  Google
                </Text>
              </Pressable>
              <Pressable
                className={`flex-1 flex-row items-center justify-center gap-2 py-4 rounded-2xl ${isDark ? "bg-surface-card" : "bg-white"}`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 4,
                  elevation: 2,
                }}
              >
                <Text
                  className={`font-semibold ${isDark ? "text-white" : "text-slate-700"}`}
                >
                  LinkedIn
                </Text>
              </Pressable>
            </View>

            {/* Login Link */}
            <View className="flex-row items-center justify-center gap-1 mt-4">
              <Text
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Already have an account?
              </Text>
              <Link
                href={{ pathname: "/(auth)/login", params: { role } }}
                asChild
              >
                <Pressable>
                  <Text className="text-primary-500 text-sm font-bold">
                    Sign In
                  </Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
