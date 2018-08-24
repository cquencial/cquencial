#!/usr/bin/env bash

PROJECT_ROOT=$(pwd)

cd $PROJECT_ROOT/packages
for D in *; do
    if [ -d "${D}" ]; then
        echo "${D}"
        METEOR_PACKAGE_DIRS=$PROJECT_ROOT/packages meteor test-packages --once "$PROJECT_ROOT/packages/${D}" --driver-package  meteortesting:mocha
    fi
done