import Module from '../Global/Module.js';

export default class IPTables extends Module {
    constructor(parent, options) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.options = options;
            this.label = `NETWORK INTERFACE ${this.options.interface}`;

            LOG(this.label, 'INIT');

            this.configData = '';

            this.on('ready', () => {
                LOG(this.label, '>>> IS RUNNING');
            });

            this
                .configure()
                .then(() => resolve(this));
        });
    }

    /**
     * wrapper function to create and save the network configuration
     *
     * @returns {Promise<void>}
     */
    configure() {
        this.createConfig();
        return Promise.resolve();
    }

    /**
     * create the unique configuration block for this interface
     * using the scheme for /etc/network/interfaces
     */
    createConfig() {
        const iface = this.options;
        this.configData = '';

        iface.auto === true ? this.configData += `auto ${iface.interface}\n` : null;
        iface['allow-hotplug'] === true ? this.configData += `allow-hotplug ${iface.interface}\n` : null;

        if (iface.dhcp === true) {
            this.configData += `iface ${iface.interface} inet dhcp\n`;
        } else {
            this.configData += `iface ${iface.interface} inet static\n`;
            if (iface.static) {
                Object.keys(iface.static).forEach(staticOption => {
                    if (typeof iface.static[staticOption] === 'object') {
                        iface.static[staticOption].forEach(field => this.configData += `  ${staticOption} ${field}\n`);
                    } else {
                        iface.static[staticOption] ? this.configData += `  ${staticOption} ${iface.static[staticOption]}\n` : null;
                    }
                });
            }
        }
    }

    /**
     * shutting down a network interface
     *
     * @returns {Promise<any>}
     */
    down = () => this.command('/sbin/ifdown', [this.options.interface, '--force']);

    /**
     * brings up a network interface
     *
     * @returns {Promise<any>}
     */
    up = () => this.command('/sbin/ifup', [this.options.interface]);

    /**
     * refresh a network interface
     * by bringing it down and up
     *
     * @returns {Promise<any | never>}
     */
    renew = () => this.down().then(() => this.up());
}