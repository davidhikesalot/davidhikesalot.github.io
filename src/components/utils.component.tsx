import "./utils.component.scss";
import { ReactNode } from "react";
import { Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircle,
  faDiamond,
  faQuestionCircle,
  faSquare,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";
import { Hike, HikeStats } from "../services/hikes.service";

interface IExternalLinkProps {
  href: string | undefined;
  newtab?: boolean;
  children: ReactNode;
  className?: string;
}
export function ExternalLink(props: IExternalLinkProps) {
  const targetProps = props.newtab ? { target: "_blank" } : {};
  return props.href ? (
    <a href={props.href} className={props.className} {...targetProps}>
      {props.children}
    </a>
  ) : (
    <>{props.children}</>
  );
}

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

export function DifficultyIcon({ hike }: { hike: Hike }) {
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
