import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';
import { cssColors } from '../../style/values';

interface Props extends PropsWithChildren {
  title: string;
}

const Container = styled('div')({
  border: `1px solid ${cssColors.border}`,
  borderTop: `1px solid ${cssColors.darkBorder}`,
  width: 200,
  margin: 20,
});

const Title = styled('div')({
  borderBottom: `1px solid ${cssColors.border}`,
  borderTop: `1px solid ${cssColors.border}`,
  fontSize: 10,
  fontFamily: 'Arial, Sans-Serif',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  textAlign: 'center',
  paddingTop: 2,
  paddingBottom: 2,
});

const Content = styled('div')({
  borderBottom: `1px solid ${cssColors.darkBorder}`,
  borderTop: `1px solid ${cssColors.darkBorder}`,
});

export const SideBarContainer: React.FC<Props> = (props: Props) => {
  return (
    <Container>
      <Title>{props.title}</Title>
      <Content>{props.children}</Content>
    </Container>
  );
};
