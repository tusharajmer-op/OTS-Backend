#!/bin/bash
APP_NAME=still-wave-99760

if [ ! -f .env ]; then
  echo ".env file not found!"
  exit 1
fi

while IFS= read -r line || [[ -n "$line" ]]; do
  if [[ ! "$line" =~ ^# && "$line" =~ = ]]; then
    varname=$(echo "$line" | cut -d '=' -f 1)
    varvalue=$(echo "$line" | cut -d '=' -f 2-)
    echo "Setting $varname..."
    heroku config:set "$varname=$varvalue" -a $APP_NAME
  fi
done < .env
