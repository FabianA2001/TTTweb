export const notFoundPage = (route: string): string =>
  `
  <h1>404</h1>
  <p class="lead">Die Route <strong>${route}</strong> existiert nicht.</p>
  <div class="panel">
    <p>Gehe zurück zu <a href="#/">Home</a>.</p>
  </div>
  `;
