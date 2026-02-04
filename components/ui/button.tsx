import { useColorScheme } from "@/hooks/use-color-scheme";
import { LinearGradient } from "expo-linear-gradient";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  textClassName?: string;
}

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  loading = false,
  className = "",
  textClassName = "",
}: ButtonProps) {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return {
          container: "bg-primary-500",
          text: "text-white",
          useGradient: true,
        };
      case "secondary":
        return {
          container: isDark ? "bg-slate-700" : "bg-slate-100",
          text: isDark ? "text-white" : "text-slate-900",
          useGradient: false,
        };
      case "outline":
        return {
          container: "bg-transparent border-2 border-primary-500",
          text: "text-primary-500",
          useGradient: false,
        };
      case "ghost":
        return {
          container: "bg-transparent",
          text: "text-primary-500",
          useGradient: false,
        };
      default:
        return {
          container: "bg-primary-500",
          text: "text-white",
          useGradient: true,
        };
    }
  };

  const variantClasses = getVariantClasses();

  const buttonContent = (
    <>
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#fff" : "#8B2735"} />
      ) : (
        <Text
          className={`text-base font-semibold ${variantClasses.text} ${textClassName}`}
        >
          {title}
        </Text>
      )}
    </>
  );

  // Primary button with gradient (when not disabled)
  if (variant === "primary" && !disabled) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled || loading}
        className={`overflow-hidden rounded-2xl active:opacity-90 active:scale-[0.98] ${className}`}
        style={{
          elevation: 8,
          shadowColor: "#8B2735",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
        }}
      >
        <LinearGradient
          colors={["#8B2735", "#7a222f", "#661c28"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            paddingVertical: 16,
            paddingHorizontal: 24,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 56,
          }}
        >
          {buttonContent}
        </LinearGradient>
      </Pressable>
    );
  }

  // Primary button when disabled - show solid color
  if (variant === "primary" && disabled) {
    return (
      <View className={`rounded-2xl overflow-hidden opacity-50 ${className}`}>
        <View
          style={{
            backgroundColor: "#8B2735",
            paddingVertical: 16,
            paddingHorizontal: 24,
            alignItems: "center",
            justifyContent: "center",
            minHeight: 56,
          }}
        >
          {buttonContent}
        </View>
      </View>
    );
  }

  // Other variants
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={`py-4 px-6 rounded-2xl items-center justify-center min-h-[56px] active:opacity-80 active:scale-[0.98] ${variantClasses.container} ${disabled ? "opacity-50" : ""} ${className}`}
    >
      {buttonContent}
    </Pressable>
  );
}
