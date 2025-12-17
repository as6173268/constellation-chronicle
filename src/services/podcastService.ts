import * as R from 'ramda';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import episodesData from '@/data/podcast/episodes.json';
import chaptersData from '@/data/podcast/chapters.json';

// Immutable data types
export interface Episode {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly duration: string;
  readonly publishedAt: string;
  readonly audioUrl?: string;
  readonly chapterId: number;
  readonly season: number;
}

export interface Chapter {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly summary: string;
  readonly dialogue?: string;
  readonly lagrangeTag: string;
  readonly axis: string;
  readonly episodeId?: number;
}

// Immutable data store
const episodes: readonly Episode[] = episodesData;
const chapters: readonly Chapter[] = chaptersData;

// Pure functions for data access
export const getEpisodes = (): readonly Episode[] => episodes;

export const getEpisodeById = (id: number): O.Option<Episode> =>
  O.fromNullable(episodes.find(ep => ep.id === id));

export const getEpisodeBySlug = (slug: string): O.Option<Episode> =>
  R.pipe(
    parseInt,
    getEpisodeById
  )(slug);

export const getChapters = (): readonly Chapter[] => chapters;

export const getChapterById = (id: number): O.Option<Chapter> =>
  O.fromNullable(chapters.find(ch => ch.id === id));

export const getChapterBySlug = (slug: string): O.Option<Chapter> =>
  O.fromNullable(chapters.find(ch => ch.slug === slug));

// Pure function for sorting episodes by date
const sortEpisodesByDate = R.sort<Episode>(
  (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
);

export const getLatestEpisodes = (count: number = 3): readonly Episode[] =>
  R.pipe(
    sortEpisodesByDate,
    R.take(count)
  )(episodes);

export const getEpisodesByChapter = (chapterId: number): readonly Episode[] =>
  A.filter<Episode>(ep => ep.chapterId === chapterId)(episodes);

export const getRelatedEpisodes = (chapter: Chapter): readonly Episode[] =>
  getEpisodesByChapter(chapter.id);

// Pure search functions using functional composition
const createSearchPredicate = (query: string) => (item: { title: string; description?: string }) => {
  const lowerQuery = query.toLowerCase();
  return item.title.toLowerCase().includes(lowerQuery) ||
         (item.description && item.description.toLowerCase().includes(lowerQuery));
};

export const searchEpisodes = (query: string): readonly Episode[] =>
  A.filter(createSearchPredicate(query))(episodes);

export const searchChapters = (query: string): readonly Chapter[] =>
  A.filter(createSearchPredicate(query))(chapters);

// Functional composition for common operations
export const getEpisodeWithChapter = (episodeId: number): O.Option<{ episode: Episode; chapter: Chapter }> =>
  R.pipe(
    getEpisodeById,
    O.chain(episode =>
      R.pipe(
        getChapterById,
        O.map(chapter => ({ episode, chapter }))
      )(episode.chapterId)
    )
  )(episodeId);

export const getEpisodesByAxis = (axis: string): readonly Episode[] =>
  R.pipe(
    A.filter<Chapter>(ch => ch.axis === axis),
    A.chain(ch => getEpisodesByChapter(ch.id))
  )(chapters);

// Curried functions for flexible composition
export const filterEpisodesBySeason = R.curry(
  (season: number, episodes: readonly Episode[]): readonly Episode[] =>
    A.filter(ep => ep.season === season)(episodes)
);

export const filterChaptersByAxis = R.curry(
  (axis: string, chapters: readonly Chapter[]): readonly Chapter[] =>
    A.filter(ch => ch.axis === axis)(chapters)
);