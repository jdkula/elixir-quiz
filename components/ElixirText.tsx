import { Typography, TypographyProps } from '@material-ui/core';
import { ElixirType, getElixir } from '~/lib/elixir';
import styled from 'styled-components';

interface Props extends TypographyProps {
    $elixir?: ElixirType;
    $bold?: boolean;
    component?: string; // is not on TypographyProps for some reason...
}

const ElixirText = styled(Typography)<Props>`
    font-weight: ${({ $bold: bold }) => (bold ? 'bold' : undefined)};
    color: ${({ $elixir: elixir }) => getElixir(elixir)?.color ?? ''};
`;

export default ElixirText;
