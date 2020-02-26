# dns-tier

**work in progress**

## installation

At first: you have a fresh installed RPi.

- install dependencies:
```
sudo apt-get update -y
sudo apt-get install git make curl -y
```

- then install node.js
```
cd ~
sudo curl -L https://git.io/n-install | bash
```

- modify root's `.bashrc` file
```
sudo su
nano /root/.bashrc
```

- add this line (and yes: this shares the `n` folder with the install user: `pi`)
```
export N_PREFIX="/home/pi/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"
```

- and logout from the console or source the `.bashrc` file
```
exit
sudo su
```
or
```
. /root/.bashrc
```

- get the source
```
// from the admin console if needed

exit
```
```
// as user pi

cd /somewhere/on/my/disk
git clone https://github.com/seekwhencer/dns-tier.git
```

- install it
```
// as user pi

cd dns-tier
npm install
```
## ... at least

- change user (!)
```
sudo su
```
- run in dev mode
```
npm run dev
```

- run in production
```
npm start 

// or

npm run prod
```

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