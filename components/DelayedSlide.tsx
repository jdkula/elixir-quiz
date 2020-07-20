import { Slide, SlideProps } from '@material-ui/core';
import { ReactElement } from 'react';

export default function DelayedSlide(props: SlideProps & { delay?: number }): ReactElement {
    return <Slide {...props} style={{ transitionDelay: props.delay ? `${props.delay}ms` : '0ms' }} />;
}
