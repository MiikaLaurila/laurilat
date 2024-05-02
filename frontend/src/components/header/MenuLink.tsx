import isPropValid from '@emotion/is-prop-valid';
import styled, { CSSObject } from '@emotion/styled';
import { cssColors } from '../../style/values';
import { PropsWithChildren } from 'react';
import { NavLink } from 'react-router-dom';

interface Props
  extends PropsWithChildren,
  React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  alignRight?: boolean;
  hideDefault?: boolean;
  href?: string;
}

interface StyledProps {
  alignRight?: boolean;
  hideDefault?: boolean;
}

const linkStyles = (props: StyledProps): CSSObject => ({
  display: 'block',
  position: props.hideDefault ? 'absolute' : 'unset',
  top: props.hideDefault ? -1000 : 'unset',
  marginLeft: props.alignRight ? 'auto' : 'initial',
  fontSize: '1rem',
  fontFamily: 'Arial, Sans-Serif',
  fontWeight: 'bold',
  textTransform: 'uppercase',
  textDecoration: 'none',
  padding: '0.2rem 0.9rem 0.3rem 0.9rem',
  ':link': {
    color: 'black',
  },
  ':visited': {
    color: 'black',
  },
  ':focus': { 
    position: 'unset',
    top: 'unset',
  },
  ':hover': {
    backgroundColor: cssColors.menuHover,
    cursor: 'pointer',
    color: cssColors.menuHoverText,
  },
  ':active': {
    backgroundColor: cssColors.menuClick,
  },
  '&.active': {
    textDecoration: 'underline',
  },
});

const MenuLinkElement = styled(NavLink, { shouldForwardProp: isPropValid })<StyledProps>(linkStyles);

const MenuLinkElementButton = styled('span')<StyledProps>(linkStyles);

export const MenuLink: React.FC<Props> = (props: Props) => {
  return props.href ? (
    <MenuLinkElement alignRight={props.alignRight} hideDefault={props.hideDefault} to={props.href} {...props}>
      {props.children}
    </MenuLinkElement>
  ) : (
    <MenuLinkElementButton alignRight={props.alignRight} hideDefault={props.hideDefault} {...props}>
      {props.children}
    </MenuLinkElementButton>
  );
};
