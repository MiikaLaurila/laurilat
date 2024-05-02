import styled from '@emotion/styled';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  width?: number;
  disabled?: boolean;
}

const ButtonElement = styled('button')<{ width?: number }>((props) => ({
  width: props.width ? `${props.width}rem` : 'unset',
}));

export const Button: React.FC<Props> = (props: Props) => {
  return (
    <ButtonElement width={props.width} onClick={props.onClick} disabled={props.disabled}>
      {props.children}
    </ButtonElement>
  );
};
