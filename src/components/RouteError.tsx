
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom';
import { buttonVariants } from './ui/button';
import DashboardHeader from './custom/DashHeader';

const RouteError = () => {
    const error = useRouteError();

    if (isRouteErrorResponse(error)) {
        return (
            <>
                <DashboardHeader />
                <div className="min-h-screen flex items-center justify-center bg-white">
                    <div className="bg-white p-8 rounded-lg  max-w-md w-full">

                        <h1 className="text-3xl font-bold text-gray-800 text-center mb-[-20px] relative z-10 ">
                            {error.status} {error.statusText}
                        </h1>
                        <img src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif" />
                        <div className='text-3xl font-bold text-center mt-[-50px]'>Look like you're lost</div>
                        <div className='text-center capitalize mt-1.5'>the page you are looking for not avaible!</div>
                        <div className='text-center mt-3.5'><Link to="/dashboard" className={buttonVariants({

                        })}>Back to Dashboard</Link></div>
                        {/* <p className="text-gray-600 mb-4">{error.data}</p> */}
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <DashboardHeader />
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Oops!</h1>
                    <p className="text-gray-600 mb-4">
                        Sorry, an unexpected error has occurred.
                    </p>
                    <p className="text-sm text-gray-500">
                        {(error as Error)?.message || 'Unknown error'}
                    </p>
                </div>
            </div>
        </>
    );
};

export default RouteError;