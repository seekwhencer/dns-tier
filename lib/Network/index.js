import fs from 'fs-extra';
import {spawn} from 'child_process';
import Module from '../Global/Module.js';
import InterfaceConfig from './InterfaceConfig.js';
import IPTables from './IPTables.js';

export default class Network extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.options = this.app.preset.data.network;
            this.label = 'NETWORK';

            LOG(this.label, 'INIT');

            this.interfaceConfig = false;
            this.ipTables = false;

            this.on('ready', () => {
                LOG(this.label, '>>> IS RUNNING');
            });

            // its a test to make a function "private" or hide from enumerable
            PROP(this, 'testFunc', {
                value: this.testFunc
            });

            LOG('??????????????', this.testFunc());

            this
                .createInterfaceConfig()
                .then(() => this.getInterfaces())
                .then(() => this.activateIPForwarding())
                .then(() => this.initIPTables())
                .then(() => this.resolve())
                .then(() => resolve(this));

        });
    }

    testFunc() {
        return 'MUH';
    }

    createInterfaceConfig() {
        return new InterfaceConfig(this).then(interfaceConfig => {
            this.interfaceConfig = interfaceConfig;
            return Promise.resolve();
        });
    }

    toggleIPForwarding = state => {
        return Promise.all([
            this.command('/sbin/sysctl', [`net.ipv4.ip_forward=${state}`]),
            this.command('/sbin/sysctl', [`net.ipv6.conf.default.forwarding=${state}`]),
            this.command('/sbin/sysctl', [`net.ipv6.conf.all.forwarding=${state}`])
        ]);
    };

    activateIPForwarding = () => this.toggleIPForwarding(1);
    deactivateIPForwarding = () => this.toggleIPForwarding(0);

    resolve() {
        const resolvFileData = 'nameserver 127.0.0.1';
        return fs.writeFileSync('/etc/resolv.conf', resolvFileData);
    }

    resetResolve = () => this.command('/sbin/resolvconf', ['-u']);

    command(bin, params) {
        return new Promise((resolve, reject) => {
            LOG(this.label, '>>> COMMAND', bin, JSON.stringify(params));
            let data = '';
            const process = spawn(bin, params);
            process.stdout.on('data', chunk => data += chunk);
            process.stdout.on('end', () => resolve(data));
        });
    }

    stutdown = () => this.resetResolve();
    getInterfaces = () => this.command('/sbin/ifconfig');
    initIPTables = () => new IPTables(this);

}