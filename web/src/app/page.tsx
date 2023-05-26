import EmptyMemories from "@/components/EmptyMemories";
import { api } from "@/lib/api";
import { cookies } from "next/headers";
import dayjs from "dayjs";
import ptBr from "dayjs/locale/pt-br";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

interface Memory {
  id: string;
  createdAt: Date;
  excerpt: string;
  coverUrl: string;
}

export default async function Home() {
  const isAuthenticated = cookies().has("token");
  dayjs.locale(ptBr);

  if (!isAuthenticated) {
    return <EmptyMemories />;
  }

  const token = cookies().get("token");
  const response = await api.get("/memories", {
    headers: { Authorization: `Bearer ${token?.value}` },
  });

  const memories: Memory[] = response.data;

  if (memories.length === 0) {
    return <EmptyMemories />;
  }

  return (
    <div className="flex flex-col gap-10 p-8">
      {memories.map((memory) => {
        return (
          <div key={memory.id} className="space-y-4">
            <time className="flex items-center gap-2 text-sm text-gray-100 -ml-8 before:h-px before:w-5 before:bg-gray-50">
              {dayjs(memory.createdAt)
                .locale("pt-br")
                .format("DD[ de ]MMMM[, ]YYYY")}
            </time>
            <Image
              src={memory.coverUrl}
              alt=""
              width={592}
              height={280}
              className="aspect-video w-full rounded-lg object-cover"
            />
            <p className="text-lg leading-relaxed text-gray-100">
              {memory.excerpt}
            </p>
            <Link
              className="flex items-center gap-2 text-sm text-gray-200 hover:text-gray-100"
              href={`/memories/${memory.id}`}
            >
              Ler mais <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        );
      })}
    </div>
  );
}
