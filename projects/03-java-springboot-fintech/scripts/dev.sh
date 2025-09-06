#!/usr/bin/env bash
set -euo pipefail
mvn spring-boot:run -Dspring-boot.run.jvmArguments="-Dserver.port=3003"
