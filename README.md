p2p-server
==========
[TOC]

Peer 2 Peer Server, this server . Used by Warping to metch the peers to start the stuff sharing.

## config.json
Configuration file where you can set some Peer2Peers Server configurations:
```json
{
	"env": "dev",
	"server": {
		"port": 8000,
		"ping": 30000
	}
}
```

**env** - Environment [ dev / production ]

**server** - Peer 2 Peer Server configurations

**port** - (8000) Server listening port

**ping** - (60000) Ping interval time to detech broken connection on WebSockets