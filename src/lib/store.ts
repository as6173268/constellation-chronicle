import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import * as O from 'fp-ts/Option';
import * as A from 'fp-ts/Array';
import { pipe } from 'fp-ts/function';
import { Episode, Chapter, LagrangeNode } from '@/utils/types';

// Immutable state types
interface AppState {
  readonly ui: {
    readonly sidebarOpen: boolean;
    readonly theme: 'light' | 'dark';
    readonly loadingStates: Record<string, boolean>;
  };
  readonly data: {
    readonly episodes: readonly Episode[];
    readonly chapters: readonly Chapter[];
    readonly lagrangeNodes: readonly LagrangeNode[];
    readonly searchQuery: string;
    readonly selectedFilters: readonly string[];
  };
  readonly user: {
    readonly preferences: Record<string, any>;
    readonly recentActivity: readonly string[];
  };
}

// Functional actions
interface AppActions {
  // UI actions
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  setLoading: (key: string, loading: boolean) => void;

  // Data actions
  setEpisodes: (episodes: readonly Episode[]) => void;
  setChapters: (chapters: readonly Chapter[]) => void;
  setLagrangeNodes: (nodes: readonly LagrangeNode[]) => void;
  setSearchQuery: (query: string) => void;
  addFilter: (filter: string) => void;
  removeFilter: (filter: string) => void;
  clearFilters: () => void;

  // User actions
  updatePreference: (key: string, value: any) => void;
  addRecentActivity: (activity: string) => void;
  clearRecentActivity: () => void;

  // Functional selectors
  getFilteredEpisodes: () => readonly Episode[];
  getFilteredChapters: () => readonly Chapter[];
  getFilteredNodes: () => readonly LagrangeNode[];
}

// Functional selectors
const createSelectors = (state: AppState) => ({
  getFilteredEpisodes: (): readonly Episode[] => {
    const { episodes, searchQuery, selectedFilters } = state.data;

    return pipe(
      episodes,
      A.filter(episode => {
        const matchesSearch = !searchQuery ||
          episode.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          episode.description.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilters = selectedFilters.length === 0 ||
          selectedFilters.some(filter => episode.chapterId.toString() === filter);

        return matchesSearch && matchesFilters;
      })
    );
  },

  getFilteredChapters: (): readonly Chapter[] => {
    const { chapters, searchQuery, selectedFilters } = state.data;

    return pipe(
      chapters,
      A.filter(chapter => {
        const matchesSearch = !searchQuery ||
          chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          chapter.summary.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilters = selectedFilters.length === 0 ||
          selectedFilters.some(filter => chapter.axis === filter);

        return matchesSearch && matchesFilters;
      })
    );
  },

  getFilteredNodes: (): readonly LagrangeNode[] => {
    const { lagrangeNodes, searchQuery, selectedFilters } = state.data;

    return pipe(
      lagrangeNodes,
      A.filter(node => {
        const matchesSearch = !searchQuery ||
          node.texto.toLowerCase().includes(searchQuery.toLowerCase()) ||
          node.eje.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesFilters = selectedFilters.length === 0 ||
          selectedFilters.some(filter => node.eje === filter);

        return matchesSearch && matchesFilters;
      })
    );
  }
});

// Initial state
const initialState: AppState = {
  ui: {
    sidebarOpen: false,
    theme: 'light',
    loadingStates: {}
  },
  data: {
    episodes: [],
    chapters: [],
    lagrangeNodes: [],
    searchQuery: '',
    selectedFilters: []
  },
  user: {
    preferences: {},
    recentActivity: []
  }
};

// Create functional store
export const useAppStore = create<AppState & AppActions>()(
  immer((set, get) => ({
    ...initialState,

    // UI actions
    toggleSidebar: () =>
      set(state => {
        state.ui.sidebarOpen = !state.ui.sidebarOpen;
      }),

    setTheme: (theme) =>
      set(state => {
        state.ui.theme = theme;
      }),

    setLoading: (key, loading) =>
      set(state => {
        state.ui.loadingStates[key] = loading;
      }),

    // Data actions
    setEpisodes: (episodes) =>
      set(state => {
        state.data.episodes = episodes;
      }),

    setChapters: (chapters) =>
      set(state => {
        state.data.chapters = chapters;
      }),

    setLagrangeNodes: (nodes) =>
      set(state => {
        state.data.lagrangeNodes = nodes;
      }),

    setSearchQuery: (query) =>
      set(state => {
        state.data.searchQuery = query;
      }),

    addFilter: (filter) =>
      set(state => {
        if (!state.data.selectedFilters.includes(filter)) {
          state.data.selectedFilters = [...state.data.selectedFilters, filter];
        }
      }),

    removeFilter: (filter) =>
      set(state => {
        state.data.selectedFilters = state.data.selectedFilters.filter(f => f !== filter);
      }),

    clearFilters: () =>
      set(state => {
        state.data.selectedFilters = [];
      }),

    // User actions
    updatePreference: (key, value) =>
      set(state => {
        state.user.preferences[key] = value;
      }),

    addRecentActivity: (activity) =>
      set(state => {
        state.user.recentActivity = [activity, ...state.user.recentActivity.slice(0, 9)]; // Keep last 10
      }),

    clearRecentActivity: () =>
      set(state => {
        state.user.recentActivity = [];
      }),

    // Functional selectors
    ...createSelectors(get() as AppState)
  }))
);

// Functional hooks for common operations
export const useEpisodes = () => useAppStore(state => state.data.episodes);
export const useChapters = () => useAppStore(state => state.data.chapters);
export const useLagrangeNodes = () => useAppStore(state => state.data.lagrangeNodes);
export const useSearchQuery = () => useAppStore(state => state.data.searchQuery);
export const useSelectedFilters = () => useAppStore(state => state.data.selectedFilters);
export const useFilteredEpisodes = () => useAppStore(state => state.getFilteredEpisodes());
export const useFilteredChapters = () => useAppStore(state => state.getFilteredChapters());
export const useFilteredNodes = () => useAppStore(state => state.getFilteredNodes());
export const useTheme = () => useAppStore(state => state.ui.theme);
export const useSidebarOpen = () => useAppStore(state => state.ui.sidebarOpen);
export const useLoadingState = (key: string) => useAppStore(state => state.ui.loadingStates[key]);
export const useUserPreferences = () => useAppStore(state => state.user.preferences);
export const useRecentActivity = () => useAppStore(state => state.user.recentActivity);