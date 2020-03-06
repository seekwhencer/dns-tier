import Module from './Global/Module.js';
import Config from './Global/Config.js';
import Storage from './Storage/index.js';
import Presets from './Presets/index.js';
import Network from './Network/index.js';
import Dnsmasq from './Dnsmasq/index.js';
import Hostapd from './Hostapd/index.js';
import Proxy from './Proxy/index.js';

export default class App extends Module {
    constructor() {
        super();
        return new Promise((resolve, reject) => {

            new Config(this)
                .then(config => {
                    this.config = config;
                    return new Storage(this);
                })
                .then(storage => {
                    this.storage = storage;
                    return new Presets(this);
                })
                .then(presets => {
                    this.presets = presets;
                    this.preset = this.presets.preset;
                    return new Network(this);
                })
                .then(network => {
                    this.network = network;
                    return new Dnsmasq(this);
                })
                .then(dnsmasq => {
                    this.dnsmasq = dnsmasq;
                    return new Hostapd(this);
                })
                .then(hostapd => {
                    this.hostapd = hostapd;
                    this.network.activateIPForwarding();
                    this.network.ipTables.configure();
                    return new Proxy(this);
                })
                .then(proxy => {
                    this.proxy = proxy;
                    resolve(this);
                })
        });
    }
}