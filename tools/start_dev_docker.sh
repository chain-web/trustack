#!/bin/bash
TOP_DIR=$(pwd -P)
source "${TOP_DIR}/tools/docker_base.sh"

set -u

ok() {
  (echo >&2 -e "[${GREEN}${BOLD} OK ${NO_COLOR}] $*")
}

main() {
  docker run  -idt --privileged --name=${DEV_CONTAINER} -v `pwd`:/work ${DOCKER_IMG}

  ok "Successfully started Docker container [${DEV_CONTAINER}] based on image: [${DOCKER_IMG}]"

  ok "-_-!"
}

main "$@"
