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
    echo -e '\n-- NODE INSTANCE --'
    echo 'What port do you want node to run on?:'
    read port

    echo -e '\n-- EXTERNAL AUTHENTICATION STRATEGIES --'

    echo 'What is your 37signals client ID?'
    read thirty7clientid

    echo 'What is your 37signals client Secret?'
    read thirty7clientsecret

    echo 'What is your 37signals callback URL? (A route here in nodejs that gets called when 37signals auth is successful)'
    read thirty7callbackurl


    
    touch $bindir/config.json
    echo "{"                                                         >> $bindir/config.json
    echo "  \"PORT\"                 : \"$port\"",                   >> $bindir/config.json
    echo "  \"THIRTY7CLIENTID\"      : \"$thirty7clientid\"",        >> $bindir/config.json
    echo "  \"THIRTY7CLIENTSECRET\"  : \"$thirty7clientsecret\"",    >> $bindir/config.json
    echo "  \"THIRTY7CALLBACKURL\"   : \"$thirty7callbackurl\""      >> $bindir/config.json
    echo "}"                                                         >> $bindir/config.json

    if [[ $? -eq 0 ]]; then
        # there were no errors generating config
        start
    else
        fail
    fi
fi



