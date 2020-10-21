import { Locale } from '@malagu/widget';
import { IntlShape } from '@formatjs/intl';

export const LocaleService = Symbol('LocaleService');

export interface LocaleService {
    tryGetLocale(): Locale | undefined;

    readonly locale: Promise<Locale>;

    readonly intl: Promise<IntlShape<string>>;

    tryGetIntl(): IntlShape<string>;
}