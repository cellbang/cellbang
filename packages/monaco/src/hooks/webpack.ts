import { WebpackContext, ConfigurationContext } from '@malagu/cli-service';
import * as paths from 'path';

export default async (context: WebpackContext) => {
    const { configurations, dev, pkg } = context;
    const configuration = ConfigurationContext.getFrontendConfiguration(configurations);
    if (configuration) {
        const resolve = (moduleName: string, path: string): string => pkg.resolveModulePath(moduleName, path).split(paths.sep).join('/');
        const monacoEditorCorePath = dev ? resolve('@theia/monaco-editor-core', 'dev/vs').split(paths.sep).join('/') : resolve('@theia/monaco-editor-core', 'min/vs');
        const monacoLanguagesPath = resolve('monaco-languages', 'release/min');
        const monacoJsonLanguagePath = resolve('monaco-json', 'release/min');
        const CopyPlugin = require('copy-webpack-plugin');
        const CircularDependencyPlugin = require('circular-dependency-plugin');
        configuration
            .plugin('copyMonaco')
                .use(CopyPlugin, [[
                    {
                        from: monacoEditorCorePath,
                        to: 'vs'
                    },
                    {
                        from: monacoLanguagesPath,
                        to: 'vs/basic-languages'
                    },
                    {
                        from: monacoJsonLanguagePath,
                        to: 'vs/language/json'
                    }
                ]])
            .end()
            .plugin('circularDependency')
                .use(CircularDependencyPlugin, [{
                    exclude: /(node_modules|examples)[\\\\|\/]./,
                    failOnError: false // https://github.com/nodejs/readable-stream/issues/280#issuecomment-297076462
                }])
            .end()
            .module
                .rule('umd-compat')
                    .test(/node_modules[\\|\/](vscode-languageserver-types|vscode-uri|jsonc-parser)/)
                    .use('umd-compat-loader')
                        .loader('umd-compat-loader');
    }
};
