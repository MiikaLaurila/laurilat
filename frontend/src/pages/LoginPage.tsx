import React, { useEffect, useState } from 'react';
import { DefaultSideBar } from '../components/elements/DefaultSideBar';
import { TextInput } from '../components/form/TextInput';
import { MainContent } from '../components/frame/MainContent';
import { ContentHeader1 } from '../components/content/ContentHeader';
import { Button } from '../components/form/Button';
import { isServerResponseError } from '../types/ServerResponse';
import { useLoginMutation } from '../store/userApi';
import { useAppSelector } from '../store/rootStore';
import { useNavigate } from 'react-router-dom';
import { FormContainer } from '../components/form/FormContainer';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>();
  const [password, setPassword] = useState<string>();
  const [errorMessage, setErrorMessage] = useState<string>();
  const userInfo = useAppSelector((state) => state.userStore.userInfo);
  const navigator = useNavigate();

  const [loginTrigger] = useLoginMutation();

  const onUsernameInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setUsername(evt.currentTarget.value);
  };

  const onPasswordInput = (evt: React.FormEvent<HTMLInputElement>) => {
    setPassword(evt.currentTarget.value);
  };

  const onLoginClick = () => {
    if (username && password) {
      loginTrigger({ username, password }).then((response) => {
        if ('error' in response) {
          if (isServerResponseError(response.error)) {
            setErrorMessage(response.error.data.message);
          } else {
            console.error(response);
          }
        }
      });
    } else {
      setErrorMessage('Invalid login information.');
    }
  };

  useEffect(() => {
    if (userInfo?.username) {
      navigator('/user');
    }
  }, [userInfo, navigator]);

  return (
    <>
      <DefaultSideBar />
      <MainContent>
        <section>
          <ContentHeader1>Login</ContentHeader1>
          <FormContainer>
            <TextInput title="Username" onInput={onUsernameInput} />
            <TextInput title="Password" hidden onInput={onPasswordInput} />
            <Button width={13} onClick={onLoginClick}>Login</Button>
          </FormContainer>
          {errorMessage && <p>{errorMessage}</p>}
        </section>
      </MainContent>
    </>
  );
};
