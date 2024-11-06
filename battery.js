// Script de monitoreo de la batería y sistema con interfaz compacta y umbrales mejorados
const os = require('os');
const readline = require('readline');
const Table = require('cli-table3');
const batteryLevel = require('battery-level');
const isCharging = require('is-charging');
const notifier = require('node-notifier');
const chalk = require('chalk');
const fs = require('fs');

// Cargar configuración desde config.json
let config;
try {
    config = {
        "battery": {
            "high": 80,
            "full": 100,
            "low": 20,
            "below50": 50,
            "below30": 30,
            "below60": 60
        },
        "temperature": {
            "warning": 35,
            "critical": 40
        },
        "system": {
            "cpuHigh": 80,
            "ramHigh": 80
        },
        "rates": {
            "chargeRate": 2,
            "dischargeRate": 2
        },
        "usage": {
            "continuousChargeThreshold": 8, // horas
            "batteryMaintainLevel": 80
        }
    }
        ;
} catch (error) {
    console.error(chalk.red('Error al cargar la configuración:', error));
    process.exit(1);
}

const { battery, temperature, system, rates, usage } = config;

let history = [];
let notified = {
    cpuHigh: false,
    ramHigh: false,
    batteryHot: false,
    batteryHigh: false,
    batteryFull: false,
    batteryLow: false,
    batteryBelow50: false,
    batteryBelow30: false,
    batteryBelow60: false,
    continuousCharge: false
};

// Variables para rastrear el tiempo de conexión continua
let connectedSince = null;

