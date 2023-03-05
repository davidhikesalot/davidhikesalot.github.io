import "./plans.page.scss";
import { useOutletContext } from "react-router-dom";
import { IPageLayoutProps } from "../layouts/page.layout";
import { CardDeckHeader } from "../components/carddeck.component";
import { HikeListCard } from "../components/hikelist.component";

export function PlansPage(props: any) {
  const ctx: IPageLayoutProps = useOutletContext();

  return ctx.data.parks ? (
    <>
      <CardDeckHeader title="Planned Hikes" />
      {ctx.data.parks.nexthikes.length > 0 && (
        <HikeListCard
          title="Next Hikes"
          hikes={ctx.data.parks.nexthikes}
        ></HikeListCard>
      )}
      {ctx.data.parks.planned.length > 0 && (
        <HikeListCard
          title="Planned"
          hikes={ctx.data.parks.planned}
        ></HikeListCard>
      )}
    </>
  ) : (
    <></>
  );
}
