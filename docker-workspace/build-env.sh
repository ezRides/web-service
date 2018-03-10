#!/usr/bin/env bash
set -euo pipefail
IFS=$'\n\t'

#/ Usage: docker build -t docker-workspace .
#/ Description: Installs all the packages on pkglist
#/   --help: Display this help message
usage() { grep '^#/' "$0" | cut -c4- ; exit 0 ; }
expr "$*" : ".*--help" > /dev/null && usage

readonly LOG_FILE="/tmp/$(basename "$0").log"
info()    { echo "[INFO]    $*" | tee -a "$LOG_FILE" >&2 ; }


if [[ "${BASH_SOURCE[0]}" = "$0" ]]; then
  info "Installation complete :)"
fi