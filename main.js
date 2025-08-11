// ==UserScript==
// @name         Kopalnia Plus
// @namespace    http://tampermonkey.net/
// @version      0.9.0
// @author       neyluu
// @match        https://*.margonem.pl/*
// @exclude      https://www.margonem.pl/*
// @grant        none
// ==/UserScript==

(() => {
    window.addEventListener('load', () => start());

    const config = {
        pickaxesSpawns: true,
        pickaxes:       true,
        depositsSpawns: true,
        deposits:       true,
        colors: {
            pickaxe:        "rgba(240, 240, 240, 1)",
            pickaxeSpawn:   "rgba(196, 196, 196, 0.75)",
            deposit:        "rgba(255, 0, 0, 1)",
            depositSpawn:   "rgba(255, 0, 0, 0.75)"
        },
        size: {
            pickaxe:        32,
            pickaxeSpawn:   20,
            deposit:        32,
            depositSpawn:   20
        }
    }

    const pickaxesSpawns = {
        "m43":  [],
        "m64":  [],
        "m83":  [[58,43],[34,6],[19,27],[26,44],[50,22],[7,40],[5,29],[18,7],[56,61],[30,24],[7,58],[37,54],[20,58],[41,23],[2,18],[13,23],[27,13],[56,12],[55,52],[40,44],[13,41],[45,58],[49,6],[49,41],[19,51],[26,34],[58,17],[41,30]],
        "m114": [],
        "m300": []
    }

    const depositsSpawns = {
        "m43":  [],
        "m64":  [],
        "m83":  [[53,39],[22,13],[41,14],[51,19],[25,19],[22,50],[43,6],[15,56],[29,60],[48,10],[32,10],[39,8],[58,33],[5,25],[14,55],[59,35],[47,50],[40,22],[13,17],[58,62],[26,58],[48,61],[3,37],[7,28],[18,5],[5,44],[47,61],[50,43],[24,7],[2,27],[39,59],[6,23],[56,8],[59,61],[6,44],[15,39],[11,44],[15,49],[57,33],[8,55],[40,58],[45,52],[34,51],[48,38],[42,39]],
        "m114": [],
        "m300": []
    }

    const depositNames = {
        "m43":  "Pokaźne Złoże",
        "m64":  "Naładowany kryształ",
        "m83":  "Błękitne złoże",
        "m114": "Niewydobyty minerał",
        "m300": "Zamrożony czarodziej"
    }

    let currentMine = "none"
    const tileSize = 32

    const start = () => {
        const spawnPoint = (x, y, color, size) => {
            return {
                rx: x,
                ry: y,
                fw: tileSize,
                fh: tileSize,
                draw(ctx) {
                    const shift = Engine.mapShift.getShift();
                    const xPos = tileSize * this.rx - (isset(this.offsetX) ? this.offsetX : 0) - Engine.map.offset[0] - shift[0] + (this.leftPosMod !== undefined ? this.leftPosMod : 0);
                    const yPos = tileSize * this.ry - this.fh + 32 + (isset(this.offsetY) ? this.offsetY : 0) - Engine.map.offset[1] - shift[1];
                    const offset = (tileSize - size) / 2

                    ctx.fillStyle = color;
                    ctx.fillRect(xPos + offset, yPos + offset, size, size);
                },
                getOrder() {
                    return this.ry;
                }
            };
        };

        const getSpawns = (spawnsData, color, size) => {
            if(currentMine == "none") return [];

            let spawns = []

            spawnsData[currentMine].forEach(spawn => {
                spawns.push(spawnPoint(spawn[0], spawn[1], color, size))
            });

            return spawns
        }

        const getActive = (spawnsData, color, size) => {
            let spawns = []

            spawnsData.forEach(spawn => {
                spawns.push(spawnPoint(spawn.d.x, spawn.d.y, color, size))
            });

            return spawns
        }

        const getPickaxesSpawns = () => {
            return getSpawns(pickaxesSpawns, config.colors.pickaxeSpawn, config.size.pickaxeSpawn)
        }

        const getDepositsSpawns = () => {
            return getSpawns(depositsSpawns, config.colors.depositSpawn, config.size.depositSpawn)
        }

        const getDeposits = () => {
            const deposits = Object.values(Engine.npcs.check()).filter(npc => npc.d.nick === depositNames[currentMine])
            return getActive(deposits, config.colors.deposit, config.size.deposit)
        }

        const getPickaxes = () => {
            const pickaxes = Object.values(Engine.npcs.check()).filter(npc => npc.d.nick === "Porzucony kilof" || npc.d.nick == "Zakopany kilof")
            return getActive(pickaxes, config.colors.pickaxe, config.size.pickaxe)
        }

        const getDrawableList = () => {
            getCurrentMine()

            if(currentMine !== "none")
            {

                let pickaxes = []
                let deposits = []
                let pickaxesSpawns = []
                let depositsSpawns = []

                if(config.pickaxes)         pickaxes = getPickaxes()
                if(config.deposits)         deposits = getDeposits()
                if(config.pickaxesSpawns)   pickaxesSpawns = getPickaxesSpawns()
                if(config.depositsSpawns)   depositsSpawns = getDepositsSpawns()

                return [...pickaxesSpawns, ...depositsSpawns, ...pickaxes, ...deposits]
            }

            return []
        }

        const getCurrentMine = () => {
            switch(window.Engine.map.d.name) {
                case "Kopalnia Krwawej Zemsty":
                    currentMine = "m43"
                    break
                case "Kopalnia Krwawego Szaleństwa":
                    currentMine = "m64"
                    break
                case "Kopalnia Krwawego Opętania":
                    currentMine = "m83"
                    break
                case "Kopalnia Krwawej Arogancji":
                    currentMine = "m114"
                    break
                case "Kopalnia Krwawej Pychy":
                    currentMine = "m300"
                    break
                default:
                    currentMine = "none"
                    break
            }
        }

        API.addCallbackToEvent('call_draw_add_to_renderer', () => Engine.renderer.add.apply(Engine.renderer, getDrawableList()));
    }
})();