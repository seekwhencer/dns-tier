import fs from 'fs-extra';
import Module from '../Global/Module.js';

export default class Dnsmasqfile extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.options = this.app.preset.data.dnsmasq;
            this.label = 'DNSMASQ CONF';

            this.path = `${this.app.preset.path}/run`;
            this.file = `${this.path}/dnsmasq.conf`;

            LOG(this.label, 'INIT');

            this
                .save()
                .then(() => resolve(this));
        });
    }

    save() {
        LOG(this.label, 'CREATE CONFIG FILE', this.file);
        const config = this.options.config;
        const dynamic = this.options.dynamic;

        let fileData = '\n# this file is managed by dns-tier\n# don\'t touch it manually\n\n';
        Object.keys(config).forEach(key => {
            const item = config[key];
            typeof item === 'boolean' ? item === true ? fileData += `${key}\n` : null : null;
            typeof item === 'string' ? fileData += `${key}=${item}\n` : null;
            typeof item === 'object' ? item.forEach(row => fileData += `${key}=${row}\n`) : null;
        });

        dynamic["dhcp-leasefile"] === true ? fileData += `dhcp-leasefile=${this.path}/dhcp.leases\n` : null;
        dynamic["conf-dir"] === true ? fileData += `conf-dir=${this.path}/mapping/,*.conf\n` : null;

        return fs.writeFile(this.file, fileData);
    }
}