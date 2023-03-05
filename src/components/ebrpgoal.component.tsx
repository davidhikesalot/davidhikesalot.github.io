import "./ebrpgoal.component.scss";
import { useOutletContext } from "react-router-dom";
import { IPageLayoutProps } from "../layouts/page.layout";
import { CardDeckHeader } from "./carddeck.component";
import { Card } from "react-bootstrap";
import { Park } from "../services/parks.service";

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
          <ul>
            {props.ctx.data.parks.list
              .filter((p: Park) =>
                statusMap[props.status].includes(p.ebrp_goal)
              )
              .map((p: Park) => (
                <li>
                  <span className={`fa-li ebrp-goal-${p.ebrp_goal}`}></span>
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
          <EBRPGoalList ctx={ctx} title="Completed Hikes" status="done" />
          <EBRPGoalList ctx={ctx} title="In Progress" status="doing" />
          <EBRPGoalList ctx={ctx} title="Not Started" status="todo" />
        </Card.Body>
      </CardDeckHeader>
    </>
  ) : (
    <></>
  );
}
