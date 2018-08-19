#!/usr/bin/env bash

METEOR_PACKAGE_DIRS=./ TEST_WATCH=1 meteor ./ackages/test-packages/$1 --driver-package  meteortesting:mocha