import { useNavigate } from 'react-router-dom';
import { DefaultSideBar } from '../components/elements/DefaultSideBar';
import { useAppSelector } from '../store/rootStore';
import { useUserInfoQuery } from '../store/userApi';
import { useEffect } from 'react';
import { MainContent } from '../components/frame/MainContent';
import { ContentHeader1, ContentHeader2 } from '../components/content/ContentHeader';
import { ProfileImageSelector } from '../components/form/ProfileImageSelector';
import { UserCreatorForm } from '../components/elements/UserCreatorForm';

export const UserPage: React.FC = () => {
  const userInfo = useAppSelector((state) => state.userStore.userInfo);
  const infoQuery = useUserInfoQuery();
  const navigator = useNavigate();

  useEffect(() => {
    if (infoQuery.isError) {
      navigator('/login');
    }
  }, [infoQuery, navigator]);

  return (
    <>
      <DefaultSideBar />
      <MainContent>
        <section>
          {userInfo && (
            <>
              <ContentHeader1>{userInfo.name}</ContentHeader1>
              <ProfileImageSelector currentUser={userInfo} />
              {userInfo.admin && (
                <>
                  <ContentHeader2>Create new user</ContentHeader2>
                  <UserCreatorForm />
                </>
              )}
            </>
          )}
        </section>
      </MainContent>
    </>
  );
};
