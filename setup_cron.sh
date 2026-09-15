#!/bin/bash

# Setup cron job to run icecat_sync.py every night at 03:00

# Get the absolute path to the project directory
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_PATH="$PROJECT_DIR/scripts/icecat_sync.py"
PYTHON_BIN="$(which python3 || which python)"

if [ -z "$PYTHON_BIN" ]; then
    echo "Python is not installed or not found in PATH."
    exit 1
fi

# The cron job command
CRON_CMD="0 3 * * * cd $PROJECT_DIR && $PYTHON_BIN $SCRIPT_PATH >> $PROJECT_DIR/icecat_sync.log 2>&1"

# Check if the cron job already exists
(crontab -l 2>/dev/null | grep -q "$SCRIPT_PATH")

if [ $? -eq 0 ]; then
    echo "Cron job for icecat_sync.py already exists."
else
    # Append the new cron job to the user's crontab
    (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
    echo "Cron job added successfully. icecat_sync.py will run every night at 03:00."
fi