// Inicialización inmediata
(async function () {
    console.log(chalk.green('Iniciando monitoreo de batería y sistema...\n'));

    // Inicializar el estado anterior para el cálculo preciso de CPU
    let previousCpuTimes = getCpuTimes();

    async function handleBatteryChange() {
        try {
            clearConsole();
            const batteryStatus = await getBatteryStatus();
            const systemUsage = getSystemUsage();
            updateHistory(batteryStatus, systemUsage);
            trackContinuousCharge(batteryStatus.charging);
            displayBatteryInfo(batteryStatus, systemUsage);
            sendNotifications(batteryStatus, systemUsage);
        } catch (error) {
            console.error(chalk.red('Error al obtener el estado de la batería:'), error);
        }
    }

    // Ejecutar cada 10 segundos
    setInterval(handleBatteryChange, 10000);
    handleBatteryChange();

    // Función para limpiar la consola
    function clearConsole() {
        readline.cursorTo(process.stdout, 0, 0);
        readline.clearScreenDown(process.stdout);
    }

    // Función para obtener el estado de la batería
    async function getBatteryStatus() {
        const charging = await isCharging();
        const level = Math.round((await batteryLevel()) * 100);
        const status = charging ? '🔌 Cargando' : '🔋 Descargando';
        const temperature = getBatteryTemperature();
        const nextAction = getNextAction(charging, level);
        const nextActionTime = getNextActionTime(charging, level);
        const recommendation = getRecommendation(charging, level);

        return { charging, level, status, temperature, nextAction, nextActionTime, recommendation };
    }

    // Función para obtener el uso del sistema
    function getSystemUsage() {
        return {
            cpuUsage: getCpuUsage(),
            ramUsage: getRamUsage(),
        };
    }

    // Función para actualizar el historial
    function updateHistory(batteryStatus, systemUsage) {
        const currentStatus = {
            timestamp: new Date().toLocaleTimeString(),
            ...batteryStatus,
            ...systemUsage,
        };

        history.push(currentStatus);
        if (history.length > 5) {
            history.shift();
        }
    }

    // Función para rastrear el tiempo de conexión continua
    function trackContinuousCharge(isChargingFlag) {
        const now = new Date();

        if (isChargingFlag) {
            if (!connectedSince) {
                connectedSince = now;
            }
        } else {
            connectedSince = null;
        }
    }

    // Función para mostrar la información en la consola de forma compacta
    function displayBatteryInfo(batteryStatus, systemUsage) {
        // Mostrar la barra de batería
        console.log(chalk.yellow('=============================='));
        console.log(chalk.yellow('      Estado de la Batería    '));
        console.log(chalk.yellow('=============================='));

        const batteryBar = createProgressBar(batteryStatus.level, 'Batería');
        console.log(`${batteryBar} | Nivel: ${batteryStatus.level}% ${batteryStatus.charging ? '(Cargando)' : '(Descargando)'} | Temperatura: ${batteryStatus.temperature}°C`);

        // Mostrar uso de CPU y RAM en una sola línea
        const cpuBar = createProgressBar(systemUsage.cpuUsage, 'CPU');
        const ramBar = createProgressBar(systemUsage.ramUsage, 'RAM');
        console.log(`${cpuBar} | ${ramBar} | CPU: ${systemUsage.cpuUsage}% | RAM: ${systemUsage.ramUsage}%`);

        // Mostrar recomendaciones en una línea
        console.log(chalk.cyan(`\nRecomendación: ${batteryStatus.recommendation} | Próxima acción: ${batteryStatus.nextAction} ${batteryStatus.nextActionTime}`));

        // Mostrar historial reducido
        console.log(chalk.yellow('\n=============================='));
        console.log(chalk.yellow('       Historial Reciente     '));
        console.log(chalk.yellow('=============================='));

        const table = new Table({
            head: [chalk.cyan('Hora'), chalk.cyan('Estado'), chalk.cyan('Nivel (%)'), chalk.cyan('Temp (°C)'), chalk.cyan('CPU (%)'), chalk.cyan('RAM (%)')],
            colWidths: [8, 12, 10, 12, 10, 10],
        });

        history.forEach((entry) => {
            table.push([
                entry.timestamp,
                entry.status,
                `${entry.level}`,
                `${entry.temperature}`,
                `${entry.cpuUsage}`,
                `${entry.ramUsage}`,
            ]);
        });

        console.log(table.toString());
        console.log(chalk.gray('(Actualizando cada 10 segundos)'));
    }

    // Función para enviar notificaciones
    function sendNotifications(batteryStatus, systemUsage) {
        const messageTemplate = (prefix, batteryStatus) => {
            return `${prefix}. Nivel: ${batteryStatus.level}%. Tiempo restante: ${batteryStatus.nextActionTime}. Recomendación: ${batteryStatus.recommendation}. Próxima acción: ${batteryStatus.nextAction} ${batteryStatus.nextActionTime}`;
        };

        // Notificaciones de uso alto de CPU o RAM
        if (systemUsage.cpuUsage > system.cpuHigh || systemUsage.ramUsage > system.ramHigh) {
            if (!notified.cpuHigh || !notified.ramHigh) {
                sendNotification('Alerta de Sistema', messageTemplate('⚠️ Uso alto de CPU o RAM', batteryStatus), true);
                notified.cpuHigh = true;
                notified.ramHigh = true;
            }
        } else {
            notified.cpuHigh = false;
            notified.ramHigh = false;
        }

        // Notificaciones relacionadas con la batería
        if (batteryStatus.charging) {
            if (batteryStatus.temperature > temperature.critical && !notified.batteryHot) {
                sendNotification('Alerta de Batería', messageTemplate('⚠️ La batería está demasiado caliente', batteryStatus), true);
                notified.batteryHot = true;
            }
            if (batteryStatus.level >= battery.high && batteryStatus.level < battery.full && !notified.batteryHigh) {
                sendNotification('Alerta de Batería', messageTemplate('⚠️ La batería está cargada al 80% o más', batteryStatus), false);
                notified.batteryHigh = true;
            }
            if (batteryStatus.level >= battery.full && !notified.batteryFull) {
                sendNotification('Alerta de Batería', messageTemplate('⚠️ La batería está al 100%', batteryStatus), true);
                notified.batteryFull = true;
            }

            // Notificación sobre uso continuo conectado
            if (batteryStatus.charging && connectedSince) {
                const now = new Date();
                const diffMs = now - connectedSince;
                const hoursConnected = diffMs / (1000 * 60 * 60);

                if (hoursConnected >= usage.continuousChargeThreshold && !notified.continuousCharge) {
                    sendNotification(
                        'Información de Batería',
                        `⚠️ Tu dispositivo ha estado conectado por más de ${usage.continuousChargeThreshold} horas. Considera mantener la batería alrededor del ${usage.batteryMaintainLevel}%.`,
                        false
                    );
                    notified.continuousCharge = true;
                }
            } else {
                notified.continuousCharge = false;
            }
        } else {
            if (batteryStatus.temperature > temperature.critical && !notified.batteryHot) {
                sendNotification('Alerta de Batería', messageTemplate('⚠️ La batería está demasiado caliente', batteryStatus), true);
                notified.batteryHot = true;
            }
            if (batteryStatus.level <= battery.low && !notified.batteryLow) {
                sendNotification('Alerta de Batería', messageTemplate('⚠️ La batería está baja', batteryStatus), true);
                notified.batteryLow = true;
            }
            if (batteryStatus.level <= battery.below50 && batteryStatus.level > battery.low && !notified.batteryBelow50) {
                sendNotification('Alerta de Batería', messageTemplate('⚠️ La batería está por debajo del 50%', batteryStatus), false);
                notified.batteryBelow50 = true;
            }
            if (batteryStatus.level <= battery.below30 && !notified.batteryBelow30) {
                sendNotification('Alerta de Batería', messageTemplate('⚠️ La batería está por debajo del 30%', batteryStatus), false);
                notified.batteryBelow30 = true;
            }
            if (batteryStatus.level <= battery.below60 && batteryStatus.level > battery.below30 && !notified.batteryBelow60) {
                sendNotification('Alerta de Batería', messageTemplate('⚠️ La batería está por debajo del 60%', batteryStatus), false);
                notified.batteryBelow60 = true;
            }
        }
    }

    // Función para crear una barra de progreso compacta
    function createProgressBar(level, label) {
        const totalBars = 20;
        const filledBars = Math.round((level / 100) * totalBars);
        const emptyBars = totalBars - filledBars;

        let bar = '';

        // Determinar el color basado en el nivel y el tipo de barra
        if (label === 'CPU' || label === 'RAM') {
            if (level > system.cpuHigh) {
                bar = chalk.red('█').repeat(filledBars) + chalk.gray('░').repeat(emptyBars);
            } else if (level > 50) {
                bar = chalk.yellow('█').repeat(filledBars) + chalk.gray('░').repeat(emptyBars);
            } else {
                bar = chalk.green('█').repeat(filledBars) + chalk.gray('░').repeat(emptyBars);
            }
        } else { // Batería
            if (level > battery.high) {
                bar = chalk.green('█').repeat(filledBars) + chalk.gray('░').repeat(emptyBars);
            } else if (level > battery.below50) {
                bar = chalk.yellow('█').repeat(filledBars) + chalk.gray('░').repeat(emptyBars);
            } else if (level > battery.low) {
                bar = chalk.red('█').repeat(filledBars) + chalk.gray('░').repeat(emptyBars);
            } else {
                bar = chalk.bgRed('█').repeat(filledBars) + chalk.gray('░').repeat(emptyBars);
            }
        }

        return `${label}: [${bar}]`;
    }

    // Función para obtener la temperatura de la batería (simulada)
    function getBatteryTemperature() {
        // En un entorno real, reemplaza esta función con una que obtenga la temperatura real de la batería
        return Math.floor(Math.random() * 6) + 35; // 35°C a 40°C
    }

    // Función para calcular el uso del CPU de manera precisa
    function getCpuUsage() {
        const currentCpuTimes = getCpuTimes();
        let idleDiff = 0;
        let totalDiff = 0;

        for (let i = 0; i < currentCpuTimes.length; i++) {
            const prev = previousCpuTimes[i];
            const curr = currentCpuTimes[i];

            const idle = curr.idle - prev.idle;
            const total = Object.keys(curr).reduce((acc, key) => acc + (curr[key] - prev[key]), 0);

            idleDiff += idle;
            totalDiff += total;
        }

        previousCpuTimes = currentCpuTimes;

        const usage = 100 - Math.round((idleDiff / totalDiff) * 100);
        return usage;
    }

    // Función para obtener los tiempos de CPU
    function getCpuTimes() {
        return os.cpus().map(cpu => ({ ...cpu.times }));
    }

    // Función para calcular el uso de la RAM
    function getRamUsage() {
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const usedMemory = totalMemory - freeMemory;
        const usage = Math.round((usedMemory / totalMemory) * 100);
        return usage;
    }

    // Función para determinar la próxima acción
    function getNextAction(charging, level) {
        // Calcular cuánto tiempo ha estado conectado
        let hoursConnected = 0;
        if (charging && connectedSince) {
            const now = new Date();
            const diffMs = now - connectedSince;
            hoursConnected = diffMs / (1000 * 60 * 60);
        }

        if (charging) {
            if (hoursConnected >= usage.continuousChargeThreshold) {
                return 'Mantener cargador conectado al 80%';
            } else {
                if (level >= battery.high) {
                    return 'Desconectar cargador';
                } else {
                    return 'Mantener cargador';
                }
            }
        } else {
            if (level <= battery.low) {
                return 'Conectar cargador';
            } else if (level <= battery.below50) {
                return 'Usar con precaución';
            } else if (level <= battery.below60) {
                return 'Usar sin cargar';
            } else {
                return 'Usar sin cargar';
            }
        }
    }

    // Función para estimar el tiempo para la próxima acción
    function getNextActionTime(charging, level) {
        let minutesRemaining;
        if (charging) {
            if (level >= battery.high) {
                minutesRemaining = (battery.full - level) / rates.chargeRate;
            } else {
                minutesRemaining = (battery.high - level) / rates.chargeRate;
            }
        } else {
            if (level <= battery.low) {
                minutesRemaining = 0; // Acción requerida inmediatamente
            } else if (level <= battery.below50) {
                minutesRemaining = (level - battery.low) / rates.dischargeRate;
            } else if (level <= battery.below60) {
                minutesRemaining = (level - 50) / rates.dischargeRate;
            } else {
                minutesRemaining = (level - 20) / rates.dischargeRate;
            }
        }

        if (minutesRemaining <= 0) {
            return 'inmediatamente';
        }

        return `en ${Math.round(minutesRemaining)} min`;
    }

    // Función para obtener recomendaciones
    function getRecommendation(charging, level) {
        // Calcular cuánto tiempo ha estado conectado
        let hoursConnected = 0;
        if (charging && connectedSince) {
            const now = new Date();
            const diffMs = now - connectedSince;
            hoursConnected = diffMs / (1000 * 60 * 60);
        }

        if (charging) {
            if (hoursConnected >= usage.continuousChargeThreshold) {
                return `Mantén el cargador conectado hasta que el nivel de batería alcance el ${usage.batteryMaintainLevel}%.`;
            } else {
                if (level >= battery.high) {
                    return 'Desconecta el cargador para prolongar la vida útil de la batería.';
                } else {
                    return 'Mantén el cargador conectado para seguir cargando.';
                }
            }
        } else {
            if (level <= battery.low) {
                return 'Conecta el cargador pronto para evitar que se apague.';
            } else if (level <= battery.below50) {
                return 'Usa el dispositivo con precaución para conservar la batería.';
            } else if (level <= battery.below60) {
                return 'Usa el dispositivo sin cargar para conservar la batería.';
            } else {
                return 'Usa el dispositivo sin cargar para conservar la batería.';
            }
        }
    }
})();
