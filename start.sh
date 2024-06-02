#!/bin/bash

# Seed the database
npm run seed

# Start the server
npm run start

export NODE_OPTIONS="--max-old-space-size=512"

