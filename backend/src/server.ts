import { createServer } from "http";

import app from "./app.ts";
import config from "./config/config.ts";
import { setupGameWebSocket } from "./websocket/gameWebSocked.ts";

const server = createServer(app);

setupGameWebSocket(server);

server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
