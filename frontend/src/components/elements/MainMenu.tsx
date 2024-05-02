import { MenuNav } from '../header/MenuNav';
import { MenuList } from '../header/MenuList';
import { MenuLink } from '../header/MenuLink';
import { useLogoutMutation, useUserInfoQuery } from '../../store/userApi';
import { useAppSelector } from '../../store/rootStore';

export const MainMenu: React.FC = () => {
  const userInfo = useAppSelector((state) => state.userStore.userInfo);
  useUserInfoQuery();

  const [logoutTrigger] = useLogoutMutation();

  const onLogoutClick = () => {
    logoutTrigger().then((response) => {
      if ('error' in response) {
        console.error(response);
      }
    });
  };

  return (
    <MenuNav aria-label="Main Menu">
      <MenuList>
        <MenuLink href="/">Home</MenuLink>
        <MenuLink href="/people">People</MenuLink>
        <MenuLink href="/food">Food</MenuLink>
        <MenuLink href="/games">Games</MenuLink>
        <MenuLink href="/sports">Sports</MenuLink>
        <MenuLink href="/other">Other</MenuLink>
        {userInfo?.username ? (
          <>
            <MenuLink alignRight href="/user">{`User Page (${userInfo.username})`}</MenuLink>
            <MenuLink onClick={onLogoutClick}>Log Out</MenuLink>
          </>
        ) : (
          <MenuLink alignRight href="/login">
            Login
          </MenuLink>
        )}
        <MenuLink hideDefault href="#content">
          Jump To Content
        </MenuLink>
      </MenuList>
    </MenuNav>
  );
};
