import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { Link, useLocalSearchParams, useRouter } from "expo-router";
import { ArrowLeft, Eye, EyeOff, Lock, Mail } from "lucide-react-native";
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

const validatePassword = (password: string): string | undefined => {
  if (!password) {
    return "Password is required";
  }
  if (password.length < 6) {
    return "Password must be at least 6 characters";
  }
  return undefined;
};

export default function LoginScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const router = useRouter();
  const { role } = useLocalSearchParams<{ role?: string }>();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Validation states
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) || "" }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value) || "",
      }));
    }
  };

  const handleBlur = (field: "email" | "password") => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === "email") {
      setErrors((prev) => ({ ...prev, email: validateEmail(email) || "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(password) || "",
      }));
    }
  };

  const validateForm = (): boolean => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError || "",
      password: passwordError || "",
    });
    setTouched({ email: true, password: true });

    return !emailError && !passwordError;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setLoading(true);
    // TODO: Implement actual login logic
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

  const getRoleInfo = () => {
    if (role === "employer") {
      return { label: "Employer", color: "#D4A843", bgColor: "#fffbeb" };
    }
    return { label: "Job Seeker", color: "#8B2735", bgColor: "#fdf2f4" };
  };

  const roleInfo = getRoleInfo();
  const isFormValid = !validateEmail(email) && !validatePassword(password);

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
            className="mb-8"
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
              Welcome Back
            </Text>
            <Text
              className={`text-base ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Sign in to continue your journey
            </Text>
          </Animated.View>

          {/* Form Card */}
          <Animated.View
            entering={FadeInUp.delay(300).duration(500)}
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
              label="Password"
              value={password}
              onChangeText={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              autoComplete="password"
              error={touched.password ? errors.password : undefined}
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

            <Link
              href={{ pathname: "/(auth)/forgot-password", params: { role } }}
              asChild
            >
              <Pressable className="self-end mb-2">
                <Text className="text-primary-500 text-sm font-semibold">
                  Forgot Password?
                </Text>
              </Pressable>
            </Link>
          </Animated.View>

          {/* Action Buttons */}
          <Animated.View
            entering={FadeInUp.delay(400).duration(500)}
            className="gap-5"
          >
            <Button
              title="Sign In"
              onPress={handleLogin}
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

            {/* Social Login Buttons */}
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

            {/* Register Link */}
            <View className="flex-row items-center justify-center gap-1 mt-4">
              <Text
                className={`text-sm ${isDark ? "text-slate-400" : "text-slate-500"}`}
              >
                Don't have an account?
              </Text>
              <Link
                href={{ pathname: "/(auth)/register", params: { role } }}
                asChild
              >
                <Pressable>
                  <Text className="text-primary-500 text-sm font-bold">
                    Create Account
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
