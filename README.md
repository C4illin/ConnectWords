# ConnectWords

An interactive word connection game made with cola.js, d3.js and websockets.

Features:
* Choose words and colors
* Choose connection names and colors
* Supports multiple hosts and clients
* Tested with 100+ clients

## How to play

1. Go to https://connectwords.emrik.org/ on a host computer
2. Write the nodes you want in the game and their colors
3. Write the connections you want. If unsure just test with only the default one
4. Join from mobile phones by scanning the QR-code
5. Play!

## Self host

```yaml
# docker-compose.yml

services:
  connectwords:
    image: ghcr.io/c4illin/connectwords:main
    restart: unless-stopped
    ports:
      - 3000:3000

```

You can also download the source code and run the `server.js` file after installing everything with npm/bun install. But docker is probably easier.
