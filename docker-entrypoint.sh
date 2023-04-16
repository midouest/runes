#!/usr/bin/env bash
set -e

EMSDK_QUIET=1 . /emsdk/emsdk_env.sh

exec "$@"
