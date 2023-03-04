import "./hikedeck.component.scss";
import { Card } from "react-bootstrap";
import { Hike } from "../services/hikes.service";
import { format as dateFormat } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CardDeckHeader, CardDeck, CardDeckCard } from "./carddeck.component";
import {
  HikeListStats,
  DifficultyBadge,
  DistanceBadge,
  ElevationBadge,
  HikeMapLink,
  HikePostLink,
} from "./hikeinfo.component";
import { faMap, faImages } from "@fortawesome/free-regular-svg-icons";

function HikeDate({ hike }: { hike: Hike }) {
  if (!hike.date) {
    const hikeDateText = hike.get("hikedate");
    return hikeDateText ? <span>{hike.get("hikedate")}</span> : <></>;
  }

  return (
    <time dateTime={dateFormat(hike.date, "L")}>
      {dateFormat(hike.date, "EEEE")} {dateFormat(hike.date, "MMM")}{" "}
      {dateFormat(hike.date, "dd")}, {dateFormat(hike.date, "yyyy")}
    </time>
  );
}

function HikeCard({ hike }: { hike: Hike }) {
  return (
    <Card>
      <Card.Header className="text-center position-relative">
        <HikeDate hike={hike} />
        {hike.mapUrl && (
          <HikeMapLink hike={hike}>
            <FontAwesomeIcon size="xs" icon={faMap} />
          </HikeMapLink>
        )}
        {hike.postUrl && (
          <HikePostLink hike={hike}>
            <FontAwesomeIcon size="xs" icon={faImages} />
          </HikePostLink>
        )}
      </Card.Header>
      <Card.Body className="text-center">
        <Card.Title>{hike.get("hikename")}</Card.Title>
        <Card.Subtitle>{hike.parkAddress}</Card.Subtitle>
        <hr className="w-50 mx-auto p-0 m-2"></hr>
        {hike.get("teaser").length > 0 && (
          <Card.Text className="text-start">{hike.get("teaser")}</Card.Text>
        )}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-around">
        <DistanceBadge hike={hike} />
        <DifficultyBadge hike={hike} />
        <ElevationBadge hike={hike} />
      </Card.Footer>
    </Card>
  );
}

export function HikeDeck({
  title,
  hikes = [],
}: {
  title: string;
  hikes?: Hike[];
}) {
  return (
    <>
      <CardDeckHeader title={title}>
        <HikeListStats hikes={hikes} />
      </CardDeckHeader>
      <CardDeck>
        {hikes.map((hike, index) => (
          <CardDeckCard>
            <HikeCard key={`hike-${index}`} hike={hike} />
          </CardDeckCard>
        ))}
      </CardDeck>
    </>
  );
}
