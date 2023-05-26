import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import NLWLogo from "../src/assets/nlw-spacetime-logo.svg";
import { Link, useRouter } from "expo-router";
import Icon from "@expo/vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import { api } from "../src/lib/api";

// TODO Does not accept .png files
interface Memory {
  id: string;
  createdAt: Date;
  excerpt: string;
  coverUrl: string;
}

export default function Memories() {
  const router = useRouter();
  const { bottom, top } = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [memories, setMemories] = useState<Memory[]>([]);
  dayjs.locale(ptBr);

  async function signOut() {
    await SecureStore.deleteItemAsync("token");
    router.push("/");
  }

  async function loadMemories() {
    setIsLoading(true);
    const token = await SecureStore.getItemAsync("token");
    const response = await api.get("/memories", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMemories(response.data);
    setIsLoading(false);
  }
  useEffect(() => {
    loadMemories();
  }, []);

  if (isLoading) {
    return (
      <View className="flex flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#9b79ea" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="flex-row mt-4 items-center justify-between px-8">
        <NLWLogo />
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" size={16} color="#000" />
          </TouchableOpacity>
          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" size={16} color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => {
          return (
            <View key={memory.id} className="space-y-4">
              <View className="flex-row items-center gap-2">
                <View className="h-px w-5 bg-gray-50"></View>
                <Text className="font-body text-xs text-gray-100">
                  {dayjs(memory.createdAt)
                    .locale("pt-br")
                    .format("DD[ de ]MMMM[ de ]YYYY")}
                </Text>
              </View>
              <View className="space-y-4 px-8">
                <Image
                  source={{
                    uri: memory.coverUrl,
                  }}
                  className="aspect-video w-full rounded-lg"
                  alt="Memória"
                />
                <Text className="font-body text-base leading-relaxed text-gray-100">
                  {memory.excerpt}
                </Text>
                <Link href="/memories/id" asChild>
                  <TouchableOpacity className="flex-row items-center gap-2">
                    <Text className="font-body text-sm text-gray-200">
                      Ler mais
                    </Text>
                    <Icon name="arrow-right" size={16} color={"#9e9ea0"} />
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
