#!/bin/bash

echo "seeding roles"
npm run seed-prod:roles

echo "seeding admin acc"
npm run seed-prod:admin

echo "Starting App"

npm run start:prod