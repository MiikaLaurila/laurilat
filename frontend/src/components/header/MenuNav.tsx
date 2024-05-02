import styled from '@emotion/styled';
import { cssColors, cssWidths } from '../../style/values';

export const MenuNav = styled('nav')({
  width: `${cssWidths.innerBody}rem`,
  height: '2.1rem',
  borderTop: `1px solid ${cssColors.border}`,
  borderBottom: `1px solid ${cssColors.border}`,
});
