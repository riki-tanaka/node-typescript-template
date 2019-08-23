import * as path from 'path';
import fs = require('fs');
import {Verifier, VerifierOptions} from '@pact-foundation/pact';
import * as yargs from 'yargs';

import {buildApiServer} from "./helper";
import * as config from '../package.json';
import {ApiServer} from "../src/server";

const provider = config.config;
const opts: VerifierOptions = config.pact as any;

const argv = yargs.options({
    providerBaseUrl: {
        alias: 'p',
        default: `${provider.protocol}://${provider.host}:${provider.port}${provider.contextRoot}`
    }
}).argv;

const pactBrokerUrl = process.env.PACTBROKER_URL || opts.pactBrokerUrl;

async function buildOptions(): Promise<VerifierOptions> {
    const options: VerifierOptions = Object.assign(
      {},
      opts,
      argv,
      pactBrokerUrl
        ? {pactBrokerUrl}
        : {pactUrls: await listPactFiles(path.join(process.cwd(), 'pacts'))},
      {
          provider: config.name,
          publishVerificationResult: true,
      },
    );

    console.log('Pact verification options', options);

    return options;
}

async function listPactFiles(pactDir: string): Promise<string[]> {
    return new Promise((resolve, reject) => {
        fs.readdir(pactDir, (err, items) => {
            if (err) {
                reject(err);
                return;
            }

            if (!items || items.length == 0) {
                reject(new Error('no pact files found'));
                return;
            }

            resolve(items.map(item => path.join(pactDir, item)));
        });
    });
}

async function verifyPact() {
    const options = await buildOptions().catch(err => {
        console.log('Error building pact options: ' + err.message);
        return null;
    });

    if (!options) {
        return;
    }

    console.log('Starting server');
    const server: ApiServer = await buildApiServer().start();

    try {
        await new Verifier().verifyProvider(options);
    } finally {
        await server.stop();
    }
}

verifyPact().catch(err => {
    console.log('Error verifying provider', err);
    process.exit(1);
});
