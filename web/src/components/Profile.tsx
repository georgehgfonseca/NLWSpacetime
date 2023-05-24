import { getUser } from "@/lib/auth";
import Image from "next/image";

export default function Profile() {
  const { name, avatarUrl } = getUser();

  return (
    <div className="flex items-center gap-3 text-left">
      <Image
        src={avatarUrl}
        width={40}
        height={40}
        alt="Profile picture"
        className="rounded-full h-10 w-10"
      ></Image>
      <p className="text-sm leading-snug max-w-[140px]">
        {name}
        <a
          href="/api/auth/logout"
          className="block text-red-400 hover:text-red-300"
        >
          Quero sair
        </a>
      </p>
    </div>
  );
}
