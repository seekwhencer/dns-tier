# dns-tier

![alt text](../master/public/images/mood.jpg?raw=true "Foto #1")

**work in progress**

## installation

At first: you have a fresh installed RPi.

- get the source
```bash
// as user pi

cd /somewhere/on/my/disk
git clone https://github.com/seekwhencer/dns-tier.git
```
- install dependencies:
```bash
sudo apt-get update -y
cd dns-tier
sudo ./install.sh
```

- then install node.js
```bash
cd ~
sudo curl -L https://git.io/n-install | bash
```

- modify root's `.bashrc` file
```bash
sudo su
nano /root/.bashrc
```

- add this line (and yes: this shares the `n` folder with the install user: `pi`)
```
export N_PREFIX="/home/pi/n"; [[ :$PATH: == *":$N_PREFIX/bin:"* ]] || PATH+=":$N_PREFIX/bin"
```

- and logout from the console or source the `.bashrc` file
```bash
exit
sudo su
```
or
```bash
. /root/.bashrc
```
- install it
```bash
// from the admin console if needed

exit
```

```bash
// as user pi

cd dns-tier
npm install
```
## ... at least

- change user (!)
```bash
sudo su
```
- run in dev mode
```bash
npm run dev
```

- run in production
```bash
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