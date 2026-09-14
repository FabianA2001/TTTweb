import requests

BASE_URL = "http://localhost:3000/api/ttt"


def make_player_move(game_id, row, col, player="1"):
    """Schickt den Zug des Spielers an die API."""

    response = requests.post(
        f"{BASE_URL}/game/{game_id}/move/{player}",
        json={"row": row, "col": col},
        timeout=5,
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


def get_game(game_id):
    """Holt den aktuellen Spielstand von der API."""

    response = requests.get(f"{BASE_URL}/game/{game_id}", timeout=5)

    if response.status_code != 200:
        print(f"Fehler beim Abrufen des Spiels: {response.status_code}")
        print(response.text)
        return None

    return response.json()


if __name__ == "__main__":
    while True:
        game_id = input("Gib die Game-ID ein: ")
        player = input("Gib die Spieler-ID ein (1 oder 0): ")
        while True:
            try:
                row = int(input("Gib die Zeile für den Zug ein (0-2): "))
                col = int(input("Gib die Spalte für den Zug ein (0-2): "))

                result = make_player_move(game_id, row, col, player)
            except Exception as e:
                print(f"Fehler beim Senden des Zugs: {e}")
                continue

            if result:
                print("Zug erfolgreich gemacht!")
                print(result)
            else:
                print("Zug konnte nicht gemacht werden.")
