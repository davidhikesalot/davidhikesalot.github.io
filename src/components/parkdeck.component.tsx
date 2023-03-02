import "./parkdeck.component.scss";
import { CardDeckHeader, CardDeck, CardDeckCard } from "./carddeck.component";
import { Container, Card, Image } from "react-bootstrap";
import { Hike } from "../services/hikes.service";
import { Parks } from "../services/parks.service";
import { Park } from "../services/parks.service";
import { HikeListItemStats } from "./hikestats.component";
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
  title?: string;
  nexthikes?: boolean;
  planned?: boolean;
  completed?: boolean;
}

function ParkMap({ park }: { park: Park }) {
  const mapIdToUrl = (id: string) => `https://drive.google.com/uc?id=${id}`;
  return (
    <LazyLoad>
      <picture>
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
        <Card.Text>
          <ul>
            {hikes.map((hike: Hike, index: number) => {
              return (
                <li className="lh-1 pb-1">
                  <a href={hike.get("mapurl")}>{hike.get("hikename")}</a>{" "}
                  <HikeListItemStats hike={hike} />
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
    <CardDeckCard className="col-12">
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
    </CardDeckCard>
  );
}

export function ParkDeck(props: IParkDeckProps) {
  const ctx: IPageLayoutProps = useOutletContext();
  const parks: Parks = ctx.data?.parks || new Parks();

  return (
    <>
      <CardDeckHeader title={props.title}></CardDeckHeader>
      <CardDeck>
        {parks.parks.map((park, index) => (
          <ParkCard key={`carddeck-card-${index}`} park={park} {...props} />
        ))}
      </CardDeck>
    </>
  );
}
