import { Route, Switch } from 'react-router-dom';
import { Header } from 'src/components/organisms';

export const Layout = ({
    routes,
}: {
    routes: Readonly<
        Array<{
            path: string;
            component: React.ReactNode;
        }>
    >;
}) => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <header className='w-full'>
                <Header />
            </header>
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
