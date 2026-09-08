import { ticTacToe } from "./pages/tictactoe";
import { apiPage } from "./pages/apiPage";
import { homePage } from "./pages/home";
import { notFoundPage } from "./pages/notFound";
import { renderNavbar } from "./components/nevbar/nevbar";
import type { Page, PageContext } from "./pages/page.ts";

const pages: Record<string, Page> = {
  "/": homePage,
  "/tictactoe": ticTacToe,
  "/api": apiPage,
};
function getCurrentPage(route: string): Page {
  return pages[route] ?? notFoundPage;
}

function getApp(): HTMLDivElement {
  const app = document.querySelector<HTMLDivElement>("#app");
  if (!app) {
    throw new Error("App container not found");
  }
  return app;
}

function getCurrentRoute(): string {
  return normalizeHash(window.location.hash);
}

function normalizeHash(hash: string) {
  const value = hash.replace(/^#/, "").trim();

  return value === "" ? "/" : value.startsWith("/") ? value : `/${value}`;
}

function updateActiveLinks() {
  const links =
    getApp().querySelectorAll<HTMLAnchorElement>("[data-route-link]");

  links.forEach((link) => {
    const isActive = normalizeHash(link.hash) === getCurrentRoute();

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

export function renderPage() {
  const currentRoute = getCurrentRoute();
  const page = getCurrentPage(currentRoute);
  const context: PageContext = {
    route: currentRoute,
    root: getApp(),
    refresh: renderPage,
  };

  getApp().innerHTML = `
    ${renderNavbar()}
    <main class="page-shell">
      ${page.render(context)}
    </main>
  `;
  updateActiveLinks();

  page.mount?.(context);
}

export function startRouter() {
  window.addEventListener("hashchange", renderPage);

  if (!window.location.hash) {
    window.location.hash = "#/";
    return;
  }

  renderPage();
}
