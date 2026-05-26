import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AudiobookHub from "@/components/audiobook/AudiobookHub";

export const metadata: Metadata = {
  title: "오디오북",
  description:
    "전기기능사 이론을 귀로 듣는 오디오북. 전기이론·전기기기·전기설비 22개 챕터, 챕터당 20분 내외.",
};

export default function AudiobookPage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <AudiobookHub />
      <Footer />
    </div>
  );
}
