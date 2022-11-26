import React from 'react'
import { useOutletContext } from 'react-router-dom'

export function ParksPage(props: any) {
    const ctx:object = useOutletContext()
    console.log(props.data)
    return (
        <div>
            <h1>Parks</h1>
            <pre>{JSON.stringify(ctx, null, 2)}</pre>
        </div>
    )
}