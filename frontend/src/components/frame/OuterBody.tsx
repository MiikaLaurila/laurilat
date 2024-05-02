import { PropsWithChildren } from 'react';
import { cssColors } from '../../style/values';
import styled from '@emotion/styled';

const BodyDiv = styled('div')({
  backgroundColor: cssColors.outerBody,
  minHeight: '100vh',
});

export const OuterBody: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
  return <BodyDiv>{props.children}</BodyDiv>;
};
