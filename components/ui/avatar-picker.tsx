import { useColorScheme } from "@/hooks/use-color-scheme";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { Camera } from "lucide-react-native";
import { Pressable, View } from "react-native";

interface AvatarPickerProps {
  uri: string | null;
  onImageSelected: (uri: string) => void;
  size?: number;
  className?: string;
}

export function AvatarPicker({
  uri,
  onImageSelected,
  size = 120,
  className = "",
}: AvatarPickerProps) {
  const colorScheme = useColorScheme() ?? "light";
  const isDark = colorScheme === "dark";

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      onImageSelected(result.assets[0].uri);
    }
  };

  return (
    <Pressable
      onPress={pickImage}
      className={`items-center justify-center overflow-hidden active:opacity-80 ${
        isDark ? "bg-gray-700" : "bg-gray-200"
      } ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 3,
        borderColor: "#8B2735",
      }}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            position: "absolute",
          }}
          contentFit="cover"
        />
      ) : (
        <View className="items-center justify-center">
          <Camera size={size * 0.35} color={isDark ? "#9ca3af" : "#6b7280"} />
        </View>
      )}
      <View
        className="absolute bottom-1 right-1 w-8 h-8 rounded-full items-center justify-center"
        style={{ backgroundColor: "#8B2735" }}
      >
        <Camera size={16} color="#fff" />
      </View>
    </Pressable>
  );
}
