import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FormatHub from "@/components/audiobook/FormatHub";
import { AUDIOBOOK_FORMATS, FORMAT_META } from "@/lib/audiobook/types";
import type { Format } from "@/lib/audiobook/types";

export async function generateStaticParams() {
  return AUDIOBOOK_FORMATS.map((format) => ({ format }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ format: string }>;
}): Promise<Metadata> {
  const { format } = await params;
  if (!AUDIOBOOK_FORMATS.includes(format as Format)) {
    return { title: "오디오북" };
  }
  const meta = FORMAT_META[format as Format];
  return {
    title: `${meta.label} · 오디오북`,
    description: meta.description,
  };
}

export default async function FormatPage({
  params,
}: {
  params: Promise<{ format: string }>;
}) {
  const { format } = await params;
  if (!AUDIOBOOK_FORMATS.includes(format as Format)) notFound();
  return (
    <div className="min-h-screen bg-zinc-50">
      <Header />
      <FormatHub format={format as Format} />
      <Footer />
    </div>
  );
}
