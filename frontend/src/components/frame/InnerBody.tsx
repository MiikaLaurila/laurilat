import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';
import { cssColors, cssWidths } from '../../style/values';

const ContentDiv = styled('div')({
  maxWidth: `${cssWidths.innerBody}rem`,
  marginLeft: 'auto',
  marginRight: 'auto',
  backgroundColor: cssColors.innerBody,
});

export const InnerBody: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
  return <ContentDiv>{props.children}</ContentDiv>;
};
