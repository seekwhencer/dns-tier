import fs from 'fs-extra';
import Module from '../Global/Module.js';

export default class NetworkInterfaceConfig extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.options = this.app.preset.data.network;
            this.label = 'NETWORK INTERFACES CONFIG';

            this.path = `${this.app.preset.path}/run`;
            this.file = `/etc/network/interfaces`;

            LOG(this.label, 'INIT');

            this.fileData = '';

            this
                .create()
                .then(() => resolve(this));
        });
    }

    /**
     * create and save the network interfaces configuration file
     * in /etc/network/interfaces by iterating all interfaces
     * and using their configData
     *
     * @returns {Promise<void>}
     */
    create() {
        LOG(this.label, 'CREATE CONFIG FILE', this.file);
        this.fileData = '\n# this file is managed by dns-tier\n# don\'t touch it manually\n\n';
        this.fileData += `auto lo\n`;
        this.fileData += `iface lo inet loopback\n`;
        this.fileData += `\n`;
        this.parent.interfaces.forEach(iface => this.fileData += `${iface.configData} \n`);
        return fs.writeFile(this.file, this.fileData);
    }
}