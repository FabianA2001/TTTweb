import "./nevbar.css";

export function renderNavbar(): string {
  return `
	<header class="navbar">
		<div class="navbar__inner">
			<a class="navbar__link" href="#/" data-route-link>Home</a>
			<nav class="navbar__link" aria-label="Hauptnavigation">
				<a href="#/tictactoe" data-route-link>Tic Tac Toe</a>
				<a href="#/api" data-route-link>API</a>
				<a href="#/ttt-monitor" data-route-link>TTT Monitor</a>
			</nav>
		</div>
	</header>
  `;
}
