#!/bin/sh

prev_HEAD="$1"
new_HEAD="$2"
new_branch="$3"

echo $prev_HEAD
echo $new_HEAD
echo $new_branch

if [ "$new_branch" = "master" ]; then
    echo "show " | git pull
fi

exit 0
