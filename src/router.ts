import { ticTacToe } from "./pages/tictactoe";
import { apiPage } from "./pages/apiPage";
import { homePage } from "./pages/home";
import { notFoundPage } from "./pages/notFound";
import { renderNavbar } from "./components/nevbar/nevbar";

export const renderPage = (route: string) => {
  const page = (() => {
  switch (route) {
    case "/":
      return homePage();
    case "/tictactoe":
      return ticTacToe();
    case "/api":
      return apiPage();
    default:
      return notFoundPage(route);
  }
  })();

  return `
    ${renderNavbar()}
    <main class="page-shell">
      ${page}
    </main>
  `;
};
const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App container not found");
}

const normalizeHash = (hash: string) => {
  const value = hash.replace(/^#/, "").trim();

  return value === "" ? "/" : value.startsWith("/") ? value : `/${value}`;
};

const getCurrentRoute = (): string => normalizeHash(window.location.hash);

const navigate = () => {
  const route = getCurrentRoute();

  app.innerHTML = renderPage(route);

  const links = app.querySelectorAll<HTMLAnchorElement>("[data-route-link]");
  links.forEach((link) => {
    const isActive = normalizeHash(link.hash) === route;

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
};

export const startRouter = () => {
  window.addEventListener("hashchange", navigate);

  if (!window.location.hash) {
    window.location.hash = "#/";
    return;
  }

  navigate();
};
