import { useOutletContext } from "react-router-dom";
import { isBefore } from "date-fns";
import { Hike } from "../services/hikes.service";
import { HikeDeck } from "../components/hikedeck.component";
import { IPageLayoutProps } from "../layouts/page.layout";

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

export function HikesPage(props: any) {
  const ctx: IPageLayoutProps = useOutletContext();
  const hikes: Hike[] = (ctx.data.hikes?.completed || []).sort(
    (a: Hike, b: Hike) => compareHikeDates(a, b)
  );
  return <HikeDeck title="Hiking Journal" hikes={hikes} />;
}
