#!/bin/bash

set -e

TOP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "****Java****"
cd $TOP_DIR/java
ant test

echo "****Scala****"
cd $TOP_DIR/scala
sbt test

echo "****Python****"
cd $TOP_DIR/python
nosetests test 

echo "****Golang****"
cd $TOP_DIR/golang
go test -v src/merge/*.go

echo "***NodeJs***"
cd $TOP_DIR/nodejs
npm test

echo "***Typescript***"
cd $TOP_DIR/typescript
gulp default

echo "***ReactJS***"
cd $TOP_DIR/react-js
yarn test
yarn build
