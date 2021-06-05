import { WebpackContext, ConfigurationContext } from '@malagu/cli-service';
import { ProvidePlugin } from 'webpack';
const nodeExternals = require('webpack-node-externals');
import * as path from 'path';

export default async (context: WebpackContext) => {
    const { configurations, dev, pkg } = context;
    const configuration = ConfigurationContext.getFrontendConfiguration(configurations);
    if (configuration) {
        configuration
            .plugin('process')
                .use(ProvidePlugin, [{
                    process: 'process/browser'
                }])
            .end()
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
                        .loader('style-loader')
                        .options({
                            esModule: false,
                            injectType: 'lazySingletonStyleTag',
                            attributes: {
                                id: 'theia-theme'
                            }
                        })
                    .end()
                    .use('css-loader')
                        .loader('css-loader')
                    .end();
    }

    const backendConfiguration = ConfigurationContext.getBackendConfiguration(configurations);

    if (dev && backendConfiguration) {
        const allowlist = pkg.componentPackages.map(cp => new RegExp(cp.name));
        allowlist.push(/@theia/);
        backendConfiguration.externals([nodeExternals({
            allowlist,
            modulesDir: path.resolve(pkg.projectPath, '../node_modules')
        }), nodeExternals({
            allowlist
        }), nodeExternals({
            allowlist,
            modulesDir: path.resolve(pkg.projectPath, '../../node_modules')
        })]);
    }

};
