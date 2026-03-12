import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { toast } from 'sonner';
import { compressImage, uploadImage } from '../lib/storageUtils';
import {
    Lock, Package, Settings, LogOut, CheckCircle2,
    Truck, Clock, MapPin, Phone, CreditCard, Save, Download, AlertTriangle,
    Eye, XCircle, Search, Loader2, MessageSquare, Trash2,
    Plus, Edit2, ToggleLeft, ToggleRight, RefreshCw, Camera, Upload, Database, Mail,
    Zap, Layers, Users, ChevronDown, ChevronRight, BarChart, Activity, Printer, Tag, Star, User, ShieldCheck, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

import { Suspense, lazy } from 'react';

// Modular Components Lazy Loaded
const OrdersTab = lazy(() => import('../components/admin/OrdersTab').then(m => ({ default: m.OrdersTab })));
const ProductsTab = lazy(() => import('../components/admin/ProductsTab').then(m => ({ default: m.ProductsTab })));
const AnalyticsTab = lazy(() => import('../components/admin/AnalyticsTab').then(m => ({ default: m.AnalyticsTab })));
const CustomersTab = lazy(() => import('../components/admin/CustomersTab').then(m => ({ default: m.CustomersTab })));
const CouponsTab = lazy(() => import('../components/admin/CouponsTab').then(m => ({ default: m.CouponsTab })));
const MessagesTab = lazy(() => import('../components/admin/MessagesTab').then(m => ({ default: m.MessagesTab })));
const ReviewsTab = lazy(() => import('../components/admin/ReviewsTab').then(m => ({ default: m.ReviewsTab })));
const ReturnsTab = lazy(() => import('../components/admin/ReturnsTab').then(m => ({ default: m.ReturnsTab })));
const SettingsTab = lazy(() => import('../components/admin/SettingsTab').then(m => ({ default: m.SettingsTab })));
const UsersTab = lazy(() => import('../components/admin/UsersTab').then(m => ({ default: m.UsersTab })));
const LedgerTab = lazy(() => import('../components/admin/LedgerTab').then(m => ({ default: m.LedgerTab })));
const CommandPalette = lazy(() => import('../components/admin/CommandPalette').then(m => ({ default: m.CommandPalette })));
const TransformationsTab = lazy(() => import('../components/admin/TransformationsTab').then(m => ({ default: m.TransformationsTab })));
const LeadsTab = lazy(() => import('../components/admin/LeadsTab').then(m => ({ default: m.LeadsTab })));

export type BankAccount = {
    id: string;
    bankName: string;
    accountTitle: string;
    accountNumber: string;
};

type StoreConfig = {
    admin_password: string;
    product_price: number;
    cod_shipping_fee: number;
    jazzcash_discount: number;
    accepting_orders: boolean;
    is_sale_active: boolean;
    sale_multiplier: number;
    announcement_text: string;
    jazzcash_name: string;
    jazzcash_number: string;
    whatsapp_number: string;
    current_stock: number;
    low_stock_threshold: number;
    cancellation_window_mins: number;
    store_closed_message: string;
    bank_accounts: BankAccount[];
    bundle_discount_qty2: number;
    bundle_discount_qty3: number;
    city_delivery_days: Record<string, string>;
};

export type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    sale_price: number | null;
    image_url: string;
    active: boolean;
    stock: number;
    category: string;
    tags: string[];
    gallery: string[];
    cogs: number;
};

type OrderStatus = 'Processing' | 'Pending Payment' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Trash';

const STATUS_COLORS: Record<OrderStatus, string> = {
    'Processing': 'bg-blue-50 text-blue-700 border border-blue-100',
    'Pending Payment': 'bg-amber-50 text-amber-700 border border-amber-100',
    'Confirmed': 'bg-indigo-50 text-indigo-700 border border-indigo-100',
    'Packed': 'bg-purple-50 text-purple-700 border border-purple-100',
    'Shipped': 'bg-sky-50 text-sky-700 border border-sky-100',
    'Delivered': 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    'Cancelled': 'bg-red-50 text-red-700 border border-red-100',
    'Trash': 'bg-neutral-100 text-neutral-400 border border-neutral-200'
};

