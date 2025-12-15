import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

interface EpisodeMarkdownProps {
  slug: string;
}

export function EpisodeMarkdown({ slug }: EpisodeMarkdownProps) {
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    fetch(`/src/data/episodes/${slug}.md`)
      .then((res) => res.text())
      .then(setContent);
  }, [slug]);

  if (!content) return <div>Cargando episodio...</div>;

  return (
    <article className="prose prose-lg max-w-3xl mx-auto">
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
