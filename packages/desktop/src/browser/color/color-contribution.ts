import { Component } from '@malagu/core';
import { ColorContribution } from '@theia/core/lib/browser/color-application-contribution';
import { Color, ColorRegistry } from '@theia/core/lib/browser/color-registry';

@Component(ColorContribution)
export class ColorContributionImpl implements ColorContribution {

    registerColors(colors: ColorRegistry): void {
        colors.register(
            {
                id: 'list.dropBackground', defaults: {
                    dark: '#383B3D',
                }, description: ''
            },
            {
                id: 'activityBarBadge.background', defaults: {
                    dark: '#007ACC',
                }, description: ''
            },
            {
                id: 'sideBarTitle.foreground', defaults: {
                    dark: '#BBBBBB',
                    light: '#6F6F6F',
                }, description: ''
            },
            {
                id: 'input.placeholderForeground', defaults: {
                    dark: '#A6A6A6',
                    light: '767676',
                }, description: ''
            },
            {
                id: 'menu.background', defaults: {
                    dark: '#252526',
                    light: '#ffffff',
                    hc: '#000000'
                }, description: ''
            },
            {
                id: 'menu.foreground', defaults: {
                    dark: '#CCCCCC',
                    light: '#616161',
                    hc: '#ffffff'
                }, description: ''
            },
            {
                id: 'statusBarItem.remoteForeground', defaults: {
                    dark: '#FFF',
                }, description: ''
            },
            {
                id: 'statusBarItem.remoteBackground', defaults: {
                    dark: '#16825D',
                    hc: '#000000'
                }, description: ''
            },
            {
                id: 'list.hoverBackground', defaults: {
                    light: '#E8E8E8',
                }, description: ''
            },
            {
                id: 'editorWidget.background', defaults: {
                    dark: '#252526'
                }, description: ''
            },
            {
                id: 'editorWidget.foreground', defaults: {
                    dark: '#cccccc',
                }, description: ''
            },
            {
                id: 'widget.shadow', defaults: {
                    dark: '#000000',
                }, description: ''
            },
            {
                id: 'focusBorder', defaults: {
                    dark: Color.rgba(14, 99, 156, .8),
                }, description: ''
            });
    }

}
