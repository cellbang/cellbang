import { ContainerUtil } from '@malagu/core';
import { LocaleService } from '../locale';

export namespace IntlUtil {
    export function get(...ids: (string | undefined)[]) {
        const localeService = ContainerUtil.get<LocaleService>(LocaleService);
        const intl = localeService.tryGetIntl();
        if (intl) {
            for (const id of ids) {
                if (id && id in intl.messages) {
                    return intl.formatMessage({ id });
                }
            }
        }
        return ids[ids.length - 1];
    }
}
