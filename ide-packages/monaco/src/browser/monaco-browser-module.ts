import { ContainerModule } from 'inversify';
import { loadVsRequire } from '@theia/monaco/lib/browser/monaco-loader';
import { loadMonacoExt } from './monaco-loader';

export { ContainerModule };

export default loadVsRequire(window)
    .then(vsRequire => loadMonacoExt(vsRequire))
    .then(() =>
        import('@theia/monaco/lib/browser/monaco-frontend-module')
    ).then(module =>
        module.default
    );
