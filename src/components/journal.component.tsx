import { Hike, HikeStats } from "../services/hikes.service";
import { format as dateFormat, isBefore } from "date-fns";

function HikesJournalEntryStats({ hikeStats }: { hikeStats: HikeStats }) {
  return (
    <div className="hike-entry-sidebar">
      <div className="hike-entry-header">{hikeStats.rating}</div>
      <div className="hike-entry-sidebar-main">{hikeStats.distance}</div>
      <div className="hike-entry-sidebar-footer">{hikeStats.elevation}'</div>
    </div>
  );
}

function HikesJournalEntryDate({ hike }: { hike: Hike }) {
  if (!hike.date) {
    const hikeDateText = hike.get("hikedate");
    return hikeDateText ? (
      <div className="hike-entry-sidebar">
        <div className="hike-entry-header">{hike.get("hikedate")}</div>
      </div>
    ) : (
      <></>
    );
  }

  return (
    <time className="hike-entry-sidebar" dateTime={dateFormat(hike.date, "L")}>
      <div className="hike-entry-header">
        {dateFormat(hike.date, "MMM")} {dateFormat(hike.date, "yyyy")}
      </div>
      <div className="hike-entry-sidebar-main">
        {dateFormat(hike.date, "dd")}
      </div>
      <div className="hike-entry-sidebar-footer">
        {dateFormat(hike.date, "EEEE")}
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
    <button
      className="hike-entry card flex-row mb-2"
      onClick={() => gotoLink()}
    >
      <div className="card-header p-0 border-0">
        <HikesJournalEntryDate hike={hike} />
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

  return (
    <div className="hike-list-items">
      {hikes
        .sort((a: Hike, b: Hike) => compareHikeDates(a, b))
        .map((hike, index) => (
          <HikesJournalEntry key={`entry-${index}`} hike={hike} />
        ))}
    </div>
  );
}
