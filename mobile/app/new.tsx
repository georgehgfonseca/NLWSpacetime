import {
  ActivityIndicator,
  Image,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import * as SecureStore from "expo-secure-store";
import { api } from "../src/lib/api";

export default function NewMemory() {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [isPublic, setIsPublic] = useState(false);
  const [content, setContent] = useState("");
  const [preview, setPreview] = useState<string | null>(null);

  async function openImagePicker() {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled && result.assets[0]) {
      setPreview(result.assets[0].uri);
    }
  }

  async function handleCreateMemory() {
    setIsLoading(true);
    const token = await SecureStore.getItemAsync("token");

    let coverUrl = "";
    console.log(preview);

    if (preview) {
      const uploadFormData = new FormData();

      uploadFormData.append("file", {
        name: preview.split("/").pop(),
        uri: preview,
        type: preview.endsWith(".mp4") ? "video/mp4" : "image/jpg",
      } as any);

      const uploadResponse = await api.post("/upload", uploadFormData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      coverUrl = uploadResponse.data.fileUrl;
    }

    await api.post(
      "/memories",
      {
        content,
        isPublic,
        coverUrl,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    router.push("/memories");
    setIsLoading(false);
  }

  if (isLoading) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#9b79ea" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 px-8"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="flex-row mt-4 items-center justify-between">
        <NLWLogo />
        <Link href="/memories" asChild>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-purple-500">
            <Icon name="arrow-left" size={16} color="#FFF" />
          </TouchableOpacity>
        </Link>
      </View>
      <View className="mt-6 space-y-6">
        <View className="flex-row items-center gap-2">
          <Switch
            value={isPublic}
            onValueChange={setIsPublic}
            thumbColor={isPublic ? "#9b79ea" : "#9E9EA0"}
            trackColor={{ false: "#767577", true: "#372560" }}
          />
          <Text className="font-body text-base text-gray-200">
            Tornar memória pública
          </Text>
        </View>
        <TouchableOpacity
          onPress={openImagePicker}
          className="h-32 justify-center items-center rounded-lg border border-dashed border-gray-500 bg-black/20"
          activeOpacity={0.7}
        >
          {preview ? (
            <Image
              source={{ uri: preview }}
              className="h-full w-full rounded-lg object-cover"
            ></Image>
          ) : (
            <View className="flex-row items-center gap-2">
              <Icon name="image" color="#9e9ea0" />
              <Text className="font-body text-sm text-gray-200">
                Adicionar foto ou vídeo de capa
              </Text>
            </View>
          )}
        </TouchableOpacity>
        <TextInput
          value={content}
          onChangeText={setContent}
          multiline
          textAlignVertical="top"
          className="p-0 font-body text-lg text-gray-50"
          placeholder="Fique livre para adicionar fotos, vídeos e relatos sobre essa experiência que você quer lembrar para sempre."
          placeholderTextColor={"#56565A"}
        ></TextInput>
        <TouchableOpacity
          onPress={handleCreateMemory}
          className="rounded-full self-end items-center bg-green-500 px-5 py-2"
          activeOpacity={0.7}
        >
          <Text className="font-alt text-sm uppercase text-black">Salvar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
