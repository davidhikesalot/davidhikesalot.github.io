import { Badge, Container, Row, Col, Card } from "react-bootstrap";
import { Hike } from "../services/hikes.service";
import { format as dateFormat, isBefore } from "date-fns";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons";

function JournalDate({ hike }: { hike: Hike }) {
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

function RatingPill({ rating }: { rating: string }) {
  const ratings: Record<string, string> = {
    easy: "success",
    moderate: "primary",
    hard: "danger",
  };
  let bg = ratings[rating] ?? "secondary";
  return <Badge bg={bg}>{rating}</Badge>;
}

function StatPill(props: any) {
  return (
    <Badge {...props} bg="secondary">
      {props.children}
    </Badge>
  );
}

function JournalCard({ hike }: { hike: Hike }) {
  const href =
    hike.get("blogposturl") ||
    hike.get("photoalbumurl") ||
    hike.get("mapurl") ||
    "";
  const gotoLink = () => (window.location.href = href);
  return (
    <button className="card app-card" onClick={() => gotoLink()}>
      <Card.Header className="position-relative">
        <JournalDate hike={hike} />
        <FontAwesomeIcon
          className="fa-xs position-absolute"
          icon={faArrowUpRightFromSquare}
        />
      </Card.Header>
      <Card.Body>
        <Card.Title>{hike.get("hikename")}</Card.Title>
        <Card.Subtitle>{hike.parkAddress}</Card.Subtitle>
        <hr className="w-50 mx-auto p-0 m-2"></hr>
        {hike.get("teaser").length > 0 && (
          <Card.Text className="text-start">{hike.get("teaser")}</Card.Text>
        )}
      </Card.Body>
      <Card.Footer className="d-flex justify-content-around">
        <StatPill>{hike.stats.distance} mi</StatPill>
        <RatingPill rating={hike.stats.rating} />
        <StatPill>{hike.stats.elevation}'</StatPill>
      </Card.Footer>
    </button>
  );
}

export function JournalCards({ hikes = [] }: { hikes?: Hike[] }) {
  const sortOrder = (cond: Boolean) => (cond === true ? -1 : 1);
  const compareHikeDates = (a: Hike, b: Hike) => {
    if (a.date || b.date) {
      return a.date && b.date
        ? sortOrder(isBefore(b.date, a.date))
        : sortOrder(!!a.date);
    }

    const aStr = a.get("hikedate");
    const bStr = b.get("hikedate");
    return aStr && bStr ? aStr.localeCompare(bStr) : sortOrder(!!aStr);
  };

  return (
    <Container className="hike-cards">
      <Row>
        {hikes
          .sort((a: Hike, b: Hike) => compareHikeDates(a, b))
          .map((hike, index) => (
            <Col>
              <JournalCard key={`entry-${index}`} hike={hike} />
            </Col>
          ))}
      </Row>
    </Container>
  );
}
