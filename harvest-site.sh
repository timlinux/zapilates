#!/usr/bin/env bash
nix-shell -p httrack --command "httrack 'https://cantolyrico.com/' \
  '+cantolyrico.com/*' \
  '+assets.squarespace.com/*' \
  '+static1.squarespace.com/*' \
  '+images.squarespace-cdn.com/*' \
  '+use.typekit.net/*' \
  '+fonts.squarespacecdn.com/*' \
  '-*/(api|commerce|cart|checkout|config|Account|login|search)*' \
  -O ./cantolyrico-mirror -%v --near "

