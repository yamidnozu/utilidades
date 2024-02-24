const os = require('os');
const blessed = require('blessed');
const contrib = require('blessed-contrib');
const screen = blessed.screen();
const grid = new contrib.grid({ rows: 2, cols: 1, screen: screen });

let lineCpu = grid.set(0, 0, 1, 1, contrib.line, {
    showNthLabel: 5,
    maxY: 100,
    label: 'Uso de CPU (%)',
    showLegend: true
});

let lineMem = grid.set(1, 0, 1, 1, contrib.line, {
    showNthLabel: 5,
    maxY: 100,
    label: 'Uso de Memoria (%)',
    showLegend: true
});

let cpuData = { title: 'CPU', x: [], y: [] };
let memData = { title: 'Memoria', x: [], y: [] };
let counter = 0;

function getCpuUsage() {
    let totalIdle = 0, totalTick = 0;
    let cpus = os.cpus();

    for (let i = 0, len = cpus.length; i < len; i++) {
        let cpu = cpus[i];
        for (let type in cpu.times) {
            totalTick += cpu.times[type];
        }     
        totalIdle += cpu.times.idle;
    }

    return (1 - totalIdle / totalTick / cpus.length) * 100;
}

function getMemUsage() {
    let totalMem = os.totalmem();
    let freeMem = os.freemem();
    return ((totalMem - freeMem) / totalMem) * 100;
}

setInterval(() => {
    counter++;
    cpuData.x.push(counter.toString());
    cpuData.y.push(getCpuUsage());
    memData.x.push(counter.toString());
    memData.y.push(getMemUsage());

    if (cpuData.x.length > 10) { // Limitar la cantidad de datos en el gráfico
        cpuData.x.shift();
        cpuData.y.shift();
        memData.x.shift();
        memData.y.shift();
    }

    lineCpu.setData([cpuData]);
    lineMem.setData([memData]);

    screen.render();
}, 1000);

screen.key(['escape', 'q', 'C-c'], (ch, key) => {
    return process.exit(0);
});

screen.render();
