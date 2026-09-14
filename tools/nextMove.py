import requests

# API-Adresse anpassen
API_URL = "http://localhost:3000/api/ttt/get-best-move"


def printBoard(board):
    size = int(len(board) ** 0.5)
    for i in range(size):
        row = board[i * size : (i + 1) * size]
        print(" | ".join(str(cell) for cell in row))
        if i < size - 1:
            print("-" * (size * 4 - 3))


# Beispiel-CompactGame
game = {"size": 3, "board": [1, 0, 0, 0, 2, 0, 0, 0, 0], "aktivePlayer": True}

print("Board vor dem Request:")
printBoard(game["board"])
print("-----------------")

try:
    response = requests.post(API_URL, json=game, timeout=5)

    # HTTP-Fehler anzeigen
    response.raise_for_status()

    # Antwort der API
    result = response.json()

    print("Board nach dem Request:")
    printBoard(result["board"])

    # print("API-Antwort:")
    # print(json.dumps(result, indent=2, ensure_ascii=False))


except requests.exceptions.RequestException as error:
    print(f"Fehler beim Request: {error}")
except ValueError:
    print("Die API hat kein gültiges JSON zurückgegeben.")
    print(response.text)
