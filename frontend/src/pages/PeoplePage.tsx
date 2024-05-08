import { Link, useNavigate } from 'react-router-dom';
import { ContentHeader1 } from '../components/content/ContentHeader';
import { DefaultSideBar } from '../components/elements/DefaultSideBar';
import { Button } from '../components/form/Button';
import { MainContent } from '../components/frame/MainContent';
import { useGetPostTypesQuery } from '../store/postApi';
import { PostType } from '../types/EditablePost';
import { useAppDispatch, useAppSelector } from '../store/rootStore';
import { initializeEditingNewPage } from '../store/editableSlice';
import styled from '@emotion/styled';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const PeopleContainer = styled('div')({
  paddingTop: '1rem',
  paddingBottom: '1rem',
});

export const PeoplePage: React.FC = () => {
  const peoplePosts = useGetPostTypesQuery(PostType.PEOPLE);
  const navigator = useNavigate();
  const userInfo = useAppSelector((state) => state.userStore.userInfo);
  const dispatch = useAppDispatch();

  const onNewPageClick = () => {
    if (userInfo) {
      navigator(`/people/new`);
      dispatch(initializeEditingNewPage({ type: PostType.PEOPLE, author: userInfo.username }));
    }
  };

  return (
    <>
      <DefaultSideBar />
      <MainContent>
        <ContentHeader1>People of lauri.lat</ContentHeader1>
        <PeopleContainer>
          {peoplePosts.isFetching ? (
            <LoadingSpinner loadingText={'Loading posts...'} />
          ) : (
            peoplePosts.data?.map((post) => {
              return (
                <div key={post.id}>
                  <Link to={post.alias ? `/people/${post.alias}` : `/people/${post.id}`}>
                    {post.title.content} | {post.author}
                  </Link>
                </div>
              );
            })
          )}
        </PeopleContainer>
        {userInfo?.admin && <Button onClick={onNewPageClick}>Create new page</Button>}
      </MainContent>
    </>
  );
};
