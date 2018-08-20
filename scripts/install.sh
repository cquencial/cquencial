#!/usr/bin/env bash

PROJECT_ROOT=$(pwd)
mkdir -p $PROJECT_ROOT/packages

# clone each repo manually instead of
# messing around with submodules for now
cd $PROJECT_ROOT/packages

git clone git@github.com:cquencial/meteor-bpmn-engine.git
git clone git@github.com:cquencial/meteor-bpmn-instances.git
git clone git@github.com:cquencial/meteor-bpmn-persistence.git
git clone git@github.com:cquencial/meteor-bpmn-history.git
git clone git@github.com:cquencial/meteor-bpmn-tasks.git

cd $PROJECT_ROOT/src && meteor npm install
cd $PROJECT_ROOT
