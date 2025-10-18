import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import {
    Eye,
    ChartBar,
    FileText,
    DollarSign,
    GitCompare as Compare,
    CaseSensitive,
    Calendar,
    Phone,
    Settings,
    CreditCard,
    BarChart3,
    Users,
    Key,
    Shield,
    Bell,
    Sliders,
    Database,
    Download,
    Ticket,
    Plus,
    BookOpen,
    MessageSquare,
    History,
    Clock,
    Book,
    Server,
    HelpCircle,
    GraduationCap,
    ThumbsUp,
    Calculator
} from "lucide-react";
interface SectionProps {
    id: string
    title: string;
    description: string;
    subnavItems?: SubnavItem[];
}
interface SubnavItem {
    id: string;
    title: string;
    href: string;
    disabled?: boolean;
    icon?: React.ReactNode;
}
export default function DashboardPage() {

    const sections: SectionProps[] = [

        {
            id: '2',
            title: 'Sales',
            description: 'Get a quick overview of your dashboard.',
            subnavItems: [
                {
                    id: "1",
                    title: "Add New Lead",
                    href: "/dashboard/leads/add",
                    disabled: false,
                    icon: <Eye size={"18px"} className="ml-0" />
                },
                {
                    id: '2',
                    title: 'View Leads',
                    href: '/dashboard/leads',
                    icon: <Eye size={"18px"}
                        className="ml-0" />
                },
                {
                    id: '4',
                    title: 'Doc Approvel',
                    href: '/dashboard/leads/approvel',
                    icon: <Eye size={"18px"}
                        className="ml-0" />
                },
                {
                    id: '4',
                    title: 'Recived Approvel',
                    href: '/dashboard/leads/approvel/list/',
                    icon: <Eye size={"18px"}
                        className="ml-0" />
                },

            ]
        },
        {
            id: '3',
            title: 'Accounts',
            description: 'Get a quick overview of your dashboard.',
            subnavItems: [
                {
                    id: '1',
                    title: 'View Leads',
                    href: '/dashboard/leads?account',
                    icon: <Eye size={"18px"}
                        className="ml-0" />
                },
                {
                    id: '4',
                    title: 'Doc Approvel',
                    href: '/dashboard/leads/approvel',
                    icon: <Eye size={"18px"}
                        className="ml-0" />
                },
                {
                    id: '4',
                    title: 'Recived Approvel',
                    href: '/dashboard/leads/approvel/list/',
                    icon: <Eye size={"18px"}
                        className="ml-0" />
                },
            ]
        },
        {
            id: '4',
            title: 'Service',
            description: 'Get a quick overview of your dashboard.',
            subnavItems: [
                {
                    id: "1",
                    title: "Inspection List",
                    href: "leads/inspection",
                    icon: <Eye size={"18px"} className="ml-0" />
                },
                {
                    id: '2',
                    title: 'View Leads',
                    href: '/dashboard/leads?account',
                    icon: <Eye size={"18px"}
                        className="ml-0" />
                },
                {
                    id: '3',
                    title: 'Doc Approvel',
                    href: '/dashboard/leads/approvel',
                    icon: <Eye size={"18px"}
                        className="ml-0" />
                },
                {
                    id: '4',
                    title: 'Recived Approvel',
                    href: '/dashboard/leads/approvel/list/',
                    icon: <Eye size={"18px"}
                        className="ml-0" />
                },

            ]
        },
        {
            id: '5',
            title: 'IT support',
            description: 'Get a quick overview of your dashboard.',
            subnavItems: [
                { id: '1', title: 'Overview', href: '/dashboard/overview', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '2', title: 'Analytics', href: '/dashboard/analytics', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '3', title: 'Reports', href: '/dashboard/reports', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '4', title: 'Price', href: '/dashboard/price', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '5', title: 'Comparisons', href: '/dashboard/comparisons', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '6', title: 'Case Studies', href: '/dashboard/case-studies', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '7', title: 'Events', href: '/dashboard/events', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '8', title: 'Contact Sales', href: '/dashboard/contact-sales', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
            ]
        },
        {
            id: '6',
            title: 'IT Department',
            description: 'Get a quick overview of your dashboard.',
            subnavItems: [
                { id: '1', title: 'Overview', href: '/dashboard/overview', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '2', title: 'Analytics', href: '/dashboard/analytics', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '3', title: 'Reports', href: '/dashboard/reports', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '4', title: 'Price', href: '/dashboard/price', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '5', title: 'Comparisons', href: '/dashboard/comparisons', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '6', title: 'Case Studies', href: '/dashboard/case-studies', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '7', title: 'Events', href: '/dashboard/events', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '8', title: 'Contact Sales', href: '/dashboard/contact-sales', disabled: true, icon: <Eye size={"18px"} className="ml-0" /> },
            ]
        },
        {
            id: '7',
            title: 'HR Department',
            description: 'Get a quick overview of your dashboard.',
            subnavItems: [
                { id: '1', title: 'Recruitment', href: 'human-resources/add-requisition/', icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '2', title: 'Employee Management', href: 'human-resources/employee-management/', icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '3', title: 'Attendance', href: 'attendance', icon: <Eye size={"18px"} className="ml-0" /> },
                { id: '4', title: 'Payroll & Compliance', href: 'payroll', icon: <Eye size={"18px"} className="ml-0" /> },

            ]
        },
        {
            id: '8',
            title: 'Procurement department',
            description: 'Get a quick overview of your dashboard.',
            subnavItems: [
                {
                    id: "1", title: "Add new Vendor", href: "vendor/add-new", icon: <Eye size={"18px"} className="ml-0" />
                },
                {
                    id: "1", title: "List of Vendor", href: "vendor/list", icon: <Eye size={"18px"} className="ml-0" />
                }
            ]
        },
    ]
    return Section ? (
        <div className=" p-4 md:pt-6 md:pb-0  md:min-h-[calc(100vh-48px)]">
            <div className="bg-white w-full overflow-hidden md:min-h-[calc(100vh-75px)]">
                <div className="flex gap-2 w-full overflow-x-auto md:min-h-[calc(100vh-75px)]">
                    {sections.map(section => (
                        <Section key={section.id} id={section.id} title={section.title} description={section.description} subnavItems={section.subnavItems} />
                    ))}
                </div>
            </div>
        </div>
    ) : null;
}

function Section({ id, title, subnavItems }: SectionProps) {
    return (
        <div key={id} className={`px-3 py-2.5 flex-1 min-w-[220px] border-none rounded shadow-none transition-shadow h-full min-h-[calc(100vh-140px)] bg-[#f8fafc]`}>
            <h2 className="relative text-[14px] text-blue-600 font-semibold mb-2 whitespace-nowrap overflow-hidden text-ellipsis ">{title}<Badge className="h-5 bg-blue-100/65 text-blue-600 font-semibold rounded-[5px] ml-1.5 min-w-[30px] px-1 font-mono tabular-nums absolute top-0 block pt-[3px] text-center right-0">
                {subnavItems ? subnavItems.length : 0}
            </Badge></h2>
            <Separator className="my-3" />
            <Subnav items={subnavItems} />
        </div>
    );
}
function Subnav({ items }: { items?: SubnavItem[] }) {
    if (!items || items.length === 0) {
        return <p className="text-sm text-gray-500">No sub-navigation items available.</p>;
    }
    const getIconByTitle = (title: string) => {
        const iconSize = "18px";
        const iconClass = "ml-0";

        const iconMap: { [key: string]: React.ReactNode } = {
            // General icons
            'Overview': <Eye size={iconSize} className={iconClass} />,
            'Analytics': <ChartBar size={iconSize} className={iconClass} />,
            'Reports': <FileText size={iconSize} className={iconClass} />,
            'Price': <DollarSign size={iconSize} className={iconClass} />,
            'Pricing': <DollarSign size={iconSize} className={iconClass} />,
            'Comparisons': <Compare size={iconSize} className={iconClass} />,
            'Case Studies': <CaseSensitive size={iconSize} className={iconClass} />,
            'Events': <Calendar size={iconSize} className={iconClass} />,
            'Webinars': <Calendar size={iconSize} className={iconClass} />,
            'Contact Sales': <Phone size={iconSize} className={iconClass} />,

            // Accounts icons
            'Account Overview': <Eye size={iconSize} className={iconClass} />,
            'Profile Settings': <Settings size={iconSize} className={iconClass} />,
            'Billing & Payments': <CreditCard size={iconSize} className={iconClass} />,
            'Subscription': <CreditCard size={iconSize} className={iconClass} />,
            'Usage Analytics': <BarChart3 size={iconSize} className={iconClass} />,
            'Team Members': <Users size={iconSize} className={iconClass} />,
            'API Keys': <Key size={iconSize} className={iconClass} />,
            'Security & Login': <Shield size={iconSize} className={iconClass} />,
            'Security & Compliance': <Shield size={iconSize} className={iconClass} />,
            'Notifications': <Bell size={iconSize} className={iconClass} />,
            'Preferences': <Sliders size={iconSize} className={iconClass} />,
            'Data & Privacy': <Database size={iconSize} className={iconClass} />,
            'Download Data': <Download size={iconSize} className={iconClass} />,

            // Service icons
            'Service Dashboard': <Eye size={iconSize} className={iconClass} />,
            'Ticket Status': <Ticket size={iconSize} className={iconClass} />,
            'Create Ticket': <Plus size={iconSize} className={iconClass} />,
            'Knowledge Base': <BookOpen size={iconSize} className={iconClass} />,
            'Live Chat': <MessageSquare size={iconSize} className={iconClass} />,
            'Service History': <History size={iconSize} className={iconClass} />,
            'SLA Status': <Clock size={iconSize} className={iconClass} />,
            'Resources': <Book size={iconSize} className={iconClass} />,
            'System Status': <Server size={iconSize} className={iconClass} />,
            'Contact Support': <HelpCircle size={iconSize} className={iconClass} />,
            'Training': <GraduationCap size={iconSize} className={iconClass} />,
            'Feedback': <ThumbsUp size={iconSize} className={iconClass} />,

            // Sales specific
            'Request Demo': <Phone size={iconSize} className={iconClass} />,
            'ROI Calculator': <Calculator size={iconSize} className={iconClass} />,
            'Implementation': <Settings size={iconSize} className={iconClass} />,

            // Default icon
            'default': <Eye size={iconSize} className={iconClass} />
        };

        // Find matching icon (case insensitive)
        const normalizedTitle = title.toLowerCase();
        const matchedKey = Object.keys(iconMap).find(key =>
            normalizedTitle.includes(key.toLowerCase())
        );

        return matchedKey ? iconMap[matchedKey] : iconMap['default'];
    };
    return (
        <nav>
            <ul className="space-y-2">
                {items.map((item) => (
                    <li key={item.id}>
                        <Link
                            to={item.href}
                            className={`flex items-center gap-1.5 bg-white  px-3 py-3 text-[14px] rounded   ${item.disabled ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-blue-100/65 hover:text-blue-600'
                                }`}
                            aria-disabled={item.disabled ? 'true' : 'false'}
                            onClick={(e) => {
                                if (item.disabled) {
                                    e.preventDefault();
                                }
                            }}
                        >
                            <span className="inline-block align-middle">{getIconByTitle(item.title)}</span>
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}