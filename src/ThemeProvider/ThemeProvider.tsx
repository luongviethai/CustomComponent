import React from 'react';
import kebabCase from 'lodash/kebabCase';
import { ThemeContext } from './ThemeContext';
import type { ThemeProviderProps, ThemeInterface } from './types';

class ThemeProvider extends React.PureComponent<ThemeProviderProps> {
    static displayName = 'ThemeProvider';

    _parseTheme(theme: ThemeInterface) {
        const style = {};
        for (const [key, value] of Object.entries(theme)) {
            if (key !== 'className' && key !== 'icons' && key !== 'componentWrapper') {
                style[`--wsr-${kebabCase(key)}`] = value;
            }
        }
        return style;
    }

    render() {
        const { dataHook, theme = {}, children } = this.props;
        return (
            <div className={theme.className} style={this._parseTheme(theme)} data-hook={dataHook}>
                <ThemeContext.Provider value={{ icons: theme.icons, className: theme.className }}>
                    {theme.componentWrapper ? theme.componentWrapper({ children }) : children}
                </ThemeContext.Provider>
            </div>
        );
    }
}

export default ThemeProvider;
