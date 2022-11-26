import {Hike, HikeStats} from '../services/hikes.service'

export function HikeListItemStats(props: any) {
    return <span>({props.hike.stats.distance}mi, {props.hike.stats.elevation}ft gain)</span>
}

function HikeListItem(props: {hike: Hike, whatever: string}) {
    return (
        <li>
            <span>{props.hike.get('parkname')}</span> 
            <a href={props.hike.get("mapurl")} rel="noreferrer" target="_blank">{props.hike.get("hikename")}</a>
            <span>({props.hike.stats.distance}mi, {props.hike.stats.elevation}ft gain)</span>
        </li>
    )
}

function HikeListItems(props: any) {
    const hikes: Hike[] = props.hikes || []

    return (
        <ul className="hike-list-items">
            {hikes.map(hike => <HikeListItem hike={hike} whatever="hello" />)}
        </ul>
    )
}


function HikeListStats(props: any) {
    const stats: HikeStats = new HikeStats()
    props.hikes?.forEach((h:Hike) => stats.add(h.stats))
    return (
        <div className="hike-list-stats">
            {stats.num_hikes} hikes / {stats.distance} miles / {stats.elevation} feet elevation
        </div>
    )
}

export function HikeList(props: any) {
    const name: string = props.name
    const hikes: Hike[] = props.hikes || []

    return (
        <div className="hike-list">
            <h5 className="hike-list-name">{name}</h5>
            <HikeListStats hikes={hikes} />
            <HikeListItems hikes={hikes} />
        </div>
    )
}