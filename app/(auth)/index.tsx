import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, {
    FadeIn,
    FadeInUp,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withSequence,
    withTiming,
} from "react-native-reanimated";

export default function WelcomeScreen() {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const router = useRouter();

  // Pulse animation for the "tap to continue" text
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0.5, { duration: 1000 }),
      ),
      -1,
      false,
    );
  }, []);

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const handleContinue = () => {
    router.push({ pathname: "/role-selection" } as any);
  };

  return (
    <Pressable onPress={handleContinue} className="flex-1">
      <LinearGradient
        colors={
          isDark
            ? ["#1a0a0d", "#2d1216", "#1a0a0d"]
            : ["#fdf2f4", "#fce7ea", "#fdf2f4"]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="flex-1 justify-center items-center"
      >
        {/* Decorative circles */}
        <View
          className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full opacity-20"
          style={{ backgroundColor: "#8B2735" }}
        />
        <View
          className="absolute bottom-[-150px] left-[-100px] w-[350px] h-[350px] rounded-full opacity-10"
          style={{ backgroundColor: "#661c28" }}
        />
        <View
          className="absolute top-[30%] left-[-50px] w-[150px] h-[150px] rounded-full opacity-10"
          style={{ backgroundColor: "#D4A843" }}
        />

        <View className="items-center flex-1 justify-center w-4/5">
          {/* Logo with enhanced styling */}
          <Animated.View
            className="items-center mb-8"
            entering={FadeIn.delay(400).duration(800)}
          >
            <View
              className="p-6 rounded-3xl"
              style={{
                backgroundColor: isDark
                  ? "rgba(139, 39, 53, 0.15)"
                  : "rgba(139, 39, 53, 0.08)",
                shadowColor: "#8B2735",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 12,
              }}
            >
              <Image
                source={require("../../assets/logos/rajarata-logo.png")}
                style={{ width: 160, height: 160 }}
                contentFit="contain"
              />
            </View>
          </Animated.View>

          {/* Title */}
          <Animated.Text
            entering={FadeInUp.delay(700).duration(600)}
            className={`font-SourceSans3Bold text-3xl text-center font-bold mb-3 ${isDark ? "text-white" : "text-slate-900"}`}
          >
            Rajarata University{"\n"}of Sri Lanka
          </Animated.Text>

          {/* Subtitle with gradient accent */}
          <Animated.View
            entering={FadeInUp.delay(900).duration(600)}
            className="items-center"
          >
            <LinearGradient
              colors={["#8B2735", "#D4A843"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="h-1 w-20 rounded-full mb-4"
            />
            <Text
              className={`font-SourceSans3Medium text-xl ${isDark ? "text-primary-300" : "text-primary-500"}`}
            >
              Career Guidance Unit
            </Text>
          </Animated.View>

          {/* Tagline */}
          <Animated.Text
            entering={FadeInUp.delay(1000).duration(600)}
            className={`font-SourceSans3Medium text-sm text-center mt-4 ${isDark ? "text-slate-400" : "text-slate-500"}`}
          >
            Your Gateway to Career Success
          </Animated.Text>
        </View>

        {/* Bottom indicator with pulse animation */}
        <Animated.View
          entering={FadeIn.delay(1200).duration(600)}
          style={[pulseStyle]}
          className="absolute bottom-16 items-center"
        >
          <View className="flex-row items-center gap-2">
            <View
              className={`w-2 h-2 rounded-full ${isDark ? "bg-primary-400" : "bg-primary-500"}`}
            />
            <Text
              className={`text-sm font-medium ${isDark ? "text-slate-400" : "text-slate-500"}`}
            >
              Tap anywhere to continue
            </Text>
            <View
              className={`w-2 h-2 rounded-full ${isDark ? "bg-primary-400" : "bg-primary-500"}`}
            />
          </View>
        </Animated.View>
      </LinearGradient>
    </Pressable>
  );
}
