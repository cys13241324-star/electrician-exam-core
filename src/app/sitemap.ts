import type { MetadataRoute } from "next";
import { simulators } from "@/lib/simulators";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://electrician-simulator.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    { path: "", priority: 1.0 },
    { path: "/cbt", priority: 0.9 },
    { path: "/flashcards", priority: 0.9 },
    { path: "/simulator", priority: 0.8 },
    { path: "/cbt/exams", priority: 0.7 },
    { path: "/cbt/study", priority: 0.7 },
    { path: "/cbt/wrong-notes", priority: 0.7 },
  ].map(({ path, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority,
  }));

  const simRoutes = simulators
    .filter((s) => s.status === "available")
    .map((s) => ({
      url: `${SITE_URL}/simulator/${s.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    }));

  return [...staticRoutes, ...simRoutes];
}
