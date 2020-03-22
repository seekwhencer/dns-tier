import fs from 'fs-extra';
import {spawn} from 'child_process';
import Module from '../Global/Module.js';
import InterfaceConfig from './InterfaceConfig.js';
import IPTables from './IPTables.js';
import Interface from "./Interface.js";

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
            this.interfaces = [];

            this.on('ready', () => {
                LOG(this.label, '>>> IS RUNNING');
            });

            this
                .init()
                .then(() => resolve(this));

        });
    }

    /**
     * all together
     * @returns {PromiseLike<T | never>}
     */
    init() {
        return this.createInterfaces()
            .then(() => this.createInterfaceConfig())
            .then(() => this.getInterfaces())
            .then(() => this.activateIPForwarding())
            .then(() => this.createIPTables())
            .then(() => this.resolve());
    }

    /**
     * entry for creation cycle
     *
     * @param index
     * @returns {PromiseLike<T | never> | Promise<T | never>|Promise<void>}
     */
    createInterfaces(index) {
        !index ? index = 0 : null;
        const name = Object.keys(this.options)[index];
        if (!name) {
            LOG(this.label, this.interfaces.length, 'INTERFACES CREATED');
            return Promise.resolve();
        } else {
            return this.createInterface(index).then(() => {
                return this.createInterfaces(index + 1);
            });
        }
    }

    /**
     * create one network interface
     *
     * @param index
     * @returns {PromiseLike<void | never> | Promise<void | never>}
     */
    createInterface(index) {
        const name = Object.keys(this.options)[index];
        const presetData = this.options[name];

        if (presetData.enable === false)
            return Promise.resolve();

        return new Interface(this, presetData).then(iface => {
            this.interfaces.push(iface);
            return Promise.resolve();
        });
    }

    /**
     * create the final interfaces configuration (object)
     * in /etc/network/interfaces
     *
     * @returns {PromiseLike<void | never> | Promise<void | never>}
     */
    createInterfaceConfig() {
        return new InterfaceConfig(this).then(interfaceConfig => {
            this.interfaceConfig = interfaceConfig;
            return Promise.resolve();
        });
    }

    /**
     * toggle the ip forwarding on and off
     *
     * @param state
     * @returns {Promise<[any, any, any]>}
     */
    toggleIPForwarding = state => {
        return Promise.all([
            this.command('/sbin/sysctl', [`net.ipv4.ip_forward=${state}`]),
            this.command('/sbin/sysctl', [`net.ipv6.conf.default.forwarding=${state}`]),
            this.command('/sbin/sysctl', [`net.ipv6.conf.all.forwarding=${state}`])
        ]);
    };

    /**
     * turn ip forwarding on
     *
     * @returns {Promise<any[]>}
     */
    activateIPForwarding = () => this.toggleIPForwarding(1);

    /**
     * turn ip forwarding off
     *
     * @returns {Promise<any[]>}
     */
    deactivateIPForwarding = () => this.toggleIPForwarding(0);

    /**
     * set the dns for the local environment
     * (not for the clients)
     *
     * @returns {*}
     */
    resolve() {
        const resolvFileData = 'nameserver 127.0.0.1';
        return fs.writeFileSync('/etc/resolv.conf', resolvFileData);
    }

    /**
     * restore the /etc/resolv.conf file
     * for on shutdown use
     *
     * @returns {Promise<any>}
     */
    resetResolve = () => this.command('/sbin/resolvconf', ['-u']);

    /**
     * wrapper function for same graceful shutdown stuff
     * @returns {Promise<any>}
     */
    stutdown = () => this.resetResolve();

    /**
     * get a list of existing network interfaces
     * by using ifconfig
     *
     * @returns {Promise<any>}
     */
    getInterfaces() {
        return this.command('/sbin/ifconfig').then(() => {

            return Promise.resolve();
        });
    }

    /**
     * create the iptables object
     *
     * @returns {PromiseLike<void | never> | Promise<void | never>}
     */
    createIPTables = () => new IPTables(this).then(ipTables => {
        this.ipTables = ipTables;
        return Promise.resolve();
    });

    /**
     * restart the networking service
     *
     * @returns {Promise<any>}
     */
    restartService() {
        return this
            .command('/usr/sbin/service', ['networking', 'restart'])
            .then(() => {
                this.emit('service-restart');
                return Promise.resolve();
            });
    }


}