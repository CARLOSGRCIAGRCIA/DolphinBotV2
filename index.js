import { join, dirname } from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { setupMaster, fork } from "cluster";
import { existsSync, writeFileSync } from "fs";
import cfonts from "cfonts";
import { createInterface } from "readline";
import chalk from "chalk";

console.log(chalk.bold.hex("#00FFFF")("\n🐬─ Iniciando Dolphin-Bot IA ─🐬"));

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(__dirname);
require(join(__dirname, "./package.json"));

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function barraCargaCyberpunk() {
  const frames = [
    "[🌊] Inicializando Dolphin-Core...",
    "[📡] Sincronizando sensores marinos...",
    "[🐬] Activando red neuronal acuática...",
    "[🫧] Procesando corrientes de datos...",
    "[🧠] Calibrando inteligencia adaptativa...",
    "[⚙️] Estabilizando sistema autónomo...",
    "[✅] DOLPHIN-BOT LISTO PARA OPERAR.",
  ];

  for (let frame of frames) {
    process.stdout.write("\r" + chalk.cyanBright(frame));
    await new Promise((res) => setTimeout(res, 350));
  }
  console.log();
}

async function animacionDolphinBot() {
  const frames = [
    chalk.hex("#2C5F8D")(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⣰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡄⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢠⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⢸⣿⣿⣿⠿⠿⠿⠿⠿⠿⠿⠟⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠘⠿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
        DOLPHINBOT v1.0
       ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
`),
    chalk.hex("#00CED1")(`
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠐⢿⣿⣿⣿⣿⣶⣤⣤⣤⣤⣤⣀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠙⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⡀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣦⠀⠀⠀⠀
⠀⠀⠀⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⠀⠀
⠀⠀⢰⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠿⠿⠿⠿⠿⠟⠃⠀
⠀⠀⢸⣿⣿⣿⣿⡿⠛⠉⠁⠀⢸⣿⠿⠁⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢸⣿⣿⡿⠋⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⢸⣿⣿⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⢀⣾⣿⣿⣿⣷⣦⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⣾⣿⣿⣿⠿⣿⣿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⡿⠛⠉⠀⠀⠀⠈⠙⠃⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
    
    🐬💙 DOLPHINBOT READY! 💙🐬
    ≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈≈
      ¡Sistema Operativo!
`),
  ];

  const duracionTotal = 2000;
  const delay = Math.floor(duracionTotal / frames.length);
  
  for (let i = 0; i < frames.length; i++) {
    console.clear();
    console.log(frames[i]);
    await new Promise((res) => setTimeout(res, delay));
  }
}

async function iniciarDolphinBot() {
  console.clear();

  console.log(
    chalk.bold.cyanBright("\n⟦ ⌬ ACCESO CONCEDIDO | DOLPHIN-BOT V.1 ⟧")
  );
  console.log(chalk.gray("⌬ 𝘾𝙖𝙣𝙖𝙡𝙞𝙯𝙖𝙣𝙙𝙤 𝙖𝙘𝙘𝙚𝙨𝙤 𝙖𝙡 𝙖𝙧𝙧𝙚𝙘𝙞𝙛𝙚..."));
  await new Promise((res) => setTimeout(res, 400));

  await animacionDolphinBot();

  await barraCargaCyberpunk();
  await new Promise((res) => setTimeout(res, 300));

  console.log(chalk.redBright("\n☰✦☰═☰  𝘿𝙊𝙇𝙋𝙃𝙄𝙉-𝘽𝙊𝙏  ☰═☰✦☰"));
  await new Promise((res) => setTimeout(res, 400));

  cfonts.say("El mejor Bot", {
    font: "block",
    align: "center",
    colors: ["#00FFFF", "#FF00FF"],
    letterSpacing: 1,
  });

  console.log(
    chalk.bold.hex("#00FFFF")(`
█▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀▀█
█░░╦─╦╔╗╦─╔╗╔╗╔╦╗╔╗░░█
█░░║║║╠─║─║─║║║║║╠─░░█
█░░╚╩╝╚╝╚╝╚╝╚╝╩─╩╚╝░░█
█▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄█
        [ ACCESO CONCEDIDO ]
  `)
  );

  await new Promise((res) => setTimeout(res, 400));

  console.log(chalk.bold.hex("#FF00FF")("\n⌬═════════════════════⌬"));
  console.log(
    chalk.bold.white("      SISTEMA CREADO POR: ") +
      chalk.bold.hex("#FFD700")("Carlos G")
  );
  console.log(chalk.bold.hex("#FF00FF")("⌬═══════════════════════⌬\n"));

  await new Promise((res) => setTimeout(res, 600));
}

let isRunning = false;
let childProcess = null;

function start(file) {
  if (isRunning) return;
  isRunning = true;
  
  let args = [join(__dirname, "núcleo•dolphin", file), ...process.argv.slice(2)];
  setupMaster({ exec: args[0], args: args.slice(1) });
  
  childProcess = fork();
  
  childProcess.on("exit", (_, code) => {
    isRunning = false;
    childProcess = null;
    
    console.log(chalk.yellow(`\n⚠️ Proceso finalizado con código: ${code}`));
    
    if (code !== 0) {
      console.log(chalk.cyan("🔄 Reiniciando en 3 segundos..."));
      setTimeout(() => start(file), 3000);
    }
  });
  
  childProcess.on("error", (err) => {
    console.error(chalk.red("❌ Error en proceso hijo:"), err);
    isRunning = false;
    childProcess = null;
  });
}

// Manejo de señales para cierre limpio
process.on("SIGINT", () => {
  console.log(chalk.yellow("\n⚠️ Recibida señal SIGINT, cerrando limpiamente..."));
  if (childProcess) {
    childProcess.kill("SIGTERM");
  }
  process.exit(0);
});

process.on("SIGTERM", () => {
  console.log(chalk.yellow("\n⚠️ Recibida señal SIGTERM, cerrando limpiamente..."));
  if (childProcess) {
    childProcess.kill("SIGTERM");
  }
  process.exit(0);
});

const archivoArranque = "./.arranque-ok";
if (!existsSync(archivoArranque)) {
  await iniciarDolphinBot();
  writeFileSync(archivoArranque, "CARLOS_FINAL");
}

start("start.js");