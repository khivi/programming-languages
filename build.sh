#!/bin/bash

set -e

TOP_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "****Java****"
cd $TOP_DIR/java
ant test

