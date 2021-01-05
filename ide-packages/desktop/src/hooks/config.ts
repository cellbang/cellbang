import { ConfigContext } from '@malagu/cli';
import { join } from 'path';

export default async (context: ConfigContext) => {
    const { config } = context;
    const template = join(__dirname, '..', '..', 'index.html');
    const favicon = join(__dirname, '..', '..', 'favicon.ico');
    let htmlWebpackPlugin = { template, favicon };
    if (!config.malagu.webpack) {
        config.malagu.webpack = {};
    } else if (config.malagu.webpack.htmlWebpackPlugin) {
        config.malagu.webpack.htmlWebpackPlugin.template = htmlWebpackPlugin.template;
        config.malagu.webpack.htmlWebpackPlugin.favicon = htmlWebpackPlugin.favicon;
        htmlWebpackPlugin = config.malagu.webpack.htmlWebpackPlugin;
    }
    config.malagu.webpack.htmlWebpackPlugin = htmlWebpackPlugin;
};
