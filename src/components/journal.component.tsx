import { Hike, HikeStats } from "../services/hikes.service";
import { Link } from "react-router-dom";
import { format as dateFormat } from "date-fns";

function HikesJournalEntryStats({ hikeStats }: { hikeStats: HikeStats }) {
  return (
    <div className="hike-entry-sidebar">
      <div className="hike-entry-header">{hikeStats.rating}</div>
      <div className="hike-entry-sidebar-main">{hikeStats.distance}</div>
      <div className="hike-entry-sidebar-footer">{hikeStats.elevation}'</div>
    </div>
  );
}

function HikesJournalEntryDate({ hikeDateStr }: { hikeDateStr: string }) {
  const hikeDate = new Date(hikeDateStr);
  return hikeDate.toString() === "Invalid Date" ? (
    <div className="hike-entry-sidebar">
      <div className="hike-entry-header">{hikeDateStr}</div>
    </div>
  ) : (
    <time className="hike-entry-sidebar" dateTime={dateFormat(hikeDate, "L")}>
      <div className="hike-entry-header">
        {dateFormat(hikeDate, "MMM")} {dateFormat(hikeDate, "yyyy")}
      </div>
      <div className="hike-entry-sidebar-main">
        {dateFormat(hikeDate, "dd")}
      </div>
      <div className="hike-entry-sidebar-footer">
        {dateFormat(hikeDate, "EEEE")}
      </div>
    </time>
  );
}

function HikesJournalEntry({ hike }: { hike: Hike }) {
  const href =
    hike.get("blogposturl") ||
    hike.get("photoalbumurl") ||
    hike.get("mapurl") ||
    "";
  const gotoLink = () => (window.location.href = href);
  return (
    <button className="hike-entry card flex-row mb-2">
      <div className="card-header p-0 border-0">
        <HikesJournalEntryDate hikeDateStr={hike.get("hikedate")} />
      </div>
      <div className="card-body hike-entry-body p-0 border-0">
        <div className="hike-entry-header">{hike.get("hikename")}</div>
        <div className="hike-entry-main">
          <div>{hike.parkAddress}</div>
          <div>{hike.get("teaser")}</div>
        </div>
      </div>
      <div className="card-footer p-0 border-0">
        <HikesJournalEntryStats hikeStats={hike.stats} />
      </div>
    </button>
  );
}

export function HikesJournalEntries({ hikes = [] }: { hikes?: Hike[] }) {
  return (
    <div className="hike-list-items">
      {hikes
        .sort((a: Hike, b: Hike) => b.date.valueOf() - a.date.valueOf())
        .map((hike, index) => (
          <HikesJournalEntry key={`entry-${index}`} hike={hike} />
        ))}
    </div>
  );
}
