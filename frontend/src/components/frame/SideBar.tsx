import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

const SidebarContainer = styled('div')({
  width: 240,
  display: 'flex',
  flexDirection: 'column',
});

export const SideBar: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
  return <SidebarContainer>{props.children}</SidebarContainer>;
};
