import { useCallback, useEffect, useMemo, useState } from "react";

import { useApiClient } from "@/hooks/useApiClient";
import type { IPost } from "@/interfaces/IPost";
import type { IPostFilters } from "@/interfaces/IPostFilters";
import type { IPostDiscipline } from "@/interfaces/IPostsService";
import {
  getPostDisciplines,
  getPosts,
  searchPosts,
} from "@/services/postsService";

import {
  emptyPostFilters,
  filterPosts,
  isPublishedPost,
  sortPosts,
} from "@/utils/postUtils";

export function usePostDiscovery() {
  const { request } = useApiClient();
  const [posts, setPosts] = useState<IPost[]>([]);
  const [disciplines, setDisciplines] = useState<IPostDiscipline[]>([]);
  const [disciplinesLoading, setDisciplinesLoading] = useState(true);
  const [disciplinesError, setDisciplinesError] = useState(false);
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<IPostFilters>(emptyPostFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [searchResults, setSearchResults] = useState<IPost[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [revision, setRevision] = useState(0);
  const [disciplinesRevision, setDisciplinesRevision] = useState(0);
  const [searchRevision, setSearchRevision] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(query.trim()), 350);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(false);

    async function loadPosts() {
      try {
        const postResponse = await getPosts(request, controller.signal);
        if (controller.signal.aborted) return;

        setPosts(sortPosts(postResponse.filter(isPublishedPost)));
      } catch {
        if (!controller.signal.aborted) setError(true);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadPosts();
    return () => controller.abort();
  }, [request, revision]);

  useEffect(() => {
    const controller = new AbortController();
    setDisciplinesLoading(true);
    setDisciplinesError(false);

    async function loadDisciplines() {
      try {
        const response = await getPostDisciplines(request, controller.signal);
        if (!controller.signal.aborted) setDisciplines(response);
      } catch {
        if (!controller.signal.aborted) setDisciplinesError(true);
      } finally {
        if (!controller.signal.aborted) setDisciplinesLoading(false);
      }
    }

    void loadDisciplines();
    return () => controller.abort();
  }, [request, disciplinesRevision]);

  const hasServerFilters = !!(
    searchQuery ||
    filters.discipline ||
    filters.author
  );

  useEffect(() => {
    const controller = new AbortController();
    setSearchError(false);

    if (!hasServerFilters || loading || error) {
      setSearching(false);
      return () => controller.abort();
    }

    setSearching(true);

    async function loadResults() {
      try {
        const response = await searchPosts(
          request,
          {
            query: searchQuery,
            discipline: filters.discipline,
            author: filters.author,
          },
          controller.signal,
        );
        if (!controller.signal.aborted) setSearchResults(sortPosts(response));
      } catch {
        if (!controller.signal.aborted) setSearchError(true);
      } finally {
        if (!controller.signal.aborted) setSearching(false);
      }
    }

    void loadResults();
    return () => controller.abort();
  }, [
    request,
    searchQuery,
    filters.discipline,
    filters.author,
    hasServerFilters,
    loading,
    error,
    revision,
    searchRevision,
  ]);

  const results = useMemo(
    () => filterPosts(hasServerFilters ? searchResults : posts, filters),
    [hasServerFilters, searchResults, posts, filters],
  );

  const featured = useMemo(
    () => posts.filter((post) => post.isFeatured),
    [posts],
  );
  const activeFilterCount = Object.values(filters).filter(Boolean).length;
  const hasCriteria = !!query.trim() || activeFilterCount > 0;
  const pendingSearch = query.trim() !== searchQuery;

  const clearFilters = useCallback(() => {
    setQuery("");
    setSearchQuery("");
    setFilters(emptyPostFilters);
  }, []);

  return {
    posts,
    disciplines,
    disciplinesLoading,
    disciplinesError,
    query,
    setQuery,
    filters,
    setFilters,
    results,
    featured,
    loading,
    error,
    searching: searching || pendingSearch,
    searchError,
    activeFilterCount,
    hasCriteria,
    clearFilters,
    reload: () => setRevision((value) => value + 1),
    retryDisciplines: () => setDisciplinesRevision((value) => value + 1),
    retrySearch: () => setSearchRevision((value) => value + 1),
  };
}
