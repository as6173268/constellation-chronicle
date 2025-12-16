// Browser-compatible episode loading
// Episodes are loaded from public folder via fetch

export async function getEpisodeMarkdown(slug: string): Promise<{ content: string; meta: Record<string, unknown> } | null> {
  try {
    const response = await fetch(`/episodes/${slug}.md`);
    if (!response.ok) return null;
    const content = await response.text();
    
    // Simple frontmatter parsing
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];
      const body = frontmatterMatch[2];
      const meta: Record<string, unknown> = {};
      
      frontmatter.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          meta[key.trim()] = valueParts.join(':').trim();
        }
      });
      
      return { content: body, meta };
    }
    
    return { content, meta: {} };
  } catch {
    return null;
  }
}

export async function getAllEpisodeSlugs(): Promise<string[]> {
  // In browser, we'd need an API or pre-generated list
  // For now return empty - episodes should be managed via Supabase
  return [];
}
