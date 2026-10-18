import { FolderTreeIcon, LayoutDashboardIcon, PackageIcon, UsersIcon } from 'lucide-react';

export const storeNavigation = [
{ to: '/', label: 'Home' },
{ to: '/products', label: 'Products' },
{ to: '/categories', label: 'Categories' },
{ to: '/admin', label: 'Admin', requiresAuth: true }];


export const adminNavigation = [
{ to: '/admin', label: 'Overview', icon: LayoutDashboardIcon, end: true },
{ to: '/admin/products', label: 'Products', icon: PackageIcon, end: false },
{ to: '/admin/categories', label: 'Categories', icon: FolderTreeIcon, end: false },
{ to: '/admin/users', label: 'Users', icon: UsersIcon, end: false }];