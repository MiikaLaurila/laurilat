import styled from '@emotion/styled';

const LogoDiv = styled('div')({
  display: 'inline-block',
  padding: '0 0.8rem',
});

const LogoLink = styled('a')({
  textDecoration: 'none',
  fontFamily: 'RobotoMono',
  fontWeight: 'bold',
  fontSize: '300%',
  userSelect: 'none',
  ':link': {
    color: 'black',
  },
  ':visited': {
    color: 'black',
  },
});

export const Logo: React.FC = () => {
  return (
    <LogoDiv>
      <LogoLink href="/">lauri.lat</LogoLink>
    </LogoDiv>
  );
};
