import { WebpackContext, ConfigurationContext } from '@malagu/cli-service';
const nodeExternals = require('webpack-node-externals');
import * as path from 'path';

export default async (context: WebpackContext) => {
    const { configurations, dev, pkg } = context;
    const configuration = ConfigurationContext.getFrontendConfiguration(configurations);
    if (configuration) {
        configuration
            .module
                .rule('css')
                    .test(/\.css$/)
                    .exclude
                        .add(/materialcolors\.css$|\.useable\.css$/)
                    .end()
                    .use('style-loader')
                        .loader('style-loader')
                    .end()
                    .use('css-loader')
                        .loader('css-loader')
                    .end()
                .end()
                .rule('useable')
                    .test(/materialcolors\.css$|\.useable\.css$/)
                    .use('style-loader')
                        .loader('style-loader/useable')
                        .options({
                            singleton: true,
                            attrs: { id: 'theia-theme' },
                        })
                    .end()
                    .use('css-loader')
                        .loader('css-loader')
                    .end();
    }

    const backendConfiguration = ConfigurationContext.getBackendConfiguration(configurations);

    if (dev && backendConfiguration) {
        const whitelist = pkg.componentPackages.map(cp => new RegExp(cp.name));
        whitelist.push(/@theia/);
        backendConfiguration.externals([nodeExternals({
            whitelist,
            modulesDir: path.resolve(pkg.projectPath, '../node_modules')
        }), nodeExternals({
            whitelist
        }), nodeExternals({
            whitelist,
            modulesDir: path.resolve(pkg.projectPath, '../../node_modules')
        })]);
    }

};
