import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';
import { useAppSelector } from '../../store/rootStore';

const MainContentElement = styled('main')<{ editPadding: boolean }>((props) => ({
  padding: '2rem',
  fontFamily: 'Roboto',
  width: '100%',
  paddingBottom: props.editPadding ? '20rem' : '2rem',
}));

export const MainContent: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
  const isEditing = useAppSelector((state) => state.editableStore.editing);
  return (
    <MainContentElement id="content" editPadding={isEditing}>
      {props.children}
    </MainContentElement>
  );
};
