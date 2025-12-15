import fs from "fs";
import path from "path";
import matter from "gray-matter";

export function getEpisodeMarkdown(slug: string) {
  const episodesDir = path.join(process.cwd(), "src", "data", "episodes");
  const filePath = path.join(episodesDir, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { content, data } = matter(fileContent);
  return { content, meta: data };
}

export function getAllEpisodeSlugs() {
  const episodesDir = path.join(process.cwd(), "src", "data", "episodes");
  return fs.readdirSync(episodesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
}
