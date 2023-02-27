import { IGoogleSheetRow } from "./data.service";
import { Hikes, Hike, HikeStats } from "./hikes.service";

export class Park {
  private _park: IGoogleSheetRow;
  private _hikes: Hikes;
  private _stats: HikeStats;

  constructor(row: IGoogleSheetRow) {
    this._park = row;
    this._hikes = new Hikes();
    this._stats = new HikeStats();
  }

  get hikes() {
    return this._hikes;
  }

  get stats() {
    return this._stats;
  }

  addHike(hike: Hike) {
    this.hikes.addHike(hike);
    this.stats.add(hike.stats);
  }

  get(field: string): string {
    if (!(field in this._park)) {
      console.error(`Unknown field: ${field}`);
      return "";
    }
    return this._park[field];
  }
}

export class Parks {
  _parks: Park[];

  static build(fetchJson: any): Parks {
    const parks = new Parks();
    fetchJson.rows.map((row: IGoogleSheetRow) => parks.addPark(new Park(row)));
    return parks;
  }

  constructor() {
    this._parks = [];
  }

  addPark(park: Park) {
    this._parks.push(park);
  }

  get parks() {
    return this._parks;
  }

  find(parkname: string): Park {
    return (
      this._parks.filter((p) => p.get("parkname") === parkname)[0] || undefined
    );
  }
}
