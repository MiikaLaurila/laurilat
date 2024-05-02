import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

const BodyLayoutElement = styled('div')({
  display: 'flex',
  flexDirection: 'row',
});

export const BodyLayout: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
  return <BodyLayoutElement>{props.children}</BodyLayoutElement>;
};
