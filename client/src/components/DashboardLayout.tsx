import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarInset, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { Activity, LogOut, PanelLeft, Radio } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";

type NavigationItem = { id: string; label: string; icon: LucideIcon };
type DashboardLayoutProps = {
  children: React.ReactNode;
  publicMode?: boolean;
  navItems?: NavigationItem[];
  activeNav?: string;
  onNavigate?: (id: string) => void;
};

const fallbackItems: NavigationItem[] = [
  { id: "overview", label: "Overview", icon: Activity },
  { id: "incidents", label: "Incidents", icon: Radio },
];

export default function DashboardLayout({ children, publicMode = false, navItems = fallbackItems, activeNav, onNavigate }: DashboardLayoutProps) {
  const { loading, user } = useAuth();
  const [location, setLocation] = useLocation();

  if (!publicMode && loading) return <DashboardLayoutSkeleton />;
  if (!publicMode && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f6] p-6">
        <div className="w-full max-w-md rounded-2xl border bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#102a27] text-emerald-300"><Activity className="h-6 w-6" /></div>
          <h1 className="text-2xl font-semibold tracking-tight">Sign in to continue</h1>
          <p className="mt-2 text-sm text-muted-foreground">Access to this workspace requires authentication.</p>
          <Button onClick={() => startLogin()} className="mt-6 w-full">Sign in</Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar
        user={user}
        publicMode={publicMode}
        navItems={navItems}
        activeNav={activeNav ?? location}
        onNavigate={(id) => onNavigate ? onNavigate(id) : setLocation(id)}
      >
        {children}
      </DashboardSidebar>
    </SidebarProvider>
  );
}

function DashboardSidebar({ children, user, publicMode, navItems, activeNav, onNavigate }: {
  children: React.ReactNode;
  user: ReturnType<typeof useAuth>["user"];
  publicMode: boolean;
  navItems: NavigationItem[];
  activeNav: string;
  onNavigate: (id: string) => void;
}) {
  const { state, toggleSidebar } = useSidebar();
  const collapsed = state === "collapsed";
  const isMobile = useIsMobile();
  const { logout } = useAuth();

  useEffect(() => {
    // Keep the app shell from scrolling horizontally on narrow screens.
    document.documentElement.classList.add("recallops-shell");
    return () => document.documentElement.classList.remove("recallops-shell");
  }, []);

  return (
    <>
      <Sidebar collapsible="icon" className="recallops-sidebar border-r-0">
        <SidebarHeader className="px-4 pb-4 pt-5">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#183d36] text-[#8de0bb] shadow-inner"><Activity className="h-[18px] w-[18px]" /></div>
            {!collapsed && <div className="min-w-0"><div className="text-[13px] font-semibold tracking-[0.18em] text-white">RECALLOPS</div><div className="mt-0.5 text-[10px] font-medium tracking-[0.12em] text-[#8ba7a0]">INCIDENT INTELLIGENCE</div></div>}
            <button onClick={toggleSidebar} className="ml-auto rounded-md p-1.5 text-[#9ab0aa] hover:bg-white/10 hover:text-white" aria-label="Toggle navigation"><PanelLeft className="h-4 w-4" /></button>
          </div>
        </SidebarHeader>
        <SidebarContent className="px-3 pt-4">
          {!collapsed && <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#6f8a83]">Workspace</p>}
          <SidebarMenu className="gap-1">
            {navItems.map((item) => {
              const active = activeNav === item.id;
              return (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    isActive={active}
                    onClick={() => onNavigate(item.id)}
                    tooltip={item.label}
                    className={`recallops-nav h-10 rounded-lg text-[13px] ${active ? "recallops-nav-active" : ""}`}
                  >
                    <item.icon className="h-[17px] w-[17px]" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-3">
          {publicMode ? (
            <div className={`rounded-xl border border-white/10 bg-white/[0.04] p-3 ${collapsed ? "hidden" : ""}`}>
              <div className="flex items-center gap-2 text-[11px] font-medium text-[#d3e3de]"><span className="h-1.5 w-1.5 rounded-full bg-[#71d3a4]" />Synthetic demo workspace</div>
              <p className="mt-1.5 text-[10px] leading-relaxed text-[#829c94]">Fictional incidents. No production actions.</p>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left hover:bg-white/5">
                  <Avatar className="h-8 w-8 border border-white/10"><AvatarFallback className="bg-[#24433c] text-xs text-white">{user?.name?.charAt(0).toUpperCase() || "U"}</AvatarFallback></Avatar>
                  {!collapsed && <span className="truncate text-xs text-white">{user?.name || "User"}</span>}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48"><DropdownMenuItem onClick={logout}><LogOut className="mr-2 h-4 w-4" />Sign out</DropdownMenuItem></DropdownMenuContent>
            </DropdownMenu>
          )}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="recallops-inset min-h-screen">
        {isMobile && <div className="sticky top-0 z-40 flex h-12 items-center border-b bg-white/90 px-3 backdrop-blur"><SidebarTrigger className="h-9 w-9" /><span className="ml-2 text-xs font-semibold tracking-[0.15em]">RECALLOPS</span></div>}
        <main className="min-h-screen">{children}</main>
      </SidebarInset>
    </>
  );
}
