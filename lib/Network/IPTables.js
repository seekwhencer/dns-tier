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
            this.postroute(this.options.config.from),
            this.forward(this.options.config.from, this.options.config.to)
        ]);
    }

    /**
     *
     * @returns {Promise<any>}
     */
    flush = () => this.command(['-F']);

    /**
     *
     * @param from
     * @returns {Promise<any[]>}
     */
    postroute(from) {
        return Promise.all([
            this.command(['-t', 'nat', '-A', 'POSTROUTING', '-o', from, '-j', 'MASQUERADE']),
        ]);
    }

    /**
     *
     * @param from
     * @param to    Array
     * @returns {Promise<[any, any, any, any, any, any, any, any, any, any]>}
     */
    forward(from, to) {
        let proms = [];
        to.forEach(iface => {
            proms.push(this.command(['-A', 'FORWARD', '-i', from, '-o', iface, '-m', 'state', '--state', 'RELATED,ESTABLISHED', '-j', 'ACCEPT']));
            proms.push(this.command(['-A', 'FORWARD', '-i', iface, '-o', from, '-j', 'ACCEPT']));
        });
        proms.push(this.command(['-A', 'INPUT', '-j', 'ACCEPT', '>>', '/dev/null', '2>&1']));
        proms.push(this.command(['-A', 'OUTPUT', '-j', 'ACCEPT', '>>', '/dev/null', '2>&1']));
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