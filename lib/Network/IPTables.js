import {spawn} from 'child_process';
import Module from '../Global/Module.js';

export default class IPTables extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = parent;
            this.app = this.parent.app;
            this.options = this.app.preset.data.iptables;
            this.label = 'IPTABLES';

            LOG(this.label, 'INIT');

            this.on('ready', () => {
                LOG(this.label, '>>> IS RUNNING');
            });

            this
                .configure()
                .then(() => resolve(this));
        });
    }

    /**
     * do some initially things
     *
     * - flush existing rules
     * - set post route
     * - set all forward routes
     *
     * @returns {Promise<[any, any[], any[]]>}
     */
    configure() {
        return Promise.all([
            this.flush(),
            this.setup(this.options.config.from, this.options.config.to)
        ]);
    }

    /**
     *
     * @returns {Promise<any>}
     */
    flush() {
        return Promise.all([
            this.command(['-P', 'INPUT', 'ACCEPT']),
            this.command(['-P', 'FORWARD', 'ACCEPT']),
            this.command(['-P', 'OUTPUT', 'ACCEPT']),
            this.command(['-t', 'nat', '-F']),
            this.command(['-t', 'mangle', '-F']),
            this.command(['-F']),
            this.command(['-X'])
        ]);
    }

    /**
     *
     * @param from
     * @returns {Promise<any[]>}
     */
    /**
     *
     * @param from
     * @param to    Array
     * @returns {Promise<[any, any, any, any, any, any, any, any, any, any]>}
     */
    setup(from, to) {
        let proms = [];

        // any interface can talk to the internet
        to.forEach(iface => {
            proms.push(this.command(['-A', 'FORWARD', '-o', from.name, '-i', iface.name, '-s', iface.network, '-m', 'conntrack', '--ctstate', 'NEW', '-j', 'ACCEPT']));

            if (iface.name !== 'eth1') {
                proms.push(this.command(['-A', 'FORWARD', '-o', 'eth1', '-i', iface.name, '-s', iface.network, '-m', 'conntrack', '--ctstate', 'NEW', '-j', 'ACCEPT']));
                proms.push(this.command(['-A', 'FORWARD', '-o',  iface.name, '-i', 'eth1', '-s', iface.network, '-m', 'conntrack', '--ctstate', 'NEW', '-j', 'ACCEPT']));
            }
        });

        proms.push(this.command(['-A', 'FORWARD', '-m', 'conntrack', '--ctstate', 'ESTABLISHED,RELATED', '-j', 'ACCEPT']));
        proms.push(this.command(['-t', 'nat', '-F', 'POSTROUTING']));
        proms.push(this.command(['-t', 'nat', '-A', 'POSTROUTING', '-o', from.name, '-j', 'MASQUERADE']));

        return Promise.all(proms);
    }

    /**
     * wrapper command function to set the default binary
     *
     * @param params
     * @returns {Promise<any>}
     */
    command = params => super.command(this.app.config.bin.iptables, params);
}