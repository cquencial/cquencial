#!/usr/bin/env bash


PROJECT_ROOT=$(pwd)

cd $PROJECT_ROOT/src
METEOR_PACKAGE_DIRS=$PROJECT_ROOT/packages meteor add $1

