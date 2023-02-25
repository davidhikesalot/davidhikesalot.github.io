import { useOutletContext } from "react-router-dom";
import { Hike } from "../services/hikes.service";
import { HikeListStats } from "../components/hikelist.component";
import { JournalCards } from "../components/journal.component";
import { IPageLayoutProps } from "../layouts/page.layout";

export function HikesPage(props: any) {
  const ctx: IPageLayoutProps = useOutletContext();
  const hikes: Hike[] = ctx.data.hikes?.completed || [];
  return (
    <div>
      <div className="app-card card mb-2 p-0">
        <h4 className="card-header app-card-header-style">Hiking Journal</h4>
        <div className="card-body p-2">
          <small>
            <HikeListStats hikes={hikes} />
          </small>
        </div>
      </div>
      <JournalCards hikes={hikes} />
    </div>
  );
}
