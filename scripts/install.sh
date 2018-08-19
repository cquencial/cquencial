#!/usr/bin/env bash

PROJECT_ROOT=$(pwd)
mkdir -p $PROJECT_ROOT/packages

cd $PROJECT_ROOT/src && meteor npm install
cd $PROJECT_ROOT
