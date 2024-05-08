import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

const MainContentElement = styled('main')({
  padding: '2rem',
  fontFamily: 'Roboto',
  width: '100%',
  paddingBottom: '5rem',
});

export const MainContent: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
  return <MainContentElement id="content">{props.children}</MainContentElement>;
};
