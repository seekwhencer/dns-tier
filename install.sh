#!/bin/sh
sudo apt-get update -y
sudo apt-get install hostapd dnsmasq iptables git curl make -y
sudo systemctl stop dnsmasq
sudo systemctl stop hostapd
sudo systemctl disable dnsmasq
sudo systemctl disable hostapd
sudo systemctl daemon-reload
