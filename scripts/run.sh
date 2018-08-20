#!/usr/bin/env bash

PROJECT_ROOT=$(pwd)

cd $PROJECT_ROOT/app
echo "run app in $(pwd)"

METEOR_PACKAGE_DIRS=$PROJECT_ROOT/packages meteor --port=9999
