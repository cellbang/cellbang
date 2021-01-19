import { loadMonaco } from '@theia/monaco/lib/browser/monaco-loader';

export function loadVsRequire(context: any): Promise<any> {
    const originalRequire = context.require;

    return new Promise<any>(resolve => {
            const vsLoader = document.createElement('script');
            vsLoader.type = 'text/javascript';
            vsLoader.src = './vs/loader.js';
            // eslint-disable-next-line
            vsLoader.charset = 'utf-8';
            vsLoader.addEventListener('load', () => {
                const amdRequire = context.require;
                if (originalRequire) {
                    context.require = originalRequire;
                }
                resolve(amdRequire);
            });
            document.body.appendChild(vsLoader);
        }
    );
}

export function loadMonacoExt(vsRequire: any): Promise<void> {
    return loadMonaco(vsRequire).then(() => new Promise<void>(resolve => {
        (window as any).AMDLoader.Utilities.NEXT_ANONYMOUS_ID = 10000;
        vsRequire([
            'vs/basic-languages/monaco.contribution',
            'vs/language/json/monaco.contribution'
        ], (basic: any, json: any) => {
            resolve();
        });
    }));

}
