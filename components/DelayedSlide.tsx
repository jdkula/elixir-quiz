import { Slide, SlideProps } from '@material-ui/core';
import { FC } from 'react';

const DelayedSlide: FC<SlideProps & { delay?: number }> = ({ delay, ...rest }) => (
    <Slide {...rest} style={{ transitionDelay: delay ? `${delay}ms` : '0ms' }} />
);

export default DelayedSlide;
