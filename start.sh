#!/bin/bash

## find the dir of the script
bindir="$(dirname "$(readlink -fn "$0")")"

function start() {
    echo "Startup checks successful."
    node app.js
    exit 0
}

function fail() {
    echo "Startup checks exiting with errors."
    exit 1
}




# see if there is a config file
if [[ -f $bindir/config.json ]]; then
    start
    
else
    # no config file exists. create one
    echo 'What port do you want node to run on?:'
    read port
    
    touch $bindir/config.json
    echo "{"                   >> $bindir/config.json
    echo "  \"port\": \"$port\""         >> $bindir/config.json
    echo "}"                   >> $bindir/config.json

    if [[ $? -eq 0 ]]; then
        # there were no errors generating config
        start
    else
        fail
    fi
fi



