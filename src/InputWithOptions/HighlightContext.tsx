import { createContext } from 'react';

interface HighlightContextInterface {
    highlight: boolean;
    match?: string | number;
}

const HighlightContext = createContext<HighlightContextInterface>({ highlight: false, match: '' });

export default HighlightContext;
