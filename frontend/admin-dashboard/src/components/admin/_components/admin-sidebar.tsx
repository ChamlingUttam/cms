'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  BookOpenText,
  ChevronDown,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LogOut,
  MessageSquareQuote,
  Settings,
  Users,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from '@/components/ui/sidebar';
const navigationItems = [
  { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Blog posts', href: '/blogs', icon: FileText },
  { label: 'FAQs', href: '/faqs', icon: BookOpenText },
  { label: 'Gallery', href: '/gallery', icon: FolderOpen },
  {
    label: 'Testimonials',
    href: '/testimonials',
    icon: MessageSquareQuote,
  },
  { label: 'Contacts', href: '/contacts', icon: Users },
];

export function AdminSidebar({
  onLogout,
  pathname,
  username,
}: {
  onLogout: () => void;
  pathname: string;
  username: string;
}) {
  const router = useRouter();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-4 w-fit">
        <Link
          className="flex items-center gap-3 overflow-hidden font-semibold tracking-tight group-data-[collapsible=icon]:justify-center"
          href="/dashboard"
        >
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <LayoutDashboard aria-hidden="true" className="size-4" />
          </span>
          <span className="truncate group-data-[collapsible=icon]:hidden">Dharan Addaresh School</span>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent className="px-2 py-3">
        <SidebarMenu>
          {navigationItems.map(({ label, href, icon: Icon }) => (
            <SidebarMenuItem key={href}>
              <SidebarMenuButton
                isActive={pathname === href}
                render={<Link href={href} />}
                tooltip={label}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton className="h-11" size="lg" tooltip={username} />
            }
            aria-label={`Account menu for ${username}`}
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-xs font-semibold text-sidebar-accent-foreground">
              {username.slice(0, 2).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1 truncate font-medium group-data-[collapsible=icon]:hidden">
              {username}
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-4 shrink-0 group-data-[collapsible=icon]:hidden"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8}>
            <div className="px-2 py-1.5">
              <p className="truncate text-sm font-medium">{username}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push('/settings')}>
              <Settings aria-hidden="true" />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => void onLogout()}
              variant="destructive"
            >
              <LogOut aria-hidden="true" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
