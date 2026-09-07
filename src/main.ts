import "./style.css";
import { startRouter } from "./router";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = "";

startRouter();
