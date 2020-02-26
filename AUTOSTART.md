# auto start with PM2

- as root
```
sudo su
```

- installing `pm2` globally
```
npm install pm2 -g
```

- say pm to start with system boot
```
pm2 startup
```

- change into the app folder
```
cd /somewhere/on/my/disk/dns-tier
```

- register and start the app
```
pm2 start "npm run dev" --name "dns-tier"
```

- save this state
```
pm2 save
```

- to restart or something
```
pm2 logs 0
pm2 restart 0
pm2 stop 0
```

The `0` is the id. 

```
pm2 status
```