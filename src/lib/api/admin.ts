import { supabase } from '@/lib/supabase/client';

export interface SystemUser {
  id: string;
  user_id_code: string;
  full_name: string;
  email: string;
  role_name: 'super_admin' | 'farm_owner' | 'farm_manager' | 'qc_auditor' | 'quality_team' | 'inventory_officer' | 'warehouse_manager' | 'sales_team' | 'dispatch_driver' | 'delivery_team' | 'customer';
  farm_scope: string;
  status: 'active' | 'suspended' | 'pending';
  last_active_at: string;
  created_at: string;
}

export interface RbacRole {
  id: string;
  role_code: string;
  name: string;
  description: string;
  user_count: number;
  permissions: string[];
  is_system_role: boolean;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  performed_by_name: string;
  ip_address: string;
  timestamp: string;
  status: 'success' | 'warning' | 'failed';
}

// Fallback Mock Data
export const mockSystemUsers: SystemUser[] = [
  {
    id: 'user-001',
    user_id_code: 'USR-001',
    full_name: 'Roshan Alexander',
    email: 'roshanalex2007@gmail.com',
    role_name: 'super_admin',
    farm_scope: 'All Farms & Facilities',
    status: 'active',
    last_active_at: 'Just now',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'user-002',
    user_id_code: 'USR-002',
    full_name: 'Rajesh Kumar',
    email: 'rajesh@edennest.farm',
    role_name: 'farm_manager',
    farm_scope: 'Eden Nest Central Farm',
    status: 'active',
    last_active_at: '10 mins ago',
    created_at: '2026-03-15T00:00:00Z',
  },
  {
    id: 'user-003',
    user_id_code: 'USR-003',
    full_name: 'Anitha Ramesh',
    email: 'anitha@edennest.farm',
    role_name: 'qc_auditor',
    farm_scope: 'Hosur Processing Plant',
    status: 'active',
    last_active_at: '1 hour ago',
    created_at: '2026-04-10T00:00:00Z',
  },
  {
    id: 'user-004',
    user_id_code: 'USR-004',
    full_name: 'Manoj Gowda',
    email: 'manoj@edennest.farm',
    role_name: 'dispatch_driver',
    farm_scope: 'Bengaluru Logistics Hub',
    status: 'active',
    last_active_at: '25 mins ago',
    created_at: '2026-05-01T00:00:00Z',
  },
];

export const mockRoles: RbacRole[] = [
  {
    id: 'role-1',
    role_code: 'SUPER_ADMIN',
    name: 'Super Admin',
    description: 'Unrestricted full access across all farm modules, financial ledgers, and system settings.',
    user_count: 2,
    permissions: ['farms:write', 'production:write', 'orders:write', 'finance:write', 'users:write', 'system:write'],
    is_system_role: true,
  },
  {
    id: 'role-2',
    role_code: 'FARM_MANAGER',
    name: 'Farm Manager',
    description: 'Full operational access to assigned farm sheds, flock telemetry, and daily production entry.',
    user_count: 5,
    permissions: ['farms:read', 'production:write', 'quality:write', 'inventory:read'],
    is_system_role: true,
  },
  {
    id: 'role-3',
    role_code: 'QC_AUDITOR',
    name: 'Quality Auditor',
    description: 'Inspection log entry, egg grade categorization, and batch quality clearance approvals.',
    user_count: 3,
    permissions: ['quality:write', 'production:read', 'inventory:read'],
    is_system_role: true,
  },
  {
    id: 'role-4',
    role_code: 'DISPATCH_DRIVER',
    name: 'Dispatch Driver',
    description: 'Delivery route sequencing, recipient confirmation, and cash/UPI collection logging.',
    user_count: 8,
    permissions: ['deliveries:write', 'orders:read'],
    is_system_role: true,
  },
];

export const mockAuditLogs: AuditLog[] = [
  { id: 'log-101', action: 'User Sign In', module: 'Auth', performed_by_name: 'Roshan Alexander', ip_address: '192.168.70.160', timestamp: '2026-07-22 21:35:10', status: 'success' },
  { id: 'log-102', action: 'Post GL Journal Entry', module: 'Accounting', performed_by_name: 'Roshan Alexander', ip_address: '192.168.70.160', timestamp: '2026-07-22 20:45:00', status: 'success' },
  { id: 'log-103', action: 'Update Shed Climate Target', module: 'Farms', performed_by_name: 'Rajesh Kumar', ip_address: '192.168.70.182', timestamp: '2026-07-22 19:12:30', status: 'success' },
];

export async function fetchSystemUsers(): Promise<SystemUser[]> {
  try {
    const { data, error } = await supabase.from('users').select('*');
    if (error || !data || data.length === 0) {
      return mockSystemUsers;
    }
    return data as SystemUser[];
  } catch {
    return mockSystemUsers;
  }
}

export async function fetchRbacRoles(): Promise<RbacRole[]> {
  try {
    const { data, error } = await supabase.from('roles').select('*');
    if (error || !data || data.length === 0) {
      return mockRoles;
    }
    return data as RbacRole[];
  } catch {
    return mockRoles;
  }
}
