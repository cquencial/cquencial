#!/usr/bin/env bash

PROJECT_ROOT=$(pwd)
METEOR_PACKAGE_DIRS=$PROJECT_ROOT/packages TEST_WATCH=1 meteor test-packages $1 --driver-package  meteortesting:mocha