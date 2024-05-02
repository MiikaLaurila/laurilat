import { DefaultSideBar } from '../components/elements/DefaultSideBar';
import { Post } from '../components/elements/Post';
import { MainContent } from '../components/frame/MainContent';
import { PostType } from '../types/EditablePost';

export const HomePage: React.FC = () => {
  return (
    <>
      <DefaultSideBar />
      <MainContent>
        <Post postType={PostType.HOME} />
      </MainContent>
    </>
  );
};
