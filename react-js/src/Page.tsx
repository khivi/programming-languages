import React from 'react';

import {useSubscriber} from './Subscribe';
import {File} from './File';
import {Output} from './Output';

interface PageProps {
    data: number[][];
}


export const Page: React.FC<PageProps> = (props: PageProps) =>   {
  const {listeners, subscribe} = useSubscriber();


  const files = props.data.map((row, index) => {
      const name = `file${index}`
      return <File key={index} name={name} data={row} subscribe={subscribe}/>;
  });

  return (
    <div className="Page">
      {[...files]}
      <Output listeners={listeners}/>
    </div>
  );
}
