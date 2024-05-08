import { useGetLatestPostsQuery } from '../../store/postApi';
import { LoadingSpinner } from '../common/LoadingSpinner';
import { SideBar } from '../frame/SideBar';
import { SideBarContainer } from '../sidebar/SideBarContainer';

export const DefaultSideBar: React.FC = () => {
  const latestPosts = useGetLatestPostsQuery();

  return (
    <SideBar>
      <SideBarContainer title={'Latest Posts'}>
        {latestPosts.isFetching ? (
          <LoadingSpinner loadingText="Loading latests posts..." />
        ) : (
          <div>
            {latestPosts.data?.map((post) => {
              return (
                <div key={post.id}>
                  <p>{post.title.content}</p>
                  <p>
                    {post.author} | {post.type}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </SideBarContainer>
    </SideBar>
  );
};
