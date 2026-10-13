import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://petnest-guide.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/user/", "/api/", "/(auth)/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
