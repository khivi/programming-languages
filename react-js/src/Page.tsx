import React, {useMemo} from 'react';

import {File} from './File';
import {Output} from './Output';

interface PageProps {
    iterables: Iterable<number>[];
}


export const Page: React.FC<PageProps> = (props: PageProps) =>   {
  const iterables = props.iterables;

  const files = useMemo(() => {
      return iterables.map((iterable, index) => {
        return <File key={index} index={index} iterable={iterable} />;
        });
  }, [iterables]);

  return (
    <div className="Page">
      {[...files]}
      <Output iterables={iterables}/>
    </div>
  );
}