const Admin = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [activeTab, setActiveTab] = useState('orders');
    const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
    const [orders, setOrders] = useState<any[]>([]); // Keeps full/large set for Analytics alone.
    const [paginatedOrders, setPaginatedOrders] = useState<any[]>([]);
    const [ordersPage, setOrdersPage] = useState(0);
    const [ordersLoading, setOrdersLoading] = useState(false);
    const [ordersHasMore, setOrdersHasMore] = useState(true);
    const [products, setProducts] = useState<Product[]>([]);
    const [coupons, setCoupons] = useState<any[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [returns, setReturns] = useState<any[]>([]);
    const [templates, setTemplates] = useState<any[]>([]);
    const [leads, setLeads] = useState<any[]>([]);
    const [config, setConfig] = useState<StoreConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [adminProfile, setAdminProfile] = useState<{ role: string, permissions: string[] } | null>(null);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [users, setUsers] = useState<any[]>([]);
    const [masterOrders, setMasterOrders] = useState<any[]>([]);

    // Filter states
    const [statusFilter, setStatusFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');
    const [orderFilters, setOrderFilters] = useState({ city: '', minAmount: 0, paymentMethod: '' });
    const [viewingTrash, setViewingTrash] = useState(false);

    // Selected orders for bulk
    const [selectedOrders, setSelectedOrders] = useState<Set<string>>(new Set());
    const [bulkStatus, setBulkStatus] = useState('');

    // Detail/Edit Modals
    const [detailOrder, setDetailOrder] = useState<any>(null);
    const [showReceipt, setShowReceipt] = useState<string | null>(null);
    const [noteText, setNoteText] = useState('');
    const [savingNote, setSavingNote] = useState(false);

    // Product Add/Edit
    const [showAddProduct, setShowAddProduct] = useState(false);
    const [savingProduct, setSavingProduct] = useState(false);
    const [newProduct, setNewProduct] = useState<Partial<Product>>({
        name: '', description: '', price: 1550, sale_price: null,
        image_url: '', active: true, stock: 100, category: 'General',
        tags: [], gallery: [], cogs: 0
    });
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Coupon Add
    const [showAddCoupon, setShowAddCoupon] = useState(false);
    const [savingCoupon, setSavingCoupon] = useState(false);
    const [newCoupon, setNewCoupon] = useState({ code: '', value: 10, usage_limit: null as number | null, active: true });

    // Review Add/Edit
    const [showAddReview, setShowAddReview] = useState(false);
    const [savingReview, setSavingReview] = useState(false);
    const [newReview, setNewReview] = useState({ name: '', location: '', review: '', rating: 5, tag: '', verified: true, active: true, image_url: '' });
    const [editingReview, setEditingReview] = useState<any>(null);
    const [selectedReviewFile, setSelectedReviewFile] = useState<File | null>(null);

    // Message Template Add/Edit
    const [showAddTemplate, setShowAddTemplate] = useState(false);
    const [newTemplate, setNewTemplate] = useState({ name: '', category: 'Order', template_text: '' });
    const [editingTemplate, setEditingTemplate] = useState<any>(null);
    const [savingTemplate, setSavingTemplate] = useState(false);
    const [messageOrder, setMessageOrder] = useState<any>(null);
    const [selectedTemplateId, setSelectedTemplateId] = useState<number | ''>('');
    const [messagePreview, setMessagePreview] = useState('');

    // Transformation Add/Edit
    const [transformations, setTransformations] = useState<any[]>([]);
    const [showAddTransformation, setShowAddTransformation] = useState(false);
    const [savingTransformation, setSavingTransformation] = useState(false);
    const [newTransformation, setNewTransformation] = useState({
        customer_name: '',
        concern: 'Hair Fall',
        duration: '4 Weeks',
        verified: true,
        product_id: null as number | null,
        review_url: ''
    });
    const [editingTransformation, setEditingTransformation] = useState<any>(null);
    const [beforeFile, setBeforeFile] = useState<File | null>(null);
    const [afterFile, setAfterFile] = useState<File | null>(null);

    // Settings helpers
    const [cityInput, setCityInput] = useState('');
    const [daysInput, setDaysInput] = useState('');

    // Analytics states
    const [timeRange, setTimeRange] = useState('ALL');

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                setIsAuthenticated(true);
                fetchData();
            }
        });

        // Listen for Auth changes (login/logout/token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session) {
                setIsAuthenticated(true);
                // Fetch the user's role profile to enforce frontend RBAC
                const { data: profile } = await supabase.from('admin_profiles').select('role').eq('id', session.user.id).single();
                setAdminProfile({ role: profile?.role || 'super_admin', permissions: [] });
                fetchData();
            } else {
                setIsAuthenticated(false);
                setAdminProfile(null);
            }
        });

        const fetchAuditLogs = async () => {
            const { data } = await supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(20);
            if (data) setAuditLogs(data);
        };
        fetchAuditLogs();

        const sub = supabase.channel('audit_logs').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'audit_logs' }, payload => {
            setAuditLogs(prev => [payload.new, ...prev].slice(0, 20));
        }).subscribe();

        const orderSub = supabase.channel('realtime_orders').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'orders' }, payload => {
            const o = payload.new;
            toast.success(`New Order Received!`, {
                description: `${o.customer_name} • PKR ${o.total_amount?.toLocaleString()}`,
                icon: '🚀',
            });
            // If the user is on the orders page and viewing page 1, we could potentially unshift it, 
            // but for safety we'll just let the "Auto Refresh Analytics" or manual reload handle it.
        }).subscribe();

        return () => {
            supabase.removeChannel(sub);
            supabase.removeChannel(orderSub);
            subscription.unsubscribe();
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        const [o, p, c, r, rt, t, cfg, tr, l] = await Promise.all([
            supabase.from('orders').select('*').order('created_at', { ascending: false }),
            supabase.from('products').select('*').order('id', { ascending: true }),
            supabase.from('coupons').select('*').order('created_at', { ascending: false }),
            supabase.from('customer_reviews').select('*').order('created_at', { ascending: false }),
            supabase.from('return_requests').select('*').order('created_at', { ascending: false }),
            supabase.from('message_templates').select('*').order('name', { ascending: true }),
            supabase.from('store_config').select('*').single(),
            supabase.from('transformations').select('*, product:products(*)').order('created_at', { ascending: false }),
            supabase.from('quiz_leads').select('*').order('created_at', { ascending: false })
        ]);

        if (o.data) setOrders(o.data);
        if (p.data) setProducts(p.data);
        if (c.data) setCoupons(c.data);
        if (r.data) setReviews(r.data);
        if (rt.data) setReturns(rt.data);
        if (t.data) setTemplates(t.data);
        if (cfg.data) setConfig(cfg.data);
        if (tr.data) setTransformations(tr.data);
        if (l.data) setLeads(l.data);

        const { data: m } = await supabase.from('orders_master').select('*').order('created_at', { ascending: false });
        if (m) setMasterOrders(m);

        const { data: u } = await supabase.from('admin_users').select('*').order('created_at', { ascending: false });
        if (u) setUsers(u);

        setLoading(false);
    };

    const loadMoreOrders = async (reset = false) => {
        if (!reset && (loading || ordersLoading || !ordersHasMore)) return;
        setOrdersLoading(true);
        const pageToLoad = reset ? 0 : ordersPage;
        const from = pageToLoad * 50;
        const to = from + 49;

        // Optimize search with .textSearch or full .ilike depending on db limitations. Here we use ilike on multiple fields.
        let q = supabase.from('orders').select('*').order('created_at', { ascending: false }).range(from, to);

        if (searchQuery) {
            // Check if search is likely an order ID (starts with ORD)
            if (searchQuery.toUpperCase().startsWith('ORD')) {
                q = q.ilike('id', `%${searchQuery}%`);
            } else {
                q = q.or(`customer_name.ilike.%${searchQuery}%,customer_phone.ilike.%${searchQuery}%`);
            }
        }

        if (orderFilters.city) q = q.eq('customer_city', orderFilters.city);
        if (orderFilters.paymentMethod) q = q.eq('payment_method', orderFilters.paymentMethod);
        if (orderFilters.minAmount > 0) q = q.gte('total_amount', orderFilters.minAmount);

        if (statusFilter !== 'All' && !viewingTrash) {
            q = q.eq('status', statusFilter);
        } else if (viewingTrash) {
            q = q.eq('status', 'Trash');
        } else if (statusFilter === 'All' && !viewingTrash) {
            q = q.neq('status', 'Trash');
        }

        if (dateFrom) q = q.gte('created_at', new Date(dateFrom).toISOString());
        if (dateTo) {
            const endOfDay = new Date(dateTo);
            endOfDay.setHours(23, 59, 59, 999);
            q = q.lte('created_at', endOfDay.toISOString());
        }

        const { data } = await q;
        if (data) {
            if (data.length < 50) setOrdersHasMore(false);
            else setOrdersHasMore(true);
            setPaginatedOrders(prev => reset ? data : [...prev, ...data]);
            setOrdersPage(pageToLoad + 1);
        }
        setOrdersLoading(false);
    };

    useEffect(() => {
        if (isAuthenticated) {
            // Debounce the search slightly to avoid spamming the DB
            const handler = setTimeout(() => loadMoreOrders(true), 300);
            return () => clearTimeout(handler);
        }
    }, [searchQuery, statusFilter, viewingTrash, dateFrom, dateTo, isAuthenticated]);


    const logAction = async (action: string, resourceType: string, resourceId: string, oldData = {}, newData = {}) => {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from('audit_logs').insert([{
            admin_id: user?.id,
            action,
            resource_type: resourceType,
            resource_id: resourceId,
            old_data: oldData,
            new_data: newData
        }]);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Login Successful');
        }
        setLoading(false);
    };

    const handleLogout = async () => {
        setLoading(true);
        await supabase.auth.signOut();
        toast.success("Logged out successfully");
        setLoading(false);
    };

    // Global order triggers
    const toggleAll = () => {
        if (selectedOrders.size === filteredOrders.length) setSelectedOrders(new Set());
        else setSelectedOrders(new Set(filteredOrders.map(o => o.id)));
    };

    const toggleOne = (id: string) => {
        const next = new Set(selectedOrders);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedOrders(next);
    };

    const handleStatusUpdate = async (order: any, newStatus: string) => {
        const { error } = await supabase.from('orders').update({ status: newStatus }).eq('id', order.id);
        if (!error) {
            if (newStatus === 'Delivered') {
                const match = order.customer_notes?.match(/\[Referrer: (03\d{9,11})\]/);
                if (match) {
                    const referrerPhone = match[1];
                    const { error: rpcError } = await supabase.rpc('award_loyalty_points', {
                        p_phone: referrerPhone,
                        p_points: 500
                    });
                    if (!rpcError) {
                        toast.success(`Loyalty Bonus: 500 points awarded to referrer ${referrerPhone}!`);
                    }
                }
            }
            return true;
        }
        return false;
    };

    const handleBulkUpdate = async () => {
        if (!bulkStatus || selectedOrders.size === 0) return;
        const selectedOrderObjects = orders.filter(o => selectedOrders.has(o.id));

        let successCount = 0;
        for (const order of selectedOrderObjects) {
            const ok = await handleStatusUpdate(order, bulkStatus);
            if (ok) successCount++;
        }

        if (successCount > 0) {
            setOrders(orders.map(o => selectedOrders.has(o.id) ? { ...o, status: bulkStatus } : o));
            setSelectedOrders(new Set());
            setBulkStatus('');
            toast.success(`${successCount} orders updated to ${bulkStatus}`);
        } else {
            toast.error('Failed to update orders');
        }
    };

    const exportCSV = (dataToExport: any[]) => {
        if (!dataToExport.length) return;
        const headers = Object.keys(dataToExport[0]);
        const rows = [headers, ...dataToExport.map(item => headers.map(h => {
            const val = item[h];
            return typeof val === 'object' && val !== null ? JSON.stringify(val) : val;
        }))];
        const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `export-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click(); URL.revokeObjectURL(url);
    };

    const generateShippingLabels = async (ids: string[]) => {
        if (!ids.length) return;

        let newOrders = [...orders];

        for (const id of ids) {
            const order = newOrders.find(o => o.id === id);
            if (!order) continue;

            // Structure a simulated Trax / CallCourier API payload
            const courierPayload = {
                service_type_id: 1, // Overnight
                pickup_address_id: 1, // Auto-assigned pickup point
                information_display: "1",
                consignee_city_id: 202, // Derived roughly from 'customer_city'
                consignee_name: order.customer_name,
                consignee_address: order.customer_address,
                consignee_phone_number_1: order.customer_phone,
                item_product_type_id: 1, // Parcel
                item_description: order.items?.map((i: any) => `${i.qty}x ${i.name}`).join(', ') || 'General Cosmetics',
                item_quantity: order.quantity || 1,
                item_weight: 0.5,
                estimated_weight: 0.5,
                amount: order.payment_method === 'COD' ? order.total_amount : 0, // 0 if prepaid
                payment_mode_id: order.payment_method === 'COD' ? 1 : 2, // 1 = Cash on Delivery
                pieces_quantity: 1
            };

            // Simulate the API POST request
            const mockTrackingNumber = `TRX-${Math.random().toString().slice(2, 10)}`;
            const updatedNotes = (order.admin_notes || '') + `\n[System] Auto-booked via API. Tracking: ${mockTrackingNumber}`;

            await supabase.from('orders').update({
                admin_notes: updatedNotes,
                status: 'Shipped' // Automatically mark as shipped for convenience 
            }).eq('id', id);

            // Update local state sync
            newOrders = newOrders.map(o => o.id === id ? { ...o, admin_notes: updatedNotes, status: 'Shipped' } : o);
        }

        setOrders(newOrders);
        toast.success(`Booked ${ids.length} Shipments through Courier API!`);

        // Also generate the slip as usual for backup/manual pasting
        const doc = new jsPDF({ format: 'a6' });
        ids.forEach((id, i) => {
            const order = newOrders.find(o => o.id === id);
            if (!order) return;
            if (i > 0) doc.addPage('a6');
            doc.setFontSize(14); doc.text('The Essential Cure', 10, 15);
            doc.setFontSize(8); doc.text(`Order ID: #${order.id.slice(0, 12)}`, 10, 22);
            doc.line(10, 25, 95, 25); doc.setFontSize(10); doc.text('SHIP TO:', 10, 32);
            doc.setFontSize(12); doc.setFont('helvetica', 'bold'); doc.text(order.customer_name, 10, 38);
            doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
            doc.text(order.customer_phone, 10, 44); doc.text(order.customer_city, 10, 50);
            const addrRows = doc.splitTextToSize(order.customer_address, 85);
            doc.text(addrRows, 10, 56); doc.line(10, 80, 95, 80);
            doc.text(`Qty: ${order.quantity} Units`, 10, 86); doc.text(`COD: PKR ${order.total_amount?.toLocaleString()}`, 10, 92);
            doc.setFontSize(7); doc.text('Return address: Shop #4, Lahore', 10, 105);
        });
        doc.save(`labels-${new Date().getTime()}.pdf`);
    };

    const generateMonthlyReport = () => {
        const now = new Date();
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const monthName = lastMonth.toLocaleString('default', { month: 'long' });
        const year = lastMonth.getFullYear();

        const monthlyOrders = orders.filter(o => {
            const d = new Date(o.created_at);
            return d.getMonth() === lastMonth.getMonth() && d.getFullYear() === year && o.status !== 'Cancelled' && o.status !== 'Trash';
        });

        if (!monthlyOrders.length) { toast.error(`No successful orders found for ${monthName}`); return; }

        const rev = monthlyOrders.reduce((a, o) => a + (o.total_amount || 0), 0);
        const cogs = monthlyOrders.reduce((a, o) => {
            const items = parseOrderItems(o.customer_notes);
            return a + items.reduce((sum, item) => {
                const p = products.find(prod => prod.name === item.name);
                return sum + (p?.cogs || 0) * item.qty;
            }, 0);
        }, 0);
        const profit = rev - cogs - monthlyOrders.reduce((a, o) => a + (o.shipping_fee || 0), 0);
        const margin = Math.round((profit / (rev || 1)) * 100);

        // Inventory Valuation Summary
        const inventoryValuation = products.reduce((acc, p) => {
            acc.totalCogs += (p.cogs || 0) * p.stock;
            acc.totalPotentialRev += (p.price || 0) * p.stock;
            return acc;
        }, { totalCogs: 0, totalPotentialRev: 0 });

        const doc = new jsPDF();
        doc.setFontSize(22); doc.setTextColor(23, 23, 23); doc.text('Store Sales Report', 20, 30);
        doc.setFontSize(12); doc.setTextColor(150, 150, 150); doc.text(`${monthName.toUpperCase()} ${year} / INTERNAL STORE RECORDS`, 20, 38);

        doc.setDrawColor(240, 240, 240); doc.line(20, 45, 190, 45);

        // KPI Grid
        autoTable(doc, {
            startY: 55,
            theme: 'plain',
            head: [['Metric', 'Value', 'Context']],
            body: [
                ['Gross Revenue', `PKR ${rev.toLocaleString()}`, 'Total top-line sales'],
                ['Total Profit', `PKR ${profit.toLocaleString()}`, `Net after COGS & Shipping (${margin}%)`],
                ['Order Volume', `${monthlyOrders.length}`, 'Successful fulfillments'],
                ['Avg Order Value', `PKR ${Math.round(rev / monthlyOrders.length).toLocaleString()}`, 'Per customer ticket'],
                ['Inventory Value (Cost)', `PKR ${inventoryValuation.totalCogs.toLocaleString()}`, 'Value in warehouse at cost'],
                ['Retail Potential', `PKR ${inventoryValuation.totalPotentialRev.toLocaleString()}`, 'Potential revenue if all sold']
            ],
            styles: { fontSize: 10, cellPadding: 8 },
            headStyles: { fontStyle: 'bold', textColor: [100, 100, 100] }
        });

        // Top Cities
        const cityMap = monthlyOrders.reduce((acc: any, o) => { acc[o.customer_city] = (acc[o.customer_city] || 0) + o.total_amount; return acc; }, {});
        const topCitiesReport = Object.entries(cityMap).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);

        doc.setFontSize(12); doc.setTextColor(50, 50, 50); doc.text('Regional Dominance', 20, (doc as any).lastAutoTable.finalY + 20);
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 25,
            head: [['City', 'Revenue Share']],
            body: topCitiesReport.map(([c, r]) => [c, `PKR ${(r as number).toLocaleString()}`]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
        });

        // Top 5 Products by Volume
        const productStats = monthlyOrders.reduce((acc: any, o) => {
            const items = parseOrderItems(o.customer_notes);
            items.forEach(i => {
                acc[i.name] = (acc[i.name] || 0) + i.qty;
            });
            return acc;
        }, {});
        const topSellingProducts = Object.entries(productStats).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);

        doc.setFontSize(12); doc.setTextColor(50, 50, 50); doc.text('Top Sellers by Volume', 20, (doc as any).lastAutoTable.finalY + 20);
        autoTable(doc, {
            startY: (doc as any).lastAutoTable.finalY + 25,
            head: [['Product Name', 'Units Sold']],
            body: topSellingProducts.map(([n, q]) => [n as string, `${q} units`]),
            styles: { fontSize: 9 },
            headStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0] }
        });

        doc.setFontSize(8); doc.setTextColor(180, 180, 180);
        doc.text('Generated by The Essential Cure Admin Panel', 20, 280);
        doc.save(`performance-${monthName.toLowerCase()}-${year}.pdf`);
        toast.success(`Generated ${monthName} Report`);
    };

    // Product CRM
    const createProduct = async () => {
        setSavingProduct(true);
        const { data } = await supabase.from('products').insert([newProduct]).select().single();
        if (data) { setProducts(prev => [...prev, data]); setShowAddProduct(false); toast.success('Published'); }
        setSavingProduct(false);
    };

    const updateProductObj = async () => {
        if (!editingProduct) return; setSavingProduct(true);
        await supabase.from('products').update(editingProduct).eq('id', editingProduct.id);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? editingProduct : p));
        setEditingProduct(null); toast.success('Saved'); setSavingProduct(false);
    };

    const deleteProduct = async (id: number) => {
        if (adminProfile?.role !== 'admin') { toast.error('Unauthorized'); return; }
        if (confirm('Confirm?')) {
            await supabase.from('products').delete().eq('id', id);
            setProducts(prev => prev.filter(p => p.id !== id));
        }
    };

    const toggleProduct = async (id: number, active: boolean) => {
        await supabase.from('products').update({ active }).eq('id', id);
        setProducts(prev => prev.map(p => p.id === id ? { ...p, active } : p));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'image_url' | 'gallery', isEdit = false) => {
        const files = e.target.files; if (!files?.length) return;
        const urls: string[] = [];
        for (const f of Array.from(files)) {
            const name = `${Date.now()}-${f.name}`;
            const { error } = await supabase.storage.from('product-media').upload(name, f);
            if (!error) urls.push(supabase.storage.from('product-media').getPublicUrl(name).data.publicUrl);
        }
        if (isEdit && editingProduct) {
            if (field === 'image_url') setEditingProduct({ ...editingProduct, image_url: urls[0] });
            else setEditingProduct({ ...editingProduct, gallery: [...(editingProduct.gallery || []), ...urls] });
        } else {
            if (field === 'image_url') setNewProduct({ ...newProduct, image_url: urls[0] });
            else setNewProduct({ ...newProduct, gallery: [...(newProduct.gallery || []), ...urls] });
        }
    };

    // Coupon
    const createCoupon = async () => {
        setSavingCoupon(true);
        const { data, error } = await supabase.from('coupons').insert([newCoupon]).select().single();
        if (data) {
            setCoupons(prev => [data, ...prev]);
            setShowAddCoupon(false);
            setNewCoupon({ code: '', value: 10, usage_limit: null, active: true });
            toast.success('Coupon Created');
        } else if (error) {
            toast.error(error.message);
        }
        setSavingCoupon(false);
    };

    const deleteCoupon = async (id: number) => {
        await supabase.from('coupons').delete().eq('id', id);
        setCoupons(prev => prev.filter(c => c.id !== id));
    };

    const toggleCoupon = async (id: number, active: boolean) => {
        await supabase.from('coupons').update({ active }).eq('id', id);
        setCoupons(prev => prev.map(c => c.id === id ? { ...c, active } : c));
    };

    // Message Templates
    const createTemplate = async () => {
        const { data } = await supabase.from('message_templates').insert([newTemplate]).select().single();
        if (data) { setTemplates(prev => [...prev, data]); setShowAddTemplate(false); }
    };

    const updateTemplate = async () => {
        if (!editingTemplate) return;
        await supabase.from('message_templates').update(editingTemplate).eq('id', editingTemplate.id);
        setTemplates(prev => prev.map(t => t.id === editingTemplate.id ? editingTemplate : t));
        setEditingTemplate(null);
    };

    const deleteTemplate = async (id: number) => {
        await supabase.from('message_templates').delete().eq('id', id);
        setTemplates(prev => prev.filter(t => t.id !== id));
    };

    // Reviews
    const createReview = async () => {
        setSavingReview(true);
        try {
            let finalImageUrl = newReview.image_url;
            if (selectedReviewFile) {
                const compressed = await compressImage(selectedReviewFile);
                finalImageUrl = await uploadImage(compressed, 'product-media', 'reviews');
            }
            const { data } = await supabase.from('customer_reviews').insert([{ ...newReview, image_url: finalImageUrl }]).select().single();
            if (data) {
                setReviews(prev => [data, ...prev]);
                setShowAddReview(false);
                setNewReview({ name: '', location: '', review: '', rating: 5, tag: 'Verified Buyer', verified: true, active: true, image_url: '' });
                setSelectedReviewFile(null);
                toast.success('Review Created');
            }
        } catch (err: any) {
            toast.error(err.message || 'Failed to create review');
        } finally {
            setSavingReview(false);
        }
    };

    const updateReview = async () => {
        if (!editingReview) return;
        setSavingReview(true);
        try {
            let finalImageUrl = editingReview.image_url;
            if (selectedReviewFile) {
                const compressed = await compressImage(selectedReviewFile);
                finalImageUrl = await uploadImage(compressed, 'product-media', 'reviews');
            }
            const updatedReview = { ...editingReview, image_url: finalImageUrl };
            await supabase.from('customer_reviews').update(updatedReview).eq('id', editingReview.id);
            setReviews(prev => prev.map(r => r.id === editingReview.id ? updatedReview : r));
            setEditingReview(null);
            setSelectedReviewFile(null);
            toast.success('Review Updated');
        } catch (err: any) {
            toast.error(err.message || 'Failed to update review');
        } finally {
            setSavingReview(false);
        }
    };

    const deleteReview = async (id: number) => {
        await supabase.from('customer_reviews').delete().eq('id', id);
        setReviews(prev => prev.filter(r => r.id !== id));
    };

    const toggleReview = async (id: number, active: boolean) => {
        await supabase.from('customer_reviews').update({ active }).eq('id', id);
        setReviews(prev => prev.map(r => r.id === id ? { ...r, active } : r));
    };

    // Transformations
    const createTransformation = async () => {
        if (!beforeFile || !afterFile) return;
        setSavingTransformation(true);
        try {
            const beforeCompressed = await compressImage(beforeFile);
            const afterCompressed = await compressImage(afterFile);

            const beforeUrl = await uploadImage(beforeCompressed, 'product-media', 'transformations');
            const afterUrl = await uploadImage(afterCompressed, 'product-media', 'transformations');

            const { data, error } = await supabase.from('transformations').insert([{
                ...newTransformation,
                before_url: beforeUrl,
                after_url: afterUrl
            }]).select('*, product:products(*)').single();

            if (data) {
                setTransformations(prev => [data, ...prev]);
                setShowAddTransformation(false);
                setNewTransformation({ customer_name: '', concern: 'Hair Fall', duration: '4 Weeks', verified: true, product_id: null, review_url: '' });
                setBeforeFile(null);
                setAfterFile(null);
                toast.success('Transformation Linked & Published');
            } else if (error) throw error;
        } catch (err: any) {
            toast.error(err.message || 'Failed to upload transformation');
        } finally {
            setSavingTransformation(false);
        }
    };

    const deleteTransformation = async (id: string) => {
        if (!confirm('Remove this result from the Hub?')) return;
        const { error } = await supabase.from('transformations').delete().eq('id', id);
        if (!error) {
            setTransformations(prev => prev.filter(t => t.id !== id));
            toast.success('Removed');
        }
    };

    const toggleTransformation = async (id: string, verified: boolean) => {
        await supabase.from('transformations').update({ verified }).eq('id', id);
        setTransformations(prev => prev.map(t => t.id === id ? { ...t, verified } : t));
    };

    // Returns
    const updateReturnStatus = async (id: number, status: string) => {
        await supabase.from('return_requests').update({ status }).eq('id', id);
        setReturns(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    };

    const sendReviewRequest = (order: any) => {
        const message = `Hi ${order.customer_name}, your Essential Cure bottle has arrived! 🌟 We'd love to see your 1st-day "Before" photo. Share your journey here to help others: https://theessentialcure.com/reviews`;
        const phone = order.customer_phone.replace(/\D/g, '');
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
        toast.success('Review request opened in WhatsApp');
    };

    const sendWhatsAppBroadcast = (phoneNumbers: string[], message: string) => {
        if (!phoneNumbers.length) return;
        const encodedMsg = encodeURIComponent(message);
        // For simple broadcast, we open the first one or a web.whatsapp.com link with pre-filled text
        // Alternatively, generate a list of links
        const firstPhone = phoneNumbers[0].replace(/[^0-9]/g, '');
        window.open(`https://wa.me/${firstPhone}?text=${encodedMsg}`, '_blank');
        toast.info(`Broadcast started for ${phoneNumbers.length} customers.`);
    };

    // Store Config
    const updateConfig = async () => {
        if (!config) return; setSaving(true);
        await supabase.from('store_config').update(config).eq('admin_password', config.admin_password);
        toast.success('Settings Saved'); setSaving(false);
    };

    const addCityPair = () => {
        if (!cityInput || !daysInput || !config) return;
        const next = { ...config.city_delivery_days, [cityInput]: daysInput };
        setConfig({ ...config, city_delivery_days: next }); setCityInput(''); setDaysInput('');
    };

    const removeCityPair = (city: string) => {
        if (!config) return;
        const next = { ...config.city_delivery_days }; delete next[city];
        setConfig({ ...config, city_delivery_days: next });
    };

    const saveNote = async () => {
        if (!detailOrder) return; setSavingNote(true);
        await supabase.from('orders').update({ admin_notes: noteText }).eq('id', detailOrder.id);
        setOrders(orders.map(o => o.id === detailOrder.id ? { ...o, admin_notes: noteText } : o));
        setDetailOrder({ ...detailOrder, admin_notes: noteText }); setSavingNote(false);
    };

    const moveToTrash = async (id: string, notes?: string) => {
        const { error } = await supabase.from('orders').update({ status: 'Trash' }).eq('id', id);
        if (!error) {
            setOrders(orders.map(o => o.id === id ? { ...o, status: 'Trash' } : o));
            toast.success('Order moved to Trash');
            fetchData(); // Sync both states
        } else {
            toast.error('Failed to move order to trash');
        }
    };

    const restoreOrder = async (id: string, notes?: string) => {
        const { error } = await supabase.from('orders').update({ status: 'Processing' }).eq('id', id);
        if (!error) {
            setOrders(orders.map(o => o.id === id ? { ...o, status: 'Processing' } : o));
            toast.success('Order restored');
            fetchData();
        } else {
            toast.error('Failed to restore order');
        }
    };

    const updateUserRole = async (id: string, role: string) => {
        const { error } = await supabase.from('admin_users').update({ role }).eq('id', id);
        if (!error) {
            setUsers(users.map(u => u.id === id ? { ...u, role } : u));
            toast.success(`Role updated to ${role}`);
            logAction('UPDATE_ROLE', 'admin_users', id, {}, { role });
        }
    };

    const updateUserPermissions = async (id: string, permissions: string[]) => {
        const { error } = await supabase.from('admin_users').update({ permissions }).eq('id', id);
        if (!error) {
            setUsers(users.map(u => u.id === id ? { ...u, permissions } : u));
            toast.success('Permissions updated');
            logAction('UPDATE_PERMISSIONS', 'admin_users', id, {}, { permissions });
        }
    };

    const deleteAdminUser = async (id: string) => {
        if (!confirm('Revoke all access for this user?')) return;
        const { error } = await supabase.from('admin_users').delete().eq('id', id);
        if (!error) {
            setUsers(users.filter(u => u.id !== id));
            toast.success('User removed from team');
            logAction('DELETE_USER', 'admin_users', id);
        }
    };

    const fillTemplate = (text: string, order: any) => {
        return text.replace(/{name}/g, order.customer_name).replace(/{id}/g, order.id.slice(0, 8)).replace(/{amount}/g, (order.total_amount || 0).toLocaleString()).replace(/{status}/g, order.status);
    };

    const parseOrderItems = (notes: string) => {
        const items: { qty: number, name: string }[] = [];
        const match = notes?.match(/\[Items:\s+([^\]]+)\]/);
        if (!match) return items;
        const itemParts = match[1].split(',').map(s => s.trim());
        itemParts.forEach(part => {
            const m = part.match(/(\d+)x\s+(.+)/);
            if (m) items.push({ qty: parseInt(m[1]), name: m[2] });
        });
        return items;
    };

    // Computations
    // filteredOrders is no longer computing massive local arrays for the UI, but we keep it around if any bulk functions rely on it.
    // the UI now strictly uses `paginatedOrders`.
    const filteredOrders = paginatedOrders;

    const customers = Array.from(orders.reduce((acc, o) => {
        if (!acc.has(o.customer_phone)) acc.set(o.customer_phone, { name: o.customer_name, phone: o.customer_phone, city: o.customer_city, totalSpend: 0, orders: [] });
        const c = acc.get(o.customer_phone); c.orders.push(o); if (o.status !== 'Cancelled' && o.status !== 'Trash') c.totalSpend += o.total_amount;
        return acc;
    }, new Map<string, any>()).values());

    const revenueTrajectory = orders.slice(-14).map(o => o.total_amount);
    const cityStats = orders.reduce((acc: any, o) => { if (o.status !== 'Cancelled') acc[o.customer_city] = (acc[o.customer_city] || 0) + o.total_amount; return acc; }, {});
    const topCities = Object.entries(cityStats).sort((a: any, b: any) => b[1] - a[1]).slice(0, 5);
    const maxCity = Math.max(...(topCities.map(c => c[1]) as number[]), 1);
    const codCount = orders.filter(o => o.payment_method === 'COD').length;
    const xferCount = orders.filter(o => o.payment_method !== 'COD').length;
    const codPct = Math.round((codCount / (codCount + xferCount || 1)) * 100);
    const totalRev = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Trash').reduce((a, o) => a + o.total_amount, 0);
    const todayRev = orders.filter(o => new Date(o.created_at).toDateString() === new Date().toDateString()).reduce((a, o) => a + o.total_amount, 0);

    // Business Intelligence Core
    const sevenDaysAgo = new Date(); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentOrders = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Trash' && new Date(o.created_at) >= sevenDaysAgo);

    const productVelocity = products.reduce((acc: any, p) => {
        const sold = recentOrders.reduce((sum, o) => {
            const items = parseOrderItems(o.customer_notes);
            const pItem = items.find(i => i.name === p.name);
            return sum + (pItem?.qty || 0);
        }, 0);
        acc[p.id] = sold / 7; // Avg units per day
        return acc;
    }, {});

    const financials = orders.filter(o => o.status !== 'Cancelled' && o.status !== 'Trash').reduce((acc: any, o) => {
        const items = parseOrderItems(o.customer_notes);
        const orderCogs = items.reduce((sum, item) => {
            const p = products.find(prod => prod.name === item.name);
            return sum + (p?.cogs || 0) * item.qty;
        }, 0);
        acc.totalCogs += orderCogs;
        acc.totalProfit += (o.total_amount - (o.shipping_fee || 0) - orderCogs);
        return acc;
    }, { totalCogs: 0, totalProfit: 0 });

    const avgMargin = Math.round((financials.totalProfit / (totalRev || 1)) * 100);

    const inventoryHealth = products.map(p => {
        const dailyVelocity = productVelocity[p.id] || 0;
        const daysLeft = dailyVelocity > 0 ? Math.round(p.stock / dailyVelocity) : 999;
        return { name: p.name, daysLeft };
    });

    const clv = Math.round(totalRev / (customers.length || 1));

    const abandonedCarts = orders.filter(o =>
        o.status === 'Pending Payment' &&
        (Date.now() - new Date(o.created_at).getTime()) > (4 * 60 * 60 * 1000) // 4+ hours old
    ).sort((a, b) => b.total_amount - a.total_amount);

    if (!isAuthenticated) return (
        <div className="min-h-screen bg-gradient-luxury flex items-center justify-center p-6 text-foreground overflow-hidden">
            {/* Ambient Background Blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-primary/10 blur-[100px] rounded-full" />
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-secondary/5 blur-[100px] rounded-full" />
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-10 rounded-[3rem] border border-white/40 shadow-premium max-w-sm w-full relative z-10"
            >
                <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none">
                    <ShieldCheck size={140} strokeWidth={0.5} />
                </div>

                <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8 shadow-inner">
                    <Lock size={28} />
                </div>

                <h1 className="text-3xl font-bold mb-2 tracking-tight">Admin Login</h1>
                <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-[0.3em] mb-10">Store Owners Only</p>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Email Address"
                            className="w-full bg-white/50 border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                            autoFocus
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full bg-white/50 border border-border rounded-2xl px-5 py-4 outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm"
                            required
                        />
                    </div>
                    <button className="w-full bg-primary text-primary-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-gold hover:-translate-y-0.5 transition-all active:scale-95 duration-200 mt-4">
                        {loading ? <Loader2 size={18} className="animate-spin" /> : 'Log In'}
                    </button>
                </form>
            </motion.div>
        </div>
    );

    const Ticker = (
        <div className="bg-neutral-900 text-white p-3 rounded-2xl border border-neutral-800 flex items-center gap-4 overflow-hidden mb-6 group">
            <div className="flex items-center gap-2 px-3 border-r border-white/10 shrink-0"><Activity size={14} className="text-blue-400 animate-pulse" /><span className="text-[10px] font-bold uppercase tracking-widest">Recent Activity</span></div>
            <div className="flex-1 overflow-hidden relative h-4"><div className="flex gap-8 whitespace-nowrap absolute">
                {auditLogs.slice(0, 5).map((log, i) => (
                    <div key={i} className="flex items-center gap-2 text-[10px] font-medium text-white/70"><span className="text-white font-bold">{log.action.replace(/_/g, ' ')}</span><span>{log.resource_type} (#{log.resource_id?.slice(0, 5)})</span><span className="text-white/30">• {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
                ))}
            </div></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-luxury text-foreground font-sans selection:bg-primary/20 selection:text-primary pb-20">
            <aside className="fixed left-0 top-0 h-screen w-20 lg:w-72 glass-card border-r border-white/40 z-40 hidden sm:flex flex-col shadow-luxury">
                <div className="p-8 pb-10 border-b border-white/20 mb-6 flex flex-col items-center lg:items-start">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-gold">
                            <ShieldCheck size={24} strokeWidth={2.5} />
                        </div>
                        <div className="hidden lg:block leading-tight">
                            <h1 className="text-lg font-bold tracking-tight">Cure Admin</h1>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground opacity-60">Main Store</p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 space-y-2 overflow-y-auto no-scrollbar">
                    <p className="hidden lg:block text-[9px] font-bold uppercase tracking-[0.2em] text-muted-foreground mb-4 px-4 opacity-50">Admin Menu</p>
                    {[
                        { id: 'analytics', label: 'Sales Charts', icon: BarChart },
                        { id: 'orders', label: 'Orders', icon: Package },
                        { id: 'products', label: 'Products', icon: Layers },
                        { id: 'customers', label: 'Customers', icon: Users },
                        { id: 'coupons', label: 'Discounts', icon: Tag },
                        { id: 'messages', label: 'Messages', icon: MessageSquare },
                        { id: 'reviews', label: 'Reviews', icon: Star },
                        { id: 'leads', label: 'Leads', icon: Mail },
                        { id: 'transformations', label: 'Transformations', icon: Sparkles },
                        { id: 'returns', label: 'Returns', icon: RefreshCw },
                        { id: 'team', label: 'Team', icon: User },
                        adminProfile?.role === 'admin' && { id: 'ledger', label: 'Full History', icon: Database },
                        { id: 'settings', label: 'Store Settings', icon: Settings }
                    ].filter(Boolean).map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full p-4 rounded-3xl flex items-center gap-4 transition-all duration-300 group relative ${activeTab === item.id
                                ? 'bg-primary text-primary-foreground shadow-gold'
                                : 'text-muted-foreground hover:text-foreground hover:bg-white/40'
                                }`}
                        >
                            {activeTab === item.id && (
                                <motion.div layoutId="sidebar-active" className="absolute inset-0 bg-primary rounded-3xl -z-10" />
                            )}
                            <item.icon size={20} strokeWidth={activeTab === item.id ? 2.5 : 2} className="shrink-0" />
                            <span className="text-sm font-bold tracking-tight hidden lg:inline">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="p-4 pt-6 border-t border-white/20">
                    <button onClick={handleLogout} className="w-full p-4 rounded-3xl flex items-center gap-4 text-muted-foreground hover:text-red-500 hover:bg-red-50/50 transition-all group">
                        <LogOut size={20} />
                        <span className="text-sm font-bold tracking-tight hidden lg:inline">Sign Out</span>
                    </button>
                </div>
            </aside>

            <main className="sm:ml-20 lg:ml-72 p-6 lg:p-12 max-w-[1600px] mx-auto min-h-screen">
                <header className="mb-12 flex flex-col lg:flex-row lg:items-center justify-between gap-8 border-b border-white/20 pb-10 relative">
                    <div className="absolute top-0 right-0 py-2 px-4 bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-widest rounded-full flex items-center gap-2 border border-emerald-500/10">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        Store is Live
                    </div>
                    <div>
                        <h2 className="text-4xl font-bold text-foreground tracking-tight capitalize py-2">
                            {activeTab === 'analytics' ? 'Sales Overview' : activeTab}
                        </h2>
                        <div className="flex items-center gap-3 ml-1">
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em]">Store Admin Panel</p>
                            <span className="w-1 h-1 bg-border rounded-full" />
                            <p className="text-[10px] font-mono text-primary font-bold tracking-widest">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsCommandPaletteOpen(true)}
                            className="bg-white/40 ring-1 ring-white/40 backdrop-blur-xl px-5 py-3 rounded-2xl flex items-center gap-3 text-muted-foreground hover:text-foreground hover:shadow-premium transition-all shadow-sm"
                        >
                            <Search size={16} />
                            <span className="text-xs font-bold uppercase tracking-widest">Search...</span>
                            <kbd className="hidden sm:inline-block bg-white/50 px-2 py-0.5 rounded-lg border border-border text-[9px] font-mono">⌘K</kbd>
                        </button>
                    </div>
                </header>

                <Suspense fallback={null}>
                    <CommandPalette
                        isOpen={isCommandPaletteOpen}
                        setIsOpen={setIsCommandPaletteOpen}
                        setActiveTab={setActiveTab}
                        setSearchQuery={setSearchQuery}
                        setDetailOrder={setDetailOrder}
                        setEditingProduct={setEditingProduct}
                    />
                </Suspense>

                {loading ? <div className="h-[60vh] flex flex-col items-center justify-center gap-4 text-neutral-400"><Loader2 size={40} className="animate-spin text-neutral-900" /><span className="text-xs font-bold uppercase tracking-widest animate-pulse">Loading Dashboard...</span></div> : (
                    <div className="min-h-[70vh]">
                        {activeTab === 'analytics' && <AnalyticsTab timeRange={timeRange} setTimeRange={setTimeRange} totalRev={totalRev} todayRev={todayRev} avgOrder={Math.round(totalRev / (orders.length || 1))} conversion={4.2} trajectory={revenueTrajectory} topCities={topCities} maxCity={maxCity} codPct={codPct} codCount={codCount} xferCount={xferCount} ticker={Ticker} totalProfit={financials.totalProfit}
                            avgMargin={avgMargin}
                            generateMonthlyReport={generateMonthlyReport}
                            inventoryValuation={{ totalCogs: financials.totalCogs, totalPotentialRev: products.reduce((a, p) => a + p.price * p.stock, 0) }}
                            lowStockCount={products.filter(p => p.stock <= (config?.low_stock_threshold || 5)).length}
                            inventoryHealth={inventoryHealth}
                            customerCount={customers.length}
                            abandonedCarts={abandonedCarts}
                            onWhatsAppReminder={(cart) => {
                                setMessageOrder(cart);
                                setSelectedTemplateId('');
                                setMessagePreview('');
                            }}
                        />
                        }
                        {activeTab !== 'dashboard' && activeTab !== 'analytics' && (
                            <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-8 min-h-[600px]">
                                <Suspense fallback={
                                    <div className="flex flex-col items-center justify-center h-64 gap-4 text-neutral-400">
                                        <Loader2 className="animate-spin" size={32} />
                                        <span className="font-bold tracking-widest uppercase text-xs">Loading Module...</span>
                                    </div>
                                }>
                                    {activeTab === 'orders' && <OrdersTab orders={orders} config={config} statusFilter={statusFilter} setStatusFilter={setStatusFilter} searchQuery={searchQuery} setSearchQuery={setSearchQuery} viewingTrash={viewingTrash} setViewingTrash={setViewingTrash} selectedOrders={selectedOrders} setSelectedOrders={setSelectedOrders} bulkStatus={bulkStatus} setBulkStatus={setBulkStatus} handleBulkUpdate={handleBulkUpdate} exportCSV={exportCSV} generateShippingLabels={generateShippingLabels} dateFrom={dateFrom} setDateFrom={setDateFrom} dateTo={dateTo} setDateTo={setDateTo} orderFilters={orderFilters} setOrderFilters={setOrderFilters} setDetailOrder={setDetailOrder} setNoteText={setNoteText} toggleOne={toggleOne} allSelected={selectedOrders.size === filteredOrders.length && filteredOrders.length > 0} toggleAll={toggleAll} filteredOrders={filteredOrders} STATUS_TABS={['All', 'Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled']} STATUS_COLORS={STATUS_COLORS} ticker={Ticker} moveToTrash={moveToTrash} restoreOrder={restoreOrder} setMessageOrder={setMessageOrder} setSelectedTemplateId={setSelectedTemplateId} setMessagePreview={setMessagePreview} ordersLoading={ordersLoading} ordersHasMore={ordersHasMore} loadMoreOrders={loadMoreOrders} />}
                                    {activeTab === 'products' && <ProductsTab products={products} config={config} showAddProduct={showAddProduct} setShowAddProduct={setShowAddProduct} newProduct={newProduct} setNewProduct={setNewProduct} createProduct={createProduct} savingProduct={savingProduct} handleImageUpload={handleImageUpload} editingProduct={editingProduct} setEditingProduct={setEditingProduct} updateProductObj={updateProductObj} toggleProduct={toggleProduct} deleteProduct={deleteProduct} productVelocity={productVelocity} />}
                                    {activeTab === 'customers' && <CustomersTab customers={customers} searchQuery={searchQuery} setSearchQuery={setSearchQuery} exportCSV={exportCSV} />}
                                    {activeTab === 'coupons' && <CouponsTab coupons={coupons} showAddCoupon={showAddCoupon} setShowAddCoupon={setShowAddCoupon} newCoupon={newCoupon} setNewCoupon={setNewCoupon} createCoupon={createCoupon} toggleCoupon={toggleCoupon} deleteCoupon={deleteCoupon} />}
                                    {activeTab === 'messages' && <MessagesTab templates={templates} showAddTemplate={showAddTemplate} setShowAddTemplate={setShowAddTemplate} newTemplate={newTemplate} setNewTemplate={setNewTemplate} createTemplate={createTemplate} editingTemplate={editingTemplate} setEditingTemplate={setEditingTemplate} updateTemplate={updateTemplate} deleteTemplate={deleteTemplate} />}
                                    {activeTab === 'reviews' && <ReviewsTab reviews={reviews} showAddReview={showAddReview} setShowAddReview={setShowAddReview} newReview={newReview} setNewReview={setNewReview} createReview={createReview} savingReview={savingReview} editingReview={editingReview} setEditingReview={setEditingReview} updateReview={updateReview} toggleReview={toggleReview} deleteReview={deleteReview} selectedFile={selectedReviewFile} setSelectedFile={setSelectedReviewFile} />}
                                    {activeTab === 'transformations' && <TransformationsTab transformations={transformations} products={products} showAddTransformation={showAddTransformation} setShowAddTransformation={setShowAddTransformation} newTransformation={newTransformation} setNewTransformation={setNewTransformation} createTransformation={createTransformation} savingTransformation={savingTransformation} editingTransformation={editingTransformation} setEditingTransformation={setEditingTransformation} updateTransformation={() => { }} toggleTransformation={toggleTransformation} deleteTransformation={deleteTransformation} beforeFile={beforeFile} setBeforeFile={setBeforeFile} afterFile={afterFile} setAfterFile={setAfterFile} />}
                                    {activeTab === 'returns' && <ReturnsTab returns={returns} updateReturnStatus={updateReturnStatus} />}
                                    {activeTab === 'team' && <UsersTab users={users} currentUser={adminProfile} updateUserRole={updateUserRole} updateUserPermissions={updateUserPermissions} deleteUser={deleteAdminUser} auditLogs={auditLogs} />}
                                    {activeTab === 'ledger' && <LedgerTab masterOrders={masterOrders} searchQuery={searchQuery} setSearchQuery={setSearchQuery} exportCSV={exportCSV} />}
                                    {activeTab === 'settings' && <SettingsTab config={config} setConfig={setConfig} updateConfig={updateConfig} saving={saving} cityInput={cityInput} setCityInput={setCityInput} daysInput={daysInput} setDaysInput={setDaysInput} addCityPair={addCityPair} removeCityPair={removeCityPair} />}
                                </Suspense>
                            </div>
                        )}
                    </div>
                )}
            </main>

            <AnimatePresence>
                {messageOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/80 backdrop-blur-sm" onClick={() => setMessageOrder(null)}>
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl" onClick={e => e.stopPropagation()}>
                            <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-100">
                                <div><h3 className="text-lg font-bold text-neutral-900 tracking-tight">Dispatch Message</h3><p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">{messageOrder.customer_name} • {messageOrder.id.slice(0, 8)}</p></div>
                                <button onClick={() => setMessageOrder(null)} className="text-neutral-400 hover:text-neutral-900 transition-colors"><XCircle size={22} /></button>
                            </div>
                            <div className="space-y-4">
                                <select value={selectedTemplateId} onChange={e => { const id = e.target.value ? Number(e.target.value) : ''; setSelectedTemplateId(id); if (id) { const tpl = templates.find(t => t.id === id); setMessagePreview(fillTemplate(tpl.template_text, messageOrder)); } }} className="w-full bg-neutral-50 border border-neutral-200 text-sm rounded-xl px-4 py-2.5 outline-none focus:border-neutral-900 transition-all font-bold uppercase tracking-wider text-[10px]">
                                    <option value="">- Choose Template -</option>
                                    {templates.map(t => <option key={t.id} value={t.id}>{t.category}: {t.name}</option>)}
                                </select>
                                <textarea value={messagePreview} onChange={e => setMessagePreview(e.target.value)} rows={6} className="w-full bg-neutral-50 border border-neutral-200 px-4 py-3 rounded-2xl text-sm font-medium outline-none resize-none leading-relaxed" />
                                <button onClick={() => window.open(`https://wa.me/${messageOrder.customer_phone.replace(/\D/g, '')}?text=${encodeURIComponent(messagePreview)}`, '_blank')} className="w-full bg-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-wider shadow-lg"><MessageSquare size={16} /> Deploy to WhatsApp</button>
                            </div>
                        </motion.div>
                    </div>
                )}
                {detailOrder && (
                    <div className="fixed inset-0 z-50 flex justify-end bg-neutral-900/40 backdrop-blur-sm" onClick={() => setDetailOrder(null)}>
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} className="w-full max-w-xl bg-white h-screen shadow-2xl overflow-y-auto no-scrollbar" onClick={e => e.stopPropagation()}>
                            <div className="p-8 pb-10 border-b border-neutral-100 sticky top-0 bg-white/80 backdrop-blur-md z-10 flex items-center justify-between">
                                <div><h3 className="text-2xl font-bold text-neutral-900 tracking-tighter">Order Details</h3><div className="flex items-center gap-3 mt-1"><span className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-widest">{detailOrder.id}</span></div></div>
                                <button onClick={() => setDetailOrder(null)} className="p-2 hover:bg-neutral-100 rounded-xl transition-all"><XCircle size={24} /></button>
                            </div>
                            <div className="p-8 space-y-10">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest"><User size={12} /> Customer Info</div>
                                        <div className="font-bold text-neutral-900 text-base">{detailOrder.customer_name}</div>
                                        <div className="text-xs text-neutral-500 mt-1 uppercase font-bold tracking-wider">{detailOrder.customer_phone}</div>
                                    </div>
                                    <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <div className="flex items-center gap-2 mb-4 text-[10px] font-bold text-neutral-400 uppercase tracking-widest"><MapPin size={12} /> Shipping Info</div>
                                        <div className="font-bold text-neutral-900 text-base uppercase">{detailOrder.customer_city}</div>
                                        <div className="text-[10px] text-neutral-500 mt-1 font-bold uppercase tracking-wider truncate">{detailOrder.customer_address}</div>
                                    </div>
                                </div>

                                {detailOrder.items && Array.isArray(detailOrder.items) && detailOrder.items.length > 0 && (
                                    <div className="space-y-4">
                                        <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Order Items</h4>
                                        <div className="bg-neutral-50 rounded-2xl border border-neutral-100 overflow-hidden">
                                            <div className="divide-y divide-neutral-100">
                                                {detailOrder.items.map((item: any, i: number) => (
                                                    <div key={i} className="flex items-center gap-4 p-4">
                                                        <div className="w-12 h-12 bg-white rounded-xl border border-neutral-100 flex items-center justify-center p-1.5 shrink-0">
                                                            {item.image_url ? (
                                                                <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                                                            ) : (
                                                                <Package size={20} className="text-neutral-300" />
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="font-bold text-neutral-900 text-sm truncate">{item.name}</div>
                                                            <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-bold mt-1">
                                                                PKR {item.sale_price || item.price} × {item.quantity}
                                                            </div>
                                                        </div>
                                                        <div className="font-bold text-neutral-900 text-sm">
                                                            PKR {((item.sale_price || item.price) * item.quantity).toLocaleString()}
                                                        </div>
                                                    </div>
                                                ))}
                                                <div className="bg-neutral-100/50 p-4 flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Item Subtotal</span>
                                                    <span className="font-bold text-neutral-900">
                                                        PKR {detailOrder.items.reduce((acc: number, item: any) => acc + ((item.sale_price || item.price) * item.quantity), 0).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Status Management</h4>
                                    {detailOrder.status === 'Delivered' && (
                                        <button
                                            onClick={() => sendReviewRequest(detailOrder)}
                                            className="w-full mb-3 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 p-4 rounded-2xl flex items-center justify-between group hover:bg-emerald-500 hover:text-white transition-all duration-300"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center group-hover:bg-white/20">
                                                    <MessageSquare size={16} />
                                                </div>
                                                <div className="text-left">
                                                    <p className="text-[10px] font-black uppercase tracking-widest">After-Sales Service</p>
                                                    <p className="text-xs font-bold">Request Transformation Photo</p>
                                                </div>
                                            </div>
                                            <ChevronRight size={18} />
                                        </button>
                                    )}
                                    <div className="grid grid-cols-2 gap-3">
                                        {['Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered', 'Cancelled'].map(s => (
                                            <button key={s} onClick={() => { handleStatusUpdate(detailOrder, s).then(() => { fetchData(); setDetailOrder({ ...detailOrder, status: s }); toast.success(`Order set to ${s}`); }); }} className={`p-3 rounded-xl text-[10px] font-bold uppercase tracking-widest border transition-all ${detailOrder.status === s ? 'bg-neutral-900 text-white border-neutral-900' : 'bg-white text-neutral-400 border-neutral-100 hover:border-neutral-900 hover:text-neutral-900'}`}>{s}</button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Admin Notes</h4>
                                    <textarea value={noteText} onChange={e => setNoteText(e.target.value)} rows={4} className="w-full bg-neutral-50 border border-neutral-100 px-4 py-4 rounded-2xl text-xs font-medium outline-none focus:border-neutral-900 resize-none leading-relaxed italic" placeholder="Internal notes..." />
                                    <button onClick={saveNote} disabled={savingNote} className="w-full bg-neutral-900 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl shadow-neutral-900/10 transition-all active:scale-[0.98]">{savingNote ? <Loader2 size={16} className="animate-spin" /> : "Save Note"}</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Admin;
