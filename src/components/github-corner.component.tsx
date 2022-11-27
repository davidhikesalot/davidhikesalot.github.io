import './github-corner.component.css'
import { ReactSVG } from 'react-svg'
import svg from './github-corner.svg'

export function GitHubCorner(props: any) {
    return (
        <a href="https://github.com/davidhikesalot/davidhikesalot.github.io" className="github-corner" aria-label="View source on GitHub">
            <ReactSVG src={svg} />
        </a>
    )
}
