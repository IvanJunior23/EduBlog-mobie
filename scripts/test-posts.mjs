import assert from "node:assert/strict";
import { test } from "node:test";

import {
  emptyPostFilters,
  filterPosts,
  getFilterOptions,
  isPublishedPost,
  sortPosts,
} from "../src/utils/postUtils.ts";
import {
  getAllPosts,
  getPostById,
  getPostDisciplines,
  getPosts,
  searchPosts,
} from "../src/services/postsService.ts";

const published = {
  _id: "0123456789abcdef01234567",
  title: "Equações do segundo grau",
  summary: "Uma introdução às equações.",
  content: "Conteúdo da aula.",
  discipline: { label: "Matemática" },
  author: { name: "Ana" },
  status: { label: "Publicado" },
  series: "1º ano",
  semester: "1",
  isFeatured: true,
  createDate: "2026-10-01T12:00:00Z",
};

test("discovery excludes drafts, archived posts and missing publication status", () => {
  const posts = [
    published,
    { ...published, status: { label: "Rascunho" }, isFeatured: true },
    { ...published, status: { label: "Arquivado" } },
    { ...published, status: null },
  ];
  assert.deepEqual(filterPosts(posts, emptyPostFilters), [published]);
  assert.equal(
    isPublishedPost({ ...published, status: { label: " PUBLICADO " } }),
    true,
  );
});

test("discipline, author, series and semester combine without unrelated results", () => {
  const posts = [
    published,
    { ...published, series: "2º ano" },
    { ...published, semester: "2" },
    { ...published, author: { name: "Bruno" } },
    { ...published, discipline: { label: "História" } },
  ];
  const filters = {
    discipline: "Matemática",
    author: "Ana",
    series: "1º ano",
    semester: "1",
  };
  assert.deepEqual(filterPosts(posts, filters), [published]);
  assert.deepEqual(filterPosts(posts, { ...filters, semester: "3" }), []);
  assert.equal(filterPosts(posts, emptyPostFilters).length, posts.length);
});

test("optional metadata does not prevent reading and filter options sort numerically", () => {
  const post = { ...published, series: null, semester: undefined };
  assert.deepEqual(filterPosts([post], emptyPostFilters), [post]);
  assert.deepEqual(
    getFilterOptions([
      null,
      "",
      undefined,
      "2º ano",
      "10º ano",
      "2º ano",
      "1º ano",
    ]),
    ["1º ano", "2º ano", "10º ano"],
  );
});

test("newest posts appear first without mutating the original catalog", () => {
  const recent = { ...published, createDate: "2026-10-02T12:00:00Z" };
  const posts = [published, recent];
  assert.deepEqual(sortPosts(posts), [recent, published]);
  assert.deepEqual(posts, [published, recent]);
});

test("listing uses the query endpoint and propagates cancellation", async () => {
  const controller = new AbortController();
  const result = await getPosts(async (path, options) => {
    assert.equal(path, "/posts");
    assert.equal(options.method, "GET");
    assert.equal(options.signal, controller.signal);
    return { data: [published] };
  }, controller.signal);
  assert.deepEqual(result, [published]);
});

test("search encodes query and catalog values and preserves the server contract", async () => {
  const controller = new AbortController();
  const result = await searchPosts(
    async (path, options) => {
      const url = new URL(path, "https://example.test");
      assert.equal(url.pathname, "/posts/search");
      assert.equal(url.searchParams.get("q"), "células & DNA");
      assert.equal(url.searchParams.get("discipline"), "Biologia");
      assert.equal(url.searchParams.get("author"), "Ana & Bruno");
      assert.equal(options.signal, controller.signal);
      return { data: [] };
    },
    {
      query: "  células & DNA  ",
      discipline: "Biologia",
      author: "Ana & Bruno",
    },
    controller.signal,
  );
  assert.deepEqual(result, []);
});

test("clearing search returns to listing and failures remain errors for retry", async () => {
  await searchPosts(
    async (path) => {
      assert.equal(path, "/posts");
      return { data: [published] };
    },
    { query: "   " },
  );
  const failure = new Error("Network unavailable");
  await assert.rejects(
    searchPosts(
      async () => {
        throw failure;
      },
      { query: "equações" },
    ),
    failure,
  );
  await assert.rejects(
    getPostById(async () => {
      throw failure;
    }, published._id),
    failure,
  );
});

test("reading loads the requested post and unwraps the response", async () => {
  assert.equal(
    await getPostById(async (path) => {
      assert.equal(path, `/posts/${published._id}`);
      return { data: published };
    }, published._id),
    published,
  );
});

test("discipline navigation includes active disciplines even when they have no posts", async () => {
  const disciplines = [
    { _id: "2", label: "História", order: 2, isActive: true },
    { _id: "0", label: "Inativa", order: 0, isActive: false },
    { _id: "1", label: "Matemática", order: 1, isActive: true },
  ];
  const result = await getPostDisciplines(async (path) => {
    assert.equal(path, "/catalog/disciplines");
    return { data: disciplines };
  });
  assert.deepEqual(
    result.map((item) => item.label),
    ["Matemática", "História"],
  );
  assert.equal(disciplines.length, 3);
});

test("the existing professor listing remains available with its original endpoint", async () => {
  await getAllPosts(async (path, options) => {
    assert.equal(path, "/posts/all");
    assert.equal(options.method, "GET");
    return { data: [] };
  });
});
