import sys

import requests

BASE_URL = "http://localhost:3000/api/ttt"


def print_board(game):
    """Zeigt das Spielfeld schön in der Konsole an."""

    size = game["size"]
    board = game["board"]

    symbols = {
        0: " ",
        1: "X",  # Kreuz
        2: "O",  # Kreis
    }

    print()

    # Spaltennummern
    print("    " + "   ".join(str(i + 1) for i in range(size)))
    print("  " + "---+" * (size - 1) + "---")

    for row in range(size):
        cells = []

        for col in range(size):
            value = board[row * size + col]
            cells.append(symbols.get(value, "?"))

        print(f"{row + 1} " + " | ".join(f" {cell} " for cell in cells))

        if row < size - 1:
            print("  " + "---+" * (size - 1) + "---")

    print()


def get_game(game_id):
    """Holt den aktuellen Spielstand von der API."""

    response = requests.get(f"{BASE_URL}/game/{game_id}", timeout=5)

    if response.status_code != 200:
        print(f"Fehler beim Abrufen des Spiels: {response.status_code}")
        print(response.text)
        return None

    return response.json()


def create_game():
    """Erstellt ein neues Spiel."""

    response = requests.post(f"{BASE_URL}/create-game", timeout=5)

    if response.status_code != 200:
        print(f"Fehler beim Erstellen des Spiels: {response.status_code}")
        print(response.text)
        return None

    data = response.json()
    return data["id"]


def delete_game(game_id):
    """Löscht ein Spiel anhand der Game-ID."""

    response = requests.delete(f"{BASE_URL}/game/{game_id}", timeout=5)
    print(f"Spiel {game_id} gelöscht.")

    if response.status_code != 200:
        print(f"Fehler beim Löschen des Spiels: {response.status_code}")
        print(response.text)
        return False

    return True


def make_player_move(game_id, row, col):
    """Schickt den Zug des Spielers an die API."""

    response = requests.post(
        f"{BASE_URL}/game/{game_id}/move/1", json={"row": row, "col": col}, timeout=5
    )

    if response.status_code == 200:
        return response.json()

    if response.status_code == 400:
        print("❌ Ungültiger Zug.")
        return None

    if response.status_code == 409:
        print("❌ Du bist nicht am Zug.")
        return None

    if response.status_code == 404:
        print("❌ Spiel wurde nicht gefunden.")
        return None

    print(f"❌ API-Fehler: {response.status_code}")
    print(response.text)

    return None


def make_ai_move(game_id):
    """Lässt die API den nächsten Zug berechnen."""

    response = requests.post(f"{BASE_URL}/game/{game_id}/ai-move", timeout=5)

    if response.status_code != 200:
        print(f"❌ Fehler beim KI-Zug: {response.status_code}")
        print(response.text)
        return None

    return response.json()


def is_game_over(game):
    """
    Erkennt, ob das Spiel beendet ist.

    Die eigentliche Spiellogik liegt in deiner API.
    Hier prüfen wir nur, ob das Board voll ist.

    Falls deine Game-Klasse einen eindeutigen Gewinner
    zurückgibt, kann man diese Funktion entsprechend erweitern.
    """

    return all(cell != 0 for cell in game["board"])


def print_result(game):
    """Zeigt das Ergebnis anhand des Spielfeldes an."""

    board = game["board"]
    size = game["size"]

    # Reihen prüfen
    for row in range(size):
        cells = [board[row * size + col] for col in range(size)]

        if cells[0] != 0 and all(cell == cells[0] for cell in cells):
            if cells[0] == 1:
                print("🎉 Du hast gewonnen!")
            else:
                print("🤖 Die KI hat gewonnen!")
            return True

    # Spalten prüfen
    for col in range(size):
        cells = [board[row * size + col] for row in range(size)]

        if cells[0] != 0 and all(cell == cells[0] for cell in cells):
            if cells[0] == 1:
                print("🎉 Du hast gewonnen!")
            else:
                print("🤖 Die KI hat gewonnen!")
            return True

    # Hauptdiagonale
    cells = [board[i * size + i] for i in range(size)]

    if cells[0] != 0 and all(cell == cells[0] for cell in cells):
        if cells[0] == 1:
            print("🎉 Du hast gewonnen!")
        else:
            print("🤖 Die KI hat gewonnen!")
        return True

    # Nebendiagonale
    cells = [board[i * size + (size - 1 - i)] for i in range(size)]

    if cells[0] != 0 and all(cell == cells[0] for cell in cells):
        if cells[0] == 1:
            print("🎉 Du hast gewonnen!")
        else:
            print("🤖 Die KI hat gewonnen!")
        return True

    # Unentschieden
    if is_game_over(game):
        print("🤝 Unentschieden!")
        return True

    return False


def ask_move(game):
    """Fragt den Spieler nach seinem Zug."""

    size = game["size"]

    while True:
        try:
            value = input("Dein Zug (Zeile Spalte, z.B. 1 3): ").strip()

            if value.lower() in ("q", "quit", "exit"):
                print("Spiel beendet.")
                sys.exit(0)

            parts = value.split()

            if len(parts) != 2:
                print("Bitte zwei Zahlen eingeben, z.B. '1 3'.")
                continue

            row = int(parts[0])
            col = int(parts[1])

            if not (1 <= row <= size and 1 <= col <= size):
                print(f"Zeile und Spalte müssen zwischen 1 und {size} liegen.")
                continue

            # API verwendet 0-basierte Koordinaten
            return row - 1, col - 1

        except ValueError:
            print("Bitte gültige Zahlen eingeben.")


def main():
    print("=" * 40)
    print("       Tic-Tac-Toe")
    print("       Du: X")
    print("       KI: O")
    print("=" * 40)

    # --------------------------------------------------
    # Spiel erstellen
    # --------------------------------------------------

    print("\nErstelle neues Spiel...")

    game_id = create_game()

    if game_id is None:
        print("Spiel konnte nicht erstellt werden.")
        sys.exit(1)

    print("Spiel erstellt!")
    print(f"Game ID: {game_id}")

    # --------------------------------------------------
    # Spiel laden
    # --------------------------------------------------

    game = get_game(game_id)

    if game is None:
        sys.exit(1)

    print_board(game)

    # --------------------------------------------------
    # Hauptspielschleife
    # --------------------------------------------------

    while True:
        # aktivePlayer:
        # true  = Kreuz (Spieler)
        # false = Kreis (KI)

        if game["aktivePlayer"]:
            # ------------------------------
            # Spieler ist dran
            # ------------------------------

            print("Du bist am Zug.")

            row, col = ask_move(game)

            updated_game = make_player_move(game_id, row, col)

            if updated_game is None:
                # Spielstand neu laden
                game = get_game(game_id)

                if game is None:
                    break

                continue

            game = updated_game

            print_board(game)

            if print_result(game):
                break

        else:
            # ------------------------------
            # KI ist dran
            # ------------------------------

            print("🤖 KI denkt nach...")

            updated_game = make_ai_move(game_id)

            if updated_game is None:
                break

            game = updated_game

            print_board(game)

            if print_result(game):
                break

    delete_game(game_id)
    print("\nSpiel beendet.")
    print(f"Game ID: {game_id}")


if __name__ == "__main__":
    try:
        main()

    except requests.ConnectionError:
        print()
        print("❌ Konnte die API nicht erreichen.")
        print(f"   Läuft die API unter {BASE_URL}?")

    except requests.Timeout:
        print()
        print("❌ Die API hat zu lange gebraucht.")

    except KeyboardInterrupt:
        print("\n\nSpiel beendet.")
