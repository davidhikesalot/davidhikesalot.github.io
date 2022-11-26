import { IGoogleSheetRow } from "./data.service"
import { Hike, HikeStats } from "./hikes.service"

export class Park {
    private _park: IGoogleSheetRow
    private _hikes: Hike[]
    private _stats: HikeStats

    constructor(row: IGoogleSheetRow) {
        this._park = row
        this._hikes = []
        this._stats = new HikeStats()
    }

    addHike(hike: Hike) {
        this._hikes.push(hike)
        this._stats.add(hike.stats)
    }

    get(field: string): string {
        if (! (field in this._park)) {
            console.error(`Unknown field: ${field}`)
            return '';
        }
        return this._park[field]
    }
}

export class Parks {
    _parks: Park[] 
    constructor(fetchJson: any) {
        this._parks = fetchJson.rows.map((row:IGoogleSheetRow) => new Park(row))
    }

    find(parkname: string): Park {
        return this._parks.filter(p => p.get('parkname') === parkname)[0] || undefined;
    }
}

