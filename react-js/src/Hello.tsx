
import React from "react";

interface HelloProps {
    name?: string;
}

const Hello: React.FC<{name?: string}> = ({name}) =>   {
  if (name) {
    return <h1>Hello, {name}!</h1>;
  } else {
    return <span>Hey, stranger</span>;
  }
}

export default Hello;

