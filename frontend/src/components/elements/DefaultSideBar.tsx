// import { useInfoMutation, useLoginQuery, userApi } from '../../store/userApi';
import { useAppSelector } from '../../store/rootStore';
import { SideBar } from '../frame/SideBar';
import { SideBarContainer } from '../sidebar/SideBarContainer';

export const DefaultSideBar: React.FC = () => {
  const userInfo = useAppSelector((state) => state.userStore.userInfo);

  return (
    <SideBar>
      <SideBarContainer title={'Latest Posts'}>{userInfo && <p>{JSON.stringify(userInfo)}</p>}</SideBarContainer>
    </SideBar>
  );
};
