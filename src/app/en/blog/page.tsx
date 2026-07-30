import type { Metadata } from "next";
import { BlogPage } from "@/components/blog-page";
import "../../design-system.css";

export const metadata: Metadata = {
  title: "Blog — MOHR & MORE",
  description: "Insights on AI, automation and entrepreneurship. Practical, well-researched, independent.",
  alternates: {
    canonical: "https://mohr-more.biz/en/blog",
    languages: {
      de: "https://mohr-more.biz/blog",
      en: "https://mohr-more.biz/en/blog",
      "x-default": "https://mohr-more.biz/blog",
    },
  },
};

export default function Page() {
  return <BlogPage />;
}
