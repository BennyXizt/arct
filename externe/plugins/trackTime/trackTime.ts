
import { timerStart, timerStop } from "./utils/utils.js"
import { spawn } from "child_process"

const dev = spawn("npm", ["run", "dev:notrack"], {
  shell: true,
  stdio: "inherit",
})

timerStart()
 
dev.on("close", () => timerStop("dev завершён"))
process.on("SIGINT", () => timerStop("остановлено вручную"))