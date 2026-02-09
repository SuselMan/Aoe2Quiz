import type { GameData } from '@/src/models/dataModel';

const DATA_URL = 'https://aoe2techtree.net/data/data.json';

const localDataFallback = require('./data.json') as GameData;

class AoeData {
    private _data: GameData | null = null;

    set data(a: GameData) {
        this._data = a;
    }

    get data(): GameData {
        if (!this._data) throw new Error('Game data not loaded yet');
        return this._data;
    }

    get isLoaded(): boolean {
        return this._data != null;
    }

    async loadFromRemote(): Promise<void> {
        if (this._data) return;
        try {
            const res = await fetch(DATA_URL);
            if (res.ok) {
                this._data = (await res.json()) as GameData;
                return;
            }
        } catch {
            /* ignore */
        }
        this._data = localDataFallback;
    }
}

const MainData = new AoeData();

export default MainData;
