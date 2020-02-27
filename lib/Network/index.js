import {spawn} from 'child_process';
import Module from '../Global/Module.js';
import InterfaceConfig from './InterfaceConfig.js';

export default class Network extends Module {
    constructor(parent) {
        super();
        return new Promise((resolve, reject) => {
            this.parent = this.app = parent;
            this.options = this.app.preset.data.network;
            this.label = 'NETWORK';

            LOG(this.label, 'INIT');

            this.process = false;
            this.interfaceConfig = false;

            this.on('ready', () => {
                LOG(this.label, '>>> IS RUNNING');
            });

            this
                .createInterfaceConfig()
                .then(() => this.activateIPForwarding())
                .then(() => resolve(this));

        });
    }

    createInterfaceConfig() {
        return new InterfaceConfig(this).then(interfaceConfig => {
            this.interfaceConfig = interfaceConfig;
            return Promise.resolve();
        });
    }

    activateIPForwarding = () =>  this.command('echo', ['1', '>', '/proc/sys/net/ipv4/ip_forward']);
    deactivateIPForwarding = () => this.command('echo', ['0', '>', '/proc/sys/net/ipv4/ip_forward']);

    resolve() {
        const resolvFileData = 'nameserver 127.0.0.1';
        fs.writeFileSync('/etc/resolv.conf', resolvFileData);
    }

    resetResolve = () => this.command('/sbin/resolvconf', ['-u']);

    command(bin, params) {
        return new Promise((resolve, reject) => {
            LOG(this.label, '>>> COMMAND', bin, JSON.stringify(params));
            const process = spawn(bin, params);
            process.stdout.on('end', () => resolve());
        });
    }

    stutdown = () => this.resetResolve();

}