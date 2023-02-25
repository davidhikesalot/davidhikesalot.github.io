import { Hike, HikeStats } from "../services/hikes.service";
import { Badge } from "react-bootstrap";

export function HikeListItemStats(props: any) {
  return (
    <span>
      ({props.hike.stats.distance}mi, {props.hike.stats.elevation}ft gain)
    </span>
  );
}

function HikeListItem(props: { hike: Hike }) {
  return (
    <div className="hike-entry card d-flex flex-row mb-2 align-items-stretch">
      <div className="card-body m-0 p-0">
        <Badge className="me-1" bg="secondary">
          {props.hike.stats.distance}mi
        </Badge>
      </div>
      <div className="card-body m-0 p-0">
        <span className="me-1">{props.hike.get("parkname")}</span>
        <a href={props.hike.get("mapurl")} rel="noreferrer" target="_blank">
          {props.hike.get("hikename")}
        </a>
      </div>
      <div className="card-footer m-0 p-0">
        <Badge className="ms-1" bg="secondary">
          {props.hike.stats.elevation}ft gain
        </Badge>
      </div>
    </div>
  );
}

function HikeListItems(props: any) {
  const hikes: Hike[] = props.hikes || [];

  return (
    <div className="hike-list-items">
      {hikes.map((hike) => (
        <HikeListItem hike={hike} />
      ))}
    </div>
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
