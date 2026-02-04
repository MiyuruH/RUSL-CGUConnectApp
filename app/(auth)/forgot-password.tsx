import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, CheckCircle, Mail, RefreshCw } from "lucide-react-native";
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

export default function ForgotPasswordScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Validation states
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState("");

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched) {
      setError(validateEmail(value) || "");
    }
  };

  const handleBlur = () => {
    setTouched(true);
    setError(validateEmail(email) || "");
  };

  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setTouched(true);
      setError(emailError);
      return;
    }

    setLoading(true);
    // TODO: Implement actual password reset logic
    setTimeout(() => {
      setLoading(false);
      setEmailSent(true);
      startCountdown();
    }, 1500);
  };

  const handleResend = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      startCountdown();
    }, 1500);
  };

  const getRoleInfo = () => {
    if (role === "employer") {
      return { label: "Employer", color: "#D4A843", bgColor: "#fffbeb" };
    }
    return { label: "Job Seeker", color: "#8B2735", bgColor: "#fdf2f4" };
  };

  const roleInfo = getRoleInfo();
  const isEmailValid = !validateEmail(email);

  if (emailSent) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-surface-dark" : "bg-slate-50"}`}
      >
        <ScrollView
          contentContainerStyle={{ padding: 24, paddingTop: 8, flex: 1 }}
          showsVerticalScrollIndicator={false}
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

          {/* Success Content */}
          <View className="flex-1 justify-center items-center">
            <Animated.View
              entering={FadeInUp.delay(200).duration(500)}
              className="items-center"
            >
              {/* Success Icon */}
              <View
                className="w-24 h-24 rounded-full items-center justify-center mb-6"
                style={{ backgroundColor: isDark ? "#3d1a1f" : "#fdf2f4" }}
              >
                <LinearGradient
                  colors={["#8B2735", "#661c28"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  className="w-20 h-20 rounded-full items-center justify-center"
                >
                  <CheckCircle size={40} color="#fff" />
                </LinearGradient>
              </View>

              <Text
                className={`text-2xl font-bold text-center mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
              >
                Check Your Email
              </Text>

              <Text
                className={`text-base text-center mb-2 ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                We've sent a password reset link to
              </Text>

              <Text
                className={`text-base font-semibold text-center mb-8 ${isDark ? "text-primary-400" : "text-primary-500"}`}
              >
                {email}
              </Text>

              {/* Instructions */}
              <View
                className={`p-4 rounded-2xl mb-8 ${isDark ? "bg-surface-card" : "bg-white"}`}
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 4,
                }}
              >
                <Text
                  className={`text-sm text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}
                >
                  Click the link in the email to reset your password. If you
                  don't see it, check your spam folder.
                </Text>
              </View>

              {/* Resend Button */}
              <View className="w-full gap-4">
                <Pressable
                  onPress={handleResend}
                  disabled={countdown > 0 || loading}
                  className={`flex-row items-center justify-center gap-2 py-4 rounded-2xl ${
                    countdown > 0 ? "opacity-50" : ""
                  } ${isDark ? "bg-surface-card" : "bg-white"}`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                    elevation: 2,
                  }}
                >
                  <RefreshCw size={18} color={isDark ? "#ec7a8f" : "#8B2735"} />
                  <Text
                    className={`font-semibold ${isDark ? "text-primary-400" : "text-primary-500"}`}
                  >
                    {countdown > 0 ? `Resend in ${countdown}s` : "Resend Email"}
                  </Text>
                </Pressable>

                <Link
                  href={{ pathname: "/(auth)/login", params: { role } }}
                  asChild
                >
                  <Button title="Back to Login" onPress={() => {}} />
                </Link>
              </View>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

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

          {/* Icon */}
          <Animated.View
            entering={FadeInDown.delay(200).duration(500)}
            className="items-center mb-8"
          >
            <View
              className="w-20 h-20 rounded-full items-center justify-center"
              style={{ backgroundColor: isDark ? "#3d1a1f" : "#fdf2f4" }}
            >
              <LinearGradient
                colors={["#8B2735", "#661c28"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="w-16 h-16 rounded-full items-center justify-center"
              >
                <Mail size={32} color="#fff" />
              </LinearGradient>
            </View>
          </Animated.View>

          {/* Title Section */}
          <Animated.View
            entering={FadeInDown.delay(300).duration(500)}
            className="mb-8"
          >
            <Text
              className={`text-3xl font-bold text-center mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
            >
              Forgot Password?
            </Text>
            <Text
              className={`text-base text-center ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              No worries! Enter your email address and we'll send you a link to
              reset your password.
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
              label="Email Address"
              value={email}
              onChangeText={handleEmailChange}
              onBlur={handleBlur}
              placeholder="Enter your registered email"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={touched ? error : undefined}
              leftIcon={
                <Mail size={20} color={isDark ? "#64748b" : "#94a3b8"} />
              }
            />
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInUp.delay(500).duration(500)}
            className="gap-5"
          >
            <Button
              title="Send Reset Link"
              onPress={handleSubmit}
              loading={loading}
              disabled={!isEmailValid}
            />

            {/* Back to Login Link */}
            <View className="flex-row items-center justify-center gap-1 mt-4">
              <Text
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Remember your password?
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
