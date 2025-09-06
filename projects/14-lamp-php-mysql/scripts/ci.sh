#!/usr/bin/env bash
set -euo pipefail
sudo apt-get update && sudo apt-get install -y php php-cli php-mysql php-xml composer
composer install --no-interaction
./vendor/bin/phpunit tests/
