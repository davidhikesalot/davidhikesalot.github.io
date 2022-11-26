import { useOutletContext } from "react-router-dom"
import { HikeList } from "../components/hike.component"
import { IPageLayoutProps } from "../layouts/page.layout"

export function CompletedPage(props: any) {
    const ctx:IPageLayoutProps = useOutletContext()

    return (
        <HikeList name="Completed" hikes={ctx.data.hikes?.completed} />
    )
}