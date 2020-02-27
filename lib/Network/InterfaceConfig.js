import fs from 'fs-extra';
import Module from '../Global/Module.js';

export default class NetworkInterfaceConfig extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.options = this.app.preset.data.network;
            this.label = 'NETWORK INTERFACE CONF';

            this.path = `${this.app.preset.path}/run`;
            this.file = `/etc/network/interfaces`;

            LOG(this.label, 'INIT');

            this
                .save()
                .then(() => resolve(this));
        });
    }

    save() {
        LOG(this.label, 'CREATE CONFIG FILE', this.file);

        let fileData = '\n# this file is managed by dns-tier\n# don\'t touch it manually\n\n';

        fileData += `auto lo\n`;
        fileData += `iface lo inet loopback\n`;
        fileData += `\n`;

        Object.keys(this.options).forEach(key => {
            const iface = this.options[key];

            iface.auto === true ? fileData += `auto ${iface.interface}\n` : null;
            iface['allow-hotplug'] === true ? fileData += `allow-hotplug ${iface.interface}\n` : null;

            if (iface.dhcp === true) {
                fileData += `iface ${iface.interface} inet dhcp\n`;
            } else {
                fileData += `iface ${iface.interface} inet static\n`;
                if (iface.static) {
                    //
                    Object.keys(iface.static).forEach(staticOption => {
                        if (typeof iface.static[staticOption] === 'object') {
                            iface.static[staticOption].forEach(field => fileData += `  ${staticOption} ${field}\n`);
                        } else {
                            iface.static[staticOption] ? fileData += `  ${staticOption} ${iface.static[staticOption]}\n` : null;
                        }
                    });
                }
            }
            fileData += `\n`;
        });

        return fs.writeFile(this.file, fileData);
    }
}