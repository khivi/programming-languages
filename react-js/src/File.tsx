import React, {useState, useEffect}  from "react";
import {Listener} from './Subscribe';

interface FileProps {
    name: string;
    data: number[];
    subscribe(listener: Listener): void;
}


export const File: React.FC<FileProps> = (props: FileProps) => {
    const subscribe = props.subscribe;
    const [data, setData] = useState(props.data);

    useEffect(() => {
        const listener: Listener = {
            next: () => setData(data => data.slice(1))
        };
        subscribe(listener)

    }, [subscribe]);

    return <div>
        <h1>
            {props.name}
        </h1>
        <ul>
            {data.map((d, i) => <li key={i}> {d} </li>)}
        </ul>
        </div>;
}


