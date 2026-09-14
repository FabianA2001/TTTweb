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

    response = requests.get(
        f"{BASE_URL}/game/{game_id}",
        timeout=5,
    )

    if response.status_code != 200:
        print(f"Fehler beim Abrufen des Spiels: {response.status_code}")
        print(response.text)
        return None

    return response.json()


def index_to_position(index, size=3):

    if index < 1 or index > size * size:
        raise ValueError(f"Feldnummer muss zwischen 1 und {size * size} liegen.")

    zero_based_index = index - 1

    row = zero_based_index // size
    col = zero_based_index % size

    return row, col


if __name__ == "__main__":
    while True:
        game_id = input("Gib die Game-ID ein: ")
        player = input("Gib die Spieler-ID ein (1 oder 0): ")

        while True:
            try:
                field_index = int(input("Gib die Feldnummer für den Zug ein: "))

                row, col = index_to_position(field_index)

                result = make_player_move(
                    game_id,
                    row,
                    col,
                    player,
                )

            except ValueError as e:
                print(f"❌ Ungültige Eingabe: {e}")
                continue

            except requests.RequestException as e:
                print(f"❌ Fehler beim Senden des Zugs: {e}")
                continue

            except Exception as e:
                print(f"❌ Fehler: {e}")
                continue

            if result:
                print("✅ Zug erfolgreich gemacht!")
                print(result)
            else:
                print("❌ Zug konnte nicht gemacht werden.")
