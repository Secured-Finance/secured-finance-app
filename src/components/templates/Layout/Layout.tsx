import { Route, Switch } from 'react-router-dom';

export const Layout = ({
    routes,
    navBar,
}: {
    routes: Readonly<
        Array<{
            path: string;
            component: React.ReactNode;
        }>
    >;
    navBar: React.ReactNode;
}) => {
    return (
        <div className='flex max-w-full flex-col items-stretch justify-center'>
            <header>{navBar}</header>
            <main>
                <Switch>
                    {routes.map(({ path, component }) => (
                        <Route path={path} key={path}>
                            {component}
                        </Route>
                    ))}
                </Switch>
            </main>
        </div>
    );
};
