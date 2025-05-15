import { HiChartPie, HiInbox } from 'react-icons/hi';
import {
    Sidebar,
    SidebarItem,
    SidebarItemGroup,
    SidebarItems,
} from 'flowbite-react';


const MySidebar = () => {
    return (
        <Sidebar aria-label="Sidebar with content" className="w-64">
            <SidebarItems>
                <SidebarItemGroup>
                    <SidebarItem href="#" icon={HiChartPie}>
                        Dashboard
                    </SidebarItem>
                    <SidebarItem href="#" icon={HiInbox}>
                        Inbox
                    </SidebarItem>
                </SidebarItemGroup>
            </SidebarItems>
        </Sidebar>
    );
};

export default MySidebar;
