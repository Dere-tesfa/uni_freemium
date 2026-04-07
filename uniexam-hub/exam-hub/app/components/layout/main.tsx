import { Outlet, useLoaderData } from 'react-router';
import { Header } from './header';
import { Footer } from './footer';
export default function MainLayout() {
    const user = null;
    
    return (
        <div className="min-h-screen flex flex-col bg-background text-foreground">
            <Header user={user} />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
        </div>
    );
}
