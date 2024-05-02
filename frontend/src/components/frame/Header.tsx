import { PropsWithChildren } from 'react';
import { Logo } from '../header/Logo';
import { MainMenu } from '../elements/MainMenu';

export const Header: React.FC<PropsWithChildren> = (props: PropsWithChildren) => {
  return (
    <header>
      <Logo />
      <MainMenu />
      {props.children}
    </header>
  );
};
