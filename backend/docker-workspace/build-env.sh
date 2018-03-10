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
  apt-get update -qq

  info "Installing packages from pkglist..."
  grep -vE "^#" < pkglist | xargs apt-get -qq install -y

  # Uncomment if you want to install npm packages
  # info "Installing packages from npm-pkglist..."
  # grep -vE "^#" < npm-pkglist | xargs npm install -g

  mkdir /home/user

  info "Installation complete :)"
fi