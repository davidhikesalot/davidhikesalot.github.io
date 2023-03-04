import "./parkdeck.component.scss";
import { CardDeckHeader, CardDeck, CardDeckCard } from "./carddeck.component";
import {
  Container,
  Card,
  Image,
  DropdownButton,
  Dropdown,
  ListGroup,
} from "react-bootstrap";
import { useLocation, useOutletContext } from "react-router-dom";

import { IPageLayoutProps } from "../layouts/page.layout";
import LazyLoad from "react-lazy-load";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { faImages, faMap } from "@fortawesome/free-regular-svg-icons";
import {
  faCircle,
  faDiamond,
  faSquare,
} from "@fortawesome/free-solid-svg-icons";

import { Hike } from "../services/hikes.service";
import { Parks } from "../services/parks.service";
import { Park } from "../services/parks.service";
import { ExternalLink } from "./utils.component";
import {
  DistanceBadge,
  ElevationBadge,
  HikeListItemStats,
  HikeMapLink,
  HikePostLink,
} from "./hikeinfo.component";
import { useEffect, useState } from "react";

interface IParkCardProps {
  park: Park;
  nexthikes?: boolean;
  planned?: boolean;
  completed?: boolean;
}

interface IParkDeckProps {
  title?: string;
  nexthikes?: boolean;
  planned?: boolean;
  completed?: boolean;
}

function ParkMap({ park }: { park: Park }) {
  const mapIdToUrl = (id: string) => `https://drive.google.com/uc?id=${id}`;
  return (
    <LazyLoad>
      <a
        href={mapIdToUrl(park.get("trailshikedid"))}
        target="_blank"
        rel="noreferrer"
        className="park-map"
      >
        <picture className="park-map">
          <source
            media="(max-width: 700px)"
            srcSet={mapIdToUrl(park.get("trailshikedmobileid"))}
          />
          <source
            media="(min-width: 701px)"
            srcSet={mapIdToUrl(park.get("trailshikedwebid"))}
          />
          <Image
            alt={park.get("parkname") + " Trail Map"}
            src={mapIdToUrl(park.get("trailshikedmobileid"))}
          />
        </picture>
      </a>
    </LazyLoad>
  );
}

function ParkCard({
  park,
  nexthikes = true,
  planned = true,
  completed = true,
}: IParkCardProps) {
  const hikelist = (title: string, hikes: Hike[]) => {
    return hikes.length === 0 ? (
      <></>
    ) : (
      <>
        <Card.Subtitle>{title}</Card.Subtitle>
        <ListGroup as="ul" className="hike-list">
          {hikes.map((hike: Hike, index: number) => {
            const ratings: string[] = ["easy", "moderate", "hard"];
            const rating: string = ratings.includes(hike.stats.difficulty)
              ? hike.stats.difficulty
              : "unknown";
            return (
              <ListGroup.Item as="li" key={index} className={`${rating}-hike`}>
                <div className="hike-title">
                  <span>{hike.get("hikename")}</span>,{" "}
                  <span className="text-nowrap">{hike.get("parkname")}</span>
                </div>
                <div className="hike-info">
                  <DistanceBadge hike={hike} />
                  {hike.mapUrl && (
                    <HikeMapLink hike={hike}>
                      <FontAwesomeIcon icon={faMap} />
                    </HikeMapLink>
                  )}
                  {hike.postUrl && (
                    <HikePostLink hike={hike}>
                      <FontAwesomeIcon icon={faImages} />
                    </HikePostLink>
                  )}
                  <ElevationBadge hike={hike} />
                </div>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      </>
    );
  };

  return (
    <CardDeckCard className="col-12">
      <Card id={park.anchor}>
        <Card.Header className="d-flex">{park.get("parkname")}</Card.Header>
        <Card.Body className="d-flex flex-row">
          <Container>
            <ParkMap park={park} />
          </Container>
          <Container>
            {nexthikes && hikelist("Next Hikes", park.hikes.nexthikes)}
            {planned && hikelist("Planned", park.hikes.planned)}
            {completed && hikelist("Completed", park.hikes.completed)}
          </Container>
        </Card.Body>
        <Card.Footer className="d-flex justify-content-around text-nowrap">
          <ExternalLink href={park.get("parkurl")}>Park Website</ExternalLink>
          <ExternalLink href={park.get("alltrailsparkurl")}>
            AllTrails
          </ExternalLink>
        </Card.Footer>
      </Card>
    </CardDeckCard>
  );
}

export function ParkDeck(props: IParkDeckProps) {
  const ctx: IPageLayoutProps = useOutletContext();
  const parks: Parks = ctx.data?.parks || new Parks();
  const [anchor, setAnchor] = useState(useLocation().hash);

  const dropdownHandler = (eventKey: any) => {
    if (eventKey) {
      setAnchor(eventKey);
    }
  };

  useEffect(() => {
    console.log(anchor);
    if (anchor) {
      console.log("::" + anchor);
      document.getElementById(anchor)?.scrollIntoView({ behavior: "smooth" });
    }
  }, [anchor]);

  const numHikesToShow = (park: Park) => {
    const { nexthikes = true, planned = true, completed = true } = props;
    const num_hikes =
      (nexthikes ? park.hikes.nexthikes.length : 0) +
      (planned ? park.hikes.planned.length : 0) +
      (completed ? park.hikes.completed.length : 0);
    return num_hikes > 0;
  };

  return (
    <>
      <CardDeckHeader>
        <Card.Header className="d-flex">
          <Container className="my-auto lh-1">
            <span>{props.title}</span>
          </Container>
          <Container>
            <DropdownButton
              id="parks-dropdown"
              onSelect={dropdownHandler}
              title="Go to park ..."
              align="end"
            >
              {parks.list.filter(numHikesToShow).map((park, index) => (
                <>
                  <Dropdown.Item key={park.anchor} eventKey={park.anchor}>
                    {park.name}
                  </Dropdown.Item>
                </>
              ))}
            </DropdownButton>
          </Container>
        </Card.Header>
      </CardDeckHeader>
      <CardDeck>
        {parks.list.filter(numHikesToShow).map((park, index) => (
          <ParkCard key={park.anchor} park={park} {...props} />
        ))}
      </CardDeck>
    </>
  );
}
