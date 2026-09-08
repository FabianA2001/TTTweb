import type { Page } from "./page.ts";

export const homePage: Page = {
  render: () =>
    `
<h1>Home</h1>
<p>Nutze die Navigation oben, um zu den anderen Seiten zu wechseln.</p>
`,
};
