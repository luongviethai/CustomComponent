import { memo } from 'react';
import reactCSS from 'reactcss';
import { dataHooks } from './constants';

type SliderPointerProps = {
    direction?: string;
};

function SliderPointer(props: SliderPointerProps) {
    const { direction } = props;

    const styles = reactCSS(
        {
            vertical: {
                picker: {
                    width: '24px',
                    height: '25px',
                    borderRadius: '50%',
                    transform: 'translate(-2px, -12px)',
                    backgroundColor: 'rgb(248, 248, 248)',
                    boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.37)',
                    cursor: 'ns-resize'
                }
            },
            default: {
                picker: {
                    transform: 'translate(-2px, -9px)',
                    height: '8px',
                    background: '',
                    border: '2px solid #FFF',
                    borderRadius: ''
                }
            }
        },
        { vertical: direction === 'vertical' }
    );

    return <div style={styles.picker} data-hook={dataHooks.pointerPicker} className="pointer-picker" />;
}

export default memo(SliderPointer);
