#!/bin/bash
if [ -x "$(command -v cf)" ]; then
  echo "Existing CF-Cli installation found. Skipping installation."
else
    echo "Installing cf7-cli"
    wget -q -O - https://packages.cloudfoundry.org/debian/cli.cloudfoundry.org.key | apt-key add -
    echo "deb https://packages.cloudfoundry.org/debian stable main" | tee /etc/apt/sources.list.d/cloudfoundry-cli.list
    apt-get update
    apt-get install cf7-cli
fi
