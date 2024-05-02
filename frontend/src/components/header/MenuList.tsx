import styled from '@emotion/styled';
import { cssColors } from '../../style/values';

export const MenuList = styled('div')({
  padding: 0,
  display: 'flex',
  flexDirection: 'row',
  width: '100%',
  borderTop: `1px solid  ${cssColors.darkBorder}`,
  borderBottom: `1px solid  ${cssColors.darkBorder}`,
});
