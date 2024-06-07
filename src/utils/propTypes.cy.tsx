// import React from 'react';
// import PropTypes from 'prop-types';

// import { render, cleanup } from '../test-utils/utils/unit';
// import { allValidators } from './propTypes';

// describe('Utils: propTypes', () => {
//     describe('allValidators', () => {
//         let consoleErrorSpy;

//         beforeEach(() => {
//             consoleErrorSpy = jest.spyOn(global.console, 'error').mockImplementation(jest.fn());
//         });

//         afterEach(() => {
//             consoleErrorSpy.mockRestore();
//             cleanup();
//             jest.resetModules();
//         });

//         it('should not log error return undefined when all validators pass', () => {
//             const Comp = () => <div />;
//             Comp.propTypes = {
//                 value: allValidators(PropTypes.number, () => undefined)
//             };
//             render(<Comp />);
//             expect(consoleErrorSpy).toHaveBeenCalledTimes(0);
//         });

//         it('should log errors for both validators', () => {
//             const Comp = () => <div />;
//             Comp.propTypes = {
//                 value: allValidators(PropTypes.number, () => new Error('my error'))
//                 // value: PropTypes.number,
//             };

//             render(<Comp value={'invalid value'} />);
//             expect(consoleErrorSpy).toHaveBeenCalledTimes(2);
//             expect(consoleErrorSpy.mock.calls[0][0]).toEqual(expect.stringContaining(`Invalid value`));
//             expect(consoleErrorSpy.mock.calls[1][0]).toEqual(expect.stringContaining(`my error`));
//         });
//     });
// });
