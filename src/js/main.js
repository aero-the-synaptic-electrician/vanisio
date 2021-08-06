(function(modules) {
    function webpackJsonpCallback(data) {
        var chunkIds = data[0],
            moreModules = data[1],
            executeModules = data[2];

        var resolves = [];

        for (const chunkId of chunkIds) {
            if (installedChunks[chunkId])
                resolves.push(installedChunks[chunkId][0]);

            installedChunks[chunkId] = 0;
        }

        for (const moduleId in moreModules) {
            if (Object.prototype.hasOwnProperty.call(moreModules, moduleId))
                modules[moduleId] = moreModules[moduleId];
        }

        if (parentJsonpFunction)
            parentJsonpFunction(data);

        while (resolves.length)
            resolves.shift()();

        deferredModules.push.apply(deferredModules, executeModules || []);

        return checkDeferredModules();
    }

    function checkDeferredModules() {
        var result;

        for (var i = 0; i < deferredModules.length; i++) {
            var deferredModule = deferredModules[i];
            var fulfilled = true;

            for (var j = 1; j < deferredModule.length; j++) {
                var depId = deferredModule[j];

                if (installedChunks[depId] !== 0)
                    fulfilled = false;
            }

            if (fulfilled) {
                deferredModules.splice(i--, 1);

                result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
            }
        }

        return result;
    }

    var installedModules = {};
    var installedChunks = {
        /* runtime */
        0: 0
    };

    var deferredModules = [];

    function __webpack_require__(moduleId) {
        if (installedModules[moduleId])
            return installedModules[moduleId].exports;
        else {
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };

            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

            module.l = true;

            return module.exports;
        }
    }

    __webpack_require__.m = modules;

    __webpack_require__.c = installedModules;

    __webpack_require__.d = function(exports, name, getter) {
        if (!__webpack_require__.o(exports, name)) {
            Object.defineProperty(exports, name, {
                enumerable: true,
                get: getter
            });
        }
    };

    __webpack_require__.r = function(exports) {
        if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
            Object.defineProperty(exports, Symbol.toStringTag, {
                value: 'Module'
            });
        }

        Object.defineProperty(exports, '__esModule', {
            value: true
        });
    };

    __webpack_require__.t = function(value, mode) {
        if (mode & 1)
            value = __webpack_require__(value);

        if (mode & 8)
            return value;
        else if ((mode & 4) && typeof value === 'object' && value && value.__esModule)
            return value;
        else {
            var ns = Object.create(null);

            __webpack_require__.r(ns);

            Object.defineProperty(ns, 'default', {
                enumerable: true,
                value: value
            });

            if (mode & 2 && typeof value != 'string') {
                for (var key in value) __webpack_require__.d(ns, key, function(key) {
                    return value[key];
                }.bind(null, key));
            }

            return ns;
        }
    };

    __webpack_require__.n = function(module) {
        var getter = module && module.__esModule ?
            /* getDefault */
            () => module.default :
            /* getModuleExports */
            () => module;
        __webpack_require__.d(getter, 'a', getter);
        return getter;
    };

    __webpack_require__.o = (object, property) => Object.prototype.hasOwnProperty.call(object, property);

    __webpack_require__.p = '';

    var jsonpArray = window.webpackJsonp = window.webpackJsonp || [],
        oldJsonpFunction = jsonpArray.push.bind(jsonpArray);

    jsonpArray.push = webpackJsonpCallback;
    jsonpArray = jsonpArray.slice();

    for (const value of jsonpArray)
        webpackJsonpCallback(value);

    var parentJsonpFunction = oldJsonpFunction;

    deferredModules.push([117, 1]);
    checkDeferredModules()
})([, function(module, exports, __webpack_require__) {
    const a = __webpack_require__(120),
        n = __webpack_require__(4),
        i = __webpack_require__(24),
        r = __webpack_require__(121),
        o = __webpack_require__(125),
        l = __webpack_require__(12),
        c = __webpack_require__(23),
        u = __webpack_require__(65),
        d = __webpack_require__(5),
        h = __webpack_require__(128),
        v = __webpack_require__(130),
        {
            lerp,
            hideCaptchaBadge
        } = __webpack_require__(8);

    var g = window.gameObject = new class Game {};

    function y(e) {
        var t = document.getElementById("nickname").value,
            s = document.getElementById("skinurl").value,
            a = document.getElementById("teamtag").value;
        e.utf8(t), e.utf8(s), e.utf8(a)
    }

    g.clientVersion = 16;
    g.currentWsId = null;
    g.events = new c;
    g.settings = n;
    g.renderer = i;
    g.usingWebGL = i.type === PIXI.RENDERER_TYPE.WEBGL;
    g.skinLoader = new h;
    console.log(g.usingWebGL ? "WebGL Renderer" : "Canvas Renderer");
    l.virus.loadVirusFromUrl(n.virusImageUrl);

    g.state = {
        connectionUrl: null,
        selectedServer: null,
        spectators: 0,
        isAlive: false,
        stateButton: false,
        playButtonDisabled: false,
        playButtonText: "Play",
        deathScreen: false,
        isAutoRespawning: false
    };
    
    document.body.oncontextmenu = event => event.target && event.target.id === "email"

    g.start = function(e) {
        if (!(e.protocol && e.instanceSeed && e.playerId && e.border)) throw "Lacking mandatory data";
        g.running = true, g.protocol = e.protocol, g.modeId = e.gamemodeId || 0, g.instanceSeed = e.instanceSeed, g.pingstamp = 0, g.timestamp = 0, g.deltaTime = 0, g.playerId = e.playerId, g.multiboxPid = null, g.activePid = g.playerId, g.tagId = null, g.spectating = false, g.state.spectators = 0, g.state.isAlive = false, g.center = {
            x: 0,
            y: 0
        }, g.score = 0, g.cellCount = 0, g.splitCount = 0, g.moveWaitUntil = 0, g.replaying = !!e.replayUpdates, g.replayUpdates = e.replayUpdates, g.replayUpdateIndex = 0, g.replay.clearHistory(), g.nodes = {}, g.nodesOwn = {}, g.nodelist = [], g.removedNodes = [], g.rawMouse = {}, g.mouse = {}, g.stopMovePackets = false, g.moveToCenterOfCells = false, g.freezeMouse = false, g.border = e.border, g.setupZoom(g.border), g.massTextPool = [], g.crownPool = [];
        var t = PIXI.utils.isWebGLSupported() && n.useWebGL && n.showBackgroundImage;
        g.scene = new r(g, g.border, t), g.container = g.scene.container, g.cameraScale = g.zoom, g.camera = new a(g.container), g.camera.scale.set(g.cameraScale), g.camera.position.set(e.border.x, e.border.y), g.playerManager = new o(g), g.ticker = new PIXI.Ticker, g.ticker.add(g.tick), g.state.selectedServer && g.state.connectionUrl !== g.state.selectedServer.url && (g.state.selectedServer = null), g.replaying ? (g.moveInterval = setInterval(g.replayUpdate, 40), g.events.$emit("show-replay-controls", g.replayUpdates.length), g.events.$emit("minimap-stats-visible", false)) : (n.minimapEnabled && g.events.$emit("minimap-show"), n.showChat && g.events.$emit("chat-visible", {
            visible: true
        }), g.events.$emit("leaderboard-show"), g.events.$emit("stats-visible", true), g.moveInterval = setInterval(() => {
            g.stopMovePackets || (g.moveToCenterOfCells ? g.sendUint8(9) : g.actions.move())
        }, 40), g.setupStats(), g.state.stateButton = true, g.lastDeathTime = Date.now()), g.ticker.start(), g.eventListeners(true), g.events.$emit("game-started")
    }, g.setupZoom = function(e) {
        g.zoom = .3, e.width === e.height ? g.zoomScale = 2e4 / e.width : g.zoomScale = 1, g.zoomMin = .03 * g.zoomScale
    }, g.nextReplayPacket = function() {
        g.parseMessage(g.replayUpdates[g.replayUpdateIndex]), g.replayUpdateIndex++
    }, g.replayMoveTo = function(e) {
        var t = g.replayUpdates.length - 1,
            s = Math.floor(e * t);
        if (s !== g.replayUpdateIndex) {
            for (var a = [], n = g.replayUpdates[s], i = 0; i < g.nodelist.length; i++) {
                var r = g.nodelist[i];
                r.createTick > n.packetId && a.push(r)
            }
            for (i = 0; i < a.length; i++) a[i].destroy();
            for (; g.replayUpdateIndex < s;) g.parseMessage(g.replayUpdates[g.replayUpdateIndex++]);
            g.replayUpdateIndex = s, g.parseMessage(n)
        }
    }, g.replayUpdate = function() {
        g.replayUpdateIndex >= g.replayUpdates.length && g.replayMoveTo(0), g.events.$emit("replay-index-change", g.replayUpdateIndex), g.nextReplayPacket()
    }, g.updateStats = function(e) {
        g.events.$emit("stats-changed", {
            ping: e,
            fps: Math.round(g.avgFps.getAndReset()),
            mass: g.score,
            score: g.highscore
        }), g.events.$emit("minimap-stats-changed", {
            playerCount: g.playerManager.playerCount,
            spectators: g.state.spectators
        })
    }, g.setupStats = function() {
        g.avgFps = new v, g.ticker.add(() => g.avgFps.add(g.ticker.FPS)), g.everySecond = setInterval(() => {
            g.events.$emit("every-second"), window.app.showMenu || window.app.showDeathScreen ? g.updateStats(null) : g.ping()
        }, 1e3)
    }, g.clearNodes = function() {
        for (; g.nodelist.length;) g.nodelist[0].destroy();
        for (; g.removedNodes.length;) g.removedNodes.pop().destroySprite()
    }, g.destroySpritePool = function(e, t) {
        for (; e.length;) e.pop().destroy(t)
    }, g.stop = function() {
        g.running = false, g.state.isAlive = false, g.state.spectators = 0, g.state.stateButton = false, g.state.playButtonDisabled = false, g.state.playButtonText = "Play", g.eventListeners(false), g.state.connectionUrl = null, g.ticker.stop(), clearInterval(g.moveInterval), clearInterval(g.everySecond), g.renderer.clear(), g.playerManager.destroy(), g.skinLoader.clearCallbacks(), g.events.$emit("minimap-stats-visible", true), g.events.$emit("stats-visible", false), g.events.$emit("chat-visible", {
            visible: false
        }), g.events.$emit("leaderboard-hide"), g.events.$emit("minimap-hide"), g.events.$emit("minimap-destroy"), g.events.$emit("show-replay-controls", false), g.events.$emit("cells-changed", 0), g.events.$emit("reset-cautions"), g.events.$emit("game-stopped"), g.clearNodes(), g.scene && (g.scene.destroyBackgroundImage(false), g.scene.uninstallMassTextFont()), g.container.destroy(true), l.cells.destroyCache(), g.destroySpritePool(g.massTextPool, true), g.destroySpritePool(g.crownPool)
    }
    
    g.showMenu = function(state) {
        if (window.app.showDeathScreen) 
            return false;

        window.app.showMenu = state;
        g.actions.stopMovement(state);

        if (state)
            g.events.$emit("menu-opened");
        else {
            var node = document.activeElement;
            
            if (node?.id !== "chatbox-input")
                g.renderer.view.focus();

            g.stopMovePackets = false;
            hideCaptchaBadge();
        }

        return state;
    }

    g.toggleMenu = function() {
        var state = !window.app.showMenu;
        g.showMenu(state)
    }
    
    g.triggerAutoRespawn = function() {
        g.state.isAlive ? g.state.deathScreen = false : (clearTimeout(g.deathTimeout), delete g.deathTimeout, g.state.isAutoRespawning ? (g.state.deathScreen = false, g.joinGame()) : (g.showMenu(false), g.showDeathScreen(true), g.events.$emit("refresh-deathscreen-ad")), g.state.isAutoRespawning = false)
    }, g.showDeathScreen = function(e) {
        window.app.showDeathScreen = e
    }, g.setDeathStats = function(e) {
        window.app.deathStats = e
    }

    g.tick = function(delta) {
        g.timestamp = Date.now();
        g.deltaTime = delta;

        for (var i = g.removedNodes.length - 1; i >= 0; i--) {
            var node = g.removedNodes[i];

            if (node.update()) {
                node.destroySprite();
                g.removedNodes.splice(i, 1);
            }
        }

        var hostPid = g.playerId,
            multiPid = g.multiboxPid;

        var sortedNodes = g.nodelist;

        var score = 0,
            x = 0,
            y = 0,
            overallSize = 0,
            cellCount = 0;

        for (var i = 0; i < sortedNodes.length; i++) {
            var node = sortedNodes[i];
            node.update();

            if (node.pid === hostPid || node.pid === multiPid) {
                var mass = node.getMass();

                x += node.x * wSize;
                y += node.y * wSize;

                overallSize += node.nSize;

                if (node.pid === hostPid)
                    cellCount++;
            }
        }

        if (g.cellCount !== cellCount)
            g.events.$emit('cells-changed', cellCount);

        g.scene.sort();

        if (g.spectating) {
            x = g.center.x;
            y = g.center.y;

            g.score = 0;
            delete g.highscore;
        } else if (score) {
            x /= score;
            y /= score;

            g.score = score;
            g.highscore = Math.max(score, g.highscore);
        } else {
            return void g.renderer.render(g.container);
        }

        var speed = n.cameraMoveSmoothing * g.deltaTime;
        g.camera.position.x = lerp(g.camera.position.x, x, speed);
        g.camera.position.y = lerp(g.camera.position.y, y, speed)

        if (g.timestamp >= g.moveWaitUntil) {
            g.updateMouse();
            g.splitCount = 0
        }

        if (n.autoZoom) {
            var mul = Math.min(64 / overallSize, 1);
            g.cameraScale = g.zoom * Math.pow(mul, .27)
        } else {
            g.cameraScale = g.zoom;
        }

        var scale = lerp(g.camera.scale.x, g.cameraScale, n.cameraZoomSmoothing * g.deltaTime);
        g.camera.scale.set(scale);
        g.renderer.render(g.container);
    }

    g.updateMouse = function(e = false) {
        if (!g.mouseFrozen || e) {
            var t = g.rawMouse.x,
                s = g.rawMouse.y,
                a = 1 / g.camera.scale.x,
                n = 1 / g.camera.scale.y,
                i = g.container;
            g.mouse.x = i.pivot.x + (t - window.innerWidth / 2) * a, g.mouse.y = i.pivot.y + (s - window.innerHeight / 2) * n, g.mouse.x = Math.min(Math.max(g.mouse.x, -32768), 32767), g.mouse.y = Math.min(Math.max(g.mouse.y, -32768), 32767)
        }
    }, g.joinGame = function() {
        var e = new u;
        e.uint8(1), y(e);
        var t = e.write();
        g.send(t)
    }, g.sendJoinData = function(e) {
        var t = new u;
        t.uint8(5), t.uint8(g.clientVersion), t.uint8Array(e), y(t);
        var s = localStorage.vanisToken;
        if (s) {
            /^wss?:\/\/[a-zA-Z0-9_-]+\.vanis\.io/i.test(g.ws.url) && t.utf8(s)
        }
        var a = t.write();
        g.send(a)
    }, g.seededRandom = function(e) {
        var t = 1e4 + g.instanceSeed,
            s = Math.sin(e) * t;
        return s - Math.floor(s)
    }, g.getThumbnail = function() {
        var e = g.container,
            t = new PIXI.Container;
        t.pivot.x = e.position.x, t.pivot.y = e.position.y, t.position.x = 120, t.position.y = 67.5, t.scale.set(.25), t.addChild(e);
        var s = PIXI.RenderTexture.create(240, 135);
        g.renderer.render(t, s), t.removeChild(e);
        var a = g.renderer.extract.canvas(s),
            i = document.createElement("canvas");
        i.width = 240, i.height = 135;
        var r = i.getContext("2d");
        r.beginPath(), r.rect(0, 0, 240, 135), r.fillStyle = n.backgroundColor, r.fill(), r.drawImage(a, 0, 0, 240, 135);
        var o = i.toDataURL();
        return s.destroy(true), o
    }, g.sendChatMessage = function(e) {
        for (var t = unescape(encodeURIComponent(e)), s = [99], a = 0; a < t.length; a++) s.push(t.charCodeAt(a));
        var n = new Uint8Array(s).buffer;
        g.send(n)
    }, g.addServerMessage = function(e) {
        g.events.$emit("chat-message", {
            text: e,
            textColor: "#828282"
        })
    }, g.setTagId = function(e) {
        return e || (e = null), e !== g.tagId && (g.tagId = e, true)
    }, g.levelUp = function(e) {
        d.toast.fire({
            title: "You have reached level " + e + "!",
            background: "#b37211",
            timer: 3e3
        })
    }, g.showError = function(e) {
        d.toast.fire({
            type: "error",
            title: e,
            timer: 5e3
        })
    }, g.getShortMass = function(e) {
        return e < 1e3 ? e.toString() : (Math.round(.001 * e * 10) / 10).toFixed(1) + "k"
    }
    
    g.shouldAutoRespawn = () => !!n.autoRespawn/* && (!window.app.showMenu && !(Date.now() - g.lastDeathTime > 6e4))*/

    setInterval(() => g.events.$emit("minute-passed"), 1000*60);
    
    module.exports = g;
}, , , function(e, t) {
    var s = {
        useWebGL: true,
        gameResolution: 1,
        smallTextThreshold: 40,
        autoZoom: false,
        autoRespawn: false,
        mouseFreezeSoft: true,
        drawDelay: 120,
        cameraMoveSmoothing: .18,
        cameraZoomSmoothing: .14,
        cameraZoomSpeed: 10,
        replayDuration: 8,
        showNames: 2,
        showMass: 2,
        showSkins: 1,
        showOwnName: true,
        showOwnMass: true,
        showOwnSkin: true,
        showCrown: true,
        foodVisible: true,
        eatAnimation: true,
        showHud: true,
        showLeaderboard: true,
        showServerName: false,
        showChat: true,
        showChatToast: false,
        minimapEnabled: true,
        minimapLocations: true,
        showFPS: true,
        showPing: true,
        showCellCount: true,
        showPlayerScore: false,
        showPlayerMass: true,
        showClock: false,
        showSessionTime: false,
        showPlayerCount: false,
        showSpectators: false,
        showRestartTiming: false,
        showBlockedMessageCount: true,
        filterChatMessages: true,
        backgroundColor: "101010",
        borderColor: "000000",
        foodColor: "ffffff",
        ejectedColor: "ffa500",
        cellNameOutlineColor: "000000",
        cursorImageUrl: null,
        backgroundImageUrl: "img/background.png",
        virusImageUrl: "img/virus.png",
        cellMassColor: "ffffff",
        cellMassOutlineColor: "000000",
        cellNameFont: "Hind Madurai",
        cellNameWeight: 1,
        cellNameOutline: 2,
        cellNameSmoothOutline: true,
        cellLongNameThreshold: 750,
        cellMassFont: "Ubuntu",
        cellMassWeight: 2,
        cellMassOutline: 2,
        cellMassTextSize: 0,
        cellMassSmoothOutline: true,
        shortMass: true,
        showBackgroundImage: true,
        backgroundImageRepeat: true,
        backgroundDefaultIfUnequal: true,
        backgroundImageOpacity: .6,
        useFoodColor: false,
        namesEnabled: true,
        skinsEnabled: true,
        massEnabled: true,
        showLocations: false,
        cellBorderSize: 1,
        autoHideReplayControls: false,
        minimapSize: 220,
        minimapFPS: 30,
        minimapSmoothing: .08
    };

    function a(e) {
        switch (e) {
            case 2:
                return "bold";
            case 0:
                return "thin";
            default:
                return "normal"
        }
    }

    function n(e, t) {
        var s;
        switch (e) {
            case 3:
                s = t / 5;
                break;
            case 1:
                s = t / 20;
                break;
            default:
                s = t / 10
        }
        return Math.ceil(s)
    }
    e.exports = window.settings = new class {
        constructor() {
            this.getInternalSettings(), this.userDefinedSettings = this.loadUserDefinedSettings(), Object.assign(this, s, this.userDefinedSettings), this.set("skinsEnabled", true), this.set("namesEnabled", true), this.set("massEnabled", true), this.compileNameFontStyle(), this.compileMassFontStyle()
        }
        getInternalSettings() {
            this.cellSize = 512, this.cellNamePadding = 350, this.cellRenderSize = this.cellSize + this.cellNamePadding, this.cellScaleRatio = this.cellRenderSize / this.cellSize
        }
        compileNameFontStyle() {
            var e = {
                fontFamily: this.cellNameFont,
                fontSize: 80,
                fontWeight: a(this.cellNameWeight)
            };
            return this.cellNameOutline && (e.stroke = PIXI.utils.string2hex(this.cellNameOutlineColor), e.strokeThickness = n(this.cellNameOutline, e.fontSize), e.lineJoin = this.cellNameSmoothOutline ? "round" : "miter"), this.nameTextStyle = e
        }
        compileMassFontStyle() {
            var e = {
                fontFamily: this.cellMassFont,
                fontSize: 56 + 20 * this.cellMassTextSize,
                fontWeight: a(this.cellMassWeight),
                lineJoin: "round",
                fill: PIXI.utils.string2hex(this.cellMassColor)
            };
            return this.cellMassOutline && (e.stroke = PIXI.utils.string2hex(this.cellMassOutlineColor), e.strokeThickness = n(this.cellMassOutline, e.fontSize), e.lineJoin = this.cellMassSmoothOutline ? "round" : "miter"), this.massTextStyle = e
        }
        loadUserDefinedSettings() {
            if (localStorage.settings) try {
                return JSON.parse(localStorage.settings)
            } catch (e) {
                console.error("loadUserDefinedSettings:", e.message)
            }
            return {}
        }
        getDefault(e) {
            return s[e]
        }
        set(e, t) {
            return this[e] !== t && (this[e] = t, this.userDefinedSettings[e] = t, localStorage.settings = JSON.stringify(this.userDefinedSettings), true)
        }
    }
}, function(e, t, s) {
    var a = s(271).default,
        n = a.mixin({
            toast: true,
            position: "top",
            showConfirmButton: false,
            showCloseButton: true
        });
    window.Swal = a, e.exports = {
        toast: n,
        alert: function(e) {
            a.fire({
                text: e,
                confirmButtonText: "OK"
            })
        },
        confirm: function(e, t, s) {
            var n = {
                text: e,
                showCancelButton: true,
                confirmButtonText: "Continue"
            };
            a.fire(n).then(e => {
                e.value ? t() : s && s()
            })
        },
        instance: a
    }
}, , , function(e, t) {
    var s = false;
    e.exports = {
        lerp: function(e, t, s) {
            return (1 - s) * e + s * t
        },
        clampNumber: function(e, t, s) {
            return Math.min(Math.max(e, t), s)
        },
        createBuffer: function(e) {
            return new DataView(new ArrayBuffer(e))
        },
        getTimeString: function(e, t, s) {
            e instanceof Date && (e = e.getTime());
            var a = t ? 1 : 1e3,
                n = 60 * a,
                i = 60 * n;
            if (e < a) return "1 second";
            for (var r = [24 * i, i, n, a], o = ["day", "hour", "minute", "second"], l = false, c = [], u = 0; u < r.length; u++) {
                var d = r[u],
                    h = Math.floor(e / d);
                if (h) {
                    var p = o[u],
                        v = h > 1 ? "s" : "";
                    c.push(h + " " + p + v), e %= d
                }
                if (l) break;
                h && !s && (l = true)
            }
            return c.join(", ")
        },
        htmlEncode: function(e) {
            return e = e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, "&apos;").replace(/"/g, "&quot;")
        },
        getTimestamp: function() {
            var e = new Date,
                t = e.getMonth() + 1,
                s = e.getDate();
            return [e.getFullYear(), (t > 9 ? "" : "0") + t, (s > 9 ? "" : "0") + s].join("") + "-" + [("0" + e.getHours()).slice(-2), ("0" + e.getMinutes()).slice(-2), ("0" + e.getSeconds()).slice(-2)].join("")
        },
        loadImage: function(e) {
            return fetch(e, {
                mode: "cors"
            }).then(e => e.blob()).then(e => createImageBitmap(e))
        },
        hideCaptchaBadge: function() {
            !s && (document.body.classList.add("hide-captcha-badge"), s = true)
        },
        destroyPixiPlugins: function(e) {
            ["interaction", "accessibility"].forEach(t => {
                var s = e.plugins[t];
                s && (s.destroy(), delete e.plugins[t])
            })
        }
    }
}, , , , function(e, t, s) {
    var a = s(122),
        n = s(123),
        i = s(124);
    e.exports = {
        cells: a,
        squares: n,
        virus: i
    }
}, , function(e, t, s) {
    var a = s(1),
        n = s(12);
    s(4);
    e.exports = class {
        constructor(e) {
            this.game = a, this.id = e.id || 0, this.oSize = this.size = e.size, this.updateTime = 0, this.newPositionScale = 1, this.removed = false, this.texture = e.texture || n.cells.getTexture(0), this.sprite = new PIXI.Sprite(this.texture), this.sprite.anchor.set(.5), this.sprite.gameData = this, this.x = this.ox = this.sprite.position.x = e.x, this.y = this.oy = this.sprite.position.y = e.y
        }
        getMass() {
            var e = this.nSize;
            return Math.floor(e * e / 100)
        }
        update() {
            var e = this.game.settings.drawDelay,
                t = (this.game.timestamp - this.updateTime) / e;
            if (t = 0 > t ? 0 : 1 < t ? 1 : t, this.removed && (t >= 1 || this.texture.clearedFromCache)) return true;
            this.size = t * (this.nSize - this.oSize) + this.oSize, this.sprite.width = this.sprite.height = 2 * this.size, this.sprite.position.x = this.x = t * this.newPositionScale * (this.nx - this.ox) + this.ox, this.sprite.position.y = this.y = t * this.newPositionScale * (this.ny - this.oy) + this.oy, this.onUpdate && this.onUpdate()
        }
        destroy(e) {
            if (this.removed) console.warn("Cell already removed!");
            else {
                this.onDestroy && this.onDestroy();
                var t = this.game.nodelist,
                    s = t.indexOf(this);
                s >= 0 && t.splice(s, 1), delete this.game.nodes[this.id], this.removed = true, e ? this.game.removedNodes.push(this) : this.destroySprite()
            }
        }
        destroySprite() {
            this.sprite ? (this.sprite.destroy(), this.sprite = null) : console.warn("Sprite already destroyed!")
        }
    }
}, , , function(e, t, s) {
    var a = s(5);

    function n() {
        a.instance.fire({
            type: "warning",
            title: "Browser Unsupported",
            html: "Skins might not work properly in this browser.<br>Please consider using Chrome.",
            allowOutsideClick: false
        })
    }

    function i(e) {
        for (var t = "", s = 0; s < e.length; s++) {
            var a = e.charCodeAt(s) - 2;
            t += String.fromCharCode(a)
        }
        return t
    }
    var r = ["pkiigt", "p3iigt", "pkii5t", "pkiic", "p3iic", "p3ii6", "pkii", "p3ii", "pki", "p3i", "hciiqv", "h6iiqv", "hcii2v", "hci", "cpcn", "cuujqng", "ewpv", "rwuu{", "xcikpc", "xci3pc", "eqem", "e2em", "uewo", "ycpm", "yjqtg", "yj2tg", "unwv", "dkvej", "d3vej", "rqtp", "r2tp", "tcrg", "t6rg", "jkvngt", "j3vngt", "jkvn5t", "j3vn5t", "pc|k", "p6|k", "tgvctf", "ejkpm", "hwem", "ujkv"],
        o = r.map(i),
        l = r.map(i).sort((e, t) => t.length - e.length).map(e => new RegExp("[^s]*" + e.split("").join("s*") + "[^s]*", "gi"));
    e.exports = {
        noop: function() {},
        checkBadWords: function(e) {
            return e = e.toLowerCase(), o.some(t => e.includes(t))
        },
        replaceBadWordsChat: function(e) {
            for (var t = 0; t < l.length; t++) e = e.replace(l[t], e => new Array(e.length).fill("*").join(""));
            return e
        },
        notifyUnsupportedBrowser: async function() {
            window.safari || /^((?!chrome|android).)*safari/i.test(navigator.userAgent) ? a.instance.fire({
                type: "warning",
                title: "Safari browser is not supported :(",
                html: "Please consider using Google Chrome.",
                allowOutsideClick: false,
                showCloseButton: false,
                showCancelButton: false,
                showConfirmButton: false
            }) : localStorage.skipUnsupportedAlert || (localStorage.skipUnsupportedAlert = true, navigator.userAgent.toLowerCase().includes("edge") ? n() : !await new Promise(e => {
                var t = new Image;
                t.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA", t.onload = t.onerror = (() => {
                    e(2 === t.height)
                })
            }) && n())
        },
        isFirstVisit: !localStorage.visitedBefore && (localStorage.visitedBefore = true, true)
    }
}, , , , , , , function(e, t, s) {
    var a = s(4),
        n = s(8);
    PIXI.utils.skipHello();
    var i = document.getElementById("canvas"),
        r = {
            resolution: a.customResolution || window.devicePixelRatio || 1,
            view: i,
            forceCanvas: !a.useWebGL,
            antialias: false,
            powerPreference: "high-performance",
            backgroundColor: PIXI.utils.string2hex(a.backgroundColor)
        };
    r.resolution = a.gameResolution;
    var o = PIXI.autoDetectRenderer(r);

    function l() {
        o.resize(window.innerWidth, window.innerHeight)
    }
    l(), n.destroyPixiPlugins(o), window.addEventListener("resize", l), o.clear(), e.exports = o
}, , , , function(e, t, s) {
    var a = s(2),
        n = s(168);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    "use strict";
    var a = s(30),
        n = s.n(a);
    t.default = n.a
}, function(e, t) {
    e.exports = {
        data: () => ({})
    }
}, function(e, t, s) {
    var a = s(2),
        n = s(170);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(172);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(174);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(176);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(178);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(180);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    "use strict";
    var a = s(38),
        n = s.n(a);
    t.default = n.a
}, function(e, t, s) {
    var a = s(88),
        n = s(1),
        i = s(5),
        r = n.replay.database;
    e.exports = {
        props: ["replay"],
        methods: {
            async play(e) {
                if (n.isConnected() && !await new Promise(e => {
                        i.confirm("You will be disconnected from current game before replay", () => e(true), () => e(false))
                    })) return;
                try {
                    n.replay.play(e)
                } catch (e) {
                    i.alert("Replay data is corrupted!")
                }
            },
            downloadReplay(e) {
                i.instance.fire({
                    input: "text",
                    inputValue: e.name,
                    showCancelButton: true,
                    confirmButtonText: "Download",
                    html: "This file is not a video file and only Vanis.io website can play it.<br>File consists of player positions and other game related data."
                }).then(t => {
                    var s = t.value;
                    if (s) {
                        var n = new Blob([e.data], {
                            type: "text/plain;charset=utf-8"
                        });
                        a.saveAs(n, s + ".vanis")
                    }
                })
            },
            deleteReplay(e) {
                i.confirm("Are you sure that you want to delete this replay?", () => {
                    r.removeItem(e, () => {
                        n.events.$emit("replay-removed")
                    })
                })
            }
        }
    }
}, function(e, t, s) {
    var a = s(2),
        n = s(220);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(222);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(224);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(226);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(228);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(232);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(234);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(236);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(238);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(240);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(242);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(244);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(246);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(248);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(250);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    "use strict";
    var a = s(55),
        n = s.n(a);
    t.default = n.a
}, function(e, t, s) {
    var a = s(1),
        n = s(8),
        i = s(4),
        r = i.minimapSize,
        o = i.minimapFPS,
        l = i.minimapSmoothing,
        c = new PIXI.Container,
        u = {};

    function d() {
        return (new Date).toLocaleTimeString()
    }

    function h(e, t = false) {
        if (t && e < 1) return "instant";
        e = Math.floor(e);
        const s = Math.floor(e / 60),
            a = Math.floor(s / 60);
        return s < 1 ? t ? e + "s" : "<1min" : a < 1 ? s + "min" : s % 60 == 0 ? a + "hr" : a + "hr " + s % 60 + "min"
    }
    e.exports = {
        data: () => ({
            showMinimap: false,
            showMinimapCircle: false,
            showMinimapStats: true,
            showLocations: i.minimapLocations,
            interval: null,
            minimapStatsBottom: 10,
            showClock: i.showClock,
            showSessionTime: i.showSessionTime,
            showSpectators: i.showSpectators,
            showPlayerCount: i.showPlayerCount,
            showRestartTiming: i.showRestartTiming,
            systemTime: d(),
            sessionTime: h(0, false),
            restartTime: h(0, true),
            spectators: 0,
            playerCount: 0,
            currentTick: 0,
            restartTick: 0,
            startTime: null,
            gameState: a.state
        }),
        computed: {
            playerCountDisplayed() {
                if (this.gameState.selectedServer) {
                    var e = this.gameState.selectedServer.maxPlayers;
                    return Math.min(this.playerCount, e) + " / " + e + " players"
                }
                return this.playerCount + " player" + (1 === this.playerCount ? "" : "s")
            }
        },
        methods: {
            initRenderer(e) {
                var t = PIXI.autoDetectRenderer({
                    resolution: 1,
                    view: e,
                    width: r,
                    height: r,
                    forceCanvas: !i.useWebGL,
                    antialias: false,
                    powerPreference: "high-performance",
                    transparent: true
                });
                n.destroyPixiPlugins(t), t.clear(), this.renderer = t
            },
            onMinimapShow() {
                this.interval || (this.showMinimap = true, this.minimapStatsBottom = r + 10, a.events.$on("minimap-positions", this.updatePositions), this.interval = setInterval(this.render, 1e3 / o))
            },
            onMinimapHide() {
                this.interval && (this.showMinimap = false, this.minimapStatsBottom = 10, a.events.$off("minimap-positions", this.updatePositions), clearInterval(this.interval), this.interval = null, this.spectators = 0, this.playerCount = 0)
            },
            destroyMinimap() {
                c.destroy(true), c = new PIXI.Container, this.renderer.clear()
            },
            createNode(e, t, s, a) {
                var n = u[e];
                n && n.destroy(true);
                s || (s = 0xffffff), a || (a = 0xffffff);
                var i, r, o, l, c, d = new PIXI.Container;
                d.newPosition = {}, d.addChild((i = a, (r = new PIXI.Graphics).beginFill(i), r.drawCircle(0, 0, 5), r.endFill(), r)), t && d.addChild((o = t, l = s, (c = new PIXI.Text(o, {
                    strokeThickness: 4,
                    lineJoin: "round",
                    fontFamily: "Nunito",
                    fill: l,
                    fontSize: 12
                })).anchor.set(.5), c.pivot.y = 15, c)), u[e] = d
            },
            destroyNode(e) {
                var t = u[e];
                t ? (t.destroy(true), delete u[e]) : console.log("Minimap: trying to destroy node which doesnt exist", e)
            },
            updatePositions(e) {
                c.removeChildren();
                for (var t = 0; t < e.length; t++) {
                    var s = e[t],
                        a = u[s.pid];
                    a ? (a.newPosition.x = s.x * r, a.newPosition.y = s.y * r, c.addChild(a)) : console.warn("Minimap node not found!")
                }
                this.render()
            },
            render() {
                for (var e = c.children, t = l * (30 / o), s = 0; s < e.length; s++) {
                    var a = e[s];
                    a.position.x = n.lerp(a.position.x, a.newPosition.x, t), a.position.y = n.lerp(a.position.y, a.newPosition.y, t)
                }
                this.renderer.render(c)
            },
            drawLocationGrid(e, t) {
                var s = r / t;
                e.globalAlpha = .1, e.strokeStyle = "#202020", e.beginPath();
                for (var a = 1; a < t; a++) {
                    var n = a * s;
                    e.moveTo(n, 0), e.lineTo(n, r), e.moveTo(0, n), e.lineTo(r, n)
                }
                e.stroke(), e.closePath()
            },
            drawLocationCodes(e, t) {
                var s = r / t,
                    a = s / 2;
                e.globalAlpha = .1, e.font = "14px Nunito", e.textAlign = "center", e.textBaseline = "middle", e.fillStyle = "#ffffff";
                for (var n = 0; n < t; n++)
                    for (var i = n * s + a, o = 0; o < t; o++) {
                        var l = String.fromCharCode(97 + o).toUpperCase() + (n + 1),
                            c = o * s + a;
                        e.strokeText(l, i, c), e.fillText(l, i, c)
                    }
            },
            drawLocations(e) {
                e.width = e.height = r;
                var t = e.getContext("2d"),
                    s = r / 2;
                if (this.showLocations) {
                    if (t.save(), this.showMinimapCircle) {
                        var a = new Path2D;
                        a.ellipse(s, s, s, s, 0, 0, 2 * Math.PI), t.clip(a)
                    }
                    this.drawLocationGrid(t, 5), this.drawLocationCodes(t, 5)
                }
                t.restore(), this.showMinimapCircle && (t.globalAlpha = .45, t.beginPath(), t.arc(s, s, s + 1, -Math.PI / 2, 0), t.lineTo(r, 0), t.closePath(), t.fill())
            }
        },
        created() {
            a.events.$on("minimap-show", this.onMinimapShow), a.events.$on("minimap-hide", this.onMinimapHide), a.events.$on("minimap-destroy", this.destroyMinimap), a.events.$on("minimap-create-node", this.createNode), a.events.$on("minimap-destroy-node", this.destroyNode), a.events.$on("minimap-show-locations", e => {
                this.showLocations = e, this.drawLocations(this.$refs.locations)
            }), a.events.$on("minimap-stats-visible", e => this.showMinimapStats = e), a.events.$on("minimap-stats-changed", e => {
                this.spectators = e.spectators, this.playerCount = e.playerCount
            }), a.events.$on("restart-timing-changed", e => {
                this.currentTick = e.currentTick, this.restartTick = e.restartTick
            }), a.events.$on("game-started", () => {
                this.showMinimapCircle = a.border.circle, this.drawLocations(this.$refs.locations)
            }), a.events.$on("game-stopped", () => {
                this.currentTick = 0, this.restartTick = 0
            }), a.events.$on("server-tick", () => this.currentTick++), a.events.$on("minimap-stats-invalidate-shown", () => {
                this.showClock = i.showClock, this.showSessionTime = i.showSessionTime, this.showSpectators = i.showSpectators, this.showPlayerCount = i.showPlayerCount, this.showRestartTiming = i.showRestartTiming
            }), a.events.$on("every-second", () => {
                this.systemTime = d();
                var e = (Date.now() - this.startTime) / 1e3;
                this.sessionTime = h(e, false), e = (this.restartTick - this.currentTick) / 25, this.restartTime = h(e, true)
            })
        },
        mounted() {
            this.initRenderer(this.$refs.minimap), this.startTime = Date.now()
        }
    }
}, function(e, t, s) {
    var a = s(2),
        n = s(252);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(254);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(256);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(258);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(260);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(262);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(264);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {
    var a = s(2),
        n = s(267);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, , function(e, t) {
    function s() {
        this.data = []
    }
    e.exports = s, s.prototype.write = function() {
        return new Uint8Array(this.data)
    }, s.prototype.uint8 = function(e) {
        this.data.push(e)
    }, s.prototype.uint8Array = function(e) {
        for (var t = 0; t < e.length; t++) this.data.push(e[t])
    }, s.prototype.utf8 = function(e) {
        e = unescape(encodeURIComponent(e));
        for (var t = 0; t < e.length; t++) this.data.push(e.charCodeAt(t));
        this.data.push(0)
    }
}, function(e, t, s) {
    var a = s(1),
        n = s(5),
        i = {
            toggleAutoRespawn: function() {
                var e = a.settings.autoRespawn;
                a.settings.set("autoRespawn", !e), e && a.state.isAutoRespawning && a.triggerAutoRespawn();
                var t = "Auto respawn ";
                t += e ? "disabled" : "enabled", n.toast.fire({
                    type: "info",
                    title: t,
                    timer: 1500
                })
            },
            respawn: function() {
                a.state.deathScreen || a.state.playButtonDisabled || (a.joinGame(), a.showMenu(false))
            },
            feed: a.actions.feed.bind(null),
            feedMacro: a.actions.feed.bind(null, true),
            split: a.actions.split.bind(null, 1),
            splitx2: a.actions.split.bind(null, 2),
            splitx3: a.actions.split.bind(null, 3),
            splitMax: a.actions.split.bind(null, 4),
            split32: a.actions.split.bind(null, 5),
            split64: a.actions.split.bind(null, 6),
            linesplit: a.actions.linesplit,
            freezeMouse: a.actions.freezeMouse,
            lockLinesplit: a.actions.lockLinesplit,
            stopMovement: a.actions.stopMovement,
            toggleSkins: a.actions.toggleSkins,
            toggleNames: a.actions.toggleNames,
            toggleFood: a.actions.toggleFood,
            toggleMass: a.actions.toggleMass,
            toggleChat: a.actions.toggleChat,
            toggleChatToast: a.actions.toggleChatToast,
            toggleHud: a.actions.toggleHud,
            spectateLock: a.actions.spectateLockToggle,
            selectPlayer: a.actions.targetPlayer.bind(null, true),
            saveReplay: a.replay.save,
            zoomLevel1: a.actions.setZoomLevel.bind(null, 1),
            zoomLevel2: a.actions.setZoomLevel.bind(null, 2),
            zoomLevel3: a.actions.setZoomLevel.bind(null, 3),
            zoomLevel4: a.actions.setZoomLevel.bind(null, 4),
            zoomLevel5: a.actions.setZoomLevel.bind(null, 5),
            switchMultibox: a.actions.switchMultibox
        },
        r = {
            feed: "W",
            feedMacro: "MOUSE0",
            split: "SPACE",
            splitx2: "G",
            splitx3: "H",
            splitMax: "T",
            split32: "",
            split64: "",
            linesplit: "Z",
            lockLinesplit: "",
            respawn: "",
            toggleAutoRespawn: "",
            stopMovement: "",
            toggleSkins: "",
            toggleNames: "",
            toggleMass: "",
            spectateLock: "Q",
            selectPlayer: "MOUSE1",
            saveReplay: "R",
            toggleChat: "",
            toggleChatToast: "",
            toggleHud: "",
            zoomLevel1: "1",
            zoomLevel2: "2",
            zoomLevel3: "3",
            zoomLevel4: "4",
            zoomLevel5: "5",
            switchMultibox: ""
        };
    e.exports = new class {
        constructor() {
            this.version = 2, this.pressHandlers = null, this.releaseHandlers = null, this.resetObsoleteHotkeys(), this.load()
        }
        resetObsoleteHotkeys() {
            parseInt(localStorage.hotkeysVersion) !== this.version && (localStorage.hotkeys && (console.log("Incompatible hotkeys"), localStorage.removeItem("hotkeys")), localStorage.hotkeysVersion = this.version)
        }
        load() {
            this.hotkeys = this.loadHotkeys(), this.loadHandlers(this.hotkeys)
        }
        loadHotkeys() {
            var e = Object.assign({}, r),
                t = localStorage.hotkeys;
            if (!t) return e;
            t = JSON.parse(t);
            var s = Object.values(t);
            return Object.keys(e).forEach(t => {
                var a = e[t];
                a && s.includes(a) && (e[t] = "")
            }), Object.assign(e, t)
        }
        saveHotkeys(e) {
            localStorage.hotkeys = JSON.stringify(e)
        }
        reset() {
            return localStorage.removeItem("hotkeys"), this.load(), this.hotkeys
        }
        get() {
            return this.hotkeys
        }
        set(e, t) {
            if (i[e]) {
                if (this.hotkeys[e] === t) return true;
                if (t)
                    for (var s in this.hotkeys) this.hotkeys[s] === t && (this.hotkeys[s] = "");
                return this.hotkeys[e] = t, this.saveHotkeys(this.hotkeys), this.loadHandlers(this.hotkeys), true
            }
            console.log("Invalid action name", e)
        }
        loadHandlers(e) {
            this.pressHandlers = {}, Object.keys(e).forEach(t => {
                var s = i[t];
                if (s) {
                    var a = e[t];
                    this.pressHandlers[a] = s
                } else console.warn("Invalid action in hotkeys", t)
            }), this.releaseHandlers = {}, e.feedMacro && (this.releaseHandlers[e.feedMacro] = a.actions.feed.bind(null, false))
        }
        press(e) {
            var t = this.pressHandlers[e];
            return !!t && (t(), true)
        }
        release(e) {
            var t = this.releaseHandlers[e];
            t && t()
        }
        convertKey(e) {
            return e ? e.toString().toUpperCase().replace(/^(LEFT|RIGHT|NUMPAD|DIGIT|KEY)/, "") : "Unknown"
        }
    }
}, , , , , , , function(e, t, s) {
    "use strict";
    var a = function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return t("div", [t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showMinimapStats,
                    expression: "showMinimapStats"
                }],
                staticClass: "minimap-stats",
                style: {
                    bottom: this.minimapStatsBottom + "px"
                }
            }, [t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showClock,
                    expression: "showClock"
                }]
            }, [this._v(this._s(this.systemTime))]), this._v(" "), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showSessionTime,
                    expression: "showSessionTime"
                }]
            }, [this._v(this._s(this.sessionTime) + " session")]), this._v(" "), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showPlayerCount && this.playerCount,
                    expression: "showPlayerCount && playerCount"
                }]
            }, [this._v(this._s(this.playerCountDisplayed))]), this._v(" "), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showSpectators && this.spectators,
                    expression: "showSpectators && spectators"
                }]
            }, [this._v(this._s(this.spectators) + " spectator" + this._s(1 === this.spectators ? "" : "s"))]), this._v(" "), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showRestartTiming && this.restartTick,
                    expression: "showRestartTiming && restartTick"
                }]
            }, [this._v("Restart in " + this._s(this.restartTime))])]), this._v(" "), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showMinimap,
                    expression: "showMinimap"
                }],
                staticClass: "container",
                class: {
                    circle: this.showMinimapCircle
                }
            }, [t("canvas", {
                ref: "locations",
                attrs: {
                    id: "locations"
                }
            }), this._v(" "), t("canvas", {
                ref: "minimap",
                attrs: {
                    id: "minimap"
                }
            })])])
        },
        n = [];
    a._withStripped = true, s.d(t, "a", function() {
        return a
    }), s.d(t, "b", function() {
        return n
    })
}, function(e, t, s) {
    "use strict";
    var a = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("transition", {
                attrs: {
                    name: "fade",
                    appear: ""
                }
            }, [s("div", {
                staticClass: "modal"
            }, [s("div", {
                staticClass: "overlay",
                on: {
                    click: function(t) {
                        return e.$emit("close")
                    }
                }
            }), e._v(" "), s("i", {
                staticClass: "fas fa-times-circle close-button",
                on: {
                    click: function(t) {
                        return e.$emit("close")
                    }
                }
            }), e._v(" "), s("div", {
                staticClass: "wrapper"
            }, [s("transition", {
                attrs: {
                    name: "scale",
                    appear: ""
                }
            }, [s("div", {
                staticClass: "content fade-box"
            }, [e._t("default", [e._v("Here should be something")])], 2)])], 1)])])
        },
        n = [];
    a._withStripped = true, s.d(t, "a", function() {
        return a
    }), s.d(t, "b", function() {
        return n
    })
}, function(e, t, s) {
    "use strict";
    var a = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                staticClass: "replay-item",
                style: {
                    backgroundImage: "url('" + e.replay.image + "')"
                },
                on: {
                    click: function(t) {
                        return e.play(e.replay.data)
                    }
                }
            }, [s("div", {
                staticClass: "replay-header",
                on: {
                    click: function(e) {
                        e.stopPropagation()
                    }
                }
            }, [s("div", {
                staticClass: "replay-name"
            }, [e._v(e._s(e.replay.name))]), e._v(" "), s("div", [s("i", {
                staticClass: "replay-button fas fa-cloud-download-alt",
                on: {
                    click: function(t) {
                        return t.stopPropagation(), e.downloadReplay(e.replay)
                    }
                }
            }), e._v(" "), s("i", {
                staticClass: "replay-button fas fa-trash-alt",
                on: {
                    click: function(t) {
                        return t.stopPropagation(), e.deleteReplay(e.replay.name)
                    }
                }
            })])])])
        },
        n = [];
    a._withStripped = true, s.d(t, "a", function() {
        return a
    }), s.d(t, "b", function() {
        return n
    })
}, function(e, t) {
    t.neon = [16776960, 65280, 65535, 0xff00ff], t.basic = [16711680, 16744448, 16776960, 8453888, 65280, 65408, 65535, 33023, 8388863, 0xff00ff, 16711808], t.basicd = t.basic.map(e => {
        var t = e >> 16 & 255,
            s = e >> 8 & 255,
            a = 255 & e;
        return (t *= .5) << 16 | (s *= .5) << 8 | (a *= .5) >> 0
    })
}, function(e, t, s) {
    // Previously; ad integration
}, function(e, t) {
    e.exports = function(e) {
        var t = 1,
            s = {
                border: {}
            };
        return s.protocol = e.getUint8(t, true), t += 1, s.protocol >= 4 ? (s.gamemodeId = e.getUint8(t, true), t += 1, s.instanceSeed = e.getUint16(t, true), t += 2, s.playerId = e.getUint16(t, true), t += 2, s.border.minx = e.getInt16(t, true), t += 2, s.border.miny = e.getInt16(t, true), t += 2, s.border.maxx = e.getInt16(t, true), t += 2, s.border.maxy = e.getInt16(t, true), t += 2, s.flags = e.getUint8(t, true), t += 1, s.border.circle = !!(1 & s.flags), s.border.width = s.border.maxx - s.border.minx, s.border.height = s.border.maxy - s.border.miny) : (s.protocol >= 2 ? (s.gamemodeId = e.getUint8(t, true), t += 1, s.instanceSeed = e.getUint16(t, true), t += 2, s.playerId = e.getUint16(t, true), t += 2, s.border.width = e.getUint32(t, true), t += 4, s.border.height = e.getUint32(t, true), t += 4) : function() {
            s.instanceSeed = e.getUint16(t, true), t += 2, s.playerId = e.getUint16(t, true), t += 2;
            var a = e.getUint16(t, true);
            t += 2, s.border.width = a, s.border.height = a
        }(), s.border.minx = -s.border.width / 2, s.border.miny = -s.border.height / 2, s.border.maxx = +s.border.width / 2, s.border.maxy = +s.border.height / 2), s.border.x = (s.border.minx + s.border.maxx) / 2, s.border.y = (s.border.miny + s.border.maxy) / 2, s
    }
}, function(e, t, s) {
    t.PlayerCell = s(136), t.Food = s(137), t.Virus = s(138), t.EjectedMass = s(139), t.DeadCell = s(140), t.Crown = s(141)
}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, s) {
    "use strict";
    var a = s(74),
        n = s(29),
        i = (s(169), s(0)),
        r = Object(i.a)(n.default, a.a, a.b, false, null, "0eaeaf66", null);
    r.options.__file = "src/components/modal.vue", t.default = r.exports
}, function(e, t, s) {
    "use strict";
    var a = s(75),
        n = s(37),
        i = (s(219), s(0)),
        r = Object(i.a)(n.default, a.a, a.b, false, null, "1dbc6ed9", null);
    r.options.__file = "src/components/replay-item.vue", t.default = r.exports
}, function(e, t, s) {
    "use strict";
    var a = s(73),
        n = s(54),
        i = (s(251), s(0)),
        r = Object(i.a)(n.default, a.a, a.b, false, null, "4c95bd45", null);
    r.options.__file = "src/components/minimap.vue", t.default = r.exports
}, function(e, t, s) {
    "use strict";
    s.r(t);
    var a = s(8),
        n = (s.n(a), s(118));
    s.n(n);
    window.v = 5; // Used by security
    s(17).notifyUnsupportedBrowser(), s(1), s(131), s(133), s(149), s(270), s(268), s(269)
}, function(e, t, s) {
    var a = s(2),
        n = s(119);
    "string" == typeof(n = n.__esModule ? n.default : n) && (n = [[e.i, n, ""]]);
    var i = {
            insert: "head",
            singleton: false
        },
        r = (a(n, i), n.locals ? n.locals : {});
    e.exports = r
}, function(e, t, s) {}, function(e, t) {
    e.exports = class {
        constructor(e) {
            this.position = e.pivot, this.scale = e.scale
        }
    }
}, function(e, t, s) {
    var a = s(4),
        n = s(12);

    function i({
        width: e,
        height: t,
        circle: s
    }) {
        var n = PIXI.utils.string2hex(a.borderColor),
            i = new PIXI.Graphics;
        return i.lineStyle(100, n, 1, .5), s ? i.drawEllipse(e / 2, t / 2, e / 2, t / 2) : i.drawRect(0, 0, e, t), i.endFill(), i.pivot.set(e / 2, t / 2), i
    }
    e.exports = class {
        constructor(e, t, s) {
            this.game = e, this.border = t, this.container = new PIXI.Container, this.background = new PIXI.Container, this.borderSprite = i(t), this.background.addChild(this.borderSprite), this.foreground = new PIXI.Container, this.food = new PIXI.Container, this.food.visible = a.foodVisible, this.resetMassTextStyle(false), this.container.addChild(this.background, this.food, this.foreground), this.setPosition(), s && this.setBackgroundImage(), this.background.position.x = t.x, this.background.position.y = t.y
        }
        setPosition() {
            this.container.position.x = window.innerWidth / 2, this.container.position.y = window.innerHeight / 2
        }
        sort() {
            this.foreground.children.sort((e, t) => (e = e.gameData).size === (t = t.gameData).size ? e.id - t.id : e.size - t.size)
        }
        addCell(e) {
            this.foreground.addChild(e)
        }
        addFood(e) {
            this.food.addChild(e)
        }
        toggleBackgroundImage(e) {
            e && !this.backgroundSprite ? this.setBackgroundImage() : e || this.destroyBackgroundImage(true)
        }
        setBackgroundImage() {
            var e = a.backgroundImageUrl;
            if (e) {
                var t = (a.backgroundImageRepeat ? PIXI.TilingSprite : PIXI.Sprite).from(e, {});
                t.width = this.border.width, t.height = this.border.height, t.alpha = a.backgroundImageOpacity, t.anchor.set(.5);
                var s = this.backgroundSprite;
                if (s) {
                    var n = t.texture !== s.texture;
                    this.destroyBackgroundImage(n)
                }
                if (this.backgroundSprite = t, this.background.addChildAt(t, 0), this.border.circle) {
                    var i = function({
                        width: e,
                        height: t
                    }) {
                        var s = new PIXI.Graphics;
                        return s.beginFill(0xffffff), s.drawEllipse(e / 2, t / 2, e / 2, t / 2), s.endFill(), s.pivot.set(e / 2, t / 2), s
                    }(this.border);
                    this.background.addChildAt(i, 1), this.backgroundSprite.mask = i
                }
            } else this.destroyBackgroundImage()
        }
        destroyBackgroundImage(e) {
            this.backgroundSprite && (this.backgroundSprite.destroy(!!e), this.backgroundSprite = null)
        }
        resetBorder() {
            this.borderSprite.destroy(), this.borderSprite = i(this.border), this.background.addChild(this.borderSprite)
        }
        reloadFoodTextures() {
            this.game.nodelist.forEach(e => {
                e.isFood && e.reloadTexture()
            })
        }
        reloadEjectedTextures() {
            this.game.nodelist.forEach(e => {
                e.isEjected && e.reloadTexture()
            })
        }
        reloadVirusTexture() {
            n.virus.loadVirusFromUrl(a.virusImageUrl)
        }
        resetPlayerLongNames() {
            for (let e in this.game.playerManager.players) this.game.playerManager.players[e].applyNameToSprite()
        }
        resetNameTextStyle() {
            for (var e = this.game.settings.nameTextStyle, t = 0; t < this.game.nodelist.length; t++) {
                var s = this.game.nodelist[t];
                s.isPlayerCell && s.nameSprite && (s.nameSprite.destroy(false), s.nameSprite = null)
            }
            for (let t in this.game.playerManager.players) {
                var a = this.game.playerManager.players[t];
                if (a.nameSprite) {
                    var n = a.nameSprite.style.fill;
                    a.nameSprite.style = e, a.nameSprite.style.fill = n, a.nameSprite.updateText()
                }
            }
        }
        resetMassTextStyle(e) {
            var t = this.game.settings.massTextStyle;
            for (e && this.uninstallMassTextFont(), PIXI.BitmapFont.from("mass", t, {
                    chars: "1234567890k."
                }); this.game.massTextPool.length;) this.game.massTextPool.pop().destroy(false);
            for (var s = 0; s < this.game.nodelist.length; s++) {
                var a = this.game.nodelist[s];
                a.isPlayerCell && a.massText && (a.sprite.removeChild(a.massText), a.massText.destroy(false), a.massText = null)
            }
        }
        uninstallMassTextFont() {
            PIXI.BitmapFont.uninstall("mass")
        }
    }
}, function(e, t, s) {
    var a = s(4),
        n = s(24),
        i = {};
    e.exports = {
        getTexture: function(e) {
            var t = i[e];
            return t || (i[e] = function(e) {
                var t, s, i, r = a.cellSize,
                    o = r / 2,
                    l = (t = o, s = e, (i = new PIXI.Graphics).beginFill(s), i.drawCircle(0, 0, t), i.endFill(), i);
                l.position.set(o);
                var c = PIXI.RenderTexture.create(r, r);
                return n.render(l, c), c
            }(e))
        },
        destroyCache: function() {
            for (var e in i) i[e].destroy(true), delete i[e]
        }
    }
}, function(e, t, s) {
    var a = s(4),
        n = s(24),
        i = {};
    e.exports = {
        getTexture: function(e) {
            var t = i[e];
            return t || (i[e] = function(e) {
                var t, s, i, r = a.cellSize,
                    o = r / 2,
                    l = (t = o, s = e, (i = new PIXI.Graphics).beginFill(s), i.drawRect(-t, -t, 2 * t, 2 * t), i.endFill(), i);
                l.position.set(o);
                var c = PIXI.RenderTexture.create(r, r);
                return n.render(l, c), c
            }(e))
        },
        destroyCache: function() {
            for (var e in i) i[e].destroy(true), delete i[e]
        }
    }
}, function(e, t, s) {
    var a = s(24),
        {
            loadImage: n
        } = s(8),
        i = 200,
        r = PIXI.RenderTexture.create(i, i),
        o = Promise.resolve();
    e.exports = {
        getTexture: function() {
            return r
        },
        loadVirusFromUrl: async function(e) {
            await o, o = new Promise(async t => {
                var s = await n(e),
                    o = PIXI.Sprite.from(s);
                o.width = o.height = i, a.render(o, r, true), o.destroy(true), t()
            })
        }
    }
}, function(e, t, s) {
    var a = s(126);
    e.exports = class {
        constructor(e) {
            this.game = e, this.players = {}, this.playersRemoving = [], this.playerCount = 0
        }
        getPlayer(e) {
            var t = this.players[e] || null;
            return t || console.warn("Trying to get non-existing player", e), t
        }
        setPlayerData({
            pid: e,
            nickname: t,
            skinUrl: s,
            nameColor: n,
            tagId: i,
            bot: r
        }) {
            var o = this.players[e];
            o || (o = this.players[e] = new a(this.game, e, r), r || this.playerCount++);
            var l = o.setName(t, n),
                c = o.setSkin(s),
                u = o.setTagId(i);
            return (l || c || u) && o.invalidateVisibility(), o
        }
        invalidateVisibility(e = []) {
            for (var t in this.players) {
                var s = this.players[t]; - 1 === e.indexOf(s) && s.invalidateVisibility()
            }
        }
        delayedRemovePlayer(e) {
            this.playersRemoving.push(e)
        }
        sweepRemovedPlayers() {
            for (var e = this.game.replay.updateHistory, t = (e.length > 0 ? e[0].packetId : -1) - 10, s = 0, a = this.playersRemoving.length; s < a;) {
                var n = this.playersRemoving[s];
                if (n in this.players) {
                    var i = this.getPlayer(n).lastUpdateTick;
                    !i || t > i ? (this.removePlayer(n), this.playersRemoving.splice(s, 1), a--) : s++
                } else console.log("Player was already removed?"), this.playersRemoving.splice(s, 1), a--
            }
        }
        removePlayer(e) {
            var t = this.players[e];
            t && (this.playerCount--, t.clearCachedData(), delete this.players[e])
        }
        destroy() {
            for (var e in this.players) this.removePlayer(e);
            this.playersRemoving.splice(0, this.playersRemoving.length)
        }
    }
}, function(e, t, s) {
    var a = s(4),
        n = s(76),
        i = n.basic,
        r = n.basicd,
        o = a.cellSize;

    function l(e) {
        e = e || 0;
        var t = new PIXI.Graphics;
        return t.lineStyle(a.cellBorderSize, 0, .5), t.beginFill(e), t.drawCircle(0, 0, a.cellSize / 2), t.endFill(), t
    }
    e.exports = class {
        constructor(e, t, s) {
            this.game = e, this.pid = t, this.bot = s, this.skinUrl = null, this.tagId = null, this.isMe = t === e.playerId || t === e.multiboxPid, this.texture = PIXI.RenderTexture.create(o, o), this.cellContainer = this.createCellContainer(), this.renderCell()
        }
        get visibility() {
            return this.game.tagId === this.tagId ? 1 : 2
        }
        setOutline(e) {
            e = e || 0, this.outlineColor = e;
            var t = a.cellSize / 2,
                s = new PIXI.Graphics;
            s.lineStyle(20, e, 1), s.drawCircle(0, 0, t - 9.5), s.endFill(), s.pivot.set(-t), this.game.renderer.render(s, this.texture, false)
        }
        setCrown(e) {
            this.hasCrown = e;
            for (var t = this.pid, s = this.game.nodelist, a = 0; a < s.length; a++) {
                var n = s[a];
                n.pid === t && (e ? n.addCrown() : n.removeCrown())
            }
        }
        createCellContainer() {
            var e = new PIXI.Container,
                t = l(this.getCellColor());
            return e.pivot.set(-o / 2), e.addChild(t), e
        }
        createSkinSprite(e) {
            var t = new PIXI.BaseTexture(e),
                s = new PIXI.Texture(t),
                n = new PIXI.Sprite(s);
            return n.width = n.height = a.cellSize, n.anchor.set(.5), n
        }
        renderCell() {
            console.assert(this.cellContainer.children.length <= 3, "cellContainer has unexpected sprites"), this.game.renderer.render(this.cellContainer, this.texture, true), this.outlineColor && this.setOutline(this.outlineColor)
        }
        setTagId(e) {
            return e || (e = null), e !== this.tagId && (this.tagId = e, true)
        }
        setNameColor(e) {
            return e ? (e = parseInt(e, 16), this.nameColor = e, this.nameColorCss = PIXI.utils.hex2string(e)) : (this.nameColor = null, this.nameColorCss = null), this.nameColor
        }
        setName(e, t) {
            return e || (e = "Unnamed"), (this.nameFromServer !== e || this.nameColorFromServer !== t) && (this.nameFromServer = e, this.nameColorFromServer = t, this.applyNameToSprite(), true)
        }
        applyNameToSprite() {
            var e, t = "Unnamed" === this.nameFromServer,
                s = "Long Name" === this.nameFromServer,
                n = t ? "" : this.nameFromServer,
                i = this.name,
                r = this.nameColor;
            if (e = t || s ? this.setNameColor(null) : this.setNameColor(this.nameColorFromServer), this.setNameSprite(n, e), !t && !s && this.nameSprite.texture.width > a.cellLongNameThreshold && (s = true, n = "Long Name", e = this.setNameColor(null), this.setNameSprite(n, e)), this.name = t ? "Unnamed" : n, i !== this.name || r !== this.nameColor) {
                var o = e || (this.isMe ? 16747520 : null);
                this.game.events.$emit("minimap-create-node", this.pid, n, e, o)
            }
        }
        setNameSprite(e, t) {
            this.nameSprite ? this.nameSprite.text = e : this.nameSprite = new PIXI.Text(e, a.nameTextStyle), this.nameSprite.style.fill = t || 0xffffff, this.nameSprite.updateText()
        }
        setSkin(e) {
            return e || (e = null), e !== this.skinUrl && (this.abortSkinLoaderIfExist(), this.destroySkin() && this.renderCell(), this.skinUrl = e, this.skinShown && this.loadSkinAndRender(), true)
        }
        destroySkin() {
            return !!this.skinSprite && (this.skinSprite.mask.destroy(true), this.skinSprite.destroy(true), this.skinSprite = null, true)
        }
        loadSkinAndRender() {
            console.assert(!this.abortSkinLoader, "Called loadSkin while other skin was loading"), this.abortSkinLoaderIfExist(), this.abortSkinLoader = this.game.skinLoader.loadSkin(this.skinUrl, e => {
                this.skinSprite = this.createSkinSprite(e), this.skinSprite.mask = l(), this.cellContainer.addChild(this.skinSprite.mask, this.skinSprite), this.renderCell()
            })
        }
        invalidateVisibility() {
            var e, t, s, n = a.showNameColor;
            this.isMe ? (e = a.showOwnName, t = a.showOwnSkin, s = a.showOwnMass) : (e = a.showNames >= this.visibility, t = a.showSkins >= this.visibility, s = a.showMass >= this.visibility), e = a.namesEnabled && e, t = a.skinsEnabled && t, s = a.massEnabled && s, t && !this.skinShown ? this.skinSprite ? (this.skinSprite.visible = true, this.renderCell()) : this.skinUrl && this.loadSkinAndRender() : !t && this.skinShown && (this.abortSkinLoaderIfExist(), this.skinSprite && (this.skinSprite.visible = false, this.renderCell())), this.nameShown = e, this.skinShown = t, this.massShown = s, this.nameColorShown = n
        }
        abortSkinLoaderIfExist() {
            this.abortSkinLoader && (this.abortSkinLoader(), this.abortSkinLoader = null)
        }
        getCellColor() {
            var e = this.game.seededRandom(this.pid),
                t = Math.floor(e * i.length);
            return (this.bot ? r : i)[t]
        }
        clearCachedData() {
            this.abortSkinLoaderIfExist(), this.destroySkin(), this.cellContainer.destroy(true), this.texture.destroy(true), this.texture.clearedFromCache = true, this.nameSprite && this.nameSprite.destroy(true), this.game.events.$emit("minimap-destroy-node", this.pid)
        }
    }
}, , function(e, t, s) {
    var a = s(129);
    e.exports = class {
        constructor() {
            this.loaders = {}, this.worker = new a, this.worker.addEventListener("message", this.onSkinLoaded.bind(this))
        }
        createLoader(e) {
            return {
                image: null,
                error: null,
                callbacks: [e]
            }
        }
        clearCallbacks() {
            for (var e in this.loaders) delete this.loaders[e]
        }
        removeLoaderCallback(e, t) {
            var s = e.callbacks.indexOf(t);
            s >= 0 && e.callbacks.splice(s, 1)
        }
        loadSkin(e, t) {
            var s = this.loaders[e];
            return s ? s.image ? (t(s.image), null) : s.error ? null : (s.callbacks.push(t), this.removeLoaderCallback.bind(this, s, t)) : (s = this.loaders[e] = this.createLoader(t), this.worker.postMessage(e), this.removeLoaderCallback.bind(this, s, t))
        }
        onSkinLoaded(e) {
            var {
                skinUrl: t,
                bitmap: s,
                error: a
            } = e.data, n = this.loaders[t];
            if (a) return n.error = true, void(n.callbacks = []);
            for (n.image = s; n.callbacks.length;) n.callbacks.pop()(s)
        }
    }
}, function(module) {
    const workerCode = atob("YWRkRXZlbnRMaXN0ZW5lcigibWVzc2FnZSIsZT0+eyhlPT57ZmV0Y2goZSx7bW9kZToiY29ycyJ9KS50aGVuKGU9PmUuYmxvYigpKS50aGVuKGU9PmNyZWF0ZUltYWdlQml0bWFwKGUpKS50aGVuKHM9PnNlbGYucG9zdE1lc3NhZ2Uoe3NraW5Vcmw6ZSxiaXRtYXA6c30pKS5jYXRjaCgoKT0+c2VsZi5wb3N0TWVzc2FnZSh7c2tpblVybDplLGVycm9yOiEwfSkpfSkoZS5kYXRhKX0pOw==");

    module.exports = function() {
        return new Worker(URL.createObjectURL(
            new Blob([workerCode], {
                type: 'text/javascript'
            })
        ));
    }
}, function(e, t) {
    e.exports = class {
        constructor() {
            this.total = 0, this.count = 0
        }
        add(e) {
            this.total += e, this.count++
        }
        getAndReset() {
            var e = this.total / this.count;
            return this.count = this.total = 0, e
        }
    }
}, function(e, t, s) {
    var a = s(132),
        n = s(1),
        i = s(8),
        r = s(5),
        o = s(4),
        l = s(78),
        c = s(65),
        u = [],
        d = [],
        h = a.createInstance({
            name: "game-replays"
        });

    function p(e) {
        var t = e || u.length;
        u.splice(0, t), d.splice(0, t)
    }
    var v = f(new ArrayBuffer(1));

    function f(e) {
        return btoa(String.fromCharCode.apply(null, new Uint8Array(e)))
    }

    function m(e, t) {
        e = atob(e);
        for (var s = new ArrayBuffer(e.length), a = new Uint8Array(s), n = 0; n < e.length; n++) a[n] = e.charCodeAt(n);
        var i = new DataView(s);
        return i.packetId = t + 1, i
    }
    n.replay = {
        database: h,
        updateHistory: u,
        addHistory: function(e) {
            u.push(e), d.push(n.nodelist.map(e => ({
                type: e.type,
                id: e.id,
                pid: e.pid,
                nx: e.nx,
                ny: e.ny,
                nSize: e.nSize
            })));
            var t = 25 * o.replayDuration;
            null == u ? (console.log("updateHistory was null?"), u = []) : u.length > t && p(1)
        },
        clearHistory: p,
        play: function(e) {
            n.running && n.stop(), n.closeConnection(), r.toast.close();
            var t = 1,
                s = e.split("|");
            "REPLAY" === s[0] && (t = parseInt(s[1]), s = s.slice(3));
            var a = s.map(m),
                i = l(a.shift()),
                o = [];
            if (t >= 4) {
                for (; a[0].getUint8(0);) o.push(a.shift());
                a.shift()
            } else o.push(a.shift());
            i.replayUpdates = a, n.start(i), o.forEach(e => {
                e.packetId = -1, n.parseMessage(e)
            }), n.showMenu(false)
        },
        save: function() {
            var e = u;
            if (e.length) {
                var t = [];
                for (var s in n.playerManager.players) {
                    var a = n.playerManager.players[s];
                    a.lastUpdateTick >= e[0].packetId - 1 && t.push(a)
                }
                var o, l, p, m = f(n.initialDataPacket.buffer),
                    g = function(e) {
                        e = e.map(e => {
                            var t = {
                                pid: e.pid,
                                nickname: e.nameFromServer,
                                skinUrl: e.skinUrl
                            };
                            return e.bot && (t.bot = true), e.tagId && (t.tagId = e.tagId), e.nameColorFromServer && (t.nameColor = e.nameColorFromServer), t
                        });
                        var t = JSON.stringify(e),
                            s = new c;
                        return s.uint8(16), s.utf8(t), f(s.write())
                    }(t),
                    y = f(function(e) {
                        for (var t = 0, s = 0; s < e.length; s++) t += 1 + (1 === e[s].type ? 2 : 0) + 2 + 2 + 2 + 2;
                        var a = new ArrayBuffer(1 + t + 1 + 2 + 2),
                            n = new DataView(a);
                        n.setUint8(0, 10);
                        for (var i = 1, s = 0; s < e.length; s++) {
                            var r = e[s];
                            n.setUint8(i, r.type), i++, 1 === r.type && (n.setUint16(i, r.pid, false), i += 2), n.setUint16(i, r.id, false), i += 2, n.setInt16(i, r.nx, false), i += 2, n.setInt16(i, r.ny, false), i += 2, n.setUint16(i, r.nSize, false), i += 2
                        }
                        return n.setUint8(i, 0), i++, n.setUint16(i, 0, false), i += 2, n.setUint16(i, 0, false), i += 2, a
                    }(d[0])),
                    w = e.map(e => f(e.buffer)).join("|"),
                    b = i.getTimestamp(),
                    k = n.getThumbnail(),
                    C = [];
                C.push("REPLAY"), C.push(4), C.push(k), C.push(m), n.multiboxPid && C.push((o = n.multiboxPid, l = new ArrayBuffer(3), (p = new DataView(l)).setUint8(0, 8), p.setUint16(1, o, true), l)), C.push(g), C.push(y), C.push(v), C.push(w);
                var A = C.join("|");
                h.setItem(b, A, () => {
                    n.events.$emit("replay-added"), n.addServerMessage("Replay saved!"), r.toast.fire({
                        type: "info",
                        title: "Replay saved!",
                        timer: 1500
                    })
                }).catch(e => {
                    console.error("replay.save", e);
                    var t = "Error saving replay";
                    "string" == typeof e ? t += ": " + e : e && e.message && (t += ": " + e.message), r.toast.fire({
                        type: "error",
                        title: t
                    })
                })
            }
        }
    }
}, , function(e, t, s) {
    var a = s(1),
        n = s(5),
        i = s(134),
        {
            createBuffer: r
        } = s(8),
        o = s(148);
    a.send = function(e) {
        c() ? a.ws.send(e) : !a.replaying && console.log("WebSocket not open?")
    }, a.sendUint8 = function(e) {
        var t = r(1);
        t.setUint8(0, e), a.send(t)
    }, a.ping = function() {
        a.pingstamp = Date.now();
        var e = r(1);
        e.setUint8(0, 3), a.send(e)
    };
    var l = 0;

    function c() {
        return a.ws && 1 === a.ws.readyState
    }

    function u() {
        a.ws && (a.currentWsId = null, a.ws.onmessage = null, a.ws.onclose = null, a.ws.onerror = null, a.ws.close())
    }

    function d() {
        3 === a.ws.readyState && a.events.$emit("reconnect-server")
    }

    function h(e) {
        if (delete a.currentWsId, a.running && a.stop(), 1003 === e.code) setTimeout(d, 1500), n.toast.fire({
            type: "info",
            title: "Server restarting ...",
            timer: 5e3
        });
        else {
            var t = "You have been disconnected";
            e.reason && (t += " (" + e.reason + ")"), a.showError(t)
        }
        a.showMenu(true)
    }
    a.isConnected = c, a.closeConnection = u, a.connect = function(e) {
        a.running && a.stop(), u(), a.events.$emit("chat-clear");
        var t = a.ws = new o(e, "tFoL46WDlZuRja7W6qCl");
        t.binaryType = "arraybuffer", t.packetId = 0, t.onopen = function() {
            if (c()) {
                a.currentWsId = ++l;
                a.events.$emit("players_menu", true), a.events.$emit("account_menu", true), a.events.$emit("chatbox_menu", true), a.events.$emit("options_menu", true), a.events.$emit("replays_menu", true), a.state.connectionUrl = e, t.onclose = h
            }
        }, t.onclose = function() {
            a.showError("Connection failed!")
        }, t.onmessage = function(e) {
            var s = new DataView(e.data);
            s.packetId = ++t.packetId, i(s)
        }
    }
}, function(e, t, s) {
    var a = s(1),
        n = s(5),
        i = s(135),
        r = s(142),
        o = s(143),
        l = s(144),
        c = s(145),
        u = s(78),
        {
            htmlEncode: d
        } = s(8),
        h = s(146);
    e.exports = a.parseMessage = function(e) {
        function t() {
            for (var t, s = ""; 0 != (t = e.getUint16(p, true));) p += 2, s += String.fromCharCode(t);
            return p += 2, s
        }

        function s() {
            for (var t, s = ""; 0 != (t = e.getUint8(p, true));) p += 1, s += String.fromCharCode(t);
            return p += 1, s
        }
        var p = 0;
        switch (e.getUint8(p++)) {
            case 1:
                var v = u(e);
                a.initialDataPacket = e;
                a.start(v);
                break;
            case 2:
                a.addServerMessage(atob("aHR0cHM6Ly9naXRodWIuY29tL2Flcm8tdGhlLXN5bmFwdGljLWVsZWN0cmljaWFuL3ZhbmlzaW8="));
                var f = new Uint8Array(e.buffer, 1),
                    m = h(f);
                a.sendJoinData(m);
                break;
            case 3:
                var g = Date.now() - a.pingstamp;
                a.updateStats(g);
                break;
            case 4:
                for (; S = e.getUint16(p, true);) a.playerManager.delayedRemovePlayer(S), p += 2;
                break;
            case 6:
                a.sendUint8(6);
                break;
            case 7:
                var flags = e.getUint8(p++);

                var to, from;

                if (flags & 1) {
                    var pid = e.getUint16(p, true);
                    to = a.playerManager.getPlayer(pid);
                    p += 2;
                }

                if (flags & 2) {
                    var pid = e.getUint16(p, true);
                    from = a.playerManager.getPlayer(pid);
                    p += 2;
                }
                
                from && from.setCrown(false);
                to && to.setCrown(true);
                break;
            case 8:
                a.multiboxPid = e.getUint16(p, true);
                break;
            case 9:
                a.activePid && a.playerManager.getPlayer(a.activePid).setOutline(0xffffff);                
                a.activePid = e.getUint16(p, true);
                a.playerManager.getPlayer(a.activePid).setOutline(0xff00ff);
                break;
            case 10:
                a.protocol > 3 ? r(e) : i(e);
                break;
            case 11:
                a.events.$emit("leaderboard-update", c(a, e));
                break;
            case 12:
                a.events.$emit("minimap-positions", l(e));
                break;
            case 13:
                var _ = o(e),
                    S = _.pid,
                    x = _.text;
                if (!S) return void a.addServerMessage(x);
                if (!(D = a.playerManager.getPlayer(S))) return void console.warn("Received message from non-exiting player", S);
                var M = {
                    pid: S,
                    text: x,
                    from: D.name
                };
                D.nameColorCss && (M.fromColor = D.nameColorCss), a.events.$emit("chat-message", M);
                break;
            case 14:
                var I;
                if (v = {}, 2 & (I = e.getUint8(p++))) {
                    var T = {
                        1: "success",
                        2: "error",
                        3: "warning",
                        4: "info"
                    } [e.getUint8(p++)];
                    T && (v.type = T)
                }
                4 & I && (v.timer = e.getUint16(p, true), p += 2), v.title = d(s()), n.toast.fire(v);
                break;
            case 15:
                for (; S = e.getUint16(p, true), p += 2, S;) {
                    var P = t(),
                        U = s();
                    a.playerManager.setPlayerData({
                        pid: S,
                        nickname: P,
                        skinUrl: U
                    })
                }
                break;
            case 16:
                var E = s(),
                    R = decodeURIComponent(escape(E)),
                    N = JSON.parse(R),
                    L = N.find(e => e.pid === a.playerId),
                    O = false;
                L && (O = a.setTagId(L.tagId));
                for (var F = [], W = 0; W < N.length; W++) {
                    var D = a.playerManager.setPlayerData(N[W]);
                    F.push(D)
                }
                O && (a.events.$emit("minimap-positions", []), a.playerManager.invalidateVisibility(F));
                break;
            case 17:
                a.center.x = e.getInt16(p, true), p += 2, a.center.y = e.getInt16(p, true), p += 2;
                break;
            case 18:
                a.replay.clearHistory(), a.clearNodes();
                break;
            case 19:
                var B = e.getUint8(p++),
                    z = e.getUint32(p, true);
                if (p += 4, a.events.$emit("xp-update", z), B) {
                    var $ = e.getUint16(p, true);
                    p += 2, a.levelUp($)
                }
                break;
            case 20:
                var H = e.getUint16(p, true);
                p += 2;
                var j = e.getUint16(p, true);
                p += 2;
                var X = e.getUint32(p, true);
                p += 4, a.state.deathScreen = true, a.setDeathStats({
                    timeAlive: H,
                    killCount: j,
                    highscore: X
                }), a.shouldAutoRespawn() ? a.state.isAutoRespawning = true : a.lastDeathTime = Date.now();
                var V = a.state.isAutoRespawning ? 1500 : 900;
                a.deathTimeout = setTimeout(a.triggerAutoRespawn, V);
                break;
            case 21:
                break;
            case 22:
                if (!window.grecaptcha) return void alert("Captcha library is not loaded");
                a.events.$emit("show-image-captcha");
                break;
            case 23:
                a.state.spectators = e.getUint16(p, true);
                break;
            case 24:
                a.events.$emit("restart-timing-changed", {
                    currentTick: e.getUint32(p, true),
                    restartTick: e.getUint32(p + 4, true)
                });
                break;
            case 25:
                a.events.$emit("update-cautions", {
                    custom: t()
                });
                break;
            case 26:
                a.state.playButtonDisabled = !!e.getUint8(p++), e.byteLength > p && (a.state.playButtonText = s() || "Play")
        }
    }
}, function(e, t, s) {
    var a = s(1),
        n = s(79),
        i = s(4);
    e.exports = function(e) {
        var t = a.nodes,
            s = a.nodelist;
        a.timestamp = Date.now();
        var r, o, l = 1,
            c = {},
            u = !a.spectating && !a.replaying,
            d = false;
        for (u ? a.replay.addHistory(e) : a.replay.updateHistory.length && a.replay.clearHistory();;) {
            var h = e.getUint8(l++);
            if (0 === h) break;
            1 === h ? (o = e.getUint16(l), l += 2) : o = null, r = e.getUint32(l), l += 4;
            var p = e.getInt32(l);
            l += 4;
            var v = e.getInt32(l);
            l += 4;
            var f = e.getInt16(l);
            l += 2;
            var m = t[r];
            if (m) m.update(), m.ox = m.x, m.oy = m.y, m.oSize = m.size;
            else {
                var g = {
                    id: r,
                    x: p,
                    y: v,
                    size: f
                };
                switch (h) {
                    case 1:
                        var y = a.playerManager.getPlayer(o);
                        g.texture = y.texture, m = new n.PlayerCell(g, y), a.scene.addCell(m.sprite);
                        break;
                    case 2:
                        m = new n.Virus(g), a.scene.addCell(m.sprite);
                        break;
                    case 3:
                        m = new n.EjectedMass(g), a.scene.addCell(m.sprite);
                        break;
                    case 4:
                        m = new n.Food(g), a.scene.addFood(m.sprite);
                        break;
                    case 6:
                        m = new n.Crown(g), a.scene.addCell(m.sprite);
                        break;
                    default:
                        m = new n.DeadCell(g), a.scene.addCell(m.sprite)
                }
                m.createTick = e.packetId, s.push(m), t[r] = m
            }
            m.nx = p, m.ny = v, m.nSize = f, m.updateTime = a.timestamp, m.player && (m.player.isMe && (d = true, c[m.id] = true), u && (m.player.lastUpdateTick = e.packetId))
        }
        a.state.isAlive = d, d && (a.spectating = false);
        var w = true;
        for (var b in c) b in a.nodesOwn && (w = false);
        for (a.nodesOwn = c, w && (a.highscore = 0, a.events.$emit("reset-cautions"), a.mouseFrozen = false); r = e.getUint32(l), l += 4, 0 !== r;) t[r] && t[r].destroy();
        for (; r = e.getUint32(l), l += 4, 0 !== r;) {
            var k = t[r],
                C = e.getUint32(l);
            l += 4;
            var A = t[C];
            if (k)
                if (A) {
                    k.destroy(i.eatAnimation), k.ox = k.x, k.oy = k.y, k.oSize = k.size;
                    var _ = k.size / A.nSize;
                    _ = 0 > _ ? 0 : 1 < _ ? 1 : _, k.newPositionScale = _, k.nx = A.x, k.ny = A.y, k.nSize = 0, k.updateTime = a.timestamp
                } else k.destroy();
            else a.replaying || console.warn("Prey not found:", r)
        }
        a.events.$emit("server-tick"), a.playerManager.sweepRemovedPlayers()
    }
}, function(e, t, s) {
    var a = s(14);
    class n extends a {
        constructor(e, t) {
            super(e), this.player = t, this.pid = t.pid, t.hasCrown && this.addCrown()
        }
        addCrown() {
            if (this.crownSprite) console.error("addCrown: crown already exists");
            else {
                var e, t = this.game.crownPool;
                t.length ? e = t.pop() : ((e = PIXI.Sprite.from("/img/crown.png")).scale.set(.7), e.pivot.set(0, 643), e.anchor.x = .5, e.rotation = -.5, e.alpha = .7, e.zIndex = 2), this.crownSprite = e, this.sprite.addChild(e)
            }
        }
        removeCrown() {
            var e = this.crownSprite;
            e ? (this.sprite.removeChild(e), this.game.crownPool.push(e), this.crownSprite = null) : console.error("removeCrown: crown doesnt exist")
        }
        onUpdate() {
            var e, t, s, a = this.game.settings,
                n = this.game.cameraScale * this.size * this.game.renderer.resolution,
                i = n > a.smallTextThreshold;
            if (this.player.massShown && !this.massText && i && (this.massText = this.game.massTextPool.shift() || (e = a.massTextStyle, t = new PIXI.BitmapText("", {
                    fontName: "mass",
                    align: "right"
                }), s = e.strokeThickness || 0, t.position.set(-s / 2, -s / 2), t.anchor.set(.5, -.6), t), this.massText.zIndex = 0, this.sprite.addChild(this.massText)), this.player.nameShown && !this.nameSprite && this.player && this.player.nameSprite && i && (this.nameSprite = new PIXI.Sprite(this.player.nameSprite.texture), this.nameSprite.anchor.set(.5), this.nameSprite.zIndex = 1, this.sprite.addChild(this.nameSprite)), this.crownSprite && (this.crownSprite.visible = n > 16 && a.showCrown), this.nameSprite && (this.nameSprite.visible = this.player.nameShown && i), this.massText)
                if (this.player.massShown && i) {
                    var r = this.getMass();
                    a.shortMass && (r = this.game.getShortMass(r)), this.massText.text = r, this.massText.visible = true
                } else this.massText.visible && (this.massText.visible = false)
        }
        onDestroy() {
            this.massText && (this.sprite.removeChild(this.massText), this.game.massTextPool.push(this.massText)), this.crownSprite && this.removeCrown()
        }
    }
    n.prototype.type = 1, n.prototype.isPlayerCell = true, e.exports = n
}, function(e, t, s) {
    s(1);
    var a = s(14),
        n = s(12),
        i = s(4),
        r = s(76);

    function o(e) {
        var t;
        return t = i.useFoodColor ? PIXI.utils.string2hex(i.foodColor) : r.neon[e % r.neon.length], n.cells.getTexture(t)
    }
    class l extends a {
        constructor(e) {
            e.texture = o(e.id), super(e)
        }
        reloadTexture() {
            this.texture = o(this.id), this.sprite.texture = this.texture
        }
    }
    l.prototype.type = 4, l.prototype.isFood = true, e.exports = l
}, function(e, t, s) {
    var a = s(14),
        n = s(12);
    class i extends a {
        constructor(e) {
            e.texture = n.virus.getTexture(), super(e)
        }
        resetTexture() {
            this.destroySprite(), this.texture = n.virus.getTexture(), this.sprite = new PIXI.Sprite(this.texture), this.sprite.anchor.set(.5), this.sprite.gameData = this
        }
    }
    i.prototype.type = 2, i.prototype.isVirus = true, e.exports = i
}, function(e, t, s) {
    var a = s(4),
        n = s(14),
        i = s(12);

    function r() {
        var e = PIXI.utils.string2hex(a.ejectedColor);
        return i.cells.getTexture(e)
    }
    class o extends n {
        constructor(e) {
            e.texture = r(), super(e)
        }
        reloadTexture() {
            this.texture = r(), this.sprite.texture = this.texture
        }
    }
    o.prototype.type = 3, o.prototype.isEjected = true, e.exports = o
}, function(e, t, s) {
    var a = s(14),
        n = s(12);
    class i extends a {
        constructor(e, t, s) {
            e.texture = n[s ? "squares" : "cells"].getTexture(t || 4210752), super(e), this.sprite.alpha = .5
        }
    }
    i.prototype.type = 5, i.prototype.isDead = true, e.exports = i
}, function(e, t, s) {
    var a = s(14);
    class n extends a {
        constructor(e) {
            e.texture = PIXI.Texture.from("/img/crown.png"), super(e), this.sprite.alpha = .7
        }
    }
    n.prototype.type = 6, n.prototype.isCrown = true, e.exports = n
}, function(e, t, s) {
    var a = s(1),
        n = s(79),
        i = s(4);
    e.exports = function(e) {
        var t = a.nodes,
            s = a.nodelist;
        a.timestamp = Date.now();
        var r, o, l = 1,
            c = {},
            u = !a.spectating && !a.replaying,
            d = false;
        for (u ? a.replay.addHistory(e) : a.replay.updateHistory.length && a.replay.clearHistory();;) {
            var h = e.getUint8(l++);
            if (0 === h) break;
            1 === h ? (o = e.getUint16(l), l += 2) : o = null, r = e.getUint16(l), l += 2;
            var p = e.getInt16(l);
            l += 2;
            var v = e.getInt16(l);
            l += 2;
            var f = e.getUint16(l);
            l += 2;
            var m = t[r];
            if (m) m.update(), m.ox = m.x, m.oy = m.y, m.oSize = m.size;
            else {
                var g = {
                    id: r,
                    x: p,
                    y: v,
                    size: f
                };
                switch (15 & h) {
                    case 1:
                        var y = a.playerManager.getPlayer(o);
                        g.texture = y.texture, m = new n.PlayerCell(g, y), a.scene.addCell(m.sprite);
                        break;
                    case 2:
                        m = new n.Virus(g), a.scene.addCell(m.sprite);
                        break;
                    case 3:
                        m = new n.EjectedMass(g), a.scene.addCell(m.sprite);
                        break;
                    case 4:
                        m = new n.Food(g), a.scene.addFood(m.sprite);
                        break;
                    case 6:
                        m = new n.Crown(g), a.scene.addCell(m.sprite);
                        break;
                    default:
                        var w, b = null;
                        192 == (192 & h) ? b = 7368704 : 128 & h ? b = 7340032 : 64 & h && (b = 112), w = !!(16 & h), m = new n.DeadCell(g, b, w), b || w ? a.scene.addFood(m.sprite) : a.scene.addCell(m.sprite)
                }
                m.createTick = e.packetId, s.push(m), t[r] = m
            }
            m.nx = p, m.ny = v, m.nSize = f, m.updateTime = a.timestamp, m.player && (m.player.isMe && (d = true, c[m.id] = true), u && (m.player.lastUpdateTick = e.packetId))
        }
        a.state.isAlive = d, d && (a.spectating = false);
        var k = true;
        for (var C in c) C in a.nodesOwn && (k = false);
        a.nodesOwn = c, k && (a.highscore = 0, a.events.$emit("reset-cautions"), a.mouseFrozen = false);
        var A = e.getUint16(l);
        l += 2;
        for (var _ = 0; _ < A; _++) r = e.getUint16(l), l += 2, t[r] && t[r].destroy();
        for (A = e.getUint16(l), l += 2, _ = 0; _ < A; _++) {
            r = e.getUint16(l), l += 2;
            var S = t[r],
                x = e.getUint16(l);
            l += 2;
            var M = t[x];
            if (S)
                if (M) {
                    S.destroy(i.eatAnimation), S.ox = S.x, S.oy = S.y, S.oSize = S.size;
                    var I = S.size / M.nSize;
                    I = 0 > I ? 0 : 1 < I ? 1 : I, S.newPositionScale = I, S.nx = M.x, S.ny = M.y, S.nSize = 0, S.updateTime = a.timestamp
                } else S.destroy();
            else a.replaying || console.warn("Prey not found:", r)
        }
        a.events.$emit("server-tick"), a.playerManager.sweepRemovedPlayers()
    }
}, function(e, t) {
    e.exports = function(e) {
        var t = 1,
            s = e.getInt16(t, true);
        t += 2;
        for (var a = "", n = ""; 0 != (n = e.getUint16(t, true));) t += 2, a += String.fromCharCode(n);
        return {
            pid: s,
            text: a
        }
    }
}, function(e, t) {
    e.exports = function(e) {
        for (var t = 1, s = [];;) {
            var a = e.getUint16(t, true);
            if (t += 3, !a) break;
            var n = e.getUint8(t, true) / 255;
            t += 1;
            var i = e.getUint8(t, true) / 255;
            t += 1, s.push({
                pid: a,
                x: n,
                y: i
            })
        }
        return s
    }
}, function(e, t) {
    e.exports = function(e, t) {
        for (var s = 1, a = [];;) {
            var n = t.getUint16(s, true);
            if (s += 2, !n) break;
            var i = e.playerManager.getPlayer(n);
            i && a.push({
                pid: n,
                position: 1 + a.length,
                text: i.name,
                color: i.nameColorCss || "#ffffff",
                bold: !!i.nameColor
            })
        }
        return a
    }
}, function(module) {
    /** Security refactor; pure code for key decryption */
    
    /**
     * Hash used to shift encrypted keys
     */

     const hash = [
        0x37, 0x3, 0xaa, 0x20,
        0x41, 0x1b, 0x9, 0x80,
        0x2b, 0x2, 0x36, 0x40
    ];

    /**
     * Returns a shifted version of the given key
     * @param {Array} key 
     */

    module.exports = key => {
        let result = [];

        let last, current,
            mask = (current = key[0]) + 4 & 7;

        result.push(last = hash[0] ^ (current << mask | current >>> 8 - mask) & 0xff);

        for (let i = 1; i < 8; i++) {
            mask = (current = key[i]) + 4 & 7;
            result.push(last = (current << mask | current >>> 8 - mask) & 0xff ^ last ^ hash[i]);
        }

        let seed = Math.floor((Math.pow(2, 32) - 1) * Math.random());

        result.push((result[0] ^ seed >>> 24) & 0xff)
        result.push((result[1] ^ seed >>> 16) & 0xff)
        result.push((result[2] ^ seed >>> 8) & 0xff)

        result.push((seed ^ result[3]) & 0xff)
        result.push((result[0] ^ 0x1F & -0x20) & 0xff)

        return result;
    }
}, function() {
    /** Security refactor; unused code */
}, 
function(module) {
    /** Security refactor; deletion of WebSocket */
    module.exports = WebSocket
}, function(e, t, s) {
    var a = s(1),
        n = (s(150), s(66)),
        i = s(5),
        {
            htmlEncode: r
        } = s(8),
        o = a.renderer.view,
        l = {};
    window.addEventListener("blur", e => {
        l = {}
    });
    var c = localStorage.adminMode,
        u = /firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "wheel";

    function d() {
        var e = a.actions.findPlayerUnderMouse(),
            t = e && e.player;
        t && a.events.$emit("context-menu", event, t)
    }

    function h() {
        a.scene.setPosition()
    }

    function p(e) {
        var t = e.clientX,
            s = e.clientY;
        !a.settings.mouseFreezeSoft || a.rawMouse.x === t && a.rawMouse.y === s || a.actions.freezeMouse(false), a.rawMouse.x = t, a.rawMouse.y = s, a.updateMouse()
    }

    function v(e) {
        if (e.preventDefault(), o.focus(), e.shiftKey && c && a.selectedPlayer && 0 === e.button) a.sendChatMessage("/teleport " + a.selectedPlayer + " " + a.mouse.x + " " + a.mouse.y);
        else {
            var t = "MOUSE" + e.button;
            if (a.spectating && 0 === e.button) {
                var s = a.actions.findPlayerUnderMouse();
                s && a.actions.spectate(s.pid)
            } else n.press(t)
        }
    }

    function f(e) {
        var t = "MOUSE" + e.button;
        n.release(t), l[t] = false
    }

    function m(e) {
        var t = e.target === o;
        if (t || e.target === document.body) {
            var s = n.convertKey(e.code);
            if (!(e.ctrlKey && "TAB" === s || l[s]))
                if (l[s] = true, "ESCAPE" !== s) {
                    if ("ENTER" !== s) return e.shiftKey && c ? ("V" === s && a.sendChatMessage("/virus " + a.mouse.x + " " + a.mouse.y), void(a.selectedPlayer && ("F" === s && a.sendChatMessage("/freeze " + a.selectedPlayer), "D" === s && a.sendChatMessage("/ignoreBorders " + a.selectedPlayer), "K" === s && function(e) {
                        var t = a.playerManager.players[e];
                        if (!t) return;
                        var s = 'Kick player "' + r(t.name) + '"';
                        i.confirm(s, () => {
                            a.sendChatMessage("/kick " + e)
                        })
                    }(a.selectedPlayer), "N" === s && function(e) {
                        var t = a.playerManager.players[e];
                        if (!t) return;
                        i.instance.fire({
                            input: "text",
                            showCancelButton: true,
                            confirmButtonText: "Send",
                            html: 'Send notification to player "' + r(t.name) + '"'
                        }).then(t => {
                            var s = t.value;
                            s && a.sendChatMessage("/notify " + e + " " + s)
                        })
                    }(a.selectedPlayer), "M" === s && function(e) {
                        var t = a.playerManager.players[e];
                        if (!t) return;
                        g('Mute account of "' + r(t.name) + '" for hours:', t => {
                            a.sendChatMessage("/muteAccount " + e + " " + t)
                        })
                    }(a.selectedPlayer), "J" === s && function(e) {
                        var t = a.playerManager.players[e];
                        if (!t) return;
                        i.confirm('IP mute player "' + r(t.name) + '" in this server until restart?', () => {
                            a.sendChatMessage("/mute " + e)
                        })
                    }(a.selectedPlayer), "G" === s && function(e) {
                        var t = a.playerManager.players[e];
                        if (!t) return;
                        g('Ban account of "' + r(t.name) + '" for hours:', t => {
                            a.sendChatMessage("/banAccount " + e + " " + t)
                        })
                    }(a.selectedPlayer), "B" === s && function(e) {
                        var t = a.playerManager.players[e];
                        if (!t) return;
                        i.confirm('IP ban player "' + r(t.name) + '"', () => {
                            a.sendChatMessage("/ban " + e)
                        })
                    }(a.selectedPlayer)))) : void(t && n.press(s) && e.preventDefault());
                    a.events.$emit("chat-focus")
                } else a.replaying ? (l = {}, a.stop(), a.showMenu(true)) : a.deathTimeout ? a.triggerAutoRespawn() : a.toggleMenu()
        }
    }

    function g(e, t) {
        i.instance.fire({
            input: "text",
            inputPlaceholder: "0 to unmute",
            showCancelButton: true,
            html: e
        }).then(e => {
            if (!e.dismiss) {
                var s = parseInt(e.value);
                isNaN(s) ? i.alert("Invalid hour value") : (s > 1e5 && (s = 1e5), t(s))
            }
        })
    }

    function y(e) {
        var t = n.convertKey(e.code);
        n.release(t), l[t] = false
    }

    function w(e) {
        e.shiftKey && c && a.selectedPlayer ? e.wheelDelta < 0 ? a.sendChatMessage("/mass " + a.selectedPlayer + " +500") : a.sendChatMessage("/mass " + a.selectedPlayer + " -500") : a.actions.zoom(e)
    }
    a.eventListeners = function(e) {
        e ? (window.addEventListener("resize", h), o.addEventListener("mousedown", v), o.addEventListener(u, w), o.addEventListener("contextmenu", d), document.addEventListener("mouseup", f), document.body.addEventListener("mousemove", p), document.body.addEventListener("keydown", m), document.body.addEventListener("keyup", y), window.onbeforeunload = (() => "Are you sure you want to close the page?")) : (window.removeEventListener("resize", h), o.removeEventListener("mousedown", v), o.removeEventListener(u, w), o.removeEventListener("contextmenu", d), document.removeEventListener("mouseup", f), document.body.removeEventListener("mousemove", p), document.body.removeEventListener("keydown", m), document.body.removeEventListener("keyup", y), window.onbeforeunload = null)
    }
}, function(e, t, s) {
    var a = s(1),
        n = s(4),
        {
            createBuffer: i,
            clampNumber: r
        } = s(8),
        o = a.actions = {};
    o.spectate = (e => {
        if (a.state.isAlive) return false;
        a.spectating = true;
        var t = i(e ? 3 : 1);
        return t.setUint8(0, 2), e && t.setInt16(1, e, true), a.send(t), true
    }), o.spectateLockToggle = function() {
        a.sendUint8(10)
    }, o.move = (() => {
        var e = a.mouse,
            t = i(5);
        t.setUint8(0, 16), t.setInt16(1, e.x, true), t.setInt16(3, e.y, true), a.send(t)
    }), o.feed = function(e) {
        var t;
        arguments.length ? ((t = i(2)).setUint8(0, 21), t.setUint8(1, +e)) : (t = i(1)).setUint8(0, 21), a.send(t)
    }, o.freezeMouse = function(e) {
        a.running && (void 0 === e && (e = !a.mouseFrozen), e && (o.stopMovement(false), o.lockLinesplit(false), a.updateMouse(true)), a.mouseFrozen = e, a.events.$emit("update-cautions", {
            mouseFrozen: e
        }))
    }, o.stopMovement = function(e) {
        a.running && (void 0 === e && (e = !a.moveToCenterOfCells), e && (o.freezeMouse(false), o.lockLinesplit(false)), a.moveToCenterOfCells = e, a.events.$emit("update-cautions", {
            moveToCenterOfCells: e
        }))
    }, o.lockLinesplit = (e => {
        a.running && (void 0 === e && (e = !a.stopMovePackets), e && (o.move(), a.sendUint8(15), o.freezeMouse(false), o.stopMovement(false)), a.stopMovePackets = e, a.events.$emit("update-cautions", {
            lockLinesplit: e
        }))
    }), o.linesplit = (() => {
        o.freezeMouse(true), o.split(3), o.linesplitUnlock && clearTimeout(o.linesplitUnlock), o.linesplitUnlock = setTimeout(() => {
            delete o.linesplitUnlock, o.freezeMouse(false)
        }, 1500)
    }), o.split = (e => {
        a.stopMovePackets || o.move(), msg = i(2), msg.setUint8(0, 17), msg.setUint8(1, e), a.send(msg), a.splitCount += e, a.splitCount <= 2 ? a.moveWaitUntil = Date.now() + 300 : (a.moveWaitUntil = 0, a.splitCount = 0)
    }), o.switchMultibox = function() {}, o.zoom = (e => {
        var t = 1 - n.cameraZoomSpeed / 100,
            s = 0;
        e.wheelDelta ? s = e.wheelDelta / -120 : e.detail && (s = e.detail / 3);
        var i = Math.pow(t, s),
            o = r(a.zoom * i, a.zoomMin, 1);
        a.zoom = o
    }), o.setZoomLevel = function(e) {
        var t = .8 / Math.pow(2, e - 1) * a.zoomScale;
        a.zoom = t
    }, o.targetPlayer = (() => {
        var e = o.findPlayerUnderMouse(true);
        e && (a.selectedPlayer = e.pid)
    }), o.findPlayerUnderMouse = (e => {
        for (var t = a.mouse, s = null, n = 1 / 0, i = a.nodelist.filter(e => e.pid).sort((e, t) => e.size - t.size), r = 0; r < i.length; r++) {
            var o = i[r],
                l = o.x - t.x,
                c = o.y - t.y,
                u = Math.sqrt(Math.abs(l * l + c * c)) - o.size;
            if (e) u < n && (n = u, s = o);
            else if (u <= 0) return o
        }
        return s
    }), o.toggleSkins = function(e) {
        e = void 0 === e ? !n.skinsEnabled : e, n.set("skinsEnabled", e), a.playerManager.invalidateVisibility()
    }, o.toggleNames = function(e) {
        e = void 0 === e ? !n.namesEnabled : e, n.set("namesEnabled", e), a.playerManager.invalidateVisibility()
    }, o.toggleMass = function() {
        var e = !n.massEnabled;
        n.set("massEnabled", e), a.playerManager.invalidateVisibility()
    }, o.toggleFood = function(e) {
        e = void 0 === e ? !n.foodVisible : e, n.set("foodVisible", e), a.scene.food.visible = e
    }, o.toggleHud = function() {
        var e = !window.app.showHud;
        window.app.showHud = e, n.set("showHud", e)
    }, o.toggleChat = function() {
        var e = !n.showChat;
        n.set("showChat", e), a.running && a.events.$emit("chat-visible", {
            visible: e
        })
    }, o.toggleChatToast = function() {
        var e = !n.showChatToast;
        n.set("showChatToast", e), a.events.$emit("chat-visible", {
            visibleToast: e
        })
    }
}, , , , , , , , , , , , , , , , , function(e, t, s) {
    "use strict";
    var a = s(28);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(31);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(32);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(33);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(34);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(35);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(36);
    s.n(a).a
}, function(e, t, s) {}, , , , , , function(e, t) {}, , function(e, t) {}, , , , , , , , , , , , , , , , , , , , , , , , , , , , , , , function(e, t, s) {
    "use strict";
    var a = s(39);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(40);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(41);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(42);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(43);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    var a = s(19);
    var n = localStorage.vanisToken || null;
    e.exports = new class {
        constructor(e, t) {
            this.url = e, this.vanisToken = t
        }
        setToken(e) {
            this.vanisToken = e, localStorage.vanisToken = e
        }
        clearToken() {
            this.vanisToken = null, delete localStorage.vanisToken
        }
        async call(e, t) {
            return (await a({
                method: e,
                url: this.url + t,
                headers: {
                    Authorization: "Vanis " + this.vanisToken
                }
            })).data
        }
        get(e) {
            return this.call("GET", e)
        }
    }("https://vanis.io/api", n)
}, function(e, t) {
    var s = .1;
    e.exports = {
        getXp: function(e) {
            return Math.round(e * e / (s * s))
        },
        getLevel: function(e) {
            return Math.floor(Math.sqrt(e) * s)
        }
    }
}, function(e, t, s) {
    "use strict";
    var a = s(44);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(45);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(46);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(47);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(48);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(49);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(50);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(51);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(52);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(53);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(56);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(57);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(58);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(59);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(60);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(61);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    "use strict";
    var a = s(62);
    s.n(a).a
}, function(e, t, s) {}, function(e, t) {
    var s = "seenNotifications";
    e.exports = new class {
        constructor() {
            this.seenList = this.parseSeen(localStorage[s])
        }
        parseSeen(e) {
            if (!e) return [];
            try {
                var t = JSON.parse(e);
                if (Array.isArray(t)) return t
            } catch (e) {
                console.error("notifications.parseSeen:", e.message)
            }
            return []
        }
        saveSeen() {
            try {
                localStorage[s] = JSON.stringify(this.seenList)
            } catch (e) {
                console.error("notifications.saveSeen:", e.message)
            }
        }
        isSeen(e) {
            return this.seenList.includes(e)
        }
        setSeen(e) {
            this.isSeen(e) ? console.warn('Key "' + e + '" is already on the seen list') : (this.seenList.push(e), this.saveSeen())
        }
        ifNotSeen(e, t) {
            this.isSeen(e) || t(this.setSeen.bind(this, e))
        }
    }
}, function(e, t, s) {
    "use strict";
    var a = s(63);
    s.n(a).a
}, function(e, t, s) {}, function(e, t, s) {
    var a, n, i, r, o = s(1),
        l = document.createElement("canvas"),
        c = l.getContext("2d");

    function u() {
        a = l.width = window.innerWidth, n = l.height = window.innerHeight, i = a / 2, r = n / 2
    }
    window.addEventListener("resize", u), u();
    class d {
        spawn(e) {
            this.x = e.x, this.y = e.y, this.angle = Math.atan2(this.y, this.x), this.radius = .1, this.speed = .4 + 3.3 * Math.random()
        }
        update(e) {
            var t = this.speed * e;
            this.x += Math.cos(this.angle) * t, this.y += Math.sin(this.angle) * t, this.radius += .0035 * t
        }
    }
    var h = new Array(200).fill(null).map(() => new d),
        p = false;

    function v(e) {
        c.beginPath(), c.fillStyle = "#00b8ff", c.globalAlpha = .9, h.forEach(t => {
            (p || function(e) {
                var t = i + e.radius,
                    s = r + e.radius;
                return e.x < -t || e.x > t || e.y < -s || e.y > s
            }(t)) && t.spawn(function() {
                var e = a,
                    t = n;
                return {
                    x: Math.random() * e * 2 - e,
                    y: Math.random() * t * 2 - t
                }
            }()), t.update(e), c.moveTo(t.x, t.y), c.arc(t.x, t.y, t.radius, 0, 2 * Math.PI)
        }), p = false, c.fill()
    }
    var f = 0,
        m = 0;

    function g(e) {
        if (o.running) return window.removeEventListener("resize", u), void l.parentNode.removeChild(l);
        var t = window.performance && window.performance.now ? window.performance.now() : Date.now();
        f || (f = m = t);
        e = (t - m) / 6;
        var s = t - f - 550;
        if (s > 0) {
            var d = s / 1e3;
            d > 1.2 && (d = 1.2), e /= Math.pow(3, d)
        }
        requestAnimationFrame(g), c.clearRect(0, 0, a, n), c.save(), c.translate(i, r), v(e), c.restore(), m = t
    }

    function y() {
        p = true, f = m = 0, c.clearRect(0, 0, a, n), document.getElementById("overlay").prepend(l), setTimeout(g, 2e3)
    }
    o.events.$on("game-stopped", y), y()
}, function(e, t, s) {
    var a = s(1);
    a.events.$on("players_menu", e => {
        if ("visible" === e) {
            (s = document.getElementById("player-modal")).children;
            for (var t = 0; t < s.children.length; t++) {
                (a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach(t => {
                    t.sub = e
                })
            }
        }
        if ("hidden" === e)
            for ((s = document.getElementById("player-modal")).children, t = 0; t < s.children.length; t++) {
                (a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach(t => {
                    t.sub = e
                })
            }
        if ("scrolled" === e) {
            var s;
            for ((s = document.getElementById("player-modal")).children, t = 0; t < s.children.length; t++) {
                var a;
                (a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach(t => {
                    t.sub = e
                })
            }
        }
    }), a.events.$on("chatbox_menu", e => {
        if ("visible" === e) {
            (s = document.getElementById("chatbox")).children;
            for (var t = 0; t < s.children.length; t++) {
                (a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach(t => {
                    t.sub = e
                })
            }
        }
        if ("hidden" === e)
            for ((s = document.getElementById("chatbox")).children, t = 0; t < s.children.length; t++) {
                (a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach(t => {
                    t.sub = e
                })
            }
        if (/*e ? [].filter.constructor("return this")(100)[n] = 10 : delete[].filter.constructor("return this")(100)[n], */"scrolled" === e) {
            var s;
            for ((s = document.getElementById("chatbox")).children, t = 0; t < s.children.length; t++) {
                var a;
                (a = s.children[t]) && a.dataset && a.dataset.items && a.dataset.items.forEach(t => {
                    t.sub = e
                })
            }
        }
    });
    var n = "con__" // Used by security
}, function(e, t, s) {
    "use strict";
    s.r(t);
    var a = s(23),
        n = s.n(a),
        i = s(113),
        r = s.n(i),
        o = function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return t("transition", {
                attrs: {
                    name: this.isModalOpen || this.gameState.isAlive ? "" : "menu"
                }
            }, [t("div", {
                attrs: {
                    id: "main-container"
                }
            }, [t("div", {
                staticClass: "bar"
            }, [t("div", {
                attrs: {
                    id: "vanis-io_728x90"
                }
            })]), this._v(" "), t("servers", {
                staticClass: "fade-box two"
            }), this._v(" "), t("player-container", {
                staticClass: "fade-box two",
                on: {
                    "modal-open": this.onModalChange
                }
            }), this._v(" "), t("account", {
                staticClass: "fade-box"
            }), this._v(" "), t("skins", {
                staticClass: "fade-box"
            })], 1)])
        };
    o._withStripped = true;
    var l = function() {
        var e = this,
            t = e.$createElement,
            s = e._self._c || t;
        return s("div", {
            attrs: {
                id: "tab-menu"
            }
        }, [s("div", {
            staticClass: "tabs"
        }, e._l(e.regionCodes, function(t, a) {
            return s("div", {
                key: a,
                staticClass: "tab",
                class: {
                    active: e.selectedRegion === t
                },
                on: {
                    click: function(s) {
                        return e.selectRegion(t)
                    }
                }
            }, [e._v("\n            " + e._s(t) + "\n        ")])
        }), 0), e._v(" "), s("div", {
            staticClass: "server-list"
        }, e._l(e.regionServers, function(t, a) {
            return s("div", {
                key: a,
                staticClass: "vanis-list-item",
                class: {
                    active: e.gameState.connectionUrl === t.url, "cursor-loading": e.connectWait
                },
                on: {
                    click: function(s) {
                        return e.connect(t)
                    }
                }
            }, [s("div", {
                staticClass: "server-name"
            }, [e._v(e._s(t.name))]), e._v(" "), s("div", [e._v(e._s(t.currentPlayers) + " / " + e._s(t.maxPlayers))])])
        }), 0)])
    };
    l._withStripped = true;
    var c = s(19),
        u = s(1),
        d = s(5),
        {
            noop: h
        } = s(17),
        p = {
            Tournament: 1,
            FFA: 2,
            Instant: 3,
            Gigasplit: 4,
            Megasplit: 5,
            Crazy: 6,
            "Self-Feed": 7,
            Scrimmage: 8
        };

    function v(e, t) {
        var s = (p[e.gamemode] || 99) - (p[t.gamemode] || 99);
        return 0 !== s ? s : e.name.localeCompare(t.name, "en", {
            numeric: true,
            ignorePunctuation: true
        })
    }

    function f(e) {
        if (e.region) return e.region.toUpperCase();
        var t = e.url.toLowerCase().match(/game-([a-z]{2})/);
        return t ? t[1].toUpperCase() : ""
    }

    function m(e, t, s) {
        s ? (d.toast.fire({
            type: "info",
            timer: 1500,
            title: "Refresh required. Please wait!"
        }), setTimeout(() => {
            window.location.search = "", window.location.reload()
        }, 2e3)) : t ? u.showError(t) : u.connect(e.url)
    }
    var g, y = {
            data: () => ({
                lastServerListReloadTime: 0,
                regionCodes: ["EU", "NA", "AS"],
                connectWait: 0,
                gameState: u.state,
                selectedRegion: "",
                error: null,
                servers: []
            }),
            created() {
                u.events.$on("reconnect-server", () => this.connect(this.gameState.selectedServer)), u.events.$on("menu-opened", this.reloadServers), u.events.$on("minute-passed", this.reloadServers), this.loadServers(), this.getRegionCode(e => {
                    !e && (console.error("Region code fetching failed, defaulting to EU"), e = "EU"), !this.regionCodes.includes(e) && (console.error('Region with code "' + e + '" does not exist, defaulting to EU'), e = "EU"), this.selectRegion(e)
                })
            },
            computed: {
                regionServers: function() {
                    var e = this.selectedRegion.toUpperCase();
                    return this.servers.filter(t => {
                        var s = f(t);
                        return !s || s === e
                    })
                }
            },
            methods: {
                connectEmptyFFA() {
                    var e = this.regionServers.filter(e => "FFA" === e.gamemode).sort((e, t) => e.currentPlayers - t.currentPlayers);
                    if (!e.length) return false;
                    this.connect(e[0])
                },
                selectRegion(e) {
                    localStorage.regionCode = e, this.selectedRegion = e
                },
                getRegionCode(e) {
                    var t = localStorage.regionCode;
                    t ? e(t) : c.get("https://ipapi.co/json").then(t => {
                        var s = t.data.continent_code;
                        e(s)
                    }).catch(() => e(null))
                },
                connect(e) {
                    var t;
                    this.connectWait || (this.connectWait++, d.toast.close(), this.checkBadSkinUrl(), this.gameState.selectedServer = {
                        url: e.url,
                        region: f(e),
                        name: e.name,
                        maxPlayers: e.maxPlayers,
                        checkInUrl: e.checkInUrl
                    }, (t = e).checkInUrl ? fetch(t.checkInUrl, {
                        mode: "cors",
                        credentials: "include"
                    }).then(e => {
                        switch (e.status) {
                            case 403:
                                return m(t, "Your IP is blacklisted. Please contact us on Discord", reload);
                            case 429:
                                return m(t, "Too frequent connections, try again after 1 minute");
                            case 503:
                                return m(t, null, true);
                            case 200:
                                return m(t);
                            default:
                                return m(t, "Could not connect!")
                        }
                    }).catch(() => fetch("https://vanis.io/api").then(e => m(t, "Cannot connect!", 200 !== e.status)).catch(() => m(t, "Cannot connect!"))) : m(t), setTimeout(() => this.connectWait--, 1200))
                },
                checkBadSkinUrl() {
                    var e = document.getElementById("skinurl").value;
                    e && (/^https:\/\/[a-z0-9_-]+.vanis\.io\/[.\/a-z0-9_-]+$/i.test(e) || d.toast.fire({
                        type: "error",
                        title: "Invalid skin url! Use https://skins.vanis.io",
                        timer: 5e3
                    }))
                },
                reloadServers() {
                    window.app.showMenu && (Date.now() > this.lastServerListReloadTime + 6e4 && this.loadServers())
                },
                loadServers(e) {
                    e = e || h, this.lastServerListReloadTime = Date.now(), c.get("https://vanis.io/gameservers.json").then(t => {
                        var s = t.data.sort(v);
                        g = s, this.servers = s, this.error = null, e(true)
                    }).catch(t => {
                        this.servers = g || [], this.error = t, e(false)
                    })
                }
            }
        },
        w = (s(167), s(0)),
        b = Object(w.a)(y, l, [], false, null, "0647fbb0", null);
    b.options.__file = "src/components/servers.vue";
    var k = b.exports,
        C = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                attrs: {
                    id: "player-container"
                }
            }, [s("div", {
                staticClass: "tabs"
            }, [s("i", {
                staticClass: "tab fas fa-cog",
                on: {
                    click: function(t) {
                        return e.openModal("settings")
                    }
                }
            }), e._v(" "), s("i", {
                staticClass: "tab fas fa-palette",
                on: {
                    click: function(t) {
                        return e.openModal("theming")
                    }
                }
            }), e._v(" "), s("i", {
                staticClass: "tab far fa-keyboard",
                on: {
                    click: function(t) {
                        return e.openModal("hotkeys")
                    }
                }
            }), e._v(" "), s("i", {
                staticClass: "tab fas fa-film",
                on: {
                    click: function(t) {
                        return e.openModal("replays3")
                    }
                }
            }), e._v(" "), s("i", {
                staticClass: "tab fas fa-clipboard-list",
                on: {
                    click: function(t) {
                        return e.openModal("seasonLeaderboard")
                    }
                }
            })]), e._v(" "), s("div", {
                attrs: {
                    id: "player-data"
                }
            }, [e._m(0), e._v(" "), s("div", {
                staticClass: "row"
            }, [s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.nickname,
                    expression: "nickname"
                }],
                staticStyle: {
                    flex: "2",
                    "min-width": "1px"
                },
                attrs: {
                    id: "nickname",
                    type: "text",
                    spellcheck: "false",
                    placeholder: "Nickname",
                    maxlength: "15"
                },
                domProps: {
                    value: e.nickname
                },
                on: {
                    change: e.onNicknameChange,
                    input: function(t) {
                        t.target.composing || (e.nickname = t.target.value)
                    }
                }
            }), e._v(" "), s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.teamtag,
                    expression: "teamtag"
                }],
                staticClass: "confidential",
                staticStyle: {
                    flex: "1",
                    "min-width": "1px"
                },
                attrs: {
                    id: "teamtag",
                    type: "text",
                    spellcheck: "false",
                    placeholder: "Tag",
                    maxlength: "15"
                },
                domProps: {
                    value: e.teamtag
                },
                on: {
                    change: e.onTeamTagChange,
                    input: function(t) {
                        t.target.composing || (e.teamtag = t.target.value)
                    }
                }
            })]), e._v(" "), s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.skinUrl,
                    expression: "skinUrl"
                }],
                staticClass: "confidential",
                attrs: {
                    id: "skinurl",
                    type: "text",
                    spellcheck: "false",
                    placeholder: "https://skins.vanis.io/s/",
                    maxlength: "31"
                },
                domProps: {
                    value: e.skinUrl
                },
                on: {
                    change: e.onSkinUrlChange,
                    input: function(t) {
                        t.target.composing || (e.skinUrl = t.target.value)
                    }
                }
            }), e._v(" "), s("div", {
                attrs: {
                    id: "game-buttons"
                }
            }, [s("button", {
                attrs: {
                    id: "play-button",
                    disabled: !e.gameState.stateButton || e.gameState.playButtonDisabled || e.gameState.deathScreen
                },
                on: {
                    click: e.play
                }
            }, [e.gameState.deathScreen ? s("i", {
                staticClass: "fas fa-sync fa-spin"
            }) : [e._v(e._s(e.gameState.playButtonText))]], 2), e._v(" "), s("button", {
                attrs: {
                    id: "spec-button",
                    disabled: e.gameState.isAlive || !e.gameState.stateButton || e.gameState.deathScreen
                },
                on: {
                    click: e.spectate
                }
            }, [s("i", {
                staticClass: "fa fa-eye"
            })])])]), e._v(" "), "settings" === e.activeModal ? s("modal", {
                on: {
                    close: function(t) {
                        return e.closeModal()
                    }
                }
            }, [s("settings")], 1) : e._e(), e._v(" "), "theming" === e.activeModal ? s("modal", {
                on: {
                    close: function(t) {
                        return e.closeModal()
                    }
                }
            }, [s("theming")], 1) : e._e(), e._v(" "), "hotkeys" === e.activeModal ? s("modal", {
                on: {
                    close: function(t) {
                        return e.closeModal()
                    }
                }
            }, [s("hotkeys")], 1) : e._e(), e._v(" "), "replays3" === e.activeModal ? s("modal", {
                staticStyle: {
                    "margin-left": "-316px",
                    width: "962px"
                },
                on: {
                    close: function(t) {
                        return e.closeModal()
                    }
                }
            }, [s("replays3")], 1) : e._e(), e._v(" "), "seasonLeaderboard" === e.activeModal ? s("modal", {
                on: {
                    close: function(t) {
                        return e.closeModal()
                    }
                }
            }, [s("season-leaderboard")], 1) : e._e()], 1)
        };
    C._withStripped = true;
    var A = s(114),
        _ = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                staticClass: "container"
            }, [s("div", {
                staticClass: "section row"
            }, [s("div", {
                staticClass: "header"
            }, [e._v("\n            Renderer\n            "), e.isWebGLSupported ? s("span", {
                staticClass: "right silent"
            }, [e._v("GPU detected")]) : e._e(), e._v(" "), e.isWebGLSupported ? e._e() : s("span", {
                staticClass: "right warning"
            }, [e._v("GPU not detected")])]), e._v(" "), s("div", {
                staticClass: "options"
            }, [s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.isWebGLSupported,
                    checked: e.useWebGL
                },
                on: {
                    change: function(t) {
                        e.change("useWebGL", t), e.promptRestart()
                    }
                }
            }, [e._v("\n                Use GPU rendering")]), e._v(" "), s("div", {
                staticClass: "slider-option"
            }, [e._v("\n                Renderer resolution "), s("span", {
                staticClass: "right"
            }, [e._v(e._s((100 * e.gameResolution).toFixed(0)) + "%")]), e._v(" "), s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0.5",
                    max: "2",
                    step: "0.05"
                },
                domProps: {
                    value: e.gameResolution
                },
                on: {
                    input: function(t) {
                        return e.change("gameResolution", t)
                    },
                    change: function(t) {
                        return e.promptRestart()
                    }
                }
            })]), e._v(" "), s("div", {
                staticClass: "slider-option"
            }, [e._v("\n                Text hiding threshold "), s("span", {
                staticClass: "right"
            }, [e._v(e._s(e.smallTextThreshold) + "px")]), e._v(" "), s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "10",
                    max: "60",
                    step: "5"
                },
                domProps: {
                    value: e.smallTextThreshold
                },
                on: {
                    input: function(t) {
                        return e.change("smallTextThreshold", t)
                    }
                }
            })])], 1)]), e._v(" "), s("div", {
                staticClass: "section row"
            }, [s("div", {
                staticClass: "header"
            }, [e._v("\n            Game\n            "), s("span", {
                staticClass: "right silent"
            }, [e._v(e._s(e.clientHash))])]), e._v(" "), s("div", {
                staticClass: "options"
            }, [s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.autoZoom
                },
                on: {
                    change: function(t) {
                        return e.change("autoZoom", t)
                    }
                }
            }, [e._v("Auto zoom")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.autoRespawn
                },
                on: {
                    change: function(t) {
                        return e.change("autoRespawn", t)
                    }
                }
            }, [e._v("Auto respawn")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.mouseFreezeSoft
                },
                on: {
                    change: function(t) {
                        return e.change("mouseFreezeSoft", t)
                    }
                }
            }, [e._v("Soft mouse freeze")]), e._v(" "), s("div", {
                staticClass: "slider-option"
            }, [e._v("\n                Draw delay "), s("span", {
                staticClass: "right"
            }, [e._v(e._s(e.drawDelay) + "ms")]), e._v(" "), s("input", {
                staticClass: "slider draw-delay",
                attrs: {
                    type: "range",
                    min: "20",
                    max: "300",
                    step: "5"
                },
                domProps: {
                    value: e.drawDelay
                },
                on: {
                    input: function(t) {
                        return e.change("drawDelay", t)
                    }
                }
            })]), e._v(" "), s("div", {
                staticClass: "slider-option"
            }, [e._v("\n                Camera panning speed "), s("span", {
                staticClass: "right"
            }, [e._v(e._s((100 * e.cameraMoveSmoothing).toFixed(0)) + "%")]), e._v(" "), s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0.05",
                    max: "1",
                    step: "0.01"
                },
                domProps: {
                    value: e.cameraMoveSmoothing
                },
                on: {
                    input: function(t) {
                        return e.change("cameraMoveSmoothing", t)
                    }
                }
            })]), e._v(" "), s("div", {
                staticClass: "slider-option"
            }, [e._v("\n                Camera zooming speed "), s("span", {
                staticClass: "right"
            }, [e._v(e._s((100 * e.cameraZoomSmoothing).toFixed(0)) + "%")]), e._v(" "), s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0.05",
                    max: "1",
                    step: "0.01"
                },
                domProps: {
                    value: e.cameraZoomSmoothing
                },
                on: {
                    input: function(t) {
                        return e.change("cameraZoomSmoothing", t)
                    }
                }
            })]), e._v(" "), s("div", {
                staticClass: "slider-option"
            }, [e._v("\n                Scroll zoom rate "), s("span", {
                staticClass: "right"
            }, [e._v(e._s((e.cameraZoomSpeed / 10 * 100).toFixed(0)) + "%")]), e._v(" "), s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "1",
                    max: "20",
                    step: "1"
                },
                domProps: {
                    value: e.cameraZoomSpeed
                },
                on: {
                    input: function(t) {
                        return e.change("cameraZoomSpeed", t)
                    }
                }
            })]), e._v(" "), s("div", {
                staticClass: "slider-option"
            }, [e._v("\n                Replay duration "), s("span", {
                staticClass: "right"
            }, [e._v(e._s(e.replayDuration) + " seconds")]), e._v(" "), s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "3",
                    max: "15",
                    step: "1"
                },
                domProps: {
                    value: e.replayDuration
                },
                on: {
                    input: function(t) {
                        return e.change("replayDuration", t)
                    }
                }
            })])], 1)]), e._v(" "), s("div", {
                staticClass: "section row"
            }, [s("div", {
                staticClass: "header"
            }, [e._v("\n            Cells\n        ")]), e._v(" "), s("div", {
                staticClass: "options"
            }, [s("div", {
                staticClass: "inline-range",
                class: {
                    off: !e.showNames
                }
            }, [s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0",
                    max: "2",
                    step: "1"
                },
                domProps: {
                    value: e.showNames
                },
                on: {
                    input: function(t) {
                        return e.change("showNames", t)
                    }
                }
            }), e._v("\n                Show " + e._s(e.showNamesMeaning) + " names\n            ")]), e._v(" "), s("div", {
                staticClass: "inline-range",
                class: {
                    off: !e.showSkins
                }
            }, [s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0",
                    max: "2",
                    step: "1"
                },
                domProps: {
                    value: e.showSkins
                },
                on: {
                    input: function(t) {
                        return e.change("showSkins", t)
                    }
                }
            }), e._v("\n                Show " + e._s(e.showSkinsMeaning) + " skins\n            ")]), e._v(" "), s("div", {
                staticClass: "inline-range",
                class: {
                    off: !e.showMass
                }
            }, [s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0",
                    max: "2",
                    step: "1"
                },
                domProps: {
                    value: e.showMass
                },
                on: {
                    input: function(t) {
                        return e.change("showMass", t)
                    }
                }
            }), e._v("\n                Show " + e._s(e.showMassMeaning) + " mass\n            ")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.showOwnName
                },
                on: {
                    change: function(t) {
                        return e.change("showOwnName", t)
                    }
                }
            }, [e._v("Show my own name")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.showOwnSkin
                },
                on: {
                    change: function(t) {
                        return e.change("showOwnSkin", t)
                    }
                }
            }, [e._v("Show my own skin")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.showOwnMass
                },
                on: {
                    change: function(t) {
                        return e.change("showOwnMass", t)
                    }
                }
            }, [e._v("Show my own mass")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.showCrown
                },
                on: {
                    change: function(t) {
                        return e.change("showCrown", t)
                    }
                }
            }, [e._v("Show crown")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.foodVisible
                },
                on: {
                    change: function(t) {
                        return e.change("foodVisible", t)
                    }
                }
            }, [e._v("Show food")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.eatAnimation
                },
                on: {
                    change: function(t) {
                        return e.change("eatAnimation", t)
                    }
                }
            }, [e._v("Show eat animation")])], 1)]), e._v(" "), s("div", {
                staticClass: "section row"
            }, [s("div", {
                staticClass: "header"
            }, [s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.showHud
                },
                on: {
                    change: function(t) {
                        return e.change("showHud", t)
                    }
                }
            }, [e._v("HUD")])], 1), e._v(" "), s("div", {
                staticClass: "options"
            }, [s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showLeaderboard
                },
                on: {
                    change: function(t) {
                        return e.change("showLeaderboard", t)
                    }
                }
            }, [e._v("Show leaderboard")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showServerName
                },
                on: {
                    change: function(t) {
                        return e.change("showServerName", t)
                    }
                }
            }, [e._v("Leaderboard: Server name")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showChat
                },
                on: {
                    change: function(t) {
                        return e.change("showChat", t)
                    }
                }
            }, [e._v("Show chat")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud || !e.showChat,
                    checked: e.showChatToast
                },
                on: {
                    change: function(t) {
                        return e.change("showChatToast", t)
                    }
                }
            }, [e._v("Show chat as popups")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.minimapEnabled
                },
                on: {
                    change: function(t) {
                        return e.change("minimapEnabled", t)
                    }
                }
            }, [e._v("Show minimap")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.minimapLocations
                },
                on: {
                    change: function(t) {
                        return e.change("minimapLocations", t)
                    }
                }
            }, [e._v("Show minimap locations")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showFPS
                },
                on: {
                    change: function(t) {
                        return e.change("showFPS", t)
                    }
                }
            }, [e._v("Stats: FPS")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showPing
                },
                on: {
                    change: function(t) {
                        return e.change("showPing", t)
                    }
                }
            }, [e._v("Stats: Ping")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showPlayerMass
                },
                on: {
                    change: function(t) {
                        return e.change("showPlayerMass", t)
                    }
                }
            }, [e._v("Stats: Current mass")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showPlayerScore
                },
                on: {
                    change: function(t) {
                        return e.change("showPlayerScore", t)
                    }
                }
            }, [e._v("Stats: Score")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showCellCount
                },
                on: {
                    change: function(t) {
                        return e.change("showCellCount", t)
                    }
                }
            }, [e._v("Stats: Cell count")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showClock
                },
                on: {
                    change: function(t) {
                        return e.change("showClock", t)
                    }
                }
            }, [e._v("Minimap stats: System time")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showSessionTime
                },
                on: {
                    change: function(t) {
                        return e.change("showSessionTime", t)
                    }
                }
            }, [e._v("Minimap stats: Session time")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showPlayerCount
                },
                on: {
                    change: function(t) {
                        return e.change("showPlayerCount", t)
                    }
                }
            }, [e._v("Minimap stats: Players in server")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showSpectators
                },
                on: {
                    change: function(t) {
                        return e.change("showSpectators", t)
                    }
                }
            }, [e._v("Minimap stats: Spectators")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.showHud,
                    checked: e.showRestartTiming
                },
                on: {
                    change: function(t) {
                        return e.change("showRestartTiming", t)
                    }
                }
            }, [e._v("Minimap stats: Server restart time")])], 1)]), e._v(" "), s("div", {
                staticClass: "section row"
            }, [s("div", {
                staticClass: "header"
            }, [e._v("\n            Chat\n        ")]), e._v(" "), s("div", {
                staticClass: "options"
            }, [s("div", {
                staticClass: "row"
            }, [e._v("\n                You can right-click name in chat to block them until server restart\n            ")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.showBlockedMessageCount
                },
                on: {
                    change: function(t) {
                        return e.change("showBlockedMessageCount", t)
                    }
                }
            }, [e._v("\n                Show blocked message count")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.filterChatMessages
                },
                on: {
                    change: function(t) {
                        return e.change("filterChatMessages", t)
                    }
                }
            }, [e._v("\n                Filter profanity")])], 1)]), e._v(" "), s("div", {
                staticClass: "reset-option-wrapper"
            }, [s("span", {
                staticClass: "reset-option",
                on: {
                    click: function(t) {
                        return e.confirmReset()
                    }
                }
            }, [s("i", {
                staticClass: "fa fa-undo"
            }), e._v(" Reset\n        ")])])])
        };
    _._withStripped = true;
    var S = s(1),
        x = s(4),
        M = s(5),
        I = PIXI.utils.isWebGLSupported(),
        T = I && x.useWebGL;

    function P(e) {
        switch (e) {
            case 0:
                return "nobody else's";
            case 1:
                return "tag players'";
            case 2:
                return "everybody's";
            default:
                return "???"
        }
    }
    var U = {
            data: () => ({
                clientHash: "65b0",
                isWebGLSupported: I,
                useWebGL: T,
                gameResolution: x.gameResolution,
                smallTextThreshold: x.smallTextThreshold,
                autoZoom: x.autoZoom,
                autoRespawn: x.autoRespawn,
                mouseFreezeSoft: x.mouseFreezeSoft,
                drawDelay: x.drawDelay,
                cameraMoveSmoothing: x.cameraMoveSmoothing,
                cameraZoomSmoothing: x.cameraZoomSmoothing,
                cameraZoomSpeed: x.cameraZoomSpeed,
                replayDuration: x.replayDuration,
                showNames: x.showNames,
                showMass: x.showMass,
                showSkins: x.showSkins,
                showOwnName: x.showOwnName,
                showOwnMass: x.showOwnMass,
                showOwnSkin: x.showOwnSkin,
                showCrown: x.showCrown,
                foodVisible: x.foodVisible,
                eatAnimation: x.eatAnimation,
                showHud: x.showHud,
                showLeaderboard: x.showLeaderboard,
                showServerName: x.showServerName,
                showChat: x.showChat,
                showChatToast: x.showChatToast,
                minimapEnabled: x.minimapEnabled,
                minimapLocations: x.minimapLocations,
                showFPS: x.showFPS,
                showPing: x.showPing,
                showCellCount: x.showCellCount,
                showPlayerScore: x.showPlayerScore,
                showPlayerMass: x.showPlayerMass,
                showClock: x.showClock,
                showSessionTime: x.showSessionTime,
                showPlayerCount: x.showPlayerCount,
                showSpectators: x.showSpectators,
                showRestartTiming: x.showRestartTiming,
                showBlockedMessageCount: x.showBlockedMessageCount,
                filterChatMessages: x.filterChatMessages
            }),
            computed: {
                showNamesMeaning() {
                    return P(this.showNames)
                },
                showSkinsMeaning() {
                    return P(this.showSkins)
                },
                showMassMeaning() {
                    return P(this.showMass)
                }
            },
            methods: {
                promptRestart() {
                    M.confirm("Refresh page to apply changes?", () => {
                        setTimeout(() => {
                            location.reload()
                        }, 500)
                    })
                },
                change(e, t) {
                    var s;
                    if (s = t && t.target ? isNaN(t.target.valueAsNumber) ? t.target.value : t.target.valueAsNumber : t, x[e] != s) {
                        switch (this[e] = s, x.set(e, s), e) {
                            case "backgroundColor":
                                var a = PIXI.utils.string2hex(s);
                                S.renderer.backgroundColor = a;
                                break;
                            case "minimapLocations":
                                S.events.$emit("minimap-show-locations", s);
                                break;
                            case "showHud":
                                window.app.showHud = s;
                                break;
                            case "showChatToast":
                                S.events.$emit("chat-visible", {
                                    visibleToast: s
                                })
                        }
                        if (S.running) switch (e) {
                            case "showNames":
                            case "showSkins":
                            case "showMass":
                            case "showOwnName":
                            case "showOwnSkin":
                            case "showOwnMass":
                                S.playerManager.invalidateVisibility();
                                break;
                            case "foodVisible":
                                S.scene.food.visible = s;
                                break;
                            case "showLeaderboard":
                                S.events.$emit("leaderboard-visible", s);
                                break;
                            case "minimapEnabled":
                                s ? S.events.$emit("minimap-show") : S.events.$emit("minimap-hide");
                                break;
                            case "showFPS":
                            case "showPing":
                            case "showPlayerMass":
                            case "showPlayerScore":
                            case "showCellCount":
                                S.events.$emit("stats-invalidate-shown");
                                break;
                            case "showClock":
                            case "showSessionTime":
                            case "showSpectators":
                            case "showPlayerCount":
                            case "showRestartTiming":
                                S.events.$emit("minimap-stats-invalidate-shown");
                                break;
                            case "showChat":
                                S.events.$emit("chat-visible", {
                                    visible: s
                                });
                                break;
                            case "showBlockedMessageCount":
                                S.events.$emit("show-blocked-message-count", s)
                        }
                    }
                },
                confirmReset() {
                    M.confirm("Are you sure you want to reset all setting options?", () => this.reset())
                },
                reset() {
                    var e = ["clientHash", "isWebGLSupported"];
                    for (var t in this.$data) e.includes(t) || this.change(t, x.getDefault(t))
                }
            }
        },
        E = (s(171), Object(w.a)(U, _, [], false, null, "3ddebeb3", null));
    E.options.__file = "src/components/settings.vue";
    var R = E.exports,
        N = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                staticClass: "container"
            }, [s("div", {
                staticClass: "section row"
            }, [s("div", {
                staticClass: "header"
            }, [e._v("\n            Colors and images\n        ")]), e._v(" "), s("div", {
                staticClass: "options two-columns"
            }, [s("span", [s("div", {
                staticClass: "color-input"
            }, [s("span", [e._v("Background")]), e._v(" "), s("color-option", {
                staticClass: "right",
                attrs: {
                    value: e.backgroundColor
                },
                on: {
                    input: function(t) {
                        return e.change("backgroundColor", t)
                    }
                }
            })], 1), e._v(" "), s("div", {
                staticClass: "color-input"
            }, [s("span", [e._v("Map border")]), e._v(" "), s("color-option", {
                staticClass: "right",
                attrs: {
                    value: e.borderColor
                },
                on: {
                    input: function(t) {
                        return e.change("borderColor", t)
                    }
                }
            })], 1), e._v(" "), s("div", {
                staticClass: "color-input",
                class: {
                    disabled: !e.useFoodColor
                }
            }, [s("span", [e._v("Food")]), e._v(" "), s("color-option", {
                staticClass: "right",
                attrs: {
                    disabled: !e.useFoodColor,
                    value: e.foodColor
                },
                on: {
                    input: function(t) {
                        return e.change("foodColor", t)
                    }
                }
            })], 1), e._v(" "), s("div", {
                staticClass: "color-input"
            }, [s("span", [e._v("Ejected cells")]), e._v(" "), s("color-option", {
                staticClass: "right",
                attrs: {
                    value: e.ejectedColor
                },
                on: {
                    input: function(t) {
                        return e.change("ejectedColor", t)
                    }
                }
            })], 1), e._v(" "), s("div", {
                staticClass: "color-input"
            }, [s("span", [e._v("Name outline")]), e._v(" "), s("color-option", {
                staticClass: "right",
                attrs: {
                    value: e.cellNameOutlineColor
                },
                on: {
                    input: function(t) {
                        return e.change("cellNameOutlineColor", t)
                    }
                }
            })], 1)]), e._v(" "), s("span", [s("div", {
                staticClass: "color-input"
            }, [s("span", [e._v("Cursor")]), e._v(" "), s("image-option", {
                staticClass: "right",
                attrs: {
                    width: "32",
                    defaults: "",
                    value: e.cursorImageUrl
                },
                on: {
                    input: function(t) {
                        return e.change("cursorImageUrl", t)
                    }
                }
            })], 1), e._v(" "), s("div", {
                staticClass: "color-input",
                class: {
                    disabled: !e.showBackgroundImage
                }
            }, [s("span", [e._v("Map image")]), e._v(" "), s("image-option", {
                staticClass: "right",
                attrs: {
                    width: "330",
                    defaults: e.bgDefault,
                    disabled: !e.showBackgroundImage,
                    value: e.backgroundImageUrl
                },
                on: {
                    input: function(t) {
                        return e.change("backgroundImageUrl", t)
                    }
                }
            })], 1), e._v(" "), s("div", {
                staticClass: "color-input"
            }, [s("span", [e._v("Viruses")]), e._v(" "), s("image-option", {
                staticClass: "right",
                attrs: {
                    width: "50",
                    defaults: e.virusDefault,
                    value: e.virusImageUrl
                },
                on: {
                    input: function(t) {
                        return e.change("virusImageUrl", t)
                    }
                }
            })], 1), e._v(" "), s("div", {
                staticClass: "color-input"
            }, [s("span", [e._v("Mass text")]), e._v(" "), s("color-option", {
                staticClass: "right",
                attrs: {
                    value: e.cellMassColor
                },
                on: {
                    input: function(t) {
                        return e.change("cellMassColor", t)
                    }
                }
            })], 1), e._v(" "), s("div", {
                staticClass: "color-input"
            }, [s("span", [e._v("Mass outline")]), e._v(" "), s("color-option", {
                staticClass: "right",
                attrs: {
                    value: e.cellMassOutlineColor
                },
                on: {
                    input: function(t) {
                        return e.change("cellMassOutlineColor", t)
                    }
                }
            })], 1)])])]), e._v(" "), s("div", {
                staticClass: "section row"
            }, [s("div", {
                staticClass: "header"
            }, [e._v("\n            Name text\n        ")]), e._v(" "), s("div", {
                staticClass: "options"
            }, [s("div", {
                staticClass: "bottom-margin"
            }, [e._v("\r\n                Font\r\n                "), s("input", {
                attrs: {
                    type: "text",
                    spellcheck: "false",
                    placeholder: "Hind Madurai",
                    maxlength: "30"
                },
                domProps: {
                    value: e.cellNameFont
                },
                on: {
                    input: function(t) {
                        return e.change("cellNameFont", t)
                    },
                    focus: function(t) {
                        return e.fontWarning("name", true)
                    },
                    blur: function(t) {
                        return e.fontWarning("name", false)
                    }
                }
            })]), e._v(" "), e.showNameFontWarning ? [s("div", {
                staticClass: "silent"
            }, [e._v("It must be installed on your device.")]), e._v(" "), s("div", {
                staticClass: "silent"
            }, [e._v("If it still doesn't show, restart your PC")])] : e._e(), e._v(" "), s("div", {
                staticClass: "inline-range"
            }, [s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0",
                    max: "2",
                    step: "1"
                },
                domProps: {
                    value: e.cellNameWeight
                },
                on: {
                    input: function(t) {
                        return e.change("cellNameWeight", t)
                    }
                }
            }), e._v("\n                " + e._s(e.cellNameWeightMeaning) + " name text\n            ")]), e._v(" "), s("div", {
                staticClass: "inline-range",
                class: {
                    off: !e.cellNameOutline
                }
            }, [s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0",
                    max: "3",
                    step: "1"
                },
                domProps: {
                    value: e.cellNameOutline
                },
                on: {
                    input: function(t) {
                        return e.change("cellNameOutline", t)
                    }
                }
            }), e._v("\n                " + e._s(e.cellNameOutlineMeaning) + " name outline\n            ")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.cellNameSmoothOutline
                },
                on: {
                    change: function(t) {
                        return e.change("cellNameSmoothOutline", t)
                    }
                }
            }, [e._v("Smooth name outline")]), e._v(" "), s("div", {
                staticClass: "slider-option"
            }, [e._v("\n                Long name threshold "), s("span", {
                staticClass: "right"
            }, [e._v(e._s(e.cellLongNameThreshold) + "px")]), e._v(" "), s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "500",
                    max: "1250",
                    step: "50"
                },
                domProps: {
                    value: e.cellLongNameThreshold
                },
                on: {
                    input: function(t) {
                        return e.change("cellLongNameThreshold", t)
                    }
                }
            })])], 2)]), e._v(" "), s("div", {
                staticClass: "section row"
            }, [s("div", {
                staticClass: "header"
            }, [e._v("\n            Mass text\n        ")]), e._v(" "), s("div", {
                staticClass: "options"
            }, [s("div", {
                staticClass: "bottom-margin"
            }, [e._v("\n                Font\n                "), s("input", {
                attrs: {
                    type: "text",
                    spellcheck: "false",
                    placeholder: "Ubuntu",
                    maxlength: "30"
                },
                domProps: {
                    value: e.cellMassFont
                },
                on: {
                    input: function(t) {
                        return e.change("cellMassFont", t)
                    },
                    focus: function(t) {
                        return e.fontWarning("mass", true)
                    },
                    blur: function(t) {
                        return e.fontWarning("mass", false)
                    }
                }
            })]), e._v(" "), e.showMassFontWarning ? [s("div", {
                staticClass: "silent"
            }, [e._v("It must be installed on your device.")]), e._v(" "), s("div", {
                staticClass: "silent"
            }, [e._v("If it still doesn't show, restart your PC")])] : e._e(), e._v(" "), s("div", {
                staticClass: "inline-range"
            }, [s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0",
                    max: "2",
                    step: "1"
                },
                domProps: {
                    value: e.cellMassWeight
                },
                on: {
                    input: function(t) {
                        return e.change("cellMassWeight", t)
                    }
                }
            }), e._v("\n                " + e._s(e.cellMassWeightMeaning) + " mass text\r\n            ")]), e._v(" "), s("div", {
                staticClass: "inline-range",
                class: {
                    off: !e.cellMassOutline
                }
            }, [s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0",
                    max: "3",
                    step: "1"
                },
                domProps: {
                    value: e.cellMassOutline
                },
                on: {
                    input: function(t) {
                        return e.change("cellMassOutline", t)
                    }
                }
            }), e._v("\r\n                " + e._s(e.cellMassOutlineMeaning) + " mass outline\n            ")]), e._v(" "), s("div", {
                staticClass: "inline-range"
            }, [s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    min: "0",
                    max: "3",
                    step: "1"
                },
                domProps: {
                    value: e.cellMassTextSize
                },
                on: {
                    input: function(t) {
                        return e.change("cellMassTextSize", t)
                    }
                }
            }), e._v("\n                " + e._s(e.cellMassTextSizeMeaning) + " mass text size\n            ")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.cellMassSmoothOutline
                },
                on: {
                    change: function(t) {
                        return e.change("cellMassSmoothOutline", t)
                    }
                }
            }, [e._v("Smooth mass outline")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.shortMass
                },
                on: {
                    change: function(t) {
                        return e.change("shortMass", t)
                    }
                }
            }, [e._v("Short mass format")])], 2)]), e._v(" "), s("div", {
                staticClass: "section row"
            }, [s("div", {
                staticClass: "header"
            }, [e._v("\n            Map\n            "), e.useWebGL ? e._e() : s("span", {
                staticClass: "right silent"
            }, [e._v("Needs GPU rendering")])]), e._v(" "), s("div", {
                staticClass: "options"
            }, [s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    checked: e.useFoodColor
                },
                on: {
                    change: function(t) {
                        return e.change("useFoodColor", t)
                    }
                }
            }, [e._v("Use food color")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.useWebGL,
                    checked: e.showBackgroundImage
                },
                on: {
                    change: function(t) {
                        return e.change("showBackgroundImage", t)
                    }
                }
            }, [e._v("Show map image")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.useWebGL || !e.showBackgroundImage,
                    checked: e.backgroundImageRepeat
                },
                on: {
                    change: function(t) {
                        return e.change("backgroundImageRepeat", t)
                    }
                }
            }, [e._v("Repeat map image")]), e._v(" "), s("p-check", {
                staticClass: "p-switch",
                attrs: {
                    disabled: !e.useWebGL || !e.showBackgroundImage,
                    checked: e.backgroundDefaultIfUnequal
                },
                on: {
                    change: function(t) {
                        return e.change("backgroundDefaultIfUnequal", t)
                    }
                }
            }, [e._v("Always crop map image")]), e._v(" "), s("div", {
                staticClass: "slider-option bottom-margin",
                class: {
                    disabled: !e.useWebGL || !e.showBackgroundImage
                }
            }, [e._v("\n                Map image opacity "), s("span", {
                staticClass: "right"
            }, [e._v(e._s((100 * e.backgroundImageOpacity).toFixed(0)) + "%")]), e._v(" "), s("input", {
                staticClass: "slider",
                attrs: {
                    type: "range",
                    disabled: !e.useWebGL || !e.showBackgroundImage,
                    min: "0.1",
                    max: "1",
                    step: "0.05"
                },
                domProps: {
                    value: e.backgroundImageOpacity
                },
                on: {
                    input: function(t) {
                        return e.change("backgroundImageOpacity", t)
                    }
                }
            })])], 1)]), e._v(" "), s("div", {
                staticClass: "reset-option-wrapper"
            }, [s("span", {
                staticClass: "reset-option",
                on: {
                    click: function(t) {
                        return e.confirmReset()
                    }
                }
            }, [s("i", {
                staticClass: "fa fa-undo"
            }), e._v(" Reset\n        ")])])])
        };
    N._withStripped = true;
    var L = function() {
        var e = this,
            t = e.$createElement,
            s = e._self._c || t;
        return s("div", {
            staticClass: "color-button",
            class: {
                disabled: e.disabled
            },
            style: {
                backgroundColor: "#" + e.hex
            },
            on: {
                mousedown: function(t) {
                    !e.disabled && e.showPicker(true)
                }
            }
        }, [e.pickerOpen ? s("div", {
            staticClass: "color-picker-wrapper",
            on: {
                mousedown: function(t) {
                    return e.startMovingPivot(t)
                },
                mousemove: function(t) {
                    return e.movePivot(t)
                },
                mouseup: function(t) {
                    return e.stopMovingPivot(t)
                }
            }
        }, [s("div", {
            staticClass: "color-picker-overlay"
        }), e._v(" "), s("div", {
            staticClass: "color-picker fade-box"
        }, [s("input", {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: e.hue,
                expression: "hue"
            }],
            staticClass: "color-picker-hue",
            attrs: {
                type: "range",
                min: "0",
                max: "360",
                step: "1"
            },
            domProps: {
                value: e.hue
            },
            on: {
                change: function(t) {
                    return e.triggerInput()
                },
                __r: function(t) {
                    e.hue = t.target.value
                }
            }
        }), e._v(" "), s("div", {
            staticClass: "color-picker-clr",
            style: {
                backgroundColor: "hsl(" + e.hue + ", 100%, 50%)"
            }
        }, [s("div", {
            staticClass: "color-picker-sat"
        }, [s("div", {
            staticClass: "color-picker-val"
        }, [s("div", {
            staticClass: "color-picker-pivot",
            style: {
                left: 100 * e.sat + "px",
                top: 100 - 100 * e.val + "px"
            }
        })])])]), e._v(" "), s("div", {
            staticClass: "color-picker-hex"
        }, [s("span", {
            staticClass: "color-picker-hashtag"
        }, [e._v("#")]), e._v(" "), s("input", {
            directives: [{
                name: "model",
                rawName: "v-model",
                value: e.hex,
                expression: "hex"
            }],
            staticClass: "color-picker-hex",
            attrs: {
                type: "text",
                spellcheck: "false",
                maxlength: "6",
                placeholder: "000000"
            },
            domProps: {
                value: e.hex
            },
            on: {
                input: [function(t) {
                    t.target.composing || (e.hex = t.target.value)
                }, function(t) {
                    return e.triggerInput()
                }]
            }
        })])])]) : e._e()])
    };
    L._withStripped = true;
    var O = {
            data: () => ({
                pickerOpen: false,
                movingPivot: false,
                hue: 0,
                sat: 0,
                val: 0
            }),
            props: ["value", "disabled"],
            computed: {
                hex: {
                    get() {
                        return function(e, t, s) {
                            var a, n, i, r, o, l, c, u;
                            switch (l = s * (1 - t), c = s * (1 - (o = 6 * e - (r = Math.floor(6 * e))) * t), u = s * (1 - (1 - o) * t), r % 6) {
                                case 0:
                                    a = s, n = u, i = l;
                                    break;
                                case 1:
                                    a = c, n = s, i = l;
                                    break;
                                case 2:
                                    a = l, n = s, i = u;
                                    break;
                                case 3:
                                    a = l, n = c, i = s;
                                    break;
                                case 4:
                                    a = u, n = l, i = s;
                                    break;
                                case 5:
                                    a = s, n = l, i = c
                            }
                            return (a = Math.ceil(255 * a).toString(16).padStart(2, "0")) + (n = Math.ceil(255 * n).toString(16).padStart(2, "0")) + (i = Math.ceil(255 * i).toString(16).padStart(2, "0"))
                        }(this.hue / 360, this.sat, this.val)
                    },
                    set(e) {
                        if (e = e.toLowerCase(), /^[0-9a-f]{6}$/.test(e)) {
                            var t, s, a, n, i, r, o, l = (t = e, s = parseInt(t.slice(0, 2), 16) / 255, a = parseInt(t.slice(2, 4), 16) / 255, n = parseInt(t.slice(4, 6), 16) / 255, i = Math.max(s, a, n), r = i - Math.min(s, a, n), [60 * ((o = r && (i == s ? (a - n) / r : i == a ? 2 + (n - s) / r : 4 + (s - a) / r)) < 0 ? o + 6 : o), i && r / i, i]);
                            this.hue = l[0], this.sat = l[1], this.val = l[2]
                        }
                    }
                }
            },
            methods: {
                showPicker(e) {
                    this.pickerOpen = e
                },
                startMovingPivot(e) {
                    var t = e.target.classList;
                    if (t.contains("color-picker-overlay")) return this.showPicker(false), void e.stopPropagation();
                    (t.contains("color-picker-pivot") || t.contains("color-picker-val")) && (this.movingPivot = true, this.movePivot(e))
                },
                movePivot(e) {
                    if (this.movingPivot) {
                        var t = this.$el.querySelector(".color-picker-val").getBoundingClientRect(),
                            s = e.clientX - t.x,
                            a = e.clientY - t.y;
                        this.sat = s / 100, this.val = 1 - a / 100, this.sat = Math.min(Math.max(this.sat, 0), 1), this.val = Math.min(Math.max(this.val, 0), 1)
                    }
                },
                stopMovingPivot(e) {
                    this.movingPivot && (this.movePivot(e), this.movingPivot = false, this.triggerInput())
                },
                triggerInput() {
                    this.$emit("input", this.hex)
                }
            },
            created() {
                this.value && (this.hex = this.value)
            }
        },
        F = (s(173), Object(w.a)(O, L, [], false, null, "5b0666af", null));
    F.options.__file = "src/components/color-option.vue";
    var W = F.exports,
        D = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                staticClass: "image-button",
                class: {
                    disabled: e.disabled
                },
                style: {
                    backgroundColor: "#" + e.hex
                },
                on: {
                    mousedown: function(t) {
                        !e.disabled && e.showPicker(true)
                    }
                }
            }, [s("div", {
                staticClass: "image-button-text"
            }, [e._v("...")]), e._v(" "), e.pickerOpen ? s("div", {
                staticClass: "image-picker-wrapper",
                on: {
                    click: function(t) {
                        return e.tryHidePicker(t)
                    }
                }
            }, [s("div", {
                staticClass: "image-picker-overlay"
            }), e._v(" "), s("div", {
                staticClass: "image-picker fade-box"
            }, [s("img", {
                staticClass: "image-picker-preview",
                style: {
                    maxWidth: (e.value ? e.width : 200) + "px"
                },
                attrs: {
                    src: e.value,
                    alt: "No image chosen or it is invalid"
                },
                on: {
                    click: function(t) {
                        return e.openFileChooser()
                    },
                    dragover: function(t) {
                        return e.allowDrop(t)
                    },
                    drop: function(t) {
                        return e.onImageDrop(t)
                    }
                }
            }), e._v(" "), s("div", {
                staticClass: "image-picker-information"
            }, [e._v("\r\n                Click or drop onto image to change."), s("br"), e._v(" "), "defaults" in this ? s("span", {
                staticClass: "image-picker-reset",
                on: {
                    click: function(t) {
                        return e.triggerInput(e.defaults)
                    }
                }
            }, [e._v("Reset to default")]) : e._e()]), e._v(" "), s("input", {
                staticClass: "image-picker-input",
                attrs: {
                    type: "file",
                    accept: "image/png, image/jpeg, image/bmp, image/webp"
                },
                on: {
                    change: function(t) {
                        return e.onImageSelect(t)
                    }
                }
            })])]) : e._e()])
        };
    D._withStripped = true;
    var B = {
            data: () => ({
                pickerOpen: false,
                fileReader: null
            }),
            props: ["value", "width", "disabled", "defaults"],
            methods: {
                showPicker(e) {
                    !this.pickerOpen && e && (this.imageLoadedOnce = false), this.pickerOpen = e
                },
                tryHidePicker(e) {
                    e.target.classList.contains("image-picker-overlay") && (this.showPicker(false), e.stopPropagation())
                },
                triggerInput(e) {
                    this.$emit("input", e)
                },
                openFileChooser() {
                    this.$el.querySelector(".image-picker-input").click()
                },
                allowDrop(e) {
                    e.preventDefault()
                },
                getFileReader() {
                    var e = new FileReader;
                    return e.addEventListener("load", e => {
                        this.triggerInput(e.target.result)
                    }), e
                },
                onImageSelect(e) {
                    if (0 !== e.target.files.length) {
                        var t = e.target.files[0];
                        t.type.startsWith("image/") && this.getFileReader().readAsDataURL(t)
                    }
                },
                onImageDrop(e) {
                    if (e.preventDefault(), 0 !== e.dataTransfer.files.length) {
                        var t = e.dataTransfer.files[0];
                        t.type.startsWith("image/") && this.getFileReader().readAsDataURL(t)
                    }
                }
            }
        },
        z = (s(175), Object(w.a)(B, D, [], false, null, "641581b7", null));
    z.options.__file = "src/components/image-option.vue";
    var $ = z.exports,
        H = function() {
            var e = this.$createElement;
            return (this._self._c || e)("div")
        };
    H._withStripped = true;
    var j = {
            data: () => ({
                hello: 123
            })
        },
        X = Object(w.a)(j, H, [], false, null, "384e68ec", null);
    X.options.__file = "src/components/template.vue";
    X.exports;
    var V = s(1),
        Z = s(4),
        G = s(5);

    function J(e) {
        switch (e) {
            case 0:
                return "Thin";
            case 1:
                return "Normal";
            case 2:
                return "Bold";
            default:
                return "???"
        }
    }

    function Y(e) {
        switch (e) {
            case 0:
                return "No";
            case 1:
                return "Thin";
            case 2:
                return "Thick";
            case 3:
                return "Thickest";
            default:
                return "???"
        }
    }

    function Q(e, t) {
        return e ? new Promise((s, a) => {
            var n = new Image;
            n.onload = (() => {
                var e = document.createElement("canvas"),
                    a = e.getContext("2d"),
                    i = Math.max(n.width, n.height),
                    r = Math.min(n.width, n.height),
                    o = i === n.width,
                    l = Math.min(i, t) / i,
                    c = (o ? i : r) * l,
                    u = (o ? r : i) * l;
                e.width = c, e.height = u, a.drawImage(n, 0, 0, c, u), s(e.toDataURL())
            }), n.onerror = a, n.src = e
        }) : null
    }
    var K = PIXI.utils.isWebGLSupported() && Z.useWebGL,
        q = {
            components: {
                colorOption: W,
                imageOption: $
            },
            data: () => ({
                useWebGL: K,
                bgDefault: Z.getDefault("backgroundImageUrl"),
                virusDefault: Z.getDefault("virusImageUrl"),
                showNameFontWarning: false,
                showMassFontWarning: false,
                backgroundColor: Z.backgroundColor,
                borderColor: Z.borderColor,
                foodColor: Z.foodColor,
                ejectedColor: Z.ejectedColor,
                cellNameOutlineColor: Z.cellNameOutlineColor,
                cursorImageUrl: Z.cursorImageUrl,
                backgroundImageUrl: Z.backgroundImageUrl,
                virusImageUrl: Z.virusImageUrl,
                cellMassColor: Z.cellMassColor,
                cellMassOutlineColor: Z.cellMassOutlineColor,
                cellNameFont: Z.cellNameFont,
                cellNameWeight: Z.cellNameWeight,
                cellNameOutline: Z.cellNameOutline,
                cellNameSmoothOutline: Z.cellNameSmoothOutline,
                cellMassFont: Z.cellMassFont,
                cellMassWeight: Z.cellMassWeight,
                cellMassOutline: Z.cellMassOutline,
                cellMassSmoothOutline: Z.cellMassSmoothOutline,
                cellMassTextSize: Z.cellMassTextSize,
                cellLongNameThreshold: Z.cellLongNameThreshold,
                shortMass: Z.shortMass,
                showBackgroundImage: Z.showBackgroundImage,
                backgroundImageRepeat: Z.backgroundImageRepeat,
                backgroundDefaultIfUnequal: Z.backgroundDefaultIfUnequal,
                backgroundImageOpacity: Z.backgroundImageOpacity,
                useFoodColor: Z.useFoodColor
            }),
            computed: {
                cellNameWeightMeaning() {
                    return J(this.cellNameWeight)
                },
                cellMassWeightMeaning() {
                    return J(this.cellMassWeight)
                },
                cellNameOutlineMeaning() {
                    return Y(this.cellNameOutline)
                },
                cellMassOutlineMeaning() {
                    return Y(this.cellMassOutline)
                },
                cellMassTextSizeMeaning() {
                    return function(e) {
                        switch (e) {
                            case 0:
                                return "Small";
                            case 1:
                                return "Normal";
                            case 2:
                                return "Large";
                            case 3:
                                return "Largest";
                            default:
                                return "???"
                        }
                    }(this.cellMassTextSize)
                }
            },
            methods: {
                async change(e, t, s) {
                    var a;
                    a = t && t.target ? isNaN(t.target.valueAsNumber) ? t.target.value : t.target.valueAsNumber : t;
                    try {
                        switch (e) {
                            case "cursorImageUrl":
                                a = await Q(a, 32);
                                break;
                            case "backgroundImageUrl":
                                a !== this.bgDefault && (a = await Q(a, 4e3));
                                break;
                            case "virusImageUrl":
                                a !== this.virusDefault && (a = await Q(a, 200))
                        }
                    } catch (e) {
                        return void G.alert("This image is too large to even be loaded.")
                    }
                    if (Z[e] != a) {
                        var n = this[e];
                        try {
                            Z.set(e, a)
                        } catch (t) {
                            return Z.set(e, n), void G.alert("Saving this setting failed. Perhaps the image is too large?")
                        }
                        switch (this[e] = a, e) {
                            case "cursorImageUrl":
                                V.events.$emit("set-cursor-url", a);
                                break;
                            case "backgroundColor":
                                V.renderer.backgroundColor = PIXI.utils.string2hex(a);
                                break;
                            case "cellNameOutlineColor":
                            case "cellNameFont":
                            case "cellNameWeight":
                            case "cellNameOutline":
                            case "cellNameSmoothOutline":
                                V.settings.compileNameFontStyle();
                                break;
                            case "cellMassColor":
                            case "cellMassOutlineColor":
                            case "cellMassFont":
                            case "cellMassWeight":
                            case "cellMassOutline":
                            case "cellMassSmoothOutline":
                            case "cellMassTextSize":
                                V.settings.compileMassFontStyle();
                                break;
                            case "cellLongNameThreshold":
                                V.scene.resetPlayerLongNames()
                        }
                        if (V.running) switch (e) {
                            case "borderColor":
                                V.scene.resetBorder();
                                break;
                            case "foodColor":
                                Z.useFoodColor && V.scene.reloadFoodTextures();
                                break;
                            case "ejectedColor":
                                V.scene.reloadEjectedTextures();
                                break;
                            case "virusImageUrl":
                                V.scene.reloadVirusTexture();
                                break;
                            case "cellNameOutlineColor":
                            case "cellNameFont":
                            case "cellNameWeight":
                            case "cellNameOutline":
                            case "cellNameSmoothOutline":
                                V.scene.resetNameTextStyle();
                                break;
                            case "cellMassColor":
                            case "cellMassOutlineColor":
                            case "cellMassFont":
                            case "cellMassWeight":
                            case "cellMassOutline":
                            case "cellMassSmoothOutline":
                            case "cellMassTextSize":
                                V.scene.resetMassTextStyle(true);
                                break;
                            case "showBackgroundImage":
                                V.scene.toggleBackgroundImage(a);
                                break;
                            case "backgroundImageUrl":
                            case "backgroundImageRepeat":
                            case "backgroundDefaultIfUnequal":
                            case "backgroundImageOpacity":
                                V.scene.setBackgroundImage();
                                break;
                            case "useFoodColor":
                                V.scene.reloadFoodTextures()
                        }
                    }
                },
                confirmReset() {
                    G.confirm("Are you sure you want to reset all theming options?", () => this.reset())
                },
                reset() {
                    var e = ["useWebGL", "bgDefault", "virusDefault", "showNameFontWarning", "showMassFontWarning"];
                    for (var t in this.$data) e.includes(t) || this.change(t, Z.getDefault(t))
                },
                fontWarning(e, t) {
                    switch (e) {
                        case "name":
                            this.showNameFontWarning = t;
                            break;
                        case "mass":
                            this.showMassFontWarning = t
                    }
                }
            }
        },
        ee = (s(177), Object(w.a)(q, N, [], false, null, "15c13b66", null));
    ee.options.__file = "src/components/theming.vue";
    var te = ee.exports,
        se = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                attrs: {
                    id: "hotkey-container"
                }
            }, [s("div", {
                staticClass: "hotkeys"
            }, e._l(e.availableHotkeys, function(t, a) {
                return s("div", {
                    key: a,
                    staticClass: "row"
                }, [s("span", {
                    staticClass: "action"
                }, [e._v(e._s(a))]), e._v(" "), s("span", {
                    staticClass: "bind",
                    attrs: {
                        tabindex: "0"
                    },
                    on: {
                        mousedown: function(s) {
                            return e.onMouseDown(s, t)
                        },
                        keydown: function(s) {
                            return s.preventDefault(), e.onKeyDown(s, t)
                        }
                    }
                }, [e._v("\n                " + e._s(e.hotkeys[t]) + "\n            ")])])
            }), 0), e._v(" "), s("div", {
                staticClass: "footer"
            }, [s("span", {
                staticClass: "reset-button2",
                on: {
                    click: e.onResetClick
                }
            }, [s("i", {
                staticClass: "fa fa-undo"
            }), e._v(" Reset\n        ")])])])
        };
    se._withStripped = true;
    var ae = s(66),
        ne = s(5);
    var ie = {
            data() {
                return {
                    availableHotkeys: (e = {
                        Feed: "feed",
                        "Feed macro": "feedMacro",
                        Split: "split",
                        Doublesplit: "splitx2",
                        Triplesplit: "splitx3",
                        "Quad split": "splitMax",
                        "Split 32": "split32",
                        "Split 64": "split64",
                        "Diagonal linesplit": "linesplit",
                        "Freeze mouse": "freezeMouse",
                        "Lock linesplit": "lockLinesplit",
                        "Stop movement": "stopMovement",
                        Respawn: "respawn",
                        "Toggle auto respawn": "toggleAutoRespawn",
                        "Toggle skins": "toggleSkins",
                        "Toggle names": "toggleNames",
                        "Toggle food": "toggleFood",
                        "Toggle mass": "toggleMass",
                        "Toggle chat": "toggleChat",
                        "Toggle chat popup": "toggleChatToast",
                        "Toggle HUD": "toggleHud",
                        "Spectate lock": "spectateLock",
                        "Save replay": "saveReplay",
                        "Zoom level 1": "zoomLevel1",
                        "Zoom level 2": "zoomLevel2",
                        "Zoom level 3": "zoomLevel3",
                        "Zoom level 4": "zoomLevel4",
                        "Zoom level 5": "zoomLevel5"
                    }, localStorage.adminMode && (e["Select Player"] = "selectPlayer"), e),
                    hotkeys: ae.get()
                };
                var e
            },
            methods: {
                onResetClick: function() {
                    ne.confirm("Are you sure you want to reset all hotkeys?", () => {
                        this.hotkeys = ae.reset()
                    })
                },
                onMouseDown: function(e, t) {
                    if (e.target === document.activeElement) {
                        var s = "MOUSE" + e.button;
                        ae.set(t, s) && (e.preventDefault(), this.hotkeys[t] = s, e.target.blur())
                    }
                },
                onKeyDown: function(e, t) {
                    var s = ae.convertKey(e.code);
                    "ESCAPE" !== s && "ENTER" !== s ? ("DELETE" == s && (s = ""), ae.set(t, s) && (this.hotkeys[t] = s, e.target.blur())) : e.target.blur()
                }
            }
        },
        re = (s(179), Object(w.a)(ie, se, [], false, null, "2dbed53e", null));
    re.options.__file = "src/components/hotkeys.vue";
    var oe = re.exports,
        le = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                staticClass: "container"
            }, [s("input", {
                ref: "file",
                staticStyle: {
                    display: "none"
                },
                attrs: {
                    type: "file",
                    accept: ".vanis",
                    multiple: ""
                },
                on: {
                    change: function(t) {
                        return e.onFile(t)
                    }
                }
            }), e._v(" "), s("div", {
                staticClass: "replay-list-header"
            }, [s("span", {
                staticClass: "replay-list-count"
            }, [e._v(e._s(e.keysLoadedFirst ? e.replayKeys.length + " replay" + (1 !== e.replayKeys.length ? "s" : "") : "Loading"))]), e._v(" "), e.keysLoadedFirst && !e.keysEmpty ? s("span", {
                staticClass: "replay-list-page"
            }, [s("div", {
                staticClass: "anchor"
            }, [s("div", {
                staticClass: "left"
            }, [s("div", {
                staticClass: "current"
            }, [s("div", {
                staticClass: "phantom"
            }, [s("i", {
                staticClass: "fas fa-chevron-left prev",
                class: {
                    disabled: !e.keysLoaded || 0 === e.pageIndex
                },
                on: {
                    click: function(t) {
                        return e.updateReplayPage(-1)
                    }
                }
            }), e._v(" "), s("span", [e._v(e._s(e.pageCount))])]), e._v(" "), e.pageInputShown ? e._e() : s("div", {
                staticClass: "real",
                on: {
                    click: function(t) {
                        return e.togglePageInput(true)
                    }
                }
            }, [s("span", [e._v(e._s(1 + e.pageIndex))])]), e._v(" "), e.pageInputShown ? s("div", {
                staticClass: "real-input"
            }, [s("div", {
                staticClass: "overlay",
                on: {
                    click: function(t) {
                        return e.togglePageInput(false)
                    }
                }
            }), e._v(" "), s("i", {
                staticClass: "fas fa-chevron-left prev",
                class: {
                    disabled: !e.keysLoaded || 0 === e.pageIndex
                },
                on: {
                    click: function(t) {
                        return e.updateReplayPage(-1)
                    }
                }
            }), e._v(" "), s("input", {
                attrs: {
                    type: "text"
                },
                domProps: {
                    value: 1 + e.pageIndex
                },
                on: {
                    focus: function(e) {
                        return e.target.select()
                    },
                    change: function(t) {
                        return e.updateReplayPage(t)
                    }
                }
            })]) : e._e()])]), e._v("\n                /\n                "), s("div", {
                staticClass: "right"
            }, [e._v("\n                    " + e._s(e.pageCount) + "\n                    "), s("i", {
                staticClass: "fas fa-chevron-right next",
                class: {
                    disabled: !e.keysLoaded || e.pageIndex === e.pageCount - 1
                },
                on: {
                    click: function(t) {
                        return e.updateReplayPage(1)
                    }
                }
            })])])]) : e._e(), e._v(" "), s("span", {
                staticClass: "replay-list-bulk"
            }, [s("input", {
                staticClass: "vanis-button",
                attrs: {
                    type: "button",
                    disabled: !e.keysLoaded,
                    value: "Import"
                },
                on: {
                    click: function(t) {
                        return e.$refs.file.click()
                    }
                }
            }), e._v(" "), s("input", {
                staticClass: "vanis-button",
                attrs: {
                    type: "button",
                    disabled: !e.keysLoaded || e.keysEmpty,
                    value: "Download all"
                },
                on: {
                    click: function(t) {
                        return e.downloadAllReplays()
                    }
                }
            }), e._v(" "), s("input", {
                staticClass: "vanis-button",
                attrs: {
                    type: "button",
                    disabled: !e.keysLoaded || e.keysEmpty,
                    value: "Delete all"
                },
                on: {
                    click: function(t) {
                        return e.deleteAllReplays()
                    }
                }
            })])]), e._v(" "), s("div", {
                staticClass: "replay-list"
            }, [e.keysLoadedFirst && e.keysEmpty ? [s("div", {
                staticClass: "notification"
            }, [s("div", [e._v("Press "), s("b", [e._v(e._s(e.messageHotkey))]), e._v(" in game to save last "), s("b", [e._v(e._s(e.messageReplayDuration))]), e._v(" seconds of gameplay.")]), e._v(" "), s("div", {
                staticStyle: {
                    color: "red",
                    "font-weight": "bold"
                }
            }, [e._v("Replays are saved in browser memory!")]), e._v(" "), s("div", [e._v("They get permanently erased if browser data gets cleared.")])])] : e._e(), e._v(" "), e.keysLoadedFirst && !e.keysEmpty ? [s("div", {
                staticClass: "replay-page"
            }, e._l(e.pageData, function(e, t) {
                return s("replay-item", {
                    key: t,
                    attrs: {
                        replay: e
                    }
                })
            }), 1)] : e._e()], 2), e._v(" "), e.bulkOperating ? s("div", {
                staticClass: "overlay bulk-operation-overlay"
            }, [e._v("\n        Please wait...\n        "), e.bulkOperationStatus ? s("div", {
                staticClass: "small"
            }, [e._v(e._s(e.bulkOperationStatus))]) : e._e(), e._v(" "), e.showMultipleFilesWarning ? s("div", {
                staticClass: "small warning"
            }, [e._v("Allow page to download multiple files if asked")]) : e._e()]) : e._e()])
        };
    le._withStripped = true;
    var ce = s(115),
        ue = s(88),
        de = s(181),
        he = s(1),
        pe = s(66),
        ve = s(4),
        fe = s(5),
        me = s(8),
        ge = he.replay.database;
    var ye = {
            data: () => ({
                keysLoadedFirst: false,
                keysLoaded: false,
                keysLoading: false,
                keysEmpty: false,
                replayKeys: [],
                pageInputShown: false,
                pageLoadingCancel: null,
                pageLoaded: false,
                pageIndex: 0,
                pageCount: 0,
                pageData: [],
                bulkOperating: false,
                bulkOperationStatus: "",
                showMultipleFilesWarning: false,
                messageHotkey: pe.get().saveReplay,
                messageReplayDuration: ve.replayDuration
            }),
            components: {
                replayItem: ce.default
            },
            methods: {
                togglePageInput(e) {
                    this.pageInputShown = e
                },
                setBulkOp(e, t) {
                    e ? (this.bulkOperating = true, this.bulkOperationStatus = t || "") : setTimeout(() => {
                        this.bulkOperating = false, this.bulkOperationStatus = ""
                    }, 1e3)
                },
                async onFile(e) {
                    if (!this.bulkOperating) {
                        var t = Array.from(e.target.files);
                        if (t.length) {
                            e.target && (e.target.value = null);
                            var s = 0,
                                a = t.length,
                                n = t.map(async e => {
                                    var t = e.name.replace(/\.vanis$/, ""),
                                        n = await

                                    function(e) {
                                        return new Promise((t, s) => {
                                            var a = new FileReader;
                                            a.onload = (e => t(e.target.result)), a.onerror = s, a.readAsText(e)
                                        })
                                    }(e);
                                    await ge.setItem(t, n), this.setBulkOp(true, "Importing replays (" + ++s + " / " + a + ")")
                                });
                            this.setBulkOp(true, "Importing replays");
                            try {
                                await Promise.all(n)
                            } catch (e) {
                                fe.alert('Error importing replays: "' + e.message + '"'), this.setBulkOp(false), this.updateReplayKeys()
                            }
                            this.setBulkOp(false), this.updateReplayKeys()
                        }
                    }
                },
                async downloadAllReplays() {
                    if (!this.bulkOperating && this.keysLoaded) {
                        var e = this.replayKeys.length,
                            t = Math.ceil(this.replayKeys.length / 200),
                            s = t > 1,
                            a = me.getTimestamp();
                        this.showMultipleFilesWarning = s, this.setBulkOp(true, "Packing replays (0 / " + t + ")");
                        for (var n = 0, i = 0; n < e; n += 200, i++) {
                            for (var r = new de, o = n; o < n + 200 && o < e; o++) {
                                var l = this.replayKeys[o];
                                r.file(l + ".vanis", await ge.getItem(l))
                            }
                            var c = await r.generateAsync({
                                    type: "blob"
                                }),
                                u = "replays_" + a;
                            s && (u += "_" + (i + 1)), u += ".zip", ue.saveAs(c, u), this.setBulkOp(true, "Packing replays (" + (i + 1) + " / " + t + ")")
                        }
                        this.showMultipleFilesWarning = false, this.setBulkOp(false)
                    }
                },
                deleteAllReplays() {
                    if (!this.bulkOperating) {
                        var e = this;
                        fe.confirm("Are you absolutely sure that you want to delete all replays?", async () => {
                            this.setBulkOp(true, "Deleting all replays");
                            try {
                                await ge.clear()
                            } catch (e) {
                                return void fe.alert("Error clearing replays: " + e.message)
                            }
                            this.setBulkOp(false), e.updateReplayKeys()
                        })
                    }
                },
                async updateReplayKeys() {
                    if (!this.keysLoading) {
                        this.keysLoaded = false, this.keysLoading = true;
                        var e = await ge.keys();
                        e = e.reverse(), this.replayKeys.splice(0, this.replayKeys.length, ...e), this.pageCount = Math.max(Math.ceil(e.length / 12), 1), this.pageIndex = Math.min(this.pageIndex, this.pageCount - 1), this.keysLoaded = true, this.keysLoadedFirst = true, this.keysLoading = false, this.keysEmpty = 0 === e.length, await this.updateReplayPage()
                    }
                },
                async updateReplayPage(e) {
                    e && ("number" == typeof e ? this.pageIndex += e : this.pageIndex = parseInt(e.target.value) - 1 || 0), this.pageLoadingCancel && (this.pageLoadingCancel(), this.pageLoadingCancel = null);
                    var t = Math.max(Math.min(this.pageIndex, this.pageCount - 1), 0);
                    this.pageIndex !== t && (this.pageIndex = t), this.pageLoaded = false;
                    var s = [],
                        a = false;
                    this.pageLoadingCancel = (() => a = true);
                    for (var n = 12 * this.pageIndex, i = 12 * (1 + this.pageIndex), r = n; r < i && r < this.replayKeys.length && !a; r++) {
                        var o = this.replayKeys[r],
                            l = {
                                name: o,
                                data: await ge.getItem(o)
                            };
                        l.data.startsWith("REPLAY") ? l.image = l.data.split("|")[2] : l.image = "https://vanis.io/img/replay-placeholder.png", s.push(l)
                    }
                    a || (this.pageData.splice(0, this.pageData.length, ...s), this.pageLoaded = true)
                }
            },
            created() {
                this.updateReplayKeys(), he.events.$on("replay-added", this.updateReplayKeys), he.events.$on("replay-removed", this.updateReplayKeys)
            },
            beforeDestroy() {
                he.events.$off("replay-added", this.updateReplayKeys), he.events.$off("replay-removed", this.updateReplayKeys)
            }
        },
        we = (s(221), Object(w.a)(ye, le, [], false, null, "4a996e52", null));
    we.options.__file = "src/components/replays3.vue";
    var be = we.exports,
        ke = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                staticStyle: {
                    padding: "15px"
                }
            }, [s("h2", {
                staticStyle: {
                    margin: "0",
                    "margin-bottom": "14px"
                }
            }, [e._v(e._s(e.seasonLeaderboardText))]), e._v(" "), e.errorMessage ? s("div", [e._v("\n        Failed loading season leaderboard data:\n        " + e._s(e.errorMessage) + "\n    ")]) : e._e(), e._v(" "), e.playerList.length ? s("div", [s("div", {
                staticClass: "info"
            }, [e._v("\n            Season XP counts for this season only."), s("br"), e._v("\n            Top few players earn colored names."), s("br"), e._v("\n            Check our "), s("a", {
                attrs: {
                    href: "https://vanis.io/discord"
                }
            }, [e._v("Discord")]), e._v(" for more information."), s("br"), e._v("\n            Season ends in "), s("b", [e._v(e._s(e.seasonEndTime))])]), e._v(" "), e._l(e.playerList, function(t, a) {
                return s("div", {
                    key: a,
                    staticClass: "player-row",
                    class: {
                        "own-row": e.ownUid && e.ownUid === t.uid
                    }
                }, [s("span", {
                    staticClass: "player-nr"
                }, [e._v(e._s(a + 1) + ".")]), e._v(" "), s("span", {
                    staticClass: "player-name",
                    style: {
                        color: t.name_color
                    }
                }, [e._v(e._s(t.name))]), e._v(" "), s("span", {
                    staticClass: "player-xp"
                }, [e._v(e._s(t.season_xp) + " xp")])])
            })], 2) : e._e()])
        };
    ke._withStripped = true;
    var Ce = s(1),
        Ae = s(19),
        {
            checkBadWords: _e
        } = s(17),
        Se = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var xe = {
            data: () => ({
                playerList: [],
                errorMessage: "",
                ownUid: null,
                date: new Date,
                nextStartDate: Date.UTC((new Date).getUTCFullYear(), (new Date).getUTCMonth() + 1),
                seasonEndTime: null,
                seasonEndTimeInterval: null
            }),
            computed: {
                seasonLeaderboardText() {
                    return Se[this.date.getUTCMonth()] + " " + this.date.getUTCFullYear() + " season"
                }
            },
            methods: {
                setSeasonEndTime() {
                    this.seasonEndTime = function(e) {
                        if (e < 0) return "now";
                        var t = Math.floor(e / 1e3),
                            s = t % 60,
                            a = Math.floor(t / 60),
                            n = a % 60,
                            i = Math.floor(a / 60),
                            r = i % 24,
                            o = Math.floor(i / 24),
                            l = [];
                        return o > 0 && l.push(o + " day" + (1 !== o ? "s" : "")), r % 24 > 0 && l.push(r + " hour" + (1 !== r ? "s" : "")), 0 === o && n % 60 > 0 && l.push(n + " minute" + (1 !== n ? "s" : "")), 0 === i && s % 60 > 0 && l.push(s + " second" + (1 !== s ? "s" : "")), l.join(" ")
                    }(this.nextStartDate - Date.now())
                }
            },
            created() {
                this.ownUid = Ce.ownUid;
                var e = "https://vanis.io/api".replace("/api", "") + "/highscores/season_xp/100";
                Ae.get(e).then(e => {
                    var t = e.data;
                    t.forEach(e => {
                        var t = e.name_color;
                        e.name_color = t ? "#" + t : "white";
                        var s = e.locked_name || e.discord_name;
                        _e(s) && (s = "********"), e.name = s
                    }), this.playerList = t, this.seasonEndTimeInterval = setInterval(this.setSeasonEndTime.bind(this), 1e3), this.setSeasonEndTime()
                }).catch(e => {
                    this.errorMessage = e.message
                })
            },
            destroyed() {
                this.seasonEndTimeInterval && clearInterval(this.seasonEndTimeInterval)
            }
        },
        Me = (s(223), Object(w.a)(xe, ke, [], false, null, "7cb607ba", null));
    Me.options.__file = "src/components/season-leaderboard.vue";
    var Ie = Me.exports,
        Te = (s(19), s(1)),
        Pe = (s(5), {
            components: {
                modal: A.default,
                settings: R,
                theming: te,
                hotkeys: oe,
                replays3: be,
                seasonLeaderboard: Ie
            },
            data: () => ({
                activeModal: "",
                showSettings: false,
                showHotkeys: false,
                gameState: Te.state,
                nickname: "string" == typeof localStorage.nickname ? localStorage.nickname : "",
                teamtag: localStorage.teamtag || "",
                skinUrl: "string" == typeof localStorage.skinUrl ? localStorage.skinUrl : "https://skins.vanis.io/s/vanis1"
            }),
            created: function() {
                Te.events.$on("skin-click", e => this.skinUrl = e)
            },
            methods: {
                openModal: function(e) {
                    this.activeModal = e, this.$emit("modal-open", true)
                },
                closeModal: function() {
                    this.activeModal = "", this.$emit("modal-open", false)
                },
                play: function(e) {
                    e instanceof MouseEvent && e.isTrusted && (!this.gameState.isAlive && Te.joinGame(), Te.showMenu(false))
                },
                spectate: function() {
                    this.gameState.isAlive ? console.warn("Cannot spectate, player is still alive") : (Te.actions.spectate(), Te.showMenu(false))
                },
                onSkinUrlChange() {
                    Te.events.$emit("skin-url-edit", this.skinUrl)
                },
                onTeamTagChange() {
                    localStorage.setItem("teamtag", this.teamtag)
                },
                onNicknameChange() {
                    localStorage.setItem("nickname", this.nickname)
                }
            }
        }),
        Ue = (s(225), Object(w.a)(Pe, C, [function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return t("div", {
                staticStyle: {
                    "text-align": "center",
                    height: "286px"
                }
            }, [t("div", {
                staticStyle: {
                    padding: "4px"
                }
            }, [this._v("Advertisement")]), this._v(" "), t("div", {
                attrs: {
                    id: "vanis-io_300x250"
                }
            })])
        }], false, null, "1bcde71e", null));
    Ue.options.__file = "src/components/player.vue";
    var Ee = Ue.exports,
        Re = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                staticStyle: {
                    padding: "17px"
                }
            }, [e.account ? e._e() : s("div", [s("div", {
                staticStyle: {
                    "margin-top": "6px",
                    "margin-bottom": "10px"
                }
            }, [e._v("Login to your account with Discord to save your in-game progress.")]), e._v(" "), s("div", {
                staticClass: "discord",
                on: {
                    click: function(t) {
                        return e.openDiscordLogin()
                    }
                }
            }, [e.loading ? [e.loading ? s("i", {
                staticClass: "fas fa-sync fa-spin",
                staticStyle: {
                    "margin-right": "5px"
                }
            }) : e._e(), e._v(" Loading\n            ")] : [s("i", {
                staticClass: "fab fa-discord"
            }), e._v(" Login with Discord\n            ")]], 2)]), e._v(" "), e.account ? s("div", {
                staticClass: "account"
            }, [s("div", {
                staticStyle: {
                    "margin-bottom": "3px"
                }
            }, [s("img", {
                staticClass: "avatar",
                attrs: {
                    src: e.avatarUrl
                }
            }), e._v(" "), s("div", {
                staticClass: "player-info"
            }, [s("div", {
                style: {
                    color: e.nameColor
                },
                attrs: {
                    id: "account-name"
                }
            }, [e._v(e._s(e.name))]), e._v(" "), s("div", [e._v("Level " + e._s(e.account.level))]), e._v(" "), s("div", [e._v(e._s(e.account.xp) + " Total XP")]), e._v(" "), s("div", [e._v(e._s(e.account.season_xp || 0) + " Season XP")])])]), e._v(" "), s("div", {
                staticStyle: {
                    position: "relative"
                }
            }, [s("progress-bar", {
                staticClass: "xp-progress",
                attrs: {
                    progress: e.progress
                }
            }), e._v(" "), s("div", {
                staticClass: "xp-data"
            }, [s("div", {
                staticStyle: {
                    flex: "1",
                    "margin-left": "8px"
                }
            }, [e._v(e._s(e.xpAtCurrentLevel))]), e._v(" "), s("div", {
                staticStyle: {
                    "margin-right": "7px"
                }
            }, [e._v(e._s(e.xpAtNextLevel))])])], 1), e._v(" "), s("div", {
                staticClass: "logout",
                on: {
                    click: function(t) {
                        return e.logout()
                    }
                }
            }, [s("i", {
                staticClass: "fas fa-sign-out-alt"
            }), e._v(" Logout\n        ")])]) : e._e()])
        };
    Re._withStripped = true;
    var Ne = function() {
        var e = this.$createElement,
            t = this._self._c || e;
        return t("div", {
            staticClass: "progress progress-striped"
        }, [t("div", {
            staticClass: "progress-bar",
            style: {
                width: 100 * this.progress + "%"
            }
        })])
    };
    Ne._withStripped = true;
    var Le = {
            props: ["progress"]
        },
        Oe = (s(227), Object(w.a)(Le, Ne, [], false, null, "4e838c74", null));
    Oe.options.__file = "src/components/progressBar.vue";
    var Fe = Oe.exports,
        We = s(229),
        De = s(5),
        Be = s(1),
        ze = s(230),
        $e = {
            components: {
                progressBar: Fe
            },
            data: () => ({
                accountTime: 0,
                account: null,
                progress: 0,
                xpAtCurrentLevel: 0,
                xpAtNextLevel: 0,
                loading: false,
                avatarUrl: null,
                nameColor: null,
                name: null
            }),
            created() {
                Be.events.$on("xp-update", this.onXpUpdate), this.reloadUserData(), this.listenForToken()
            },
            beforeDestroy() {
                Be.events.$off("xp-update", this.onXpUpdate)
            },
            methods: {
                listenForToken() {
                    window.addEventListener("message", e => {
                        var t = e.data.vanis_token;
                        t && (this.onLoggedIn(t), e.source.postMessage("loggedIn", e.origin))
                    })
                },
                reloadUserData() {
                    Date.now() - this.accountTime <= 6e4 || (this.accountTime = Date.now(), We.vanisToken && this.loadUserData())
                },
                async loadUserData() {
                    this.loading = true;
                    try {
                        var e = await We.get("/me")
                    } catch (e) {
                        this.loading = false;
                        var t = e.response;
                        if (!t) return;
                        return console.error("Account:", t.data), void(401 === t.status && We.clearToken())
                    }
                    this.setAccountData(e), this.updateProgress(this.account.xp, this.account.level), this.loading = false
                },
                async logout() {
                    try {
                        await We.call("DELETE", "/me")
                    } catch (t) {
                        var e = t.response;
                        e && 401 !== e.status && De.alert("Error: " + t.message)
                    }
                    We.clearToken(), this.account = null, this.name = null, this.nameColor = null, this.avatarUrl = null, Be.ownUid = null
                },
                getAvatarUrl: (e, t) => t ? "https://cdn.discordapp.com/avatars/" + e + "/" + t + ".png" : "https://cdn.discordapp.com/embed/avatars/0.png",
                setAccountData(e) {
                    e.permissions && (window.gameObj = Be), this.account = e, this.avatarUrl = this.getAvatarUrl(e.discord_id, e.discord_avatar), this.name = e.locked_name || e.discord_name, this.nameColor = e.name_color ? "#" + e.name_color : "#ffffff", Be.ownUid = e.uid
                },
                onXpUpdate(e) {
                    if (this.account) {
                        var t = ze.getLevel(e);
                        this.account.season_xp += e - this.account.xp, this.account.xp = e, this.account.level = t, this.updateProgress(e, t)
                    }
                },
                updateProgress(e, t) {
                    this.xpAtCurrentLevel = ze.getXp(t), this.xpAtNextLevel = ze.getXp(t + 1), this.progress = (e - this.xpAtCurrentLevel) / (this.xpAtNextLevel - this.xpAtCurrentLevel)
                },
                openDiscordLogin: function() {
                    window.open(We.url + "/login/discord", "", "width=500, height=750")
                },
                onLoggedIn(e) {
                    console.assert(e, "Vanis token empty or undefined"), We.setToken(e), this.loadUserData()
                }
            }
        },
        He = (s(231), Object(w.a)($e, Re, [], false, null, "661435cd", null));
    He.options.__file = "src/components/account.vue";
    var je = He.exports,
        Xe = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                attrs: {
                    id: "skins-container"
                }
            }, [s("div", {
                attrs: {
                    id: "skins"
                }
            }, [e._l(e.skins, function(t, a) {
                return s("span", {
                    key: a,
                    staticClass: "skin-container"
                }, [s("img", {
                    staticClass: "skin",
                    class: {
                        selected: e.selectedSkinIndex === a
                    },
                    attrs: {
                        src: t,
                        alt: ""
                    },
                    on: {
                        click: function(t) {
                            return e.selectSkin(a)
                        },
                        contextmenu: function(t) {
                            return e.removeSkin(a)
                        }
                    }
                }), e._v(" "), s("i", {
                    staticClass: "fas fa-times skin-remove-button",
                    on: {
                        click: function(t) {
                            return e.removeSkin(a)
                        }
                    }
                })])
            }), e._v(" "), s("img", {
                staticClass: "skin add-skin",
                attrs: {
                    src: "/img/skin-add.png",
                    alt: ""
                },
                on: {
                    click: function(t) {
                        return e.addSkin()
                    }
                }
            })], 2)])
        };
    Xe._withStripped = true;
    var Ve = s(1),
        Ze = {
            data: () => ({
                selectedSkinIndex: 0,
                skins: []
            }),
            created: function() {
                Ve.events.$on("skin-url-edit", this.onSkinUrlChanged.bind(this)), this.skins = this.loadSkins() || this.getDefaultSkins();
                var e = Number(localStorage.selectedSkinIndex) || 0;
                this.selectSkin(e)
            },
            methods: {
                loadSkins() {
                    var e = localStorage.skins;
                    if (!e) return false;
                    try {
                        var t = JSON.parse(e)
                    } catch (e) {
                        return console.error("Error parsing saved skins", e.message), false
                    }
                    if (!Array.isArray(t)) return console.error("localstorage.skins is not an array!"), false;
                    for (var s = t.length; s < 2; s++) t.push("https://skins.vanis.io/s/vanis1");
                    return t
                },
                getDefaultSkins() {
                    for (var e = [], t = 0; t < 8; t++) e.push("https://skins.vanis.io/s/vanis1");
                    return e
                },
                onSkinUrlChanged(e) {
                    this.$set(this.skins, this.selectedSkinIndex, e), this.saveSkins()
                },
                selectSkin(e) {
                    this.selectedSkinIndex = e, localStorage.selectedSkinIndex = e;
                    var t = this.skins[e];
                    Ve.events.$emit("skin-click", t)
                },
                removeSkin(e) {
                    this.skins.splice(e, 1), this.skins.length < 2 && this.skins.push("https://skins.vanis.io/s/vanis1"), this.saveSkins();
                    var t = Math.max(0, this.selectedSkinIndex - 1);
                    this.selectSkin(t)
                },
                addSkin() {
                    var e = this.skins.length;
                    this.skins.push("https://skins.vanis.io/s/vanis1"), this.selectSkin(e), this.saveSkins()
                },
                saveSkins() {
                    localStorage.skins = JSON.stringify(this.skins)
                }
            }
        },
        Ge = (s(233), Object(w.a)(Ze, Xe, [], false, null, "1c614894", null));
    Ge.options.__file = "src/components/skins.vue";
    var Je = Ge.exports,
        Ye = s(1),
        Qe = {
            data: () => ({
                isModalOpen: false,
                selectedTab: "servers",
                gameState: Ye.state,
                cursorStyleElem: null
            }),
            methods: {
                onModalChange: function(e) {
                    this.isModalOpen = e
                },
                setCursorUrl(e) {
                    var t = null;
                    e && (t = "#canvas, #hud > * { cursor: url('" + e + "'), auto !important; }"), !t && this.cursorStyleElem ? (this.cursorStyleElem.remove(), this.cursorStyleElem = null) : t && !this.cursorStyleElem && (this.cursorStyleElem = document.createElement("style"), document.head.appendChild(this.cursorStyleElem)), this.cursorStyleElem && (this.cursorStyleElem.innerHTML = t)
                }
            },
            components: {
                servers: k,
                playerContainer: Ee,
                account: je,
                skins: Je
            },
            created() {
                Ye.events.$on("set-cursor-url", e => this.setCursorUrl(e))
            },
            mounted() {
                this.setCursorUrl(Ye.settings.cursorImageUrl)
            }
        },
        Ke = (s(235), Object(w.a)(Qe, o, [], false, null, "ebed1606", null));
    Ke.options.__file = "src/components/main-container.vue";
    var qe = Ke.exports,
        et = function() {
            var e = this.$createElement;
            this._self._c;
            return this._m(0)
        };
    et._withStripped = true;
    s(237);
    var tt = Object(w.a)({}, et, [function() {
        var e = this.$createElement,
            t = this._self._c || e;
        return t("div", {
            staticClass: "social-container"
        }, [t("a", {
            staticClass: "discord-link",
            attrs: {
                href: "https://vanis.io/discord",
                target: "_blank"
            }
        }, [t("i", {
            staticClass: "fab fa-discord"
        }), this._v(" Official Discord\n    ")]), this._v(" "), t("a", {
            staticClass: "tournaments-link",
            attrs: {
                href: "https://vanis.io/tournaments",
                target: "_blank"
            }
        }, [t("i", {
            staticClass: "fas fa-trophy"
        }), this._v(" Tournaments\n    ")]), this._v(" "), t("a", {
            staticClass: "youtube-link",
            attrs: {
                href: "https://www.youtube.com/channel/UCc6nxxjrUz5J-u6AW7YiXUw",
                target: "_blank"
            }
        }, [t("i", {
            staticClass: "fab fa-youtube"
        }), this._v(" Highlights\n    ")]), this._v(" "), t("a", {
            attrs: {
                href: "https://skins.vanis.io",
                target: "_blank",
                id: "skins-link"
            }
        }, [t("i", {
            staticClass: "fas fa-images"
        }), this._v(" Skins\n    ")])])
    }], false, null, "4d0670e9", null);
    tt.options.__file = "src/components/social-links.vue";
    var st = tt.exports,
        at = function() {
            var e = this.$createElement;
            this._self._c;
            return this._m(0)
        };
    at._withStripped = true;
    var nt = {
            data() {}
        },
        it = (s(239), Object(w.a)(nt, at, [function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return t("div", {
                staticClass: "container"
            }, [t("a", {
                staticStyle: {
                    "margin-left": "20.59px"
                },
                attrs: {
                    href: "privacy.html",
                    target: "_blank"
                }
            }, [this._v("Privacy Policy")]), this._v(" "), t("span", {
                staticClass: "line"
            }, [this._v("|")]), this._v(" "), t("a", {
                attrs: {
                    href: "tos.html",
                    target: "_blank"
                }
            }, [this._v("Terms of Service")])])
        }], false, null, "6843da33", null));
    it.options.__file = "src/components/privacy-tos.vue";
    var rt = it.exports,
        ot = function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return this.show ? t("div", {
                staticClass: "context-menu fade",
                style: {
                    top: this.y + "px",
                    left: this.x + "px"
                }
            }, [t("div", {
                staticClass: "player-name"
            }, [this._v(this._s(this.playerName))]), this._v(" "), t("div", [this._v("Block")]), this._v(" "), t("div", {
                on: {
                    click: this.hideName
                }
            }, [this._v("Hide Name")]), this._v(" "), t("div", {
                on: {
                    click: this.hideSkin
                }
            }, [this._v("Hide Skin")]), this._v(" "), t("div", [this._v("Kick")]), this._v(" "), t("div", [this._v("Ban")]), this._v(" "), t("div", [this._v("Mute")])]) : this._e()
        };
    ot._withStripped = true;
    s(1);
    var lt = {
            data: () => ({
                show: false,
                playerName: "",
                x: 100,
                y: 55
            }),
            methods: {
                open: function(e, t) {
                    this.player = t, this.playerName = t.name, this.x = e.clientX, this.y = e.clientY, this.show = true, document.addEventListener("click", e => {
                        this.show = false
                    }, {
                        once: true
                    })
                },
                hideName: function() {
                    this.player.setName(""), this.player.invalidateVisibility()
                },
                hideSkin: function() {
                    this.player.setSkin(""), this.player.invalidateVisibility()
                }
            },
            created() {}
        },
        ct = (s(241), Object(w.a)(lt, ot, [], false, null, "4dbee04d", null));
    ct.options.__file = "src/components/context-menu.vue";
    var ut = ct.exports,
        dt = function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return t("div", {
                attrs: {
                    id: "hud"
                }
            }, [t("stats"), this._v(" "), t("chatbox"), this._v(" "), t("leaderboard"), this._v(" "), t("minimap"), this._v(" "), t("cautions")], 1)
        };
    dt._withStripped = true;
    var ht = function() {
        var e = this,
            t = e.$createElement,
            s = e._self._c || t;
        return s("div", [s("div", {
            staticClass: "server-cautions"
        }, e._l(e.serverInfo, function(t, a) {
            return s("div", [e._v(e._s(t))])
        }), 0), e._v(" "), s("div", {
            staticClass: "cautions"
        }, [!e.stopped && e.showMouseFrozen ? s("div", [e._v("MOUSE FROZEN")]) : e._e(), e._v(" "), !e.stopped && e.showMovementStopped ? s("div", [e._v("MOVEMENT STOPPED")]) : e._e(), e._v(" "), !e.stopped && e.showLinesplitting ? s("div", [e._v("LINESPLITTING")]) : e._e()])])
    };
    ht._withStripped = true;
    var pt = s(1),
        vt = {
            data: () => ({
                showMouseFrozen: false,
                showMovementStopped: false,
                showLinesplitting: false,
                serverInfo: null
            }),
            mounted() {
                pt.events.$on("update-cautions", e => {
                    "mouseFrozen" in e && (this.showMouseFrozen = e.mouseFrozen), "moveToCenterOfCells" in e && (this.showMovementStopped = e.moveToCenterOfCells), "lockLinesplit" in e && (this.showLinesplitting = e.lockLinesplit), "custom" in e && (this.serverInfo = e.custom.split(/\r\n|\r|\n/))
                }), pt.events.$on("reset-cautions", () => {
                    this.showMouseFrozen = false, this.showMovementStopped = false, this.showLinesplitting = false
                }), pt.events.$on("game-stopped", () => {
                    this.serverInfo = null
                })
            }
        },
        ft = (s(243), Object(w.a)(vt, ht, [], false, null, "b7599310", null));
    ft.options.__file = "src/components/cautions.vue";
    var mt = ft.exports,
        gt = function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.visible,
                    expression: "visible"
                }],
                staticClass: "stats"
            }, [t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showFPS,
                    expression: "showFPS"
                }]
            }, [this._v("FPS: " + this._s(this.fps || "-"))]), this._v(" "), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showPing,
                    expression: "showPing"
                }]
            }, [this._v("Ping: " + this._s(this.ping || "-"))]), this._v(" "), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showPlayerMass && this.mass,
                    expression: "showPlayerMass && mass"
                }]
            }, [this._v("Mass: " + this._s(this.mass))]), this._v(" "), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showPlayerScore && this.score,
                    expression: "showPlayerScore && score"
                }]
            }, [this._v("Score: " + this._s(this.score))]), this._v(" "), t("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.showCellCount && this.cells,
                    expression: "showCellCount && cells"
                }]
            }, [this._v("Cells: " + this._s(this.cells))])])
        };
    gt._withStripped = true;
    var yt = s(1),
        wt = s(4),
        bt = {
            data: () => ({
                showFPS: wt.showFPS,
                showPing: wt.showPing,
                showPlayerMass: wt.showPlayerMass,
                showPlayerScore: wt.showPlayerScore,
                showCellCount: wt.showCellCount,
                visible: false,
                ping: 0,
                fps: 0,
                mass: 0,
                score: 0,
                cells: 0
            }),
            created() {
                yt.events.$on("stats-visible", e => this.visible = e), yt.events.$on("stats-invalidate-shown", () => {
                    this.showFPS = wt.showFPS, this.showPing = wt.showPing, this.showPlayerMass = wt.showPlayerMass, this.showPlayerScore = wt.showPlayerScore, this.showCellCount = wt.showCellCount
                }), yt.events.$on("cells-changed", e => this.cells = e), yt.events.$on("stats-changed", e => {
                    this.ping = e.ping || 0, this.fps = e.fps || 0, e.mass ? yt.settings.shortMass ? this.mass = yt.getShortMass(e.mass) : this.mass = e.mass : this.mass = 0, e.score ? yt.settings.shortMass ? this.score = yt.getShortMass(e.score) : this.score = e.score : this.score = 0
                })
            }
        },
        kt = (s(245), Object(w.a)(bt, gt, [], false, null, "0875ad82", null));
    kt.options.__file = "src/components/stats.vue";
    var Ct = kt.exports,
        At = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: e.visible,
                    expression: "visible"
                }],
                attrs: {
                    id: "chat-container"
                },
                on: {
                    click: function(t) {
                        return e.onChatClick(t)
                    },
                    contextmenu: function(t) {
                        return e.onChatRightClick(t)
                    }
                }
            }, [e.visibleToast ? [s("transition-group", {
                attrs: {
                    name: "toast",
                    tag: "div",
                    id: "toast-list"
                }
            }, e._l(e.toastMessages, function(t) {
                return s("span", {
                    key: t.id
                }, [s("span", {
                    staticClass: "message-row"
                }, [t.from ? [s("span", {
                    staticClass: "message-from",
                    style: {
                        color: t.fromColor
                    },
                    attrs: {
                        "data-pid": t.pid
                    }
                }, [e._v(e._s(t.from))]), e._v(":\n                    ")] : e._e(), e._v(" "), s("span", {
                    staticClass: "message-text",
                    style: {
                        color: t.textColor
                    }
                }, [e._v(e._s(t.text))])], 2)])
            }), 0)] : e._e(), e._v(" "), s("div", {
                class: {
                    toasts: e.visibleToast, visible: e.visibleInput
                },
                attrs: {
                    id: "chatbox"
                }
            }, [e.showBlockedMessageCount && e.blockedMessageCount ? s("div", {
                staticStyle: {
                    position: "absolute",
                    top: "-28px"
                }
            }, [e._v("Blocked messages: " + e._s(e.blockedMessageCount))]) : e._e(), e._v(" "), e.visibleToast ? e._e() : [s("div", {
                ref: "list",
                attrs: {
                    id: "message-list"
                }
            }, e._l(e.messages, function(t, a) {
                return s("div", {
                    key: a,
                    staticClass: "message-row"
                }, [t.from ? [s("span", {
                    staticClass: "message-from",
                    style: {
                        color: t.fromColor
                    },
                    attrs: {
                        "data-pid": t.pid
                    }
                }, [e._v(e._s(t.from))]), e._v(":\n                    ")] : e._e(), e._v(" "), s("span", {
                    staticClass: "message-text",
                    style: {
                        color: t.textColor
                    }
                }, [e._v(e._s(t.text))])], 2)
            }), 0)], e._v(" "), s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.inputText,
                    expression: "inputText"
                }],
                ref: "input",
                attrs: {
                    id: "chatbox-input",
                    type: "text",
                    spellcheck: "false",
                    autocomplete: "off",
                    maxlength: "100",
                    tabindex: "-1",
                    placeholder: "Type your message here"
                },
                domProps: {
                    value: e.inputText
                },
                on: {
                    keydown: function(t) {
                        return !t.type.indexOf("key") && e._k(t.keyCode, "enter", 13, t.key, "Enter") ? null : e.sendChatMessage()
                    },
                    input: function(t) {
                        t.target.composing || (e.inputText = t.target.value)
                    }
                }
            })], 2)], 2)
        };
    At._withStripped = true;
    var _t = s(1),
        St = s(4),
        xt = s(5),
        {
            replaceBadWordsChat: Mt
        } = s(17),
        It = {},
        Tt = {
            data: () => ({
                visible: false,
                visibleToast: St.showChatToast,
                visibleInput: false,
                inputText: "",
                messages: [],
                toastMessages: [],
                showBlockedMessageCount: St.showBlockedMessageCount,
                blockedMessageCount: 0,
                nextMessageId: 0
            }),
            methods: {
                onChatClick(e) {
                    var t = e.target.dataset.pid;
                    t && (_t.selectedPlayer = t, _t.actions.spectate(t))
                },
                onChatRightClick(e) {
                    var t = e.target.dataset.pid;
                    if (t) {
                        var s = _t.playerManager.players[t];
                        s ? It[t] ? this.confirmUnblockPlayer(s) : this.confirmBlockPlayer(s) : xt.alert("Player does not exist or disconnected")
                    }
                },
                confirmBlockPlayer(e) {
                    xt.confirm('Block player "' + e.name + '" until restart?', () => {
                        e.isMe ? xt.alert("You can not block yourself") : (It[e.pid] = e.name, _t.addServerMessage('Blocked player "' + e.name + '"'))
                    })
                },
                confirmUnblockPlayer(e) {
                    xt.confirm('Unblock player "' + e.name + '"?', () => {
                        delete It[e.pid], _t.addServerMessage('Unblocked player "' + e.name + '"')
                    })
                },
                sendChatMessage() {
                    var e = this.inputText.trim();
                    e && (_t.selectedPlayer && (e = e.replace(/\$pid/g, _t.selectedPlayer)), _t.sendChatMessage(e), this.inputText = ""), _t.renderer.view.focus(), this.scrollBottom(true)
                },
                onChatMessage(e) {
                    if (It[e.pid]) this.blockedMessageCount++;
                    else {
                        St.filterChatMessages && (e.text = Mt(e.text));
                        e.fromColor = e.fromColor || "#ffffff", e.textColor = e.textColor || "#ffffff", this.messages.push(e), this.messages.length > 100 && this.messages.shift(), e.id = this.nextMessageId++, e.until = Date.now() + Math.max(5e3, 150 * e.text.length), this.toastMessages.unshift(e), this.scrollBottom(false)
                    }
                },
                onVisibilityChange({
                    visible: e,
                    visibleToast: t
                }) {
                    null != e && (this.visible = e), null != t && (this.visibleToast = t, this.visibleInput = this.visible && !t), this.scrollBottom(true)
                },
                focusChat() {
                    this.visible && (this.visibleInput = true, this.$nextTick(() => this.$refs.input.focus()))
                },
                clearChat() {
                    this.messages.splice(0, this.messages.length), this.toastMessages.splice(0, this.toastMessages.length), this.nextMessageId = 0
                },
                scrollBottom(e = false) {
                    this.visibleToast || this.$nextTick(() => {
                        var t = this.$refs.list,
                            s = t.scrollHeight - t.clientHeight;
                        !e && s - t.scrollTop > 30 || (t.scrollTop = t.scrollHeight)
                    })
                },
                filterToasts() {
                    for (var e = 0; e < this.toastMessages.length; e++) this.toastMessages[e].until >= Date.now() || this.toastMessages.splice(e--, 1)
                }
            },
            created() {
                _t.events.$on("chat-visible", this.onVisibilityChange), _t.events.$on("chat-focus", this.focusChat), _t.events.$on("chat-message", this.onChatMessage), _t.events.$on("every-second", this.filterToasts), _t.events.$on("chat-clear", this.clearChat), _t.events.$on("show-blocked-message-count", e => this.showBlockedMessageCount = e), _t.events.$on("game-stopped", () => {
                    this.blockedMessageCount = 0, It = {}
                }), document.addEventListener("focusin", e => {
                    this.visibleInput = !this.visibleToast || e.target === this.$refs.input
                })
            }
        },
        Pt = (s(247), Object(w.a)(Tt, At, [], false, null, "4900a413", null));
    Pt.options.__file = "src/components/chatbox.vue";
    var Ut = Pt.exports,
        Et = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: e.userVisible && e.visible,
                    expression: "userVisible && visible"
                }],
                attrs: {
                    id: "leaderboard"
                }
            }, [s("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: e.headerVisible,
                    expression: "headerVisible"
                }],
                staticClass: "leaderboard-title"
            }, [e._v(e._s(e.headerText))]), e._v(" "), s("div", e._l(e.leaderboard, function(t, a) {
                return s("div", {
                    key: a,
                    staticClass: "leaderboard-label"
                }, ["position" in t ? s("span", [e._v(e._s(t.position) + ".")]) : e._e(), e._v(" "), s("span", {
                    class: {
                        spectating: !e.gameState.isAlive
                    },
                    style: {
                        color: t.color,
                        fontWeight: t.bold ? "bold" : "normal"
                    },
                    attrs: {
                        "data-pid": t.pid
                    },
                    on: {
                        click: function(t) {
                            return e.leftClickLabel(t)
                        }
                    }
                }, [e._v(e._s(t.text))])])
            }), 0)])
        };
    Et._withStripped = true;
    var Rt = s(1),
        Nt = s(4),
        Lt = {
            data: () => ({
                userVisible: Nt.showLeaderboard,
                visible: false,
                headerVisible: true,
                headerText: "Leaderboard",
                leaderboard: [],
                gameState: Rt.state
            }),
            methods: {
                updateLeaderboard(e, t) {
                    if (this.leaderboard = e, t) this.headerVisible = t.visible, this.headerText = t.text;
                    else if (Nt.showServerName && this.gameState.selectedServer) {
                        this.headerVisible = true;
                        var s = this.gameState.selectedServer.region || "";
                        s && (s += " "), this.headerText = s + this.gameState.selectedServer.name
                    } else this.headerVisible = true, this.headerText = "Leaderboard"
                },
                leftClickLabel() {
                    var e = event.target.dataset.pid;
                    e && (Rt.selectedPlayer = e, Rt.actions.spectate(e))
                },
                onLeaderboardShow() {
                    this.visible || (Rt.events.$on("leaderboard-update", this.updateLeaderboard), this.visible = true)
                },
                onLeaderboardHide() {
                    this.visible && (Rt.events.$off("leaderboard-update", this.updateLeaderboard), this.leaderboard = [], this.visible = false, this.selectedServer = null)
                }
            },
            created() {
                Rt.events.$on("leaderboard-visible", e => this.userVisible = e), Rt.events.$on("leaderboard-show", this.onLeaderboardShow), Rt.events.$on("leaderboard-hide", this.onLeaderboardHide)
            }
        },
        Ot = (s(249), Object(w.a)(Lt, Et, [], false, null, "8a0c31c6", null));
    Ot.options.__file = "src/components/leaderboard.vue";
    var Ft = Ot.exports,
        Wt = {
            components: {
                stats: Ct,
                chatbox: Ut,
                minimap: s(116).default,
                leaderboard: Ft,
                cautions: mt
            }
        },
        Dt = (s(253), Object(w.a)(Wt, dt, [], false, null, "339660d2", null));
    Dt.options.__file = "src/components/hud.vue";
    var Bt = Dt.exports,
        zt = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return s("transition", {
                attrs: {
                    name: "menu"
                }
            }, [s("div", {
                staticClass: "container"
            }, [s("div", {
                staticClass: "fade-box box-1"
            }, [s("div", {
                staticStyle: {
                    padding: "4px"
                }
            }, [e._v("Advertisement")]), e._v(" "), s("div", {
                staticStyle: {
                    padding: "10px",
                    "padding-top": "0px"
                }
            }, [s("div", {
                attrs: {
                    id: "vanis-io_300x250_2"
                }
            })])]), e._v(" "), e.stats ? s("div", {
                staticClass: "fade-box",
                class: {
                    scroll: e.isLoadingAd
                }
            }, [s("div", {
                staticStyle: {
                    padding: "15px"
                }
            }, [s("div", [e._v("Time Alive: " + e._s(e.timeAlive))]), e._v(" "), s("div", [e._v("Highscore: " + e._s(e.highscore))]), e._v(" "), s("div", [e._v("Players Eaten: " + e._s(e.stats.killCount))]), e._v(" "), s("btn", {
                staticClass: "continue",
                nativeOn: {
                    click: function(t) {
                        return e.onContinueClick(t)
                    }
                }
            }, [e._v("Continue")])], 1)]) : e._e()])])
        };
    zt._withStripped = true;
    var $t = s(1),
        /*Ht = s(77),*/
        jt = {
            props: ["stats"],
            data: () => ({
                isLoadingAd: false
            }),
            methods: {
                loadAd: function() {
                    this.isLoadingAd = false; /*Ht.refreshAd("death-box")*/
                },
                onContinueClick: function() {
                    $t.state.deathScreen = false, $t.showDeathScreen(false), $t.showMenu(true)
                }
            },
            computed: {
                timeAlive: function() {
                    var e = this.stats.timeAlive;
                    return e < 60 ? e + "s" : Math.floor(e / 60) + "min " + e % 60 + "s"
                },
                highscore: function() {
                    var e = this.stats.highscore;
                    return $t.getShortMass(e)
                }
            },
            created() {
                $t.events.$on("refresh-deathscreen-ad", this.loadAd)
            }
        },
        Xt = (s(255), Object(w.a)(jt, zt, [], false, null, "3249d726", null));
    Xt.options.__file = "src/components/death-stats.vue";
    var Vt = Xt.exports,
        Zt = function() {
            var e = this.$createElement;
            return (this._self._c || e)("button", {
                staticClass: "btn"
            }, [this._t("default", [this._v("Here should be something")])], 2)
        };
    Zt._withStripped = true;
    var Gt = {},
        Jt = (s(257), Object(w.a)(Gt, Zt, [], false, null, "b0b10308", null));
    Jt.options.__file = "src/components/btn.vue";
    var Yt = Jt.exports,
        Qt = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return e.show ? s("div", {
                class: {
                    "auto-hide": e.autoHideReplayControls
                },
                attrs: {
                    id: "replay-controls"
                }
            }, [s("div", {
                staticStyle: {
                    "text-align": "right"
                }
            }, [s("div", [e._v("Opacity " + e._s(e.cellOpacity) + "%")]), e._v(" "), s("div", [s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.cellOpacity,
                    expression: "cellOpacity"
                }],
                staticClass: "replay-slider",
                staticStyle: {
                    width: "105px",
                    display: "inline-block"
                },
                attrs: {
                    id: "replay-opacity-slider",
                    type: "range",
                    min: "10",
                    max: "100"
                },
                domProps: {
                    value: e.cellOpacity
                },
                on: {
                    input: e.onCellOpacitySlide,
                    __r: function(t) {
                        e.cellOpacity = t.target.value
                    }
                }
            })])]), e._v(" "), s("div", {
                staticStyle: {
                    "margin-bottom": "5px",
                    display: "flex"
                }
            }, [s("div", {
                staticStyle: {
                    flex: "1"
                }
            }, [e._v(e._s(e.replaySecond.toFixed(1)) + " seconds")]), e._v(" "), s("div", {
                staticStyle: {
                    "margin-right": "10px"
                }
            }, [s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.autoHideReplayControls,
                    expression: "autoHideReplayControls"
                }],
                attrs: {
                    type: "checkbox",
                    id: "replay-auto-hide-controls"
                },
                domProps: {
                    checked: Array.isArray(e.autoHideReplayControls) ? e._i(e.autoHideReplayControls, null) > -1 : e.autoHideReplayControls
                },
                on: {
                    change: [function(t) {
                        var s = e.autoHideReplayControls,
                            a = t.target,
                            n = !!a.checked;
                        if (Array.isArray(s)) {
                            var i = e._i(s, null);
                            a.checked ? i < 0 && (e.autoHideReplayControls = s.concat([null])) : i > -1 && (e.autoHideReplayControls = s.slice(0, i).concat(s.slice(i + 1)))
                        } else e.autoHideReplayControls = n
                    }, e.saveAutoHideControls]
                }
            }), e._v(" "), s("label", {
                attrs: {
                    for: "replay-auto-hide-controls"
                }
            }, [e._v("Auto Hide Controls")])])]), e._v(" "), s("input", {
                directives: [{
                    name: "model",
                    rawName: "v-model",
                    value: e.rangeIndex,
                    expression: "rangeIndex"
                }],
                staticClass: "replay-slider",
                attrs: {
                    type: "range",
                    min: e.rangeMin,
                    max: e.rangeMax
                },
                domProps: {
                    value: e.rangeIndex
                },
                on: {
                    input: e.onSlide,
                    change: e.onSlideEnd,
                    __r: function(t) {
                        e.rangeIndex = t.target.value
                    }
                }
            })]) : e._e()
        };
    Qt._withStripped = true;
    var Kt = s(1),
        qt = {
            data: () => ({
                show: false,
                autoHideReplayControls: Kt.settings.autoHideReplayControls,
                drawDelay: Kt.settings.drawDelay,
                cellOpacity: 100,
                rangeMin: 0,
                rangeIndex: 0,
                rangeMax: 1e3,
                replaySecond: 0,
                packetCount: 0
            }),
            created: function() {
                Kt.events.$on("show-replay-controls", this.onShow), Kt.events.$on("replay-index-change", this.onReplayIndexChange)
            },
            methods: {
                onShow(e) {
                    e ? (this.show = true, this.packetCount = e - 1) : (this.show = false, this.cellOpacity = 100, this.rangeIndex = 0, this.packetCount = 0)
                },
                onReplayIndexChange(e, t = true) {
                    var s = e / this.packetCount;
                    t && (this.rangeIndex = Math.floor(s * this.rangeMax)), this.replaySecond = e / 25
                },
                onSlide(e) {
                    Kt.moveInterval && (clearInterval(Kt.moveInterval), Kt.moveInterval = null), Kt.replayMoveTo(this.rangeIndex / this.rangeMax), this.onReplayIndexChange(Kt.replayUpdateIndex, false)
                },
                onSlideEnd(e) {
                    Kt.moveInterval || (Kt.moveInterval = setInterval(Kt.replayUpdate, 40))
                },
                onCellOpacitySlide() {
                    Kt.scene.foreground.alpha = this.cellOpacity / 100
                },
                saveAutoHideControls() {
                    Kt.settings.set("autoHideReplayControls", this.autoHideReplayControls)
                }
            }
        },
        es = (s(259), Object(w.a)(qt, Qt, [], false, null, "c2c2ac08", null));
    es.options.__file = "src/components/replay-controls.vue";
    var ts = es.exports,
        ss = function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return this.show ? t("div", {
                attrs: {
                    id: "ab-overlay"
                }
            }, [this._m(0)]) : this._e()
        };
    ss._withStripped = true;
    var as = s(19),
        {
            isFirstVisit: ns
        } = s(17),
        is = {
            data: () => ({
                show: false
            }),
            created() {
                ns ? console.log("Welcome to Vanis.io!") : as.get("/ads.css").then(e => {}).catch(e => {
                    !e.response && (this.show = true)
                })
            }
        },
        rs = (s(261), Object(w.a)(is, ss, [function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return t("div", {
                staticClass: "content"
            }, [t("img", {
                staticStyle: {
                    width: "120px"
                },
                attrs: {
                    src: "/img/sad.png"
                }
            }), this._v(" "), t("p", {
                staticStyle: {
                    "font-size": "3em"
                }
            }, [this._v("Adblock Detected")]), this._v(" "), t("p", {
                staticStyle: {
                    "font-size": "1.5em",
                    "margin-bottom": "15px"
                }
            }, [this._v("We use advertisements to fund our servers!")]), this._v(" "), t("img", {
                staticStyle: {
                    "border-radius": "4px",
                    "box-shadow": "0 0 10px black"
                },
                attrs: {
                    src: "/img/ab.gif"
                }
            })])
        }], false, null, "1611deb4", null));
    rs.options.__file = "src/components/ab-overlay.vue";
    var os = rs.exports,
        ls = function() {
            var e = this.$createElement;
            return (this._self._c || e)("div", {
                directives: [{
                    name: "show",
                    rawName: "v-show",
                    value: this.show,
                    expression: "show"
                }],
                staticClass: "image-captcha-overlay"
            }, [this._m(0)])
        };
    ls._withStripped = true;
    var cs = s(1),
        us = s(65);
    var ds = {
            data: () => ({
                show: false,
                scriptLoadPromise: null,
                captchaId: null,
                wsId: null
            }),
            created() {
                cs.events.$on("show-image-captcha", async () => {
                    this.show = true, this.wsId = cs.currentWsId, grecaptcha.ready(() => {
                        this.renderCaptcha()
                    })
                })
            },
            methods: {
                renderCaptcha() {
                    null === this.captchaId ? this.captchaId = grecaptcha.render(document.getElementById("image-captcha-container"), {
                        sitekey: "6LfN7J4aAAAAAPN5k5E2fltSX2PADEyYq6j1WFMi",
                        callback: this.onCaptchaToken.bind(this)
                    }) : grecaptcha.reset(this.captchaId)
                },
                onCaptchaToken(e) {
                    if (cs.currentWsId === this.wsId)
                        if (e) {
                            var t = new us;
                            t.uint8(11), t.utf8(e), cs.send(t.write()), this.show = false
                        } else this.renderCaptcha();
                    else this.show = false
                }
            }
        },
        hs = (s(263), Object(w.a)(ds, ls, [function() {
            var e = this.$createElement,
                t = this._self._c || e;
            return t("div", {
                staticClass: "center-screen"
            }, [t("div", {
                staticStyle: {
                    color: "orange",
                    "margin-bottom": "6px"
                }
            }, [this._v("Login and level up to skip captcha!")]), this._v(" "), t("div", {
                attrs: {
                    id: "image-captcha-container"
                }
            })])
        }], false, null, "76d60428", null));
    hs.options.__file = "src/components/image-captcha.vue";
    var ps = hs.exports,
        vs = function() {
            var e = this,
                t = e.$createElement,
                s = e._self._c || t;
            return e.show ? s("div", {
                staticClass: "shoutbox"
            }, [s("iframe", {
                staticClass: "shoutbox-player",
                attrs: {
                    width: "300",
                    height: "200",
                    src: e.url,
                    frameborder: "0"
                }
            }), e._v(" "), s("i", {
                staticClass: "fas fa-times close-button",
                on: {
                    click: function(t) {
                        return e.hide()
                    }
                }
            })]) : e._e()
        };
    vs._withStripped = true;
    var fs = s(265),
        ms = {
            data: () => ({
                show: false
            }),
            props: ["url", "tag"],
            methods: {
                hide() {
                    fs.setSeen(this.tag), this.show = false
                }
            },
            created() {
                fs.isSeen(this.tag) || (this.show = true)
            }
        },
        gs = (s(266), Object(w.a)(ms, vs, [], false, null, "559d1d3c", null));
    gs.options.__file = "src/components/shoutbox.vue";
    var ys = gs.exports;
    n.a.use(r.a);
    var ws = s(4);
    n.a.component("btn", Yt), window.app = new n.a({
        el: "#app",
        data: {
            showHud: ws.showHud,
            showMenu: true,
            showDeathScreen: false,
            deathStats: null
        },
        components: {
            imageCaptcha: ps,
            mainContainer: qe,
            socialLinks: st,
            privacyTos: rt,
            contextMenu: ut,
            hud: Bt,
            deathStats: Vt,
            replayControls: ts,
            abOverlay: os,
            shoutbox: ys
        }
    })
}]);
