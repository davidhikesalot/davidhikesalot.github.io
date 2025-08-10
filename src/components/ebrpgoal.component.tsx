import "./ebrpgoal.component.scss";
import { useOutletContext } from "react-router-dom";
import { IPageLayoutProps } from "../layouts/page.layout";
import { CardDeckHeader } from "./carddeck.component";
import { Card } from "react-bootstrap";
import { Park } from "../services/parks.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircle, faCircleHalfStroke } from "@fortawesome/free-solid-svg-icons";
import { faCircle as faCircleThin  } from "@fortawesome/free-regular-svg-icons";

const parkStatusIcons: Record<string, JSX.Element> = {
  "not-started": <FontAwesomeIcon icon={faCircle} className="text-dark" />,
  "started": <FontAwesomeIcon icon={faCircleThin} className="text-primary" />,
  "halfway": <FontAwesomeIcon icon={faCircleHalfStroke} className="text-primary" />,
  "almost-done": <FontAwesomeIcon icon={faCircle} className="text-primary" />,
  "completed": <FontAwesomeIcon icon={faCircle} className="text-success" />,
  "unknown": <FontAwesomeIcon icon={faCircle} />
};

const getParkStatusIcon = (status: string): JSX.Element => {
  return <span className="fa-li">{parkStatusIcons[status] || parkStatusIcons["unknown"]}</span>;
}

function EBRPGoalList(props: any) {
  const statusMap: Record<string, Array<string>> = {
    todo: ["not-started"],
    doing: ["started", "halfway", "almost-done"],
    done: ["completed"],
  };
  return (
    <div className="ebrp-goal-list">
      <Card.Subtitle>{props.title}</Card.Subtitle>
      <Card.Text>
        {props.ctx.data.parks !== null && (
          <ul className="fa-ul">
            {props.ctx.data.parks.list
              .filter((p: Park) =>
                statusMap[props.status].includes(p.ebrp_goal)
              )
              .map((p: Park, idx: number) => (
                <li key={idx}>
                  {getParkStatusIcon(p.ebrp_goal)}
                  {p.name}
                </li>
              ))}
          </ul>
        )}
      </Card.Text>
    </div>
  );
}

export function EastBayChallengePage(props: any) {
  const ctx: IPageLayoutProps = useOutletContext();
  return ctx.data.parks ? (
    <>
      <CardDeckHeader>
        <Card.Header>East Bay Regional Parks Challenge</Card.Header>
        <Card.Body>
          <p>
            In 2019, in an effort to get off the couch, I started working
            towards hiking all of the trails found on the Trail Brochures for
            the parks in the East Bay Regional Park District.
          </p>
          <EBRPGoalList ctx={ctx} title="Completed Parks" status="done" />
          <EBRPGoalList ctx={ctx} title="In Progress" status="doing" />
          <EBRPGoalList ctx={ctx} title="Not Started" status="todo" />
        </Card.Body>
      </CardDeckHeader>
    </>
  ) : (
    <></>
  );
}
