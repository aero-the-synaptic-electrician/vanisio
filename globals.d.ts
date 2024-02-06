interface Border {
    width: number;
    height: number;
    minx: number;
    miny: number;
    maxx: number;
    maxy: number;
    x: number;
    y: number;
    circle?: boolean;
};

interface Food {
    minSize?: number;
    maxSize?: number;
    stepSize?: number;
    ejectedSize?: number;
}

interface InitialData {
    protocol: number;
    gamemodeId: number;
    instanceSeed: number;
    playerId: number;
    border: BorderData;
    food: FoodData;
};

interface Server {
    url: string;
    region: string;
    name: string;
    slots: number;
};

interface State {
    connectionUrl: string?;
    selectedServer: Server?;
    spectators: number;
    interactible: boolean;
    playButtonDisabled: boolean;
    playButtonText: string;
    deathDelay: boolean;
    autoRespawning: boolean;
    alive: boolean;
};

interface PlayerData {
    pid: number;
    nickname: string | null;
    skin: string | null;
    skinUrl: string | null;
    nameColor: string | null;
    tagId: number | null;
    bot?: boolean;
};

interface CellData {
    type: number;
    id: number;
    pid: number?;
    x: number;
    y: number;
    size: number;
    flags: number;
    texture?: PIXI.Texture;
};


type Vector2 = import('./src/physics/vector2');

interface Camera {
    timeStamp: number;
    spectator: Vector2;
    oldPosition: Vector2;
    newPosition: Vector2;
    oldScale: number;
    newScale: number;
};

declare type Cell = import('./src/cells/cell');

declare type Callback = (image: ImageBitmap?) => void;

interface Loader {
    image?: ImageBitmap;
    errored?: boolean;
    callbacks: Callback[];
};

interface ResponseData {
    url: string;
    image: ImageBitmap?;
    errored: boolean;
}

declare type Game = import('./src/game').Game;

declare type EventLevel = 0 | 1 | 2 | 3 | 4;
declare type EventData = any[];

enum EventType {
    Info = 0,
    Warning = 1,
    Error = 2
};

type Connection = import('./src/network/connection').Connection;

type ActionManager = import('./src/game/action-manager').ActionManager;

declare var production: boolean | undefined;