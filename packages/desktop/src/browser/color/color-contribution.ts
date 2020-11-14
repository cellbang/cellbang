import { Component } from '@malagu/core';
import { ColorContribution } from '@theia/core/lib/browser/color-application-contribution';
import { Color, ColorRegistry } from '@theia/core/lib/browser/color-registry';
import { Condition } from '../../common/utils';

/* eslint-disable max-len */

@Component(ColorContribution)
export class ColorContributionImpl implements ColorContribution {

    registerColors(colors: ColorRegistry): void {
        if (Condition.isEditorMode()) {
            return;
        }
        colors.register(
            {
                id: 'list.dropBackground', defaults: {
                    dark: '#383B3D',
                    light: '#d6ebff'
                }, description: ''
            },
            {
                id: 'activityBarBadge.background', defaults: {
                    light: '##007acc',
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
                    dark: '#2a2b2d',
                    light: '#E8E8E8',
                }, description: ''
            },
            {
                id: 'editorWidget.background', defaults: {
                    dark: '#252526',
                    light: '#f3f3f3'
                }, description: ''
            },
            {
                id: 'editorWidget.foreground', defaults: {
                    dark: '#cccccc',
                    light: '#616161'
                }, description: ''
            },
            {
                id: 'widget.shadow', defaults: {
                    dark: '#000000',
                    light: '#a8a8a8'
                }, description: ''
            },
            {
                id: 'focusBorder', defaults: {
                    dark: Color.rgba(14, 99, 156, .8),
                    light: Color.rgba(0, 122, 204, .4)
                }, description: ''
            },
            {
                id: 'foreground',
                description: 'Overall foreground color. This color is only used if not overridden by a component.',
                defaults: {
                    dark: '#CCCCCC',
                    light: '#616161',
                    hc: '#FFFFFF'
                }
            },
            {
                id: 'errorForeground',
                description: 'Overall foreground color for error messages. This color is only used if not overridden by a component.',
                defaults: {
                    dark: '#F48771',
                    light: '#A1260D',
                    hc: '#F48771'
                }
            },
            {
                id: 'descriptionForeground',
                description: 'Foreground color for description text providing additional information, for example for a label.',
                defaults: {
                    light: '#717171'
                }
            },
            {
                id: 'icon.foreground',
                description: 'The default color for icons in the workbench.',
                defaults: {
                    dark: '#C5C5C5',
                    light: '#424242',
                    hc: '#FFFFFF'
                }
            },
            {
                id: 'focusBorder',
                description: '',
                defaults: {
                    dark: Color.rgba(14, 99, 156, 0.8),
                    light: Color.rgba(0, 122, 204, 0.4),
                }
            },
            {
                id: 'contrastBorder',
                description: 'An extra border around elements to separate them from others for greater contrast.',
                defaults: {

                    hc: '#6FC3DF'
                }
            },
            {
                id: 'contrastActiveBorder',
                description: 'An extra border around active elements to separate them from others for greater contrast.',
                defaults: {

                    hc: 'focusBorder'
                }
            },
            {
                id: 'selection.background',
                description: 'Overall border color for focused elements. This color is only used if not overridden by a component.',
                defaults: {
                    dark: '#217daf',
                    light: '#c0dbf1'
                }
            },
            {
                id: 'textSeparator.foreground',
                description: 'Color for text separators.',
                defaults: {
                    light: '#0000002e',
                    dark: '#ffffff2e',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'textLink.foreground',
                description: 'Foreground color for links in text.',
                defaults: {
                    light: '#006AB1',
                    dark: '#3794FF',
                    hc: '#3794FF'
                }
            },
            {
                id: 'textLink.activeForeground',
                description: 'Foreground color for links in text when clicked on and on mouse hover.',
                defaults: {
                    light: '#006AB1',
                    dark: '#3794FF',
                    hc: '#3794FF'
                }
            },
            {
                id: 'textPreformat.foreground',
                description: 'Foreground color for preformatted text segments.',
                defaults: {
                    light: '#A31515',
                    dark: '#D7BA7D',
                    hc: '#D7BA7D'
                }
            },
            {
                id: 'textBlockQuote.background',
                description: 'Background color for block quotes in text.',
                defaults: {
                    light: '#7f7f7f1a',
                    dark: '#7f7f7f1a',

                }
            },
            {
                id: 'textBlockQuote.border',
                description: 'Border color for block quotes in text.',
                defaults: {
                    light: '#007acc80',
                    dark: '#007acc80',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'textCodeBlock.background',
                description: 'Background color for code blocks in text.',
                defaults: {
                    light: '#dcdcdc66',
                    dark: '#0a0a0a66',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'widget.shadow',
                description: '',
                defaults: {
                    dark: '#000000',
                    light: '#a8a8a8'
                }
            },
            {
                id: 'input.background',
                description: 'Input box background.',
                defaults: {
                    dark: '#3C3C3C',
                    light: Color.rgba(255, 255, 255, 1),
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'input.foreground',
                description: 'Input box foreground.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'input.border',
                description: 'Input box border.',
                defaults: {

                    hc: 'contrastBorder'
                }
            },
            {
                id: 'inputOption.activeBorder',
                description: 'Border color of activated options in input fields.',
                defaults: {
                    dark: '#007ACC00',
                    light: '#007ACC00',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'inputOption.activeBackground',
                description: 'Background color of activated options in input fields.',
                defaults: {

                }
            },
            {
                id: 'input.placeholderForeground',
                description: '',
                defaults: {
                    dark: '#A6A6A6',
                    light: '767676'
                }
            },
            {
                id: 'inputValidation.infoBackground',
                description: 'Input validation background color for information severity.',
                defaults: {
                    dark: '#063B49',
                    light: '#D6ECF2',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'inputValidation.infoForeground',
                description: 'Input validation foreground color for information severity.',
                defaults: {

                }
            },
            {
                id: 'inputValidation.infoBorder',
                description: 'Input validation border color for information severity.',
                defaults: {
                    dark: '#007acc',
                    light: '#007acc',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'inputValidation.warningBackground',
                description: 'Input validation background color for warning severity.',
                defaults: {
                    dark: '#352A05',
                    light: '#F6F5D2',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'inputValidation.warningForeground',
                description: 'Input validation foreground color for warning severity.',
                defaults: {

                }
            },
            {
                id: 'inputValidation.warningBorder',
                description: 'Input validation border color for warning severity.',
                defaults: {
                    dark: '#B89500',
                    light: '#B89500',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'inputValidation.errorBackground',
                description: 'Input validation background color for error severity.',
                defaults: {
                    dark: '#5A1D1D',
                    light: '#F2DEDE',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'inputValidation.errorForeground',
                description: 'Input validation foreground color for error severity.',
                defaults: {

                }
            },
            {
                id: 'inputValidation.errorBorder',
                description: 'Input validation border color for error severity.',
                defaults: {
                    dark: '#BE1100',
                    light: '#BE1100',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'dropdown.background',
                description: 'Dropdown background.',
                defaults: {
                    dark: '#3C3C3C',
                    light: Color.rgba(255, 255, 255, 1),
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'dropdown.listBackground',
                description: 'Dropdown list background.',
                defaults: {

                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'dropdown.foreground',
                description: 'Dropdown foreground.',
                defaults: {
                    dark: '#F0F0F0',

                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'dropdown.border',
                description: 'Dropdown border.',
                defaults: {
                    dark: 'dropdown.background',
                    light: '#CECECE',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'checkbox.background',
                description: 'Background color of checkbox widget.',
                defaults: {
                    dark: 'dropdown.background',
                    light: 'dropdown.background',
                    hc: 'dropdown.background'
                }
            },
            {
                id: 'checkbox.foreground',
                description: 'Foreground color of checkbox widget.',
                defaults: {
                    dark: 'dropdown.foreground',
                    light: 'dropdown.foreground',
                    hc: 'dropdown.foreground'
                }
            },
            {
                id: 'checkbox.border',
                description: 'Border color of checkbox widget.',
                defaults: {
                    dark: 'dropdown.border',
                    light: 'dropdown.border',
                    hc: 'dropdown.border'
                }
            },
            {
                id: 'pickerGroup.foreground',
                description: 'Quick picker color for grouping labels.',
                defaults: {
                    dark: '#3794FF',
                    light: '#0066BF',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'pickerGroup.border',
                description: 'Quick picker color for grouping borders.',
                defaults: {
                    dark: '#3F3F46',
                    light: '#CCCEDB',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'button.foreground',
                description: 'Button foreground color.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 1),
                    light: Color.rgba(255, 255, 255, 1),
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'button.background',
                description: 'Button background color.',
                defaults: {
                    dark: '#0E639C',
                    light: '#007ACC'
                }
            },
            {
                id: 'button.hoverBackground',
                description: 'Button background color when hovering.',
                defaults: {}
            },
            {
                id: 'badge.background',
                description: 'Badge background color. Badges are small information labels, e.g. for search results count.',
                defaults: {
                    dark: '#4D4D4D',
                    light: '#C4C4C4',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'badge.foreground',
                description: 'Badge foreground color. Badges are small information labels, e.g. for search results count.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 1),
                    light: '#333',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'scrollbar.shadow',
                description: 'Scrollbar shadow to indicate that the view is scrolled.',
                defaults: {
                    dark: '#000000',
                    light: '#DDDDDD',

                }
            },
            {
                id: 'scrollbarSlider.background',
                description: 'Scrollbar slider background color.',
                defaults: {
                    dark: Color.rgba(121, 121, 121, 0.4),
                    light: Color.rgba(100, 100, 100, 0.4),
                }
            },
            {
                id: 'scrollbarSlider.hoverBackground',
                description: 'Scrollbar slider background color when hovering.',
                defaults: {
                    dark: Color.rgba(100, 100, 100, 0.7),
                    light: Color.rgba(100, 100, 100, 0.7),
                }
            },
            {
                id: 'scrollbarSlider.activeBackground',
                description: 'Scrollbar slider background color when clicked on.',
                defaults: {
                    dark: Color.rgba(191, 191, 191, 0.4),
                    light: Color.rgba(0, 0, 0, 0.6),
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'progressBar.background',
                description: 'Background color of the progress bar that can show for long running operations.',
                defaults: {
                    dark: Color.rgba(14, 112, 192, 1),
                    light: Color.rgba(14, 112, 192, 1),
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'editorError.foreground',
                description: 'Foreground color of error squigglies in the editor.',
                defaults: {
                    dark: '#F48771',
                    light: '#E51400',

                }
            },
            {
                id: 'editorError.border',
                description: 'Border color of error boxes in the editor.',
                defaults: {

                    hc: Color.rgba(228, 119, 119, 0.8),
                }
            },
            {
                id: 'editorWarning.foreground',
                description: 'Foreground color of warning squigglies in the editor.',
                defaults: {
                    dark: '#CCA700',
                    light: '#E9A700',

                }
            },
            {
                id: 'editorWarning.border',
                description: 'Border color of warning boxes in the editor.',
                defaults: {

                    hc: Color.rgba(255, 204, 0, 0.8),
                }
            },
            {
                id: 'editorInfo.foreground',
                description: 'Foreground color of info squigglies in the editor.',
                defaults: {
                    dark: '#75BEFF',
                    light: '#75BEFF',

                }
            },
            {
                id: 'editorInfo.border',
                description: 'Border color of info boxes in the editor.',
                defaults: {

                    hc: Color.rgba(117, 190, 255, 0.8),
                }
            },
            {
                id: 'editorHint.foreground',
                description: 'Foreground color of hint squigglies in the editor.',
                defaults: {
                    dark: Color.rgba(238, 238, 238, 0.7),
                    light: '#6c6c6c',

                }
            },
            {
                id: 'editorHint.border',
                description: 'Border color of hint boxes in the editor.',
                defaults: {

                    hc: Color.rgba(238, 238, 238, 0.8),
                }
            },
            {
                id: 'editor.background',
                description: 'Editor background color.',
                defaults: {
                    light: '#fffffe',
                    dark: '#1E1E1E',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'editor.foreground',
                description: 'Editor default foreground color.',
                defaults: {
                    light: '#333333',
                    dark: '#BBBBBB',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'editorWidget.background',
                description: '',
                defaults: {
                    dark: '#252526',
                    light: '#f3f3f3'
                }
            },
            {
                id: 'editorWidget.foreground',
                description: '',
                defaults: {
                    dark: '#cccccc',
                    light: '#616161'
                }
            },
            {
                id: 'editorWidget.border',
                description: 'Border color of editor widgets. The color is only used if the widget chooses to have a border and if the color is not overridden by a widget.',
                defaults: {
                    dark: '#454545',
                    light: '#C8C8C8',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'editorWidget.resizeBorder',
                description: 'Border color of the resize bar of editor widgets. The color is only used if the widget chooses to have a resize border and if the color is not overridden by a widget.',
                defaults: {

                }
            },
            {
                id: 'editor.selectionBackground',
                description: 'Color of the editor selection.',
                defaults: {
                    light: '#ADD6FF',
                    dark: '#264F78',
                    hc: '#f3f518'
                }
            },
            {
                id: 'editor.selectionForeground',
                description: 'Color of the selected text for high contrast.',
                defaults: {

                    hc: '#000000'
                }
            },
            {
                id: 'editor.inactiveSelectionBackground',
                description: 'Color of the selection in an inactive editor. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {},
            },
            {
                id: 'editor.selectionHighlightBackground',
                description: 'Color for regions with the same content as the selection. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {

                },
            },
            {
                id: 'editor.selectionHighlightBorder',
                description: 'Border color for regions with the same content as the selection.',
                defaults: {

                    hc: 'contrastActiveBorder'
                }
            },
            {
                id: 'editor.findMatchBackground',
                description: 'Color of the current search match.',
                defaults: {
                    light: '#A8AC94',
                    dark: '#515C6A',

                }
            },
            {
                id: 'editor.findMatchHighlightBackground',
                description: 'Color of the other search matches. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    light: '#EA5C0055',
                    dark: '#EA5C0055',

                },
            },
            {
                id: 'editor.findRangeHighlightBackground',
                description: 'Color of the range limiting the search. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: '#3a3d4166',
                    light: '#b4b4b44d',

                },
            },
            {
                id: 'editor.findMatchBorder',
                description: 'Border color of the current search match.',
                defaults: {

                    hc: 'contrastActiveBorder'
                }
            },
            {
                id: 'editor.findMatchHighlightBorder',
                description: 'Border color of the other search matches.',
                defaults: {

                    hc: 'contrastActiveBorder'
                }
            },
            {
                id: 'editor.findRangeHighlightBorder',
                description: 'Border color of the range limiting the search. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {

                },
            },
            {
                id: 'searchEditor.findMatchBackground',
                description: 'Color of the Search Editor query matches.',
                defaults: {
                    hc: 'editor.findMatchHighlightBackground'
                }
            },
            {
                id: 'searchEditor.findMatchBorder',
                description: 'Border color of the Search Editor query matches.',
                defaults: {
                    hc: 'editor.findMatchHighlightBorder'
                }
            },
            {
                id: 'editor.hoverHighlightBackground',
                description: 'Highlight below the word for which a hover is shown. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    light: '#ADD6FF26',
                    dark: '#264f7840',
                    hc: '#ADD6FF26'
                },
            },
            {
                id: 'editorHoverWidget.background',
                description: 'Background color of the editor hover.',
                defaults: {
                    light: 'editorWidget.background',
                    dark: 'editorWidget.background',
                    hc: 'editorWidget.background'
                }
            },
            {
                id: 'editorHoverWidget.foreground',
                description: 'Foreground color of the editor hover.',
                defaults: {
                    light: 'editorWidget.foreground',
                    dark: 'editorWidget.foreground',
                    hc: 'editorWidget.foreground'
                }
            },
            {
                id: 'editorHoverWidget.border',
                description: 'Border color of the editor hover.',
                defaults: {
                    light: 'editorWidget.border',
                    dark: 'editorWidget.border',
                    hc: 'editorWidget.border'
                }
            },
            {
                id: 'editorHoverWidget.statusBarBackground',
                description: 'Background color of the editor hover status bar.',
                defaults: {
                    hc: 'editorWidget.background'
                }
            },
            {
                id: 'editorLink.activeForeground',
                description: 'Color of active links.',
                defaults: {
                    dark: '#4E94CE',
                    light: Color.rgba(0, 0, 255, 1),
                    hc: Color.rgba(0, 255, 255, 1),
                }
            },
            {
                id: 'editorLightBulb.foreground',
                description: 'The color used for the lightbulb actions icon.',
                defaults: {
                    dark: '#FFCC00',
                    light: '#DDB100',
                    hc: '#FFCC00'
                }
            },
            {
                id: 'editorLightBulbAutoFix.foreground',
                description: 'The color used for the lightbulb auto fix actions icon.',
                defaults: {
                    dark: '#75BEFF',
                    light: '#007ACC',
                    hc: '#75BEFF'
                }
            },
            {
                id: 'diffEditor.insertedTextBackground',
                description: 'Background color for text that got inserted. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: Color.rgba(155, 185, 85, 0.2),
                    light: Color.rgba(155, 185, 85, 0.2),

                },
            },
            {
                id: 'diffEditor.removedTextBackground',
                description: 'Background color for text that got removed. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: Color.rgba(255, 0, 0, 0.2),
                    light: Color.rgba(255, 0, 0, 0.2),

                },
            },
            {
                id: 'diffEditor.insertedTextBorder',
                description: 'Outline color for the text that got inserted.',
                defaults: {

                    hc: '#33ff2eff'
                }
            },
            {
                id: 'diffEditor.removedTextBorder',
                description: 'Outline color for text that got removed.',
                defaults: {

                    hc: '#FF008F'
                }
            },
            {
                id: 'diffEditor.border',
                description: 'Border color between the two text editors.',
                defaults: {

                    hc: 'contrastBorder'
                }
            },
            {
                id: 'list.focusBackground',
                description: 'List/Tree background color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.',
                defaults: {
                    dark: '#062F4A',
                    light: '#D6EBFF',

                }
            },
            {
                id: 'list.focusForeground',
                description: 'List/Tree foreground color for the focused item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.',
                defaults: {

                }
            },
            {
                id: 'list.activeSelectionBackground',
                description: 'List/Tree background color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.',
                defaults: {
                    dark: '#094771',
                    light: '#0074E8'
                }
            },
            {
                id: 'list.activeSelectionForeground',
                description: 'List/Tree foreground color for the selected item when the list/tree is active. An active list/tree has keyboard focus, an inactive does not.',
                defaults: {
                    dark: '#FFF',
                    light: '#FFF'
                }
            },
            {
                id: 'list.inactiveSelectionBackground',
                description: 'List/Tree background color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.',
                defaults: {
                    dark: '#37373D',
                    light: '#E4E6F1'
                }
            },
            {
                id: 'list.inactiveSelectionForeground',
                description: 'List/Tree foreground color for the selected item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.'
            },
            {
                id: 'list.inactiveFocusBackground',
                description: 'List/Tree background color for the focused item when the list/tree is inactive. An active list/tree has keyboard focus, an inactive does not.',
                defaults: {

                }
            },
            {
                id: 'list.hoverBackground',
                description: '',
                defaults: {
                    dark: '#2a2b2d',
                    light: '#E8E8E8'
                }
            },
            {
                id: 'list.hoverForeground',
                description: 'List/Tree foreground when hovering over items using the mouse.'
            },
            {
                id: 'list.dropBackground',
                description: '',
                defaults: {
                    dark: '#383B3D',
                    light: '#d6ebff'
                }
            },
            {
                id: 'list.highlightForeground',
                description: 'List/Tree foreground color of the match highlights when searching inside the list/tree.',
                defaults: {
                    dark: '#0097fb',
                    light: '#0066BF',
                    hc: 'focusBorder'
                }
            },
            {
                id: 'list.invalidItemForeground',
                description: 'List/Tree foreground color for invalid items, for example an unresolved root in explorer.',
                defaults: {
                    dark: '#B89500',
                    light: '#B89500',
                    hc: '#B89500'
                }
            },
            {
                id: 'list.errorForeground',
                description: 'Foreground color of list items containing errors.',
                defaults: {
                    dark: '#F88070',
                    light: '#B01011',

                }
            },
            {
                id: 'list.warningForeground',
                description: 'Foreground color of list items containing warnings.',
                defaults: {
                    dark: '#CCA700',
                    light: '#855F00',

                }
            },
            {
                id: 'listFilterWidget.background',
                description: 'Background color of the type filter widget in lists and trees.',
                defaults: {
                    light: '#efc1ad',
                    dark: '#653723',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'listFilterWidget.outline',
                description: 'Outline color of the type filter widget in lists and trees.',
                defaults: {
                    dark: Color.rgba(0, 0, 0, 0),
                    light: Color.rgba(0, 0, 0, 0),
                    hc: '#f38518'
                }
            },
            {
                id: 'listFilterWidget.noMatchesOutline',
                description: 'Outline color of the type filter widget in lists and trees, when there are no matches.',
                defaults: {
                    dark: '#BE1100',
                    light: '#BE1100',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'list.filterMatchBackground',
                description: 'Background color of the filtered match.',
                defaults: {
                    dark: 'editor.findMatchHighlightBackground',
                    light: 'editor.findMatchHighlightBackground'
                }
            },
            {
                id: 'list.filterMatchBorder',
                description: 'Border color of the filtered match.',
                defaults: {
                    dark: 'editor.findMatchHighlightBorder',
                    light: 'editor.findMatchHighlightBorder',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'tree.indentGuidesStroke',
                description: 'Tree stroke color for the indentation guides.',
                defaults: {
                    dark: '#585858',
                    light: '#a9a9a9',
                    hc: '#a9a9a9'
                }
            },
            {
                id: 'menu.border',
                description: 'Border color of menus.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'menu.foreground',
                description: '',
                defaults: {
                    dark: '#CCCCCC',
                    light: '#616161',
                    hc: '#ffffff'
                }
            },
            {
                id: 'menu.background',
                description: '',
                defaults: {
                    dark: '#252526',
                    light: '#ffffff',
                    hc: '#000000'
                }
            },
            {
                id: 'menu.selectionForeground',
                description: 'Foreground color of the selected menu item in menus.',
                defaults: {
                    dark: 'list.activeSelectionForeground',
                    light: 'list.activeSelectionForeground',
                    hc: 'list.activeSelectionForeground'
                }
            },
            {
                id: 'menu.selectionBackground',
                description: 'Background color of the selected menu item in menus.',
                defaults: {
                    dark: 'list.activeSelectionBackground',
                    light: 'list.activeSelectionBackground',
                    hc: 'list.activeSelectionBackground'
                }
            },
            {
                id: 'menu.selectionBorder',
                description: 'Border color of the selected menu item in menus.',
                defaults: {
                    hc: 'activeContrastBorder'
                }
            },
            {
                id: 'menu.separatorBackground',
                description: 'Color of a separator menu item in menus.',
                defaults: {
                    dark: '#BBBBBB',
                    light: '#888888',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'editor.snippetTabstopHighlightBackground',
                description: 'Highlight background color of a snippet tabstop.',
                defaults: {
                    dark: Color.rgba(124, 124, 124, 0.3),
                    light: Color.rgba(10, 50, 100, 0.2),
                    hc: Color.rgba(124, 124, 124, 0.3),
                }
            },
            {
                id: 'editor.snippetTabstopHighlightBorder',
                description: 'Highlight border color of a snippet tabstop.',
                defaults: {

                }
            },
            {
                id: 'editor.snippetFinalTabstopHighlightBackground',
                description: 'Highlight background color of the final tabstop of a snippet.',
                defaults: {

                }
            },
            {
                id: 'editor.snippetFinalTabstopHighlightBorder',
                description: 'Highlight border color of the final stabstop of a snippet.',
                defaults: {
                    dark: '#525252',
                    light: Color.rgba(10, 50, 100, 0.5),
                    hc: '#525252'
                }
            },
            {
                id: 'breadcrumb.foreground',
                description: 'Color of focused breadcrumb items.',
                defaults: {}
            },
            {
                id: 'breadcrumb.background',
                description: 'Background color of breadcrumb items.',
                defaults: {
                    light: 'editor.background',
                    dark: 'editor.background',
                    hc: 'editor.background'
                }
            },
            {
                id: 'breadcrumb.focusForeground',
                description: 'Color of focused breadcrumb items.',
                defaults: {}
            },
            {
                id: 'breadcrumb.activeSelectionForeground',
                description: 'Color of selected breadcrumb items.',
                defaults: {}
            },
            {
                id: 'breadcrumbPicker.background',
                description: 'Background color of breadcrumb item picker.',
                defaults: {
                    light: 'editorWidget.background',
                    dark: 'editorWidget.background',
                    hc: 'editorWidget.background'
                }
            },
            {
                id: 'merge.currentHeaderBackground',
                description: 'Current header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: Color.rgba(64, 200, 174, 0.5),
                    light: Color.rgba(64, 200, 174, 0.5),

                },
            },
            {
                id: 'merge.currentContentBackground',
                description: 'Current content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {},
            },
            {
                id: 'merge.incomingHeaderBackground',
                description: 'Incoming header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: Color.rgba(64, 166, 255, 0.5),
                    light: Color.rgba(64, 166, 255, 0.5),

                },
            },
            {
                id: 'merge.incomingContentBackground',
                description: 'Incoming content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {},
            },
            {
                id: 'merge.commonHeaderBackground',
                description: 'Common ancestor header background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: Color.rgba(96, 96, 96, 0.4),
                    light: Color.rgba(96, 96, 96, 0.4),

                },
            },
            {
                id: 'merge.commonContentBackground',
                description: 'Common ancestor content background in inline merge-conflicts. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {},
            },
            {
                id: 'merge.border',
                description: 'Border color on headers and the splitter in inline merge-conflicts.',
                defaults: {

                    hc: '#C3DF6F'
                }
            },
            {
                id: 'editorOverviewRuler.currentContentForeground',
                description: 'Current overview ruler foreground for inline merge-conflicts.',
                defaults: {
                    hc: 'merge.border'
                }
            },
            {
                id: 'editorOverviewRuler.incomingContentForeground',
                description: 'Incoming overview ruler foreground for inline merge-conflicts.',
                defaults: {
                    hc: 'merge.border'
                }
            },
            {
                id: 'editorOverviewRuler.commonContentForeground',
                description: 'Common ancestor overview ruler foreground for inline merge-conflicts.',
                defaults: {
                    hc: 'merge.border'
                }
            },
            {
                id: 'editorOverviewRuler.findMatchForeground',
                description: 'Overview ruler marker color for find matches. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: '#d186167e',
                    light: '#d186167e',
                    hc: '#AB5A00'
                },
            },
            {
                id: 'editorOverviewRuler.selectionHighlightForeground',
                description: 'Overview ruler marker color for selection highlights. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: '#A0A0A0CC',
                    light: '#A0A0A0CC',
                    hc: '#A0A0A0CC'
                },
            },
            {
                id: 'minimap.findMatchHighlight',
                description: 'Minimap marker color for find matches.',
                defaults: {
                    light: '#d18616',
                    dark: '#d18616',
                    hc: '#AB5A00'
                },
            },
            {
                id: 'minimap.selectionHighlight',
                description: 'Minimap marker color for the editor selection.',
                defaults: {
                    light: '#ADD6FF',
                    dark: '#264F78',
                    hc: '#ffffff'
                },
            },
            {
                id: 'minimap.errorHighlight',
                description: 'Minimap marker color for errors.',
                defaults: {
                    dark: Color.rgba(255, 18, 18, 0.7),
                    light: Color.rgba(255, 18, 18, 0.7),
                    hc: Color.rgba(255, 50, 50, 1),
                }
            },
            {
                id: 'minimap.warningHighlight',
                description: 'Minimap marker color for warnings.',
                defaults: {
                    dark: 'editorWarning.foreground',
                    light: 'editorWarning.foreground',
                    hc: 'editorWarning.border'
                }
            },
            {
                id: 'problemsErrorIcon.foreground',
                description: 'The color used for the problems error icon.',
                defaults: {
                    dark: 'editorError.foreground',
                    light: 'editorError.foreground',
                    hc: 'editorError.foreground'
                }
            },
            {
                id: 'problemsWarningIcon.foreground',
                description: 'The color used for the problems warning icon.',
                defaults: {
                    dark: 'editorWarning.foreground',
                    light: 'editorWarning.foreground',
                    hc: 'editorWarning.foreground'
                }
            },
            {
                id: 'problemsInfoIcon.foreground',
                description: 'The color used for the problems info icon.',
                defaults: {
                    dark: 'editorInfo.foreground',
                    light: 'editorInfo.foreground',
                    hc: 'editorInfo.foreground'
                }
            },
            {
                id: 'editor.lineHighlightBackground',
                description: 'Background color for the highlight of line at the cursor position.',
                defaults: {

                }
            },
            {
                id: 'editor.lineHighlightBorder',
                description: 'Background color for the border around the line at the cursor position.',
                defaults: {
                    dark: '#282828',
                    light: '#eeeeee',
                    hc: '#f38518'
                }
            },
            {
                id: 'editor.rangeHighlightBackground',
                description: 'Background color of highlighted ranges, like by quick open and find features. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: '#ffffff0b',
                    light: '#fdff0033',

                },
            },
            {
                id: 'editor.rangeHighlightBorder',
                description: 'Background color of the border around highlighted ranges.',
                defaults: {

                    hc: 'contrastActiveBorder'
                },
            },
            {
                id: 'editor.symbolHighlightBackground',
                description: 'Background color of highlighted symbol, like for go to definition or go next/previous symbol. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: 'editor.findMatchHighlightBackground',
                    light: 'editor.findMatchHighlightBackground',

                },
            },
            {
                id: 'editor.symbolHighlightBorder',
                description: 'Background color of the border around highlighted symbols.',
                defaults: {

                    hc: 'contrastActiveBorder'
                },
            },
            {
                id: 'editorCursor.foreground',
                description: 'Color of the editor cursor.',
                defaults: {
                    dark: '#AEAFAD',
                    light: Color.rgba(0, 0, 0, 1),
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'editorCursor.background',
                description: 'The background color of the editor cursor. Allows customizing the color of a character overlapped by a block cursor.',

            },
            {
                id: 'editorWhitespace.foreground',
                description: 'Color of whitespace characters in the editor.',
                defaults: {
                    dark: '#e3e4e229',
                    light: '#33333333',
                    hc: '#e3e4e229'
                }
            },
            {
                id: 'editorIndentGuide.background',
                description: 'Color of the editor indentation guides.',
                defaults: {
                    dark: 'editorWhitespace.foreground',
                    light: 'editorWhitespace.foreground',
                    hc: 'editorWhitespace.foreground'
                }
            },
            {
                id: 'editorIndentGuide.activeBackground',
                description: 'Color of the active editor indentation guides.',
                defaults: {
                    dark: 'editorWhitespace.foreground',
                    light: 'editorWhitespace.foreground',
                    hc: 'editorWhitespace.foreground'
                }
            },
            {
                id: 'editorLineNumber.foreground',
                description: 'Color of editor line numbers.',
                defaults: {
                    dark: '#858585',
                    light: '#237893',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'editorActiveLineNumber.foreground',
                description: 'Color of editor active line number',
                defaults: {
                    dark: '#c6c6c6',
                    light: '#0B216F',
                    hc: 'contrastActiveBorder'
                },
            },
            {
                id: 'editorLineNumber.activeForeground',
                description: 'Color of editor active line number',
                defaults: {
                    dark: 'editorActiveLineNumber.foreground',
                    light: 'editorActiveLineNumber.foreground',
                    hc: 'editorActiveLineNumber.foreground'
                }
            },
            {
                id: 'editorRuler.foreground',
                description: 'Color of the editor rulers.',
                defaults: {
                    dark: '#5A5A5A',
                    light: Color.rgba(211, 211, 211, 1),
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'editorCodeLens.foreground',
                description: 'Foreground color of editor code lenses',
                defaults: {
                    dark: '#999999',
                    light: '#999999',
                    hc: '#999999'
                }
            },
            {
                id: 'editorBracketMatch.background',
                description: 'Background color behind matching brackets',
                defaults: {
                    dark: '#0064001a',
                    light: '#0064001a',
                    hc: '#0064001a'
                }
            },
            {
                id: 'editorBracketMatch.border',
                description: 'Color for matching brackets boxes',
                defaults: {
                    dark: '#888',
                    light: '#B9B9B9',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'editorOverviewRuler.border',
                description: 'Color of the overview ruler border.',
                defaults: {
                    dark: '#7f7f7f4d',
                    light: '#7f7f7f4d',
                    hc: '#7f7f7f4d'
                }
            },
            {
                id: 'editorGutter.background',
                description: 'Background color of the editor gutter. The gutter contains the glyph margins and the line numbers.',
                defaults: {
                    dark: 'editor.background',
                    light: 'editor.background',
                    hc: 'editor.background'
                }
            },
            {
                id: 'editorUnnecessaryCode.border',
                description: 'Border color of unnecessary (unused) source code in the editor.',
                defaults: {

                    hc: Color.rgba(255, 255, 255, 0.8),
                }
            },
            {
                id: 'editorUnnecessaryCode.opacity',
                description: 'Opacity of unnecessary (unused) source code in the editor. For example, \'#000000c0\' will render the code with 75% opacity. For high contrast themes, use the  "editorUnnecessaryCode.border" theme color to underline unnecessary code instead of fading it out.',
                defaults: {
                    dark: Color.rgba(0, 0, 0, 0.667),
                    light: Color.rgba(0, 0, 0, 0.467),

                }
            },
            {
                id: 'editorOverviewRuler.rangeHighlightForeground',
                description: 'Overview ruler marker color for range highlights. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: Color.rgba(0, 122, 204, 0.6),
                    light: Color.rgba(0, 122, 204, 0.6),
                    hc: Color.rgba(0, 122, 204, 0.6),
                },
            },
            {
                id: 'editorOverviewRuler.errorForeground',
                description: 'Overview ruler marker color for errors.',
                defaults: {
                    dark: Color.rgba(255, 18, 18, 0.7),
                    light: Color.rgba(255, 18, 18, 0.7),
                    hc: Color.rgba(255, 50, 50, 1),
                }
            },
            {
                id: 'editorOverviewRuler.warningForeground',
                description: 'Overview ruler marker color for warnings.',
                defaults: {
                    dark: 'editorWarning.foreground',
                    light: 'editorWarning.foreground',
                    hc: 'editorWarning.border'
                }
            },
            {
                id: 'editorOverviewRuler.infoForeground',
                description: 'Overview ruler marker color for infos.',
                defaults: {
                    dark: 'editorInfo.foreground',
                    light: 'editorInfo.foreground',
                    hc: 'editorInfo.border'
                }
            },
            {
                id: 'editorOverviewRuler.bracketMatchForeground',
                description: 'Overview ruler marker color for matching brackets.',
                defaults: {
                    dark: '#A0A0A0',
                    light: '#A0A0A0',
                    hc: '#A0A0A0'
                }
            },
            {
                id: 'symbolIcon.arrayForeground',
                description: 'The foreground color for array symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.booleanForeground',
                description: 'The foreground color for boolean symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.classForeground',
                description: 'The foreground color for class symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#EE9D28',
                    light: '#D67E00',
                    hc: '#EE9D28'
                }
            },
            {
                id: 'symbolIcon.colorForeground',
                description: 'The foreground color for color symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.constantForeground',
                description: 'The foreground color for constant symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.constructorForeground',
                description: 'The foreground color for constructor symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#B180D7',
                    light: '#652D90',
                    hc: '#B180D7'
                }
            },
            {
                id: 'symbolIcon.enumeratorForeground',
                description: 'The foreground color for enumerator symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#EE9D28',
                    light: '#D67E00',
                    hc: '#EE9D28'
                }
            },
            {
                id: 'symbolIcon.enumeratorMemberForeground',
                description: 'The foreground color for enumerator member symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#75BEFF',
                    light: '#007ACC',
                    hc: '#75BEFF'
                }
            },
            {
                id: 'symbolIcon.eventForeground',
                description: 'The foreground color for event symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#EE9D28',
                    light: '#D67E00',
                    hc: '#EE9D28'
                }
            },
            {
                id: 'symbolIcon.fieldForeground',
                description: 'The foreground color for field symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#75BEFF',
                    light: '#007ACC',
                    hc: '#75BEFF'
                }
            },
            {
                id: 'symbolIcon.fileForeground',
                description: 'The foreground color for file symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.folderForeground',
                description: 'The foreground color for folder symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.functionForeground',
                description: 'The foreground color for function symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#B180D7',
                    light: '#652D90',
                    hc: '#B180D7'
                }
            },
            {
                id: 'symbolIcon.interfaceForeground',
                description: 'The foreground color for interface symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#75BEFF',
                    light: '#007ACC',
                    hc: '#75BEFF'
                }
            },
            {
                id: 'symbolIcon.keyForeground',
                description: 'The foreground color for key symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.keywordForeground',
                description: 'The foreground color for keyword symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.methodForeground',
                description: 'The foreground color for method symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#B180D7',
                    light: '#652D90',
                    hc: '#B180D7'
                }
            },
            {
                id: 'symbolIcon.moduleForeground',
                description: 'The foreground color for module symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.namespaceForeground',
                description: 'The foreground color for namespace symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.nullForeground',
                description: '',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.numberForeground',
                description: 'The foreground color for number symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.objectForeground',
                description: 'The foreground color for object symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.operatorForeground',
                description: 'The foreground color for operator symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.packageForeground',
                description: 'The foreground color for package symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.propertyForeground',
                description: 'The foreground color for property symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.referenceForeground',
                description: 'The foreground color for reference symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.snippetForeground',
                description: 'The foreground color for snippet symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.stringForeground',
                description: 'The foreground color for string symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.structForeground',
                description: 'The foreground color for struct symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.textForeground',
                description: 'The foreground color for text symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.typeParameterForeground',
                description: 'The foreground color for type parameter symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.unitForeground',
                description: 'The foreground color for unit symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: 'foreground',
                    light: 'foreground',
                    hc: 'foreground'
                }
            },
            {
                id: 'symbolIcon.variableForeground',
                description: 'The foreground color for variable symbols. These symbols appear in the outline, breadcrumb, and suggest widget.',
                defaults: {
                    dark: '#75BEFF',
                    light: '#007ACC',
                    hc: '#75BEFF'
                }
            },
            {
                id: 'editor.foldBackground',
                description: 'Color of the editor selection.',
                defaults: {

                }
            },
            {
                id: 'peekViewTitle.background',
                description: 'Background color of the peek view title area.',
                defaults: {
                    dark: '#1E1E1E',
                    light: '#FFFFFF',
                    hc: '#0C141F'
                }
            },
            {
                id: 'peekViewTitleLabel.foreground',
                description: 'Color of the peek view title.',
                defaults: {
                    dark: '#FFFFFF',
                    light: '#333333',
                    hc: '#FFFFFF'
                }
            },
            {
                id: 'peekViewTitleDescription.foreground',
                description: 'Color of the peek view title info.',
                defaults: {
                    dark: '#ccccccb3',
                    light: '#616161e6',
                    hc: '#FFFFFF99'
                }
            },
            {
                id: 'peekView.border',
                description: 'Color of the peek view borders and arrow.',
                defaults: {
                    dark: '#007acc',
                    light: '#007acc',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'peekViewResult.background',
                description: 'Background color of the peek view result list.',
                defaults: {
                    dark: '#252526',
                    light: '#F3F3F3',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'peekViewResult.lineForeground',
                description: 'Foreground color for line nodes in the peek view result list.',
                defaults: {
                    dark: '#bbbbbb',
                    light: '#646465',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'peekViewResult.fileForeground',
                description: 'Foreground color for file nodes in the peek view result list.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 1),
                    light: '#1E1E1E',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'peekViewResult.selectionBackground',
                description: 'Background color of the selected entry in the peek view result list.',
                defaults: {
                    dark: '#3399ff33',
                    light: '#3399ff33',

                }
            },
            {
                id: 'peekViewResult.selectionForeground',
                description: 'Foreground color of the selected entry in the peek view result list.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 1),
                    light: '#6C6C6C',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'peekViewEditor.background',
                description: 'Background color of the peek view editor.',
                defaults: {
                    dark: '#001F33',
                    light: '#F2F8FC',
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'peekViewEditorGutter.background',
                description: 'Background color of the gutter in the peek view editor.',
                defaults: {
                    dark: 'peekViewEditor.background',
                    light: 'peekViewEditor.background',
                    hc: 'peekViewEditor.background'
                }
            },
            {
                id: 'peekViewResult.matchHighlightBackground',
                description: 'Match highlight color in the peek view result list.',
                defaults: {
                    dark: '#ea5c004d',
                    light: '#ea5c004d',

                }
            },
            {
                id: 'peekViewEditor.matchHighlightBackground',
                description: 'Match highlight color in the peek view editor.',
                defaults: {
                    dark: '#ff8f0099',
                    light: '#f5d802de',

                }
            },
            {
                id: 'peekViewEditor.matchHighlightBorder',
                description: 'Match highlight border in the peek view editor.',
                defaults: {

                    hc: 'contrastActiveBorder'
                }
            },
            {
                id: 'editorSuggestWidget.background',
                description: 'Background color of the suggest widget.',
                defaults: {
                    dark: 'editorWidget.background',
                    light: 'editorWidget.background',
                    hc: 'editorWidget.background'
                }
            },
            {
                id: 'editorSuggestWidget.border',
                description: 'Border color of the suggest widget.',
                defaults: {
                    dark: 'editorWidget.border',
                    light: 'editorWidget.border',
                    hc: 'editorWidget.border'
                }
            },
            {
                id: 'editorSuggestWidget.foreground',
                description: 'Foreground color of the suggest widget.',
                defaults: {
                    dark: 'editor.foreground',
                    light: 'editor.foreground',
                    hc: 'editor.foreground'
                }
            },
            {
                id: 'editorSuggestWidget.selectedBackground',
                description: 'Background color of the selected entry in the suggest widget.',
                defaults: {
                    dark: 'list.focusBackground',
                    light: 'list.focusBackground',
                    hc: 'list.focusBackground'
                }
            },
            {
                id: 'editorSuggestWidget.highlightForeground',
                description: 'Color of the match highlights in the suggest widget.',
                defaults: {
                    dark: 'list.highlightForeground',
                    light: 'list.highlightForeground',
                    hc: 'list.highlightForeground'
                }
            },
            {
                id: 'editor.wordHighlightBackground',
                description: 'Background color of a symbol during read-access, like reading a variable. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: '#575757B8',
                    light: '#57575740',

                },
            },
            {
                id: 'editor.wordHighlightStrongBackground',
                description: 'Background color of a symbol during write-access, like writing to a variable. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: '#004972B8',
                    light: '#0e639c40',

                },
            },
            {
                id: 'editor.wordHighlightBorder',
                description: 'Border color of a symbol during read-access, like reading a variable.',
                defaults: {

                    hc: 'contrastActiveBorder'
                }
            },
            {
                id: 'editor.wordHighlightStrongBorder',
                description: 'Border color of a symbol during write-access, like writing to a variable.',
                defaults: {

                    hc: 'contrastActiveBorder'
                }
            },
            {
                id: 'editorOverviewRuler.wordHighlightForeground',
                description: 'Overview ruler marker color for symbol highlights. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: '#A0A0A0CC',
                    light: '#A0A0A0CC',
                    hc: '#A0A0A0CC'
                },
            },
            {
                id: 'editorOverviewRuler.wordHighlightStrongForeground',
                description: 'Overview ruler marker color for write-access symbol highlights. The color must not be opaque so as not to hide underlying decorations.',
                defaults: {
                    dark: '#C0A0C0CC',
                    light: '#C0A0C0CC',
                    hc: '#C0A0C0CC'
                },
            },
            {
                id: 'editorMarkerNavigationError.background',
                description: 'Editor marker navigation widget error color.',
                defaults: {}
            },
            {
                id: 'editorMarkerNavigationWarning.background',
                description: 'Editor marker navigation widget warning color.',
                defaults: {}
            },
            {
                id: 'editorMarkerNavigationInfo.background',
                description: 'Editor marker navigation widget info color.',
                defaults: {}
            },
            {
                id: 'editorMarkerNavigation.background',
                description: 'Editor marker navigation widget background.',
                defaults: {
                    dark: '#2D2D30',
                    light: Color.rgba(255, 255, 255, 1),
                    hc: '#0C141F'
                }
            },
            {
                id: 'window.activeBorder',
                description: 'The color used for the border of the window when it is active.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'window.inactiveBorder',
                description: 'The color used for the border of the window when it is inactive.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'activityBar.background',
                description: 'Activity bar background color. The activity bar is showing on the far left or right and allows to switch between views of the side bar.',
                defaults: {
                    dark: '#333333',
                    light: '#2C2C2C',
                    hc: '#000000'
                }
            },
            {
                id: 'activityBar.foreground',
                description: 'Activity bar item foreground color when it is active. The activity bar is showing on the far left or right and allows to switch between views of the side bar.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 1),
                    light: Color.rgba(255, 255, 255, 1),
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'activityBar.inactiveForeground',
                description: 'Activity bar item foreground color when it is inactive. The activity bar is showing on the far left or right and allows to switch between views of the side bar.',
                defaults: {
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'activityBar.border',
                description: 'Activity bar border color separating to the side bar. The activity bar is showing on the far left or right and allows to switch between views of the side bar.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'activityBar.activeBorder',
                description: 'Activity bar border color for the active item. The activity bar is showing on the far left or right and allows to switch between views of the side bar.',
                defaults: {
                    dark: 'activityBar.foreground',
                    light: 'activityBar.foreground'
                }
            },
            {
                id: 'activityBar.activeFocusBorder',
                description: 'Activity bar focus border color for the active item. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'
            },
            {
                id: 'activityBar.activeBackground',
                description: 'Activity bar background color for the active item. The activity bar is showing on the far left or right and allows to switch between views of the side bar.'
            },
            {
                id: 'activityBar.dropBackground',
                description: 'Drag and drop feedback color for the activity bar items. The color should have transparency so that the activity bar entries can still shine through. The activity bar is showing on the far left or right and allows to switch between views of the side bar.',
                defaults: {}
            },
            {
                id: 'activityBarBadge.background',
                description: '',
                defaults: {
                    dark: '#007ACC',
                    light: '##007acc'
                }
            },
            {
                id: 'activityBarBadge.foreground',
                description: 'Activity notification badge foreground color. The activity bar is showing on the far left or right and allows to switch between views of the side bar.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 1),
                    light: Color.rgba(255, 255, 255, 1),
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'sideBar.background',
                description: 'Side bar background color. The side bar is the container for views like explorer and search.',
                defaults: {
                    dark: '#252526',
                    light: '#F3F3F3',
                    hc: '#000000'
                }
            },
            {
                id: 'sideBar.foreground',
                description: 'Side bar foreground color. The side bar is the container for views like explorer and search.'
            },
            {
                id: 'sideBarSectionHeader.background',
                description: 'Side bar section header background color. The side bar is the container for views like explorer and search.',
                defaults: {
                    dark: '#80808033',
                    light: '#80808033'
                }
            },
            {
                id: 'sideBarSectionHeader.foreground',
                description: 'Side bar foreground color. The side bar is the container for views like explorer and search.'
            },
            {
                id: 'sideBarSectionHeader.border',
                description: 'Side bar section header border color. The side bar is the container for views like explorer and search.',
                defaults: {
                    hc: '#6FC3DF'
                }
            },
            {
                id: 'tree.inactiveIndentGuidesStroke',
                description: 'Tree stroke color for the inactive indentation guides.',
                defaults: {}
            },
            {
                id: 'editorGroup.border',
                description: 'Color to separate multiple editor groups from each other. Editor groups are the containers of editors.',
                defaults: {
                    dark: '#444444',
                    light: '#E7E7E7',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'editorGroup.dropBackground',
                description: 'Background color when dragging editors around. The color should have transparency so that the editor contents can still shine through.',
                defaults: {}
            },
            {
                id: 'editorGroupHeader.tabsBackground',
                description: 'Background color of the editor group title header when tabs are enabled. Editor groups are the containers of editors.',
                defaults: {
                    dark: '#252526',
                    light: '#F3F3F3'
                }
            },
            {
                id: 'editorGroupHeader.tabsBorder',
                description: 'Border color of the editor group title header when tabs are enabled. Editor groups are the containers of editors.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'tab.activeBackground',
                description: 'Active tab background color. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    dark: 'editor.background',
                    light: 'editor.background',
                    hc: 'editor.background'
                }
            },
            {
                id: 'tab.unfocusedActiveBackground',
                description: 'Active tab background color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    dark: 'tab.activeBackground',
                    light: 'tab.activeBackground',
                    hc: 'tab.activeBackground'
                }
            },
            {
                id: 'tab.inactiveBackground',
                description: 'Inactive tab background color. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    dark: '#2D2D2D',
                    light: '#ECECEC'
                }
            },
            {
                id: 'tab.activeForeground',
                description: 'Active tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 1),
                    light: '#333333',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'tab.inactiveForeground',
                description: 'Inactive tab foreground color in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'tab.unfocusedActiveForeground',
                description: 'Active tab foreground color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'tab.unfocusedInactiveForeground',
                description: 'Inactive tab foreground color in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'tab.border',
                description: 'Border to separate tabs from each other. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    dark: '#252526',
                    light: '#F3F3F3',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'tab.activeBorder',
                description: 'Border on the bottom of an active tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'
            },
            {
                id: 'tab.unfocusedActiveBorder',
                description: 'Border on the bottom of an active tab in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {}
            },
            {
                id: 'tab.activeBorderTop',
                description: 'Border to the top of an active tab. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    dark: 'focusBorder',
                    light: 'focusBorder'
                }
            },
            {
                id: 'tab.unfocusedActiveBorderTop',
                description: 'Border to the top of an active tab in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {}
            },
            {
                id: 'tab.hoverBackground',
                description: 'Tab background color when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'
            },
            {
                id: 'tab.unfocusedHoverBackground',
                description: 'Tab background color in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {}
            },
            {
                id: 'tab.hoverBorder',
                description: 'Border to highlight tabs when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.'
            },
            {
                id: 'tab.unfocusedHoverBorder',
                description: 'Border to highlight tabs in an unfocused group when hovering. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {}
            },
            {
                id: 'tab.activeModifiedBorder',
                description: 'Border on the top of modified (dirty) active tabs in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    dark: '#3399CC',
                    light: '#33AAEE'
                }
            },
            {
                id: 'tab.inactiveModifiedBorder',
                description: 'Border on the top of modified (dirty) inactive tabs in an active group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'tab.unfocusedActiveModifiedBorder',
                description: 'Border on the top of modified (dirty) active tabs in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'tab.unfocusedInactiveModifiedBorder',
                description: 'Border on the top of modified (dirty) inactive tabs in an unfocused group. Tabs are the containers for editors in the editor area. Multiple tabs can be opened in one editor group. There can be multiple editor groups.',
                defaults: {
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'statusBar.foreground',
                description: 'Status bar foreground color when a workspace is opened. The status bar is shown in the bottom of the window.',
                defaults: {
                    dark: '#FFFFFF',
                    light: '#FFFFFF',
                    hc: '#FFFFFF'
                }
            },
            {
                id: 'statusBar.background',
                description: 'Status bar background color when a workspace is opened. The status bar is shown in the bottom of the window.',
                defaults: {
                    dark: '#007ACC',
                    light: '#007ACC'
                }
            },
            {
                id: 'statusBar.noFolderForeground',
                description: 'Status bar foreground color when no folder is opened. The status bar is shown in the bottom of the window.',
                defaults: {
                    dark: 'statusBar.foreground',
                    light: 'statusBar.foreground',
                    hc: 'statusBar.foreground'
                }
            },
            {
                id: 'statusBar.noFolderBackground',
                description: 'Status bar background color when no folder is opened. The status bar is shown in the bottom of the window.',
                defaults: {
                    dark: '#68217A',
                    light: '#68217A'
                }
            },
            {
                id: 'statusBar.border',
                description: 'Status bar border color separating to the sidebar and editor. The status bar is shown in the bottom of the window.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'statusBar.noFolderBorder',
                description: 'Status bar border color separating to the sidebar and editor when no folder is opened. The status bar is shown in the bottom of the window.',
                defaults: {
                    dark: 'statusBar.border',
                    light: 'statusBar.border',
                    hc: 'statusBar.border'
                }
            },
            {
                id: 'statusBarItem.activeBackground',
                description: 'Status bar item background color when clicking. The status bar is shown in the bottom of the window.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 0.18),
                    light: Color.rgba(255, 255, 255, 0.18),
                    hc: Color.rgba(255, 255, 255, 0.18),
                }
            },
            {
                id: 'statusBarItem.hoverBackground',
                description: 'Status bar item background color when hovering. The status bar is shown in the bottom of the window.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 0.12),
                    light: Color.rgba(255, 255, 255, 0.12),
                    hc: Color.rgba(255, 255, 255, 0.12),
                }
            },
            {
                id: 'quickInput.background',
                description: 'Quick Input background color. The Quick Input widget is the container for views like the color theme picker.',
                defaults: {
                    dark: 'sideBar.background',
                    light: 'sideBar.background',
                    hc: 'sideBar.background'
                }
            },
            {
                id: 'quickInput.foreground',
                description: 'Quick Input foreground color. The Quick Input widget is the container for views like the color theme picker.',
                defaults: {
                    dark: 'sideBar.foreground',
                    light: 'sideBar.foreground',
                    hc: 'sideBar.foreground'
                }
            },
            {
                id: 'panel.background',
                description: 'Panel background color. Panels are shown below the editor area and contain views like output and integrated terminal.',
                defaults: {
                    dark: 'editor.background',
                    light: 'editor.background',
                    hc: 'editor.background'
                }
            },
            {
                id: 'panel.border',
                description: 'Panel border color to separate the panel from the editor. Panels are shown below the editor area and contain views like output and integrated terminal.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'panel.dropBackground',
                description: 'Drag and drop feedback color for the panel title items. The color should have transparency so that the panel entries can still shine through. Panels are shown below the editor area and contain views like output and integrated terminal.',
                defaults: {
                    dark: Color.rgba(255, 255, 255, 0.12),
                    hc: Color.rgba(255, 255, 255, 0.12),
                }
            },
            {
                id: 'panelTitle.activeForeground',
                description: 'Title color for the active panel. Panels are shown below the editor area and contain views like output and integrated terminal.',
                defaults: {
                    dark: '#E7E7E7',
                    light: '#424242',
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'panelTitle.inactiveForeground',
                description: 'Title color for the inactive panel. Panels are shown below the editor area and contain views like output and integrated terminal.',
                defaults: {
                    hc: Color.rgba(255, 255, 255, 1),
                }
            },
            {
                id: 'panelTitle.activeBorder',
                description: 'Border color for the active panel title. Panels are shown below the editor area and contain views like output and integrated terminal.',
                defaults: {
                    dark: 'panelTitle.activeForeground',
                    light: 'panelTitle.activeForeground',
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'panelInput.border',
                description: 'Input box border for inputs in the panel.',
                defaults: {
                    light: '#ddd'
                }
            },
            {
                id: 'imagePreview.border',
                description: 'Border color for image in image preview.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'titleBar.activeForeground',
                description: 'Title bar foreground when the window is active. Note that this color is currently only supported on macOS.',
                defaults: {
                    dark: '#CCCCCC',
                    light: '#333333',
                    hc: '#FFFFFF'
                }
            },
            {
                id: 'titleBar.inactiveForeground',
                description: 'Title bar foreground when the window is inactive. Note that this color is currently only supported on macOS.',
                defaults: {}
            },
            {
                id: 'titleBar.activeBackground',
                description: 'Title bar background when the window is active. Note that this color is currently only supported on macOS.',
                defaults: {
                    dark: '#3C3C3C',
                    light: '#DDDDDD',
                    hc: '#000000'
                }
            },
            {
                id: 'titleBar.inactiveBackground',
                description: 'Title bar background when the window is inactive. Note that this color is currently only supported on macOS.',
                defaults: {}
            },
            {
                id: 'titleBar.border',
                description: 'Title bar border color. Note that this color is currently only supported on macOS.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'menubar.selectionForeground',
                description: 'Foreground color of the selected menu item in the menubar.',
                defaults: {
                    dark: 'titleBar.activeForeground',
                    light: 'titleBar.activeForeground',
                    hc: 'titleBar.activeForeground'
                }
            },
            {
                id: 'menubar.selectionBackground',
                description: 'Background color of the selected menu item in the menubar.',
                defaults: {}
            },
            {
                id: 'menubar.selectionBorder',
                description: 'Border color of the selected menu item in the menubar.',
                defaults: {
                    hc: 'activeContrastBorder'
                }
            },
            {
                id: 'welcomePage.background',
                description: 'Background color for the Welcome page.'
            },
            {
                id: 'welcomePage.buttonBackground',
                description: 'Background color for the buttons on the Welcome page.',
                defaults: {
                    dark: Color.rgba(0, 0, 0, 0.2),
                    light: Color.rgba(0, 0, 0, 0.04),
                    hc: Color.rgba(0, 0, 0, 1),
                }
            },
            {
                id: 'welcomePage.buttonHoverBackground',
                description: 'Hover background color for the buttons on the Welcome page.',
                defaults: {
                    dark: Color.rgba(200, 235, 255, 0.072),
                    light: Color.rgba(0, 0, 0, 0.1),
                }
            },
            {
                id: 'walkThrough.embeddedEditorBackground',
                description: 'Background color for the embedded editors on the Interactive Playground.',
                defaults: {
                    dark: Color.rgba(0, 0, 0, 0.4),
                    light: '#f4f4f4'
                }
            },
            {
                id: 'settings.headerForeground',
                description: 'The foreground color for a section header or active title.',
                defaults: {
                    dark: '#e7e7e7',
                    light: '#444444',
                    hc: '#ffffff'
                }
            },
            {
                id: 'settings.modifiedItemIndicator',
                description: 'The color of the modified setting indicator.',
                defaults: {
                    dark: Color.rgba(12, 125, 157, 1),
                    light: Color.rgba(102, 175, 224, 1),
                    hc: Color.rgba(0, 73, 122, 1),
                }
            },
            {
                id: 'settings.dropdownBackground',
                description: 'Settings editor dropdown background.',
                defaults: {
                    dark: 'dropdown.background',
                    light: 'dropdown.background',
                    hc: 'dropdown.background'
                }
            },
            {
                id: 'settings.dropdownForeground',
                description: 'Settings editor dropdown foreground.',
                defaults: {
                    dark: 'dropdown.foreground',
                    light: 'dropdown.foreground',
                    hc: 'dropdown.foreground'
                }
            },
            {
                id: 'settings.dropdownBorder',
                description: 'Settings editor dropdown border.',
                defaults: {
                    dark: 'dropdown.border',
                    light: 'dropdown.border',
                    hc: 'dropdown.border'
                }
            },
            {
                id: 'settings.dropdownListBorder',
                description: 'Settings editor dropdown list border. This surrounds the options and separates the options from the description.',
                defaults: {
                    dark: 'editorWidget.border',
                    light: 'editorWidget.border',
                    hc: 'editorWidget.border'
                }
            },
            {
                id: 'settings.checkboxBackground',
                description: 'Settings editor checkbox background.',
                defaults: {
                    dark: 'checkbox.background',
                    light: 'checkbox.background',
                    hc: 'checkbox.background'
                }
            },
            {
                id: 'settings.checkboxForeground',
                description: 'Settings editor checkbox foreground.',
                defaults: {
                    dark: 'checkbox.foreground',
                    light: 'checkbox.foreground',
                    hc: 'checkbox.foreground'
                }
            },
            {
                id: 'settings.checkboxBorder',
                description: 'Settings editor checkbox border.',
                defaults: {
                    dark: 'checkbox.border',
                    light: 'checkbox.border',
                    hc: 'checkbox.border'
                }
            },
            {
                id: 'settings.textInputBackground',
                description: 'Settings editor text input box background.',
                defaults: {
                    dark: 'input.background',
                    light: 'input.background',
                    hc: 'input.background'
                }
            },
            {
                id: 'settings.textInputForeground',
                description: 'Settings editor text input box foreground.',
                defaults: {
                    dark: 'input.foreground',
                    light: 'input.foreground',
                    hc: 'input.foreground'
                }
            },
            {
                id: 'settings.textInputBorder',
                description: 'Settings editor text input box border.',
                defaults: {
                    dark: 'input.border',
                    light: 'input.border',
                    hc: 'input.border'
                }
            },
            {
                id: 'settings.numberInputBackground',
                description: 'Settings editor number input box background.',
                defaults: {
                    dark: 'input.background',
                    light: 'input.background',
                    hc: 'input.background'
                }
            },
            {
                id: 'settings.numberInputForeground',
                description: 'Settings editor number input box foreground.',
                defaults: {
                    dark: 'input.foreground',
                    light: 'input.foreground',
                    hc: 'input.foreground'
                }
            },
            {
                id: 'settings.numberInputBorder',
                description: 'Settings editor number input box border.',
                defaults: {
                    dark: 'input.border',
                    light: 'input.border',
                    hc: 'input.border'
                }
            },
            {
                id: 'variable.name.color',
                description: 'Color of a variable name.',
                defaults: {
                    dark: '#C586C0',
                    light: '#9B46B0',
                    hc: '#C586C0'
                }
            },
            {
                id: 'variable.value.color',
                description: 'Color of a variable value.',
                defaults: {
                    dark: Color.rgba(204, 204, 204, 0.6),
                    light: Color.rgba(108, 108, 108, 0.8),
                    hc: Color.rgba(204, 204, 204, 0.6),
                }
            },
            {
                id: 'variable.number.variable.color',
                description: 'Value color of a number variable',
                defaults: {
                    dark: '#B5CEA8',
                    light: '#09885A',
                    hc: '#B5CEA8'
                }
            },
            {
                id: 'variable.boolean.variable.color',
                description: 'Value color of a boolean variable',
                defaults: {
                    dark: '#4E94CE',
                    light: '#0000FF',
                    hc: '#4E94CE'
                }
            },
            {
                id: 'variable.string.variable.color',
                description: 'Value color of a string variable',
                defaults: {
                    dark: '#CE9178',
                    light: '#A31515',
                    hc: '#CE9178'
                }
            },
            {
                id: 'ansi.black.color',
                description: 'ANSI black color',
                defaults: {
                    dark: '#A0A0A0',
                    light: Color.rgba(128, 128, 128, 1),
                    hc: '#A0A0A0'
                }
            },
            {
                id: 'ansi.red.color',
                description: 'ANSI red color',
                defaults: {
                    dark: '#A74747',
                    light: '#BE1717',
                    hc: '#A74747'
                }
            },
            {
                id: 'ansi.green.color',
                description: 'ANSI green color',
                defaults: {
                    dark: '#348F34',
                    light: '#338A2F',
                    hc: '#348F34'
                }
            },
            {
                id: 'ansi.yellow.color',
                description: 'ANSI yellow color',
                defaults: {
                    dark: '#5F4C29',
                    light: '#BEB817',
                    hc: '#5F4C29'
                }
            },
            {
                id: 'ansi.blue.color',
                description: 'ANSI blue color',
                defaults: {
                    dark: '#6286BB',
                    light: Color.rgba(0, 0, 139, 1),
                    hc: '#6286BB'
                }
            },
            {
                id: 'ansi.magenta.color',
                description: 'ANSI magenta color',
                defaults: {
                    dark: '#914191',
                    light: Color.rgba(139, 0, 139, 1),
                    hc: '#914191'
                }
            },
            {
                id: 'ansi.cyan.color',
                description: 'ANSI cyan color',
                defaults: {
                    dark: '#218D8D',
                    light: Color.rgba(0, 139, 139, 1),
                    hc: '#218D8D'
                }
            },
            {
                id: 'ansi.white.color',
                description: 'ANSI white color',
                defaults: {
                    dark: '#707070',
                    light: '#BDBDBD',
                    hc: '#707070'
                }
            },
            {
                id: 'errorBackground',
                description: 'Background color of error widgets (like alerts or notifications).',
                defaults: {
                    dark: 'inputValidation.errorBackground',
                    light: 'inputValidation.errorBackground',
                    hc: 'inputValidation.errorBackground'
                }
            },
            {
                id: 'successBackground',
                description: 'Background color of success widgets (like alerts or notifications).',
                defaults: {
                    dark: 'editorGutter.addedBackground',
                    light: 'editorGutter.addedBackground',
                    hc: 'editorGutter.addedBackground'
                }
            },
            {
                id: 'warningBackground',
                description: 'Background color of warning widgets (like alerts or notifications).',
                defaults: {
                    dark: 'editorWarning.foreground',
                    light: 'editorWarning.foreground',
                    hc: 'editorWarning.border'
                }
            },
            {
                id: 'warningForeground',
                description: 'Foreground color of warning widgets (like alerts or notifications).',
                defaults: {
                    dark: 'inputValidation.warningBackground',
                    light: 'inputValidation.warningBackground',
                    hc: 'inputValidation.warningBackground'
                }
            },
            {
                id: 'statusBar.offlineBackground',
                description: 'Background of hovered statusbar item in case the theia server is offline.',
                defaults: {
                    dark: 'editorWarning.foreground',
                    light: 'editorWarning.foreground',
                    hc: 'editorWarning.foreground'
                }
            },
            {
                id: 'statusBar.offlineForeground',
                description: 'Background of hovered statusbar item in case the theia server is offline.',
                defaults: {
                    dark: 'editor.background',
                    light: 'editor.background',
                    hc: 'editor.background'
                }
            },
            {
                id: 'statusBarItem.offlineHoverBackground',
                description: 'Background of hovered statusbar item in case the theia server is offline.',
                defaults: {}
            },
            {
                id: 'statusBarItem.offlineActiveBackground',
                description: 'Background of active statusbar item in case the theia server is offline.',
                defaults: {}
            },
            {
                id: 'secondaryButton.foreground',
                description: 'Foreground color of secondary buttons.',
                defaults: {
                    dark: 'dropdown.foreground',
                    light: 'dropdown.foreground',
                    hc: 'dropdown.foreground'
                }
            },
            {
                id: 'secondaryButton.disabledForeground',
                description: 'Foreground color of secondary buttons.',
                defaults: {}
            },
            {
                id: 'secondaryButton.background',
                description: 'Background color of secondary buttons.',
                defaults: {}
            },
            {
                id: 'secondaryButton.hoverBackground',
                description: 'Background color when hovering secondary buttons.',
                defaults: {}
            },
            {
                id: 'secondaryButton.disabledBackground',
                description: 'Background color when hovering secondary buttons.',
                defaults: {}
            },
            {
                id: 'button.disabledForeground',
                description: 'Foreground color of secondary buttons.',
                defaults: {}
            },
            {
                id: 'button.disabledBackground',
                description: 'Background color of secondary buttons.',
                defaults: {}
            },
            {
                id: 'notificationCenter.border',
                description: 'Notifications center border color. Notifications slide in from the bottom right of the window.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'notificationToast.border',
                description: 'Notification toast border color. Notifications slide in from the bottom right of the window.',
                defaults: {
                    hc: 'contrastBorder'
                }
            },
            {
                id: 'notifications.foreground',
                description: 'Notifications foreground color. Notifications slide in from the bottom right of the window.',
                defaults: {
                    dark: 'editorWidget.foreground',
                    light: 'editorWidget.foreground',
                    hc: 'editorWidget.foreground'
                }
            },
            {
                id: 'notifications.background',
                description: 'Notifications background color. Notifications slide in from the bottom right of the window.',
                defaults: {
                    dark: 'editorWidget.background',
                    light: 'editorWidget.background',
                    hc: 'editorWidget.background'
                }
            },
            {
                id: 'notificationLink.foreground',
                description: 'Notification links foreground color. Notifications slide in from the bottom right of the window.',
                defaults: {
                    dark: 'textLink.foreground',
                    light: 'textLink.foreground',
                    hc: 'textLink.foreground'
                }
            },
            {
                id: 'notificationCenterHeader.foreground',
                description: 'Notifications center header foreground color. Notifications slide in from the bottom right of the window.'
            },
            {
                id: 'notificationCenterHeader.background',
                description: 'Notifications center header background color. Notifications slide in from the bottom right of the window.',
                defaults: {
                    hc: 'notifications.background'
                }
            },
            {
                id: 'notifications.border',
                description: 'Notifications border color separating from other notifications in the notifications center. Notifications slide in from the bottom right of the window.',
                defaults: {
                    dark: 'notificationCenterHeader.background',
                    light: 'notificationCenterHeader.background',
                    hc: 'notificationCenterHeader.background'
                }
            },
            {
                id: 'notificationsErrorIcon.foreground',
                description: 'The color used for the icon of error notifications. Notifications slide in from the bottom right of the window.',
                defaults: {
                    dark: 'editorError.foreground',
                    light: 'editorError.foreground',
                    hc: 'editorError.foreground'
                }
            },
            {
                id: 'notificationsWarningIcon.foreground',
                description: 'The color used for the icon of warning notifications. Notifications slide in from the bottom right of the window.',
                defaults: {
                    dark: 'editorWarning.foreground',
                    light: 'editorWarning.foreground',
                    hc: 'editorWarning.foreground'
                }
            },
            {
                id: 'notificationsInfoIcon.foreground',
                description: 'The color used for the icon of info notifications. Notifications slide in from the bottom right of the window.',
                defaults: {
                    dark: 'editorInfo.foreground',
                    light: 'editorInfo.foreground',
                    hc: 'editorInfo.foreground'
                }
            },
            {
                id: 'sideBarTitle.foreground',
                description: '',
                defaults: {
                    dark: '#BBBBBB',
                    light: '#6F6F6F'
                }
            },
            {
                id: 'statusBarItem.remoteForeground',
                description: '',
                defaults: {
                    dark: '#FFF'
                }
            },
            {
                id: 'statusBarItem.remoteBackground',
                description: '',
                defaults: {
                    dark: '#16825D',
                    hc: '#000000'
                }
            });
    }

}
