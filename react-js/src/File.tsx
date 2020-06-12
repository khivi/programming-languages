import React from "react";

interface FileProps {
    index: number;
    iterable: Iterable<number>;
}


export const File: React.FC<FileProps> = (props: FileProps) => {
    const iterable = props.iterable;
    const name = `file${props.index}`;
    const rows = [];
    let i = 0;
    for (const d of iterable) {
        rows.push(<li key={i}> {d}</li>);
        i += 1;
    }
        
    return <div>
        <h1>
            {name}
        </h1>
        <ul>
            {[...rows]}
        </ul>
        </div>;
}



