import { isRouteErrorResponse, useRouteError } from 'react-router-dom';
import { DefaultSideBar } from '../components/elements/DefaultSideBar';
import { MainContent } from '../components/frame/MainContent';
export const ErrorPage: React.FC = () => {
  const error = useRouteError();
  return (
    <>
      <DefaultSideBar />
      <MainContent>
        <div>
          <p>Oops, some kind of error happened!</p>
          {isRouteErrorResponse(error) && (
            <p>
              <i>
                {error.status} {error.data}
              </i>
            </p>
          )}
        </div>
      </MainContent>
    </>
  );
};
