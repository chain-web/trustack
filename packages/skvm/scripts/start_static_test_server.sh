#!/bin/bash

if type sfz >/dev/null 2>&1; then
  sfz ./tests
else
  echo 'no sfz, installing'
  cargo install sfz && sfz ./tests
fi

