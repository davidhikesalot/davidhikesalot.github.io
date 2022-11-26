import { IGoogleSheetRow } from "./data.service"
import { Park, Parks } from "./parks.service"

export class HikeStats {
    _num_hikes: number
    _distance: number
    _elevation: number
    _duration: number
    constructor(row: IGoogleSheetRow|undefined = undefined) {
        this._num_hikes = row ? 1 : 0

        const cellToFloat = (col:string) => (parseFloat((row||{})[col]) || 0.0)

        this._distance = cellToFloat('distance')
        this._elevation = cellToFloat('elevation')
        this._duration = cellToFloat('duration')
    }


    get num_hikes(): string {
        return this._toFixedLocaleString(this._num_hikes)
    }

    get distance(): string {
        return this._toFixedLocaleString(this._distance, 1)
    }

    get elevation(): string {
        return this._toFixedLocaleString(this._elevation)
    }

    get duration(): string {
        return this._toFixedLocaleString(this._duration)
    }

    add(more_stats: HikeStats) {
        this._num_hikes += more_stats._num_hikes
        this._distance += more_stats._distance
        this._elevation += more_stats._elevation
        this._duration += more_stats._duration
    }

    _toFixedLocaleString(num: number, fixed:number = 0): string {
        return parseFloat(num.toFixed(fixed)).toLocaleString()
    }
}

export class Hike {
    _hike: IGoogleSheetRow
    _stats: HikeStats
    _park?: Park
    constructor(row: IGoogleSheetRow, parks: Parks) {
        this._hike = row
        this._stats = new HikeStats(row)
        this._park = parks.find(this.get('parkname'))
        if (this._park) {
            this._park.addHike(this)
        }
    }

    get stats() {
        return this._stats
    }

    get isCompleted(): boolean {
        return this.get('hikestatus') === 'completed'
    }

    get isPlanned(): boolean {
        return this.get('hikestatus') !== 'completed'
    }

    get isNextHike(): boolean {
        return this.get('hikestatus') === 'nexthike'
    }

    get(field: string): string {
        if (! (field in this._hike)) {
            console.error(`Unknown field: ${field}`)
            return '';
        }
        return this._hike[field]
    }
}

export class Hikes {
    private _hikes: Hike[]
    constructor(fetchJson: any, parks: Parks) {
        this._hikes = fetchJson.rows.map((row:IGoogleSheetRow) => new Hike(row, parks))
    }

    get completed(): Hike[] {
        return this._hikes.filter(h => h.isCompleted)
    }

    get planned(): Hike[] {
        return this._hikes.filter(h => h.isPlanned)
    }

    get nexthikes(): Hike[] {
        return this._hikes.filter(h => h.isNextHike)
    }
}
