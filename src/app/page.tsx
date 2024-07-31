"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter()

  const handleClick = () => {
    router.push("/profile")
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <button onClick={handleClick}>
        Go To Profile
      </button>
    </main>
  );
}
