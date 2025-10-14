#!/bin/bash
# Startup script for static website

# Install http-server if not exists
if ! command -v http-server &> /dev/null; then
    npm install -g http-server
fi

# Serve static files
cd /home/site/wwwroot
http-server -p 8080 --cors
