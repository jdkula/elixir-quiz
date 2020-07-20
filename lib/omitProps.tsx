/**
 * omitProps.tsx
 * ==============
 *
 * Exports a function that simply prevents the props with the given
 * keys from being passed to the wrapped function.
 */
import {
    ComponentType,
    ForwardRefExoticComponent,
    PropsWithoutRef,
    RefAttributes,
    forwardRef,
    PropsWithChildren,
    Ref,
} from 'react';

type ForwardRef<P, R> = ForwardRefExoticComponent<PropsWithoutRef<P> & RefAttributes<R>>;

export default function omitProps<Props, OmittedProps extends keyof never, ExtendedProps extends Props, RefType>(
    Component: ComponentType<Props>,
    ...omittedProps: OmittedProps[]
): ForwardRef<ExtendedProps, RefType> {
    const Omitted = (props: ExtendedProps, ref: Ref<RefType>) => {
        const copy = { ...props };
        for (const omitted of omittedProps) {
            delete copy[(omitted as unknown) as keyof ExtendedProps];
        }
        const result: PropsWithChildren<Props> = copy;

        return <Component {...result} ref={ref} />;
    };

    Omitted.displayName = 'OmitProps(' + (Component.displayName || Component.name) + ')';

    const Forwarded = forwardRef(Omitted);

    return Forwarded;
}
