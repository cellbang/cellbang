import { WebpackContext, ConfigurationContext, FRONTEND_TARGET } from '@malagu/cli';
export default async (context: WebpackContext) => {
    const { configurations } = context;
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
};
