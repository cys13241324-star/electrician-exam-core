import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "전기기능사 필기 학습 | addto 온라인",
    short_name: "전기기능사",
    description:
      "CBT 모의고사·해설강의·플립카드·오디오북·시뮬레이터까지 한 곳에서.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    orientation: "portrait",
    lang: "ko",
    icons: [
      {
        src: "/addto-bi.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    categories: ["education", "productivity"],
  };
}
