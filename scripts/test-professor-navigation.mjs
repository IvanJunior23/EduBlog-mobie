import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import * as React from "react";
import * as jsxRuntime from "react/jsx-runtime";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

function loadSource(relativePath, imports = {}) {
  const source = readFileSync(
    new URL(`../${relativePath}`, import.meta.url),
    "utf8",
  );
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      jsx: ts.JsxEmit.ReactJSX,
    },
  });
  const output = {};
  const dependencies = {
    react: React,
    "react/jsx-runtime": jsxRuntime,
    ...imports,
  };
  new Function("require", "exports", outputText)((name) => {
    assert.ok(Object.hasOwn(dependencies, name), `Unexpected import: ${name}`);
    return dependencies[name];
  }, output);
  return output;
}

const noop = () => null;
const host =
  (tag) =>
  ({ children }) =>
    React.createElement(tag, null, children);
const native = {
  View: host("div"),
  Text: host("span"),
  Pressable: host("button"),
  ScrollView: host("div"),
  FlatList: noop,
  TextInput: noop,
  StyleSheet: { create: (styles) => styles },
};
const Stack = ({ children }) => children;
Stack.Screen = function StackScreen() {
  return null;
};
Stack.Protected = function StackProtected() {
  return null;
};
const utils = loadSource("src/utils/postUtils.ts");
const userWithRole = (role) => (role ? { role, name: "Ana" } : null);

function homeMarkup(role) {
  const { default: HomeScreen } = loadSource(
    "src/features/posts/screens/HomeScreen.tsx",
    {
      "@/context/AuthContext": {
        useAuth: () => ({ user: userWithRole(role), logout: noop }),
      },
      "@expo/vector-icons": { Ionicons: noop },
      "expo-router": {
        Link: ({ href, children }) =>
          React.createElement("a", { href }, children),
      },
      "react-native": native,
      "react-native-safe-area-context": { SafeAreaView: native.View },
      "@/utils/postUtils": utils,
      "../components/FeaturedCarousel": { default: noop },
      "../components/PostCard": { default: noop },
      "../components/PostFilterChips": { default: noop },
      "../components/PostsFeedback": { default: noop },
      "../usePostDiscovery": {
        usePostDiscovery: () => ({
          posts: [],
          results: [],
          filters: utils.emptyPostFilters,
          query: "",
          disciplines: [],
          featured: [],
          loading: false,
          error: false,
          searching: false,
          searchError: false,
          hasCriteria: false,
          activeFilterCount: 0,
          setQuery: noop,
          clearFilters: noop,
        }),
      },
    },
  );
  return renderToStaticMarkup(React.createElement(HomeScreen));
}

for (const role of ["PROFESSOR", "ALUNO", null]) {
  test(`Home shows the professor entry only to professors: ${role}`, () => {
    const markup = homeMarkup(role);
    assert.equal(
      markup.includes('href="/professor/dashboard"'),
      role === "PROFESSOR",
    );
    assert.ok(markup.includes("Perfil"));
    assert.ok(markup.includes("Sair"));
  });

  test(`the professor route group has a matching access guard: ${role}`, () => {
    const { default: AppLayout } = loadSource("src/app/(app)/_layout.tsx", {
      "expo-router": { Stack },
      "@/context/AuthContext": {
        useAuth: () => ({ user: userWithRole(role) }),
      },
    });
    const children = React.Children.toArray(AppLayout().props.children);
    const protectedGroup = children.find(
      (child) => child.type === Stack.Protected,
    );
    assert.equal(protectedGroup.props.guard, role === "PROFESSOR");
    assert.equal(protectedGroup.props.children.props.name, "professor");
    assert.ok(
      children.some(
        (child) => child.type === Stack.Screen && child.props.name === "index",
      ),
    );
  });
}

test("the professor entry redirects to the canonical dashboard route", () => {
  const Redirect = noop;
  const { default: ProfessorRoute } = loadSource(
    "src/app/(app)/professor/index.tsx",
    {
      "expo-router": { Redirect },
    },
  );
  const target = ProfessorRoute();
  assert.equal(target.type, Redirect);
  assert.equal(target.props.href, "/professor/dashboard");
});

function findElement(node, type) {
  if (!React.isValidElement(node)) return undefined;
  if (node.type === type) return node;
  for (const child of React.Children.toArray(node.props.children)) {
    const match = findElement(child, type);
    if (match) return match;
  }
}

for (const canGoBack of [true, false]) {
  test(`the dashboard returns to content with a safe direct-link fallback: ${canGoBack}`, () => {
    const calls = [];
    const router = {
      canGoBack: () => canGoBack,
      back: () => calls.push("back"),
      replace: (href) => calls.push(href),
    };
    const { default: Dashboard } = loadSource(
      "src/features/professor/screens/ProfessorDashboardScreen.tsx",
      {
        "@/context/AuthContext": {
          useAuth: () => ({ user: userWithRole("PROFESSOR") }),
        },
        "@expo/vector-icons": { Ionicons: noop },
        "expo-router": { Stack, useRouter: () => router },
        "react-native": native,
        "react-native-safe-area-context": { SafeAreaView: native.View },
      },
    );
    const screen = Dashboard();
    const markup = renderToStaticMarkup(screen);
    assert.ok(markup.includes("Painel do Professor"));
    assert.ok(markup.includes("Ana"));
    const backButton = findElement(screen, native.Pressable);
    backButton.props.onPress();
    assert.deepEqual(calls, [canGoBack ? "back" : "/"]);
  });
}
