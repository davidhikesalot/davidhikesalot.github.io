import "./hikelist.component.scss";
import { Card, Col, ListGroup, Row } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faMap } from "@fortawesome/free-regular-svg-icons";

import { Hike } from "../services/hikes.service";
import { DifficultyIcon, HikeMapLink, HikePostLink } from "./utils.component";

interface IHikesListProps {
  title?: string;
  hikes: Hike[];
  parkFirst?: boolean;
}

export function HikeList({ title, hikes, parkFirst = false }: IHikesListProps) {
  return hikes.length === 0 ? (
    <></>
  ) : (
    <>
      {title && <Card.Subtitle>{title}</Card.Subtitle>}
      <ListGroup as="ul" className="hike-list">
        {hikes.map((hike: Hike, index: number) => {
          const ratings: string[] = ["easy", "moderate", "hard"];
          const rating: string = ratings.includes(hike.stats.difficulty)
            ? hike.stats.difficulty
            : "unknown";
          return (
            <ListGroup.Item as="li" key={index} className={`${rating}-hike`}>
              <Row>
                <Col className="hike-title">
                  <DifficultyIcon hike={hike} />
                  <span>{hike.get("hikename")}</span>,{" "}
                  <span className="text-nowrap">{hike.get("parkname")}</span>
                </Col>
              </Row>
              <Row className="hike-info">
                <Col className="hike-stats ">
                  {hike.stats.distance} miles, {hike.stats.elevation}' gain
                </Col>
                {hike.postUrl && (
                  <HikePostLink className="col" hike={hike}>
                    <FontAwesomeIcon icon={faImages} />
                  </HikePostLink>
                )}
                {hike.mapUrl ? (
                  <HikeMapLink className="col" hike={hike}>
                    <FontAwesomeIcon icon={faMap} />
                  </HikeMapLink>
                ) : (
                  <Col></Col>
                )}
              </Row>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </>
  );
}

export function HikeListCard(props: IHikesListProps) {
  const childProps = { ...props };
  delete childProps.title;
  return (
    <Card className="hike-list-card">
      <Card.Header>{props.title}</Card.Header>
      <Card.Body>
        <HikeList {...childProps} />
      </Card.Body>
    </Card>
  );
}
