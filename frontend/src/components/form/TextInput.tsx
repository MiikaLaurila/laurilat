import styled from '@emotion/styled';

interface Props {
  title: string;
  onInput?: React.FormEventHandler<HTMLInputElement>;
  defaultText?: string;
  hidden?: boolean;
}

const Title = styled('p')({
  fontSize: '1rem',
  fontFamily: 'Arial, Sans-Serif',
  textTransform: 'uppercase',
});

const Input = styled('input')({
  fontSize: '1rem',
});

export const TextInput: React.FC<Props> = (props: Props) => {
  return (
    <div>
      <Title>{props.title}</Title>
      <Input type={props.hidden ? 'password' : undefined} onInput={props.onInput} />
    </div>
  );
};
