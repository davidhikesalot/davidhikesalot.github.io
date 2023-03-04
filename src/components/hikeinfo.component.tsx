import { Hike, HikeStats } from "../services/hikes.service";
import { Badge } from "react-bootstrap";
import { ReactNode } from "react";
import { ExternalLink } from "./utils.component";
import {
  faCircle,
  faDiamond,
  faQuestionCircle,
  faSquare,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface IHikeLinkProps {
  hike: Hike;
  children: ReactNode;
}
export function HikeMapLink({ hike, children }: IHikeLinkProps) {
  return (
    <ExternalLink className="hike-map-link" href={hike.mapUrl}>
      {children}
    </ExternalLink>
  );
}
export function HikePostLink({ hike, children }: IHikeLinkProps) {
  return (
    <ExternalLink className="hike-post-link" href={hike.postUrl}>
      {children}
    </ExternalLink>
  );
}

export function HikeListItemStats({ hike }: { hike: Hike }) {
  return (
    <span className="hike-stats">
      ({hike.stats.distance}mi / {hike.stats.elevation}' gain)
    </span>
  );
}

export function HikeDifficultyIcon({ hike }: { hike: Hike }) {
  const icons: Record<string, IconDefinition> = {
    easy: faCircle,
    moderate: faSquare,
    hard: faDiamond,
  };
  let icon = icons[hike.stats.difficulty] ?? faQuestionCircle;

  return (
    <span className="hike-difficulty-icon">
      <FontAwesomeIcon icon={icon} fixedWidth />
    </span>
  );
}

interface IStatBadgeProps {
  hike: Hike;
  bg?: string;
}
export function DifficultyBadge({ hike, bg = "secondary" }: IStatBadgeProps) {
  const ratings: Record<string, string> = {
    easy: "success",
    moderate: "primary",
    hard: "danger",
  };
  bg = ratings[hike.stats.difficulty] ?? bg;
  return (
    <Badge bg={bg} className="hike-badge-distance">
      {hike.stats.difficulty}
    </Badge>
  );
}

export function DistanceBadge({ hike, bg = "secondary" }: IStatBadgeProps) {
  return (
    <Badge bg={bg} className="badge-transparent">
      {hike.stats.distance} mi
    </Badge>
  );
}

export function ElevationBadge({ hike, bg = "secondary" }: IStatBadgeProps) {
  return (
    <Badge bg={bg} className="badge-transparent">
      {hike.stats.elevation}'
    </Badge>
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
        <Badge bg="secondary">{props.hike.stats.elevation}ft gain</Badge>
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
    <div className="hike-list card mb-2 p-0 border-0">
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
