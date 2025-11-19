import { Grid2x2Plus, Gauge, ShoppingCart, PackagePlus, ChartNoAxesCombined, FileSymlink, ChartNetwork, ChevronDown, MapPin, Wrench, Headset, BookMarked, MonitorCheck, Truck, ChartPie, IdCard, FileText, UserPlus, CalendarDays, CreditCard, FolderCode,  UsersRound, NotebookTabs } from 'lucide-react';
import { useState } from 'react';
interface BaseNavItem {
    id: number;
    name: string;
    icon: React.ReactNode;
}
import { useLocation } from "react-router-dom";
interface NavLink extends BaseNavItem {
    link: string;
    subnav?: never;
}

interface NavGroup extends BaseNavItem {
    link?: never;
    subnav: NavItem[];
}
type OpenNavState = {
    [key: number]: boolean;
};
type NavItem = NavLink | NavGroup;
export default function NavigationLinks() {
    const location = useLocation();
    const navLinks: NavItem[] = [
        {
            id: 1,
            name: "Executive Dashboard",
            icon: <Gauge />,
            link: "/admin"
        },
        {
            id: 2,
            name: "Sales",
            icon: <ShoppingCart />,
            subnav: [
                {
                    id: 11,
                    name: "Add Lead",
                    icon: <PackagePlus />,
                    link: "/products/electronics"
                },
                {
                    id: 12,
                    name: "Lead Management",
                    icon: <ChartNoAxesCombined />,
                    link: "/products/clothing"
                },
                {
                    id: 13,
                    name: "Quote Management",
                    icon: <FileSymlink />,
                    link: "/products/clothing"
                },
                {
                    id: 14,
                    name: "Sales Analytics",
                    icon: <ChartNetwork />,
                    link: "/products/clothing"
                },
            ]
        },
        {
            id: 3,
            name: "Services",
            icon: <Grid2x2Plus />,
            subnav: [
                {
                    id: 21,
                    name: "Site Visits",
                    icon: <MapPin />,
                    link: "/products/electronics"
                },
                {
                    id: 22,
                    name: "Installation",
                    icon: <Wrench />,
                    link: "/products/clothing"
                },
                {
                    id: 23,
                    name: "Support Tickets",
                    icon: <Headset />,
                    link: "/products/clothing"
                }
            ]
        },
        {
            id: 4,
            name: "Procurement",
            icon: <UsersRound />,
            subnav: [
                {
                    id: 31,
                    name: "Purchase Requests",
                    icon: <BookMarked />,
                    link: "/products/electronics"
                },
                {
                    id: 32,
                    name: "Purchase Orders",
                    icon: <MonitorCheck />,
                    link: "/products/clothing"
                },
                {
                    id: 33,
                    name: "Vendor Management",
                    icon: <Truck />,
                    link: "/products/clothing"
                }
            ]
        },
        {
            id: 5,
            name: "Accounts",
            icon: <NotebookTabs />,
            subnav: [
                {
                    id: 41,
                    name: "Invoices",
                    icon: <FileText />,
                    link: "/products/electronics"
                },
                {
                    id: 42,
                    name: "Payments",
                    icon: <IdCard />,
                    link: "/products/clothing"
                },
                {
                    id: 43,
                    name: "Financial Reports",
                    icon: <ChartPie />,
                    link: "/products/clothing"
                }
            ]
        },
        {
            id: 6,
            name: "Human Resources",
            icon: <Grid2x2Plus />,
            subnav: [
                {
                    id: 51,
                    name: "Recruitment",
                    icon: <UserPlus />,
                    link: "/products/electronics"
                },
                {
                    id: 52,
                    name: "Attendance",
                    icon: <CalendarDays />,
                    link: "/products/clothing"
                },
                {
                    id: 53,
                    name: "Payroll",
                    icon: <CreditCard />,
                    link: "/products/clothing"
                }
            ]
        },
        {
            id: 7,
            name: "IT Suppport",
            icon: <FolderCode />,
            link: "/"
        },
        {
            id: 8,
            name: "Analytics & Reports",
            icon: <ChartNoAxesCombined />,
            link: "/"
        }
    ]
    const [openNavState, setOpenNavState] = useState<OpenNavState>({});
    const toggleNavItem = (id: number) => {
        setOpenNavState(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const isNavItemOpen = (id: number): boolean => {
        return openNavState[id] || false;
    };
    return (
        <nav className='space-y-2'>
            {navLinks.map((item) => (
                <div className="nav-item" key={item.id}>
                    {'link' in item ? (
                        <a
                            href={item.link}
                            className="flex items-center gap-3 p-3 rounded-lg bg-neutral-100 data-[state=active]:bg-blue-700 data-[state=active]:text-white hover:bg-blue-700 hover:text-white transition-colors"
                            data-state={location.pathname === item.link ? 'active' : ''}
                        >
                            {item.icon}
                            <span className="font-medium">{item.name}</span>
                        </a>
                    ) : (
                        <div className="nav-group">
                            <button
                                onClick={() => toggleNavItem(item.id)}
                                className="flex items-center justify-between w-full p-3 bg-neutral-100 rounded-lg hover:bg-blue-700 hover:text-white transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {item.icon}
                                    <span className="font-medium">{item.name}</span>
                                </div>
                                <ChevronDown
                                    className={`transform transition-transform ${isNavItemOpen(item.id) ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            {isNavItemOpen(item.id) && (
                                <div className="submenu mt-1  space-y-1 bg-blue-100 rounded-lg">
                                    {item.subnav.map((subnav) => (
                                        <a
                                            href={subnav.link}
                                            key={subnav.id}
                                            className="flex items-center gap-3 p-2 pl-6  rounded-lg hover:bg-blue-700 hover:text-white transition-colors"
                                        >
                                            {subnav.icon}
                                            <span>{subnav.name}</span>
                                        </a>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}