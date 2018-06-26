#!/usr/bin/env bash

set -ex
project_root_dir="$( cd "$(dirname "$0")" ; pwd -P )"


cd "$project_root_dir"
rm -rfv ./dist
npm run build:gh-pages


cd "$project_root_dir/../Futbol_gh-pages"
rm -rfv ./*

cp -rv "$project_root_dir/dist"/* .


git add .
git config commit.gpgSign false
git commit -m "Build for github pages"
git config commit.gpgSign true
git push


cd "$project_root_dir"
