import fs from 'fs-extra';
import Chokidar from 'chokidar';
import Module from '../Global/Module.js';

export default class DnsmasqLeases extends Module {
    constructor(parent) {
        super();
        this.parent = parent;
        this.app = this.parent.app;
        this.label = 'DNSMASQ LEASES';

        LOG(this.label, 'INIT');

        this.on('change-leases', () => {
            LOG(this.label, 'CHANGED', this.parent.runConfig.dhcpFile);
            this.file();
            this.parent.emit('change-leases'); // elevate events
        });
    }

    watch() {
        LOG(this.label, 'START WATCHING FILE:', this.parent.runConfig.dhcpFile);
        this.watcher = Chokidar.watch(this.parent.runConfig.dhcpFile).on('all', (event, path) => {
            this.emit(`${event}-leases`);
        });
    }

    file() {
        fs.readFile(this.parent.runConfig.dhcpFile).then(data => {
            LOG(this.label, 'LEASE FILE:', data.toString());
        });
    }
}