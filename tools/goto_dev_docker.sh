#!/bin/bash
TOP_DIR=$(pwd -P)
source "${TOP_DIR}/tools/docker_base.sh"

docker exec -it ${DEV_CONTAINER} /bin/zsh

# (echo >&2 -e "[${GREEN}${BOLD} OK ${NO_COLOR}] ")