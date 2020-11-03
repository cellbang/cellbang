import { WebpackContext, ConfigurationContext, FRONTEND_TARGET } from '@malagu/cli';
import * as paths from 'path';

export default async (context: WebpackContext) => {
    const { configurations, dev, pkg } = context;
    const configuration = ConfigurationContext.getConfiguration(FRONTEND_TARGET, configurations);
    if (configuration) {
        const resolve = (moduleName: string, path: string): string => pkg.resolveModulePath(moduleName, path).split(paths.sep).join('/');
        const monacoEditorCorePath = dev ? resolve('@theia/monaco-editor-core', 'dev/vs').split(paths.sep).join('/') : resolve('@theia/monaco-editor-core', 'min/vs');
        const monacoLanguagesPath = resolve('monaco-languages', 'release/min');
        const monacoCssLanguagePath = resolve('monaco-css', 'release/min');
        const monacoJsonLanguagePath = resolve('monaco-json', 'release/min');
        const monacoHtmlLanguagePath = resolve('monaco-html', 'release/min');
        const CopyPlugin = require('copy-webpack-plugin');
        const CircularDependencyPlugin = require('circular-dependency-plugin');

        configuration.plugins!.push(...[
            new CopyPlugin([
                {
                    from: monacoEditorCorePath,
                    to: 'vs'
                },
                {
                    from: monacoLanguagesPath,
                    to: 'vs/basic-languages'
                },
                {
                    from: monacoCssLanguagePath,
                    to: 'vs/language/css'
                },
                {
                    from: monacoJsonLanguagePath,
                    to: 'vs/language/json'
                },
                {
                    from: monacoHtmlLanguagePath,
                    to: 'vs/language/html'
                }
            ]),
            new CircularDependencyPlugin({
                exclude: /(node_modules|examples)[\\\\|\/]./,
                failOnError: false // https://github.com/nodejs/readable-stream/issues/280#issuecomment-297076462
            })
        ]);

        const index = configuration.module!.rules.findIndex(r => r.use === 'source-map-loader');
        if (index !== -1) {
            configuration.module!.rules.splice(index, 1);
        }

        configuration.module!.rules.push(...[
            {
                test: /\.js$/,
                enforce: 'pre',
                loader: 'source-map-loader',
                exclude: /jsonc-parser|class-transformer|vscode-textmate|fast-plist|onigasm|(monaco-editor.*)/
            } as any,
            {
                test: /\.js$/,
                // include only es6 dependencies to transpile them to es5 classes
                include: /vscode-ws-jsonrpc|vscode-jsonrpc|vscode-languageserver-protocol|vscode-languageserver-types/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: [
                            // reuse runtime babel lib instead of generating it in each js file
                            '@babel/plugin-transform-runtime',
                            // ensure that classes are transpiled
                            '@babel/plugin-transform-classes'
                        ],
                        // see https://github.com/babel/babel/issues/8900#issuecomment-431240426
                        sourceType: 'unambiguous',
                        cacheDirectory: true
                    }
                }
            },
            {
                test: /node_modules[\\|\/](vscode-languageserver-types|vscode-uri|jsonc-parser)/,
                use: { loader: 'umd-compat-loader' }
            }
        ]);

    }
};
