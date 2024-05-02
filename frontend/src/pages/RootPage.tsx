import { OuterBody } from '../components/frame/OuterBody';
import { Header } from '../components/frame/Header';
import { InnerBody } from '../components/frame/InnerBody';
import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { BodyLayout } from '../components/frame/BodyLayout';

interface Props extends PropsWithChildren {
  error?: React.ReactNode;
}

export const RootPage: React.FC<Props> = (props: Props) => {
  return (
    <OuterBody>
      <InnerBody>
        <Header />
        <BodyLayout>{props.error ?? <Outlet />}</BodyLayout>
      </InnerBody>
    </OuterBody>
  );
};
