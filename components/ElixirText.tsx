import { withStyles, Typography, TypographyProps } from '@material-ui/core';
import { ElixirType, getElixir } from '~/lib/elixir';
import omitProps from '~/lib/omitProps';
import { FC } from 'react';

interface Props extends TypographyProps {
    elixir?: ElixirType;
    bold?: boolean;
    component?: string; // is not on TypographyProps for some reason...
}

const ElixirText = withStyles({
    root: {
        fontWeight: ({ bold }: Props) => (bold ? 'bold' : undefined),
        color: ({ elixir }: Props) => getElixir(elixir)?.color ?? undefined,
    },
})(omitProps(Typography, 'elixir', 'bold')) as FC<Props>;

export default ElixirText;
