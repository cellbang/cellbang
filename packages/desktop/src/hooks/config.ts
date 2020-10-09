import { ConfigContext } from '@malagu/cli';
import { join } from 'path';

export default async (context: ConfigContext) => {
    const { config } = context;
    const template = join(__dirname, '..', '..', 'index.html');
    let htmlWebpackPlugin = { template };
    if (!config.malagu.webpack) {
        config.malagu.webpack = {};
    } else if (config.malagu.webpack.htmlWebpackPlugin) {
        config.malagu.webpack.htmlWebpackPlugin.template = htmlWebpackPlugin.template;
        htmlWebpackPlugin = config.malagu.webpack.htmlWebpackPlugin;
    }
    config.malagu.webpack.htmlWebpackPlugin = htmlWebpackPlugin;
};
