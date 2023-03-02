import "./parkdeck.component.css";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { Hike } from "../services/hikes.service";
import { Parks } from "../services/parks.service";
import { Park } from "../services/parks.service";
import { useOutletContext } from "react-router-dom";
import { IPageLayoutProps } from "../layouts/page.layout";
import LazyLoad from "react-lazy-load";

interface IParkCardProps {
  park: Park;
  nexthikes?: boolean;
  planned?: boolean;
  completed?: boolean;
}

interface IParkDeckProps {
  nexthikes?: boolean;
  planned?: boolean;
  completed?: boolean;
}

function ParkMap({ park }: { park: Park }) {
  const mapIdToUrl = (id: string) => `https://drive.google.com/uc?id=${id}`;
  return (
    <a
      href={mapIdToUrl(park.get("trailshikedid"))}
      target="_blank"
      rel="noreferrer"
      className="park-map"
    >
      <LazyLoad>
        <Image
          alt=""
          src={mapIdToUrl(park.get("trailshikedmobileid"))}
          srcSet={mapIdToUrl(park.get("trailshikedwebid")) + " 768w"}
        />
      </LazyLoad>
    </a>
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
        <Card.Text>
          <ul>
            {hikes.map((hike: Hike, index: number) => {
              return (
                <li>
                  <a href={hike.get("mapurl")}>{hike.get("hikename")}</a>
                </li>
              );
            })}
          </ul>
        </Card.Text>
      </>
    );
  };

  const count_hikes = (cond: boolean, hikes: Hike[]): number =>
    cond ? hikes.length : 0;
  const num_hikes_to_show: number =
    count_hikes(nexthikes, park.hikes.nexthikes) +
    count_hikes(planned, park.hikes.planned) +
    count_hikes(completed, park.hikes.planned);

  return num_hikes_to_show === 0 ? (
    <></>
  ) : (
    <Col xs={12} sm={12} md={12} lg={6} xl={6} xxl={6}>
      <Card className="app-card">
        <Card.Header>{park.get("parkname")}</Card.Header>
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
          <a href={park.get("parkurl")}>Park Website</a>
          <a href={park.get("alltrailsparkurl")}>@AllTrails</a>
        </Card.Footer>
      </Card>
    </Col>
  );
}

export function ParkDeck(props: IParkDeckProps) {
  const ctx: IPageLayoutProps = useOutletContext();
  const parks: Parks = ctx.data?.parks || new Parks();

  return (
    <>
      <Container className="card-deck">
        <Row>
          {parks.parks.map((park, index) => (
            <ParkCard park={park} {...props} />
          ))}
        </Row>
      </Container>
    </>
  );
}
