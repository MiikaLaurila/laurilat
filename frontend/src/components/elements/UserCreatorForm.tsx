import { useState } from 'react';
import { Button } from '../form/Button';
import { FormContainer } from '../form/FormContainer';
import { TextInput } from '../form/TextInput';
import { CheckboxInput } from '../form/CheckboxInput';
import { NewUserPrompt } from '../../types/User';
import { useCreateUserMutation } from '../../store/userApi';
import { isServerResponseError } from '../../types/ServerResponse';

export const UserCreatorForm: React.FC = () => {
  const [username, setUsername] = useState<string>();
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [passwordRepeat, setPasswordRepeat] = useState<string>();
  const [makeAdmin, setMakeAdmin] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [triggerCreate] = useCreateUserMutation();

  const onUsernameInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setUsername(evt.currentTarget.value);
  };

  const onNameInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setName(evt.currentTarget.value);
  };

  const onEmailInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setEmail(evt.currentTarget.value);
  };

  const onPasswordInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setPassword(evt.currentTarget.value);
  };

  const onPasswordRepeatInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setPasswordRepeat(evt.currentTarget.value);
  };

  const onMakeAdminChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setMakeAdmin(evt.currentTarget.checked);
  };

  const validateInput = () => {
    if (
      username?.trim() &&
      name?.trim() &&
      email?.trim() &&
      password?.trim() &&
      passwordRepeat?.trim() &&
      password === passwordRepeat
    ) {
      const newUser: NewUserPrompt = {
        username,
        name,
        email,
        admin: makeAdmin,
        password,
      };
      return newUser;
    }
    return null;
  };

  const onLoginClick = () => {
    const newUser = validateInput();
    if (newUser) {
      triggerCreate(newUser).then((response) => {
        if ('error' in response) {
          if (isServerResponseError(response.error)) {
            setErrorMessage(response.error.data.message);
          } else {
            console.error(response);
          }
        } else {
          setErrorMessage(response.data.message);
        }
      });
    }
  };
  return (
    <FormContainer>
      <TextInput title="Username" onInput={onUsernameInput} />
      <TextInput title="Name" onInput={onNameInput} />
      <TextInput title="Email" onInput={onEmailInput} />
      <TextInput title="Password" hidden onInput={onPasswordInput} />
      <TextInput title="Password again" hidden onInput={onPasswordRepeatInput} />
      <CheckboxInput title="User is admin" id="create-user-admin" onChange={onMakeAdminChange} />
      <Button onClick={onLoginClick} disabled={!validateInput()}>
        Create User
      </Button>
      {errorMessage && <p>{errorMessage}</p>}
    </FormContainer>
  );
};
