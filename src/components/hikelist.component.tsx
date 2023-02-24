import { Hike, HikeStats } from "../services/hikes.service";

export function HikeListItemStats(props: any) {
  return (
    <span>
      ({props.hike.stats.distance}mi, {props.hike.stats.elevation}ft gain)
    </span>
  );
}

function HikeListItem(props: { hike: Hike; whatever: string }) {
  return (
    <li>
      <span>{props.hike.get("parkname")}</span>
      <a href={props.hike.get("mapurl")} rel="noreferrer" target="_blank">
        {props.hike.get("hikename")}
      </a>
      <span>
        ({props.hike.stats.distance}mi, {props.hike.stats.elevation}ft gain)
      </span>
    </li>
  );
}

function HikeListItems(props: any) {
  const hikes: Hike[] = props.hikes || [];

  return (
    <ul className="hike-list-items">
      {hikes.map((hike) => (
        <HikeListItem hike={hike} whatever="hello" />
      ))}
    </ul>
  );
}

export function HikeListStats({ hikes = [] }: { hikes?: Hike[] }) {
  const stats: HikeStats = new HikeStats();
  hikes?.forEach((h: Hike) => stats.add(h.stats));
  return (
    <div className="hike-list-stats">
      {stats.num_hikes} hikes / {stats.distance} miles / {stats.elevation} feet
      elevation
    </div>
  );
}

export function HikeList(props: any) {
  const name: string = props.name;
  const hikes: Hike[] = props.hikes || [];

  return (
    <div className="app-card hike-list card mb-2 p-0 border-0">
      <h5 className="hike-list-name hike-entry-header card-header p-2">
        {name}
      </h5>
      <div className="card-body p-2">
        <HikeListStats hikes={hikes} />
        <HikeListItems hikes={hikes} />
      </div>
    </div>
  );
}
