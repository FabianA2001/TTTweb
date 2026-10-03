import { createServer } from "http";

import app from "./app.ts";
import config from "./config/config.ts";
import { setupGameWebSocket } from "./websocket/gameWebSocked.ts";

const server = createServer(app);

setupGameWebSocket(server);

server.listen(config.port, "0.0.0.0", () => {
  console.log(`Backend läuft auf http://0.0.0.0:${config.port}`);
});
