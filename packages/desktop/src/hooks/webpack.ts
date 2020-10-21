import { WebpackContext, ConfigurationContext, FRONTEND_TARGET, BACKEND_TARGET } from '@malagu/cli';
const nodeExternals = require('webpack-node-externals');
import * as path from 'path';

export default async (context: WebpackContext) => {
    const { configurations, dev, pkg } = context;
    const configuration = ConfigurationContext.getConfiguration(FRONTEND_TARGET, configurations);
    if (configuration) {
        configuration.module!.rules.push(...[
            {
                test: /\.css$/,
                exclude: /materialcolors\.css$|\.useable\.css$/,
                loader: 'style-loader!css-loader'
            },
            {
                test: /materialcolors\.css$|\.useable\.css$/,
                use: [
                  {
                    loader: 'style-loader/useable',
                    options: {
                      singleton: true,
                      attrs: { id: 'theia-theme' },
                    }
                  },
                  'css-loader'
                ]
            },
        ]);
    }

    const backendConfiguration = ConfigurationContext.getConfiguration(BACKEND_TARGET, configurations);

    if (dev && backendConfiguration) {
        const whitelist = pkg.componentPackages.map(cp => new RegExp(cp.name));
        whitelist.push(/@theia/);
        backendConfiguration.externals = [nodeExternals({
            whitelist,
            modulesDir: path.resolve(pkg.projectPath, '../node_modules')
        }), nodeExternals({
            whitelist
        }), nodeExternals({
            whitelist,
            modulesDir: path.resolve(pkg.projectPath, '../../node_modules')
        })];
    }

};
