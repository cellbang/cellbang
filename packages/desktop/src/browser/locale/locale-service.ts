import { Component, Autowired, PostConstruct, Deferred } from '@malagu/core';
import { Locale, LocaleManager } from '@malagu/widget';
import { createIntl, createIntlCache, IntlShape } from '@formatjs/intl';
import { LocaleService } from './locale-protocol';

@Component(LocaleService)
export class LocaleServiceImpl implements LocaleService {

    @Autowired(LocaleManager)
    protected readonly localeManager: LocaleManager;

    protected localeDeferred = new Deferred<Locale>();

    protected intlDeferred = new Deferred<IntlShape<string>>();

    protected _intl: IntlShape<string>;

    @PostConstruct()
    protected init() {
        this.localeManager.currentSubject.subscribe(l => {
            if (l) {
                const cache = createIntlCache();
                this._intl = createIntl({
                    locale: l.lang,
                    messages: l.messages
                }, cache);
                this.localeDeferred.resolve(l);
                this.intlDeferred.resolve(this._intl);
            }
        });
    }

    tryGetLocale(): Locale | undefined {
        return this.localeManager.currentSubject.value;
    }

    get locale(): Promise<Locale> {
        return this.localeDeferred.promise;
    }

    get intl(): Promise<IntlShape<string>> {
        return this.intlDeferred.promise;
    }

    tryGetIntl(): IntlShape<string> {
        return this._intl;
    }
}
