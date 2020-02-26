# dns-tier

**work in progress**

## acceptance criterias

- wifi access point (hostapd)
- with multiple wifi interfaces
- runs on a raspberry pi
- as dhcp server (dnsmasq)
- as internet gateway
- as mobile (off grid) internet gateway
- as local domain
- as firewall (iptables)
- with proxy (node.js) for subdomains, routed to different ports
- routed from bare metal
- routed from docker
- easy domain name mapping
- with web ui
- with presets for multiple scenarios (key feature)
- using node.js
- running as compiled binary

## What is working at the moment?

- presets, load and save as `json` files
- create run config for hostapd as `hostapd.conf`
- create run config for dnsmasq as `dnsmasq.conf`
- create network interfaces file in `/etc/network/interfaces`
- managing `iptables`

## Working on:
- managing ip4 forward
- managing `/etc/resolv.conf`

This opens a wifi access point with the given configuration.
To modify the configuration, go into the folder `storage/presets/default` and edit manually the stored `json` files.
But: later these files will be modified by the app.  
 
To change the super global configuration, edit the files from the `config/` folder.  
 
To change the environment, edit `config/app.json`.