import { useOutletContext } from "react-router-dom"
import { HikeList } from "../components/hike.component"
import { IPageLayoutProps } from "../layouts/page.layout"

export function PlansPage(props: any) {
    const ctx:IPageLayoutProps = useOutletContext()

    return (
        <>
        <HikeList name="Next Hikes" hikes={ctx.data.hikes?.nexthikes} />
        <hr />
        <HikeList name="Planned" hikes={ctx.data.hikes?.planned} />
        </>
    )
}