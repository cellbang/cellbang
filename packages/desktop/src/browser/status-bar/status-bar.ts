import { Component } from '@malagu/core';
import { StatusBarEntry, StatusBarImpl } from '@theia/core/lib/browser';
import { IntlUtil } from '../utils';

@Component({ id: StatusBarImpl, rebind: true })
export class StatusBarExt extends StatusBarImpl {

    setElement(id: string, entry: StatusBarEntry): Promise<void> {
        entry.text = IntlUtil.get(entry.text)!;
        entry.tooltip = IntlUtil.get(entry.tooltip)!;
        return super.setElement(id, entry);
    }

}
