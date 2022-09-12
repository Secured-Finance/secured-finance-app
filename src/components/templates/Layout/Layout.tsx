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
        <div className='grid overflow-auto' data-testid='root-div'>
            <header>{navBar}</header>
            <main className='h-screen'>
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
