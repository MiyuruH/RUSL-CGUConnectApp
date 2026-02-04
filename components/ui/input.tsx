import { useColorScheme } from "@/hooks/use-color-scheme";
import { useRef, useState } from "react";
import { Pressable, Text, TextInput, TextInputProps, View } from "react-native";

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerClassName?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function Input({
  label,
  error,
  containerClassName = "",
  leftIcon,
  rightIcon,
  style,
  ...props
}: InputProps) {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<TextInput>(null);

  const getBorderColor = () => {
    if (error) return "#ef4444";
    if (isFocused) return isDark ? "#ec7a8f" : "#8B2735";
    return isDark ? "#475569" : "#e2e8f0";
  };

  const getBackgroundColor = () => {
    if (isDark) return "#2d1216";
    return isFocused ? "#ffffff" : "#fdf2f4";
  };

  const handleContainerPress = () => {
    inputRef.current?.focus();
  };

  return (
    <View style={{ marginBottom: 20 }} className={containerClassName}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: "600",
            marginBottom: 10,
            color: isDark ? "#e2e8f0" : "#334155",
          }}
        >
          {label}
        </Text>
      )}
      <Pressable
        onPress={handleContainerPress}
        style={{
          flexDirection: "row",
          alignItems: "center",
          borderRadius: 16,
          borderWidth: 2,
          borderColor: getBorderColor(),
          backgroundColor: getBackgroundColor(),
          ...(isFocused && !error
            ? {
                shadowColor: "#8B2735",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 4,
              }
            : {}),
        }}
      >
        {leftIcon && (
          <View style={{ paddingLeft: 16 }} pointerEvents="none">
            {leftIcon}
          </View>
        )}
        <TextInput
          ref={inputRef}
          style={[
            {
              flex: 1,
              paddingVertical: 16,
              paddingHorizontal: leftIcon ? 12 : 16,
              fontSize: 16,
              color: isDark ? "#ffffff" : "#0f172a",
            },
            style,
          ]}
          placeholderTextColor={isDark ? "#64748b" : "#94a3b8"}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          {...props}
        />
        {rightIcon && (
          <View style={{ paddingRight: 16 }} pointerEvents="none">
            {rightIcon}
          </View>
        )}
      </Pressable>
      {error && (
        <Text
          style={{
            color: "#ef4444",
            fontSize: 12,
            marginTop: 6,
            marginLeft: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
}
