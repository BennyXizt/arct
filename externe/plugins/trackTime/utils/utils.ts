import fs from "fs"
import path from "path";
import { fileURLToPath } from "url"

const 
    __filename = fileURLToPath(import.meta.url),
    __dirname = path.dirname(__filename),
    file = path.join(__dirname, "..", "data", "dev-time.json")

let 
    timer: NodeJS.Timeout, 
    start: number, 
    data = {
        totalSeconds: 0
    }

export function getFormattedTime(value: number) {
    if (value < 60) {
        return `${value} сек`
    } else if (value < 3600) {
        const minutes = Math.floor(value / 60)
        const seconds = value % 60

        return `${minutes} мин ${seconds} сек`
    } else {
        const hours = Math.floor(value / 3600)
        const minutes = Math.floor((value % 3600) / 60)
        const seconds = value % 60

        return `${hours} ч ${minutes} мин ${seconds} сек`
    }
}

export function timerStart() {
    if (fs.existsSync(file)) {
        data = JSON.parse(fs.readFileSync(file, "utf-8"))
    }

    start = Date.now()

    console.log(`🚀 Таймер стартовал... | Всего по проекту: ${getFormattedTime(data.totalSeconds)}`)

    let seconds = 0

    timer = setInterval(() => {
        seconds++;

        if (seconds % 1800 === 0) {
            console.log("\n\n--\tВажное объявление\t--\n\n")
            console.log("⏰ 30 минут прошло — сделай паузу")
            console.log("\n\n--\tВажное объявление\t--\n\n")
        }
    }, 1000)

}

export function timerStop(reason: string) {
  clearInterval(timer)

  const sessionSeconds = Math.floor((Date.now() - start) / 1000)

  data.totalSeconds += sessionSeconds
  fs.writeFileSync(file, JSON.stringify(data, null, 2))

  console.log(`\n\n\n🛑 Спасибо, что уделил мне время. Проект завершен по причине: ${reason}`)
  console.log('\n---\tСтатистика\t---\n')
  console.log(`⏱️\tСессия: ${getFormattedTime(sessionSeconds)}`)
  console.log(`📊\tВсего: ${getFormattedTime(data.totalSeconds)}`)
  console.log('\n---\tСтатистика\t---\n')

  process.exit()
}