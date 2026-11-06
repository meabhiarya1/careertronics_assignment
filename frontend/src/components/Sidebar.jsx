import {
  BookOpen,
  BriefcaseBusiness,
  GraduationCap,
  Headphones,
  LogOut,
  MapPin,
  Package,
  Users,
  Wallet,
} from 'lucide-react';

const MENU_ITEMS = [
  { label: 'Franchise Management', icon: Users, isActive: true },
  { label: 'Student Management', icon: GraduationCap },
  { label: 'LMS', icon: BookOpen },
  { label: 'Finance', icon: Wallet },
  { label: 'HRMS', icon: BriefcaseBusiness },
  { label: 'Centers', icon: MapPin },
  { label: 'Assets', icon: Package },
  { label: 'Support', icon: Headphones },
];

// Side navigation from the UI reference. The links are UI only.
export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white px-4 py-6 lg:flex">
      <nav aria-label="Main menu" className="flex-1">
        <ul className="space-y-1">
          {MENU_ITEMS.map(({ label, icon: Icon, isActive }) => (
            <li key={label}>
              <button
                type="button"
                aria-current={isActive ? 'page' : undefined}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-brand-50 font-medium text-brand-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-md bg-linear-to-r from-brand-500 to-red-700 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90"
      >
        <LogOut className="size-4" aria-hidden="true" />
        Log Out
      </button>
    </aside>
  );
}
