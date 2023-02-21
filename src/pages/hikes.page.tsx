import { useOutletContext } from "react-router-dom";
import { Hike } from "../services/hikes.service";
import { HikeListStats } from "../components/hike.component";
import { HikesJournalEntries } from "../components/journal.component";
import { IPageLayoutProps } from "../layouts/page.layout";

export function HikesPage(props: any) {
  const ctx: IPageLayoutProps = useOutletContext();
  const hikes: Hike[] = ctx.data.hikes?.completed || [];
  return (
    <div className="hikes-journal">
      <div className="card mb-2 p-0">
        <div className="card-body p-2">
          <h5>Hiking Journal</h5>
          <small>
            <HikeListStats hikes={hikes} />
          </small>
        </div>
      </div>
      <HikesJournalEntries hikes={hikes} />
    </div>
  );
}
