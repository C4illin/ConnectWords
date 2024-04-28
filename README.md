# ConnectWords

An interactive word connection game made with cola.js, d3.js and websockets.

Features:

- Choose words and colors
- Choose connection names and colors
- Supports multiple hosts and clients
- Tested with 100+ clients
- All responses are cached in memory for 24 hours

## How to play

1. Go to https://connectwords.emrik.org/ on a host computer
2. Write the nodes you want in the game and their colors
3. Write the connections you want. If unsure just test with only the default one
4. Join from mobile phones by scanning the QR-code
5. Play!

## Self host

```bash
docker run -d -p 3000:3000 ghcr.io/c4illin/connectwords:main
```

```yaml
# docker-compose.yml

services:
  connectwords:
    image: ghcr.io/c4illin/connectwords:main
    ports:
      - 3000:3000
    environment:
      - CACHE_HOURS=24 # Optional, default 24
```

You probably want to add a reverse proxy in front of it.

### Not docker

1. Clone the repo
2. Install dependencies with `bun install` or `npm install`
3. Start the server with `bun .` or `node .`
4. Visit your local ip on port 3000
