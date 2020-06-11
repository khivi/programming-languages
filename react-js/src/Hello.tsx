import React, {useState}  from "react";

interface DataProps {
    name: string;
    data: number[];
}


export const Data: React.FC<DataProps> = (props: DataProps) => {
    const [data, setData] = useState(props.data);

    const next = (): void => {
        setData(data => data.slice(1));
    };

    return <div>
        <h1>
            {props.name}
        </h1>
        <ul>
            {data.map((d, i) => <li key={i}> {d} </li>)}
        </ul>
        <button onClick={next}>{props.name}</button>
        </div>;
}



