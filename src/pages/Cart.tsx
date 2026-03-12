import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import { useDocumentMeta } from '@/hooks/useDocumentMeta';
import CitySelect from '@/components/CitySelect';
import { ArrowLeft, Minus, Plus, ShoppingBag, Trash2, User, Phone, MapPin, Home, ChevronRight, CheckCircle2, Package, XCircle, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AnimatedSection from "@/components/AnimatedSection";
import heroProduct2 from "@/assets/hero-product-2.png";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, CreditCard, Banknote, UploadCloud, Truck, Check, FileCheck, ArrowUpCircle, RotateCcw } from "lucide-react";
import Navbar from "@/components/Navbar";
import { trackInitiateCheckout, trackPurchase } from "@/lib/analytics";
import { useCartStore } from "@/store/cartStore";
import { PackagePlus } from "lucide-react";

type OrderStatus = 'Processing' | 'Pending Payment' | 'Confirmed' | 'Packed' | 'Shipped' | 'Delivered' | 'Cancelled';

type Order = {
    id: string;
    date: string;
    quantity: number;
    total: number;
    status: OrderStatus;
    customerInfo: {
        name: string;
        phone: string;
        city: string;
        address: string;
    };
    paymentMethod: 'COD' | 'Transfer';
    shippingFee: number;
    cancelReason?: string;
};

const Cart = () => {
    const { items, total, updateQuantity, removeItem, clearCart, addItem } = useCartStore();
    const totalItems = items.reduce((acc, i) => acc + i.quantity, 0);
    const [showForm, setShowForm] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [isEmpty, setIsEmpty] = useState(items.length === 0);

    const [upsells, setUpsells] = useState<any[]>([]);

    useEffect(() => {
        const fetchUpsells = async () => {
            const { data } = await supabase
                .from('products')
                .select('*')
                .eq('active', true)
                .order('created_at', { ascending: false });
            if (data) {
                setUpsells(data);
            }
        };
        fetchUpsells();
    }, []);

    const availableUpsells = upsells.filter(
        upsell => upsell.stock > 0 && !items.some(item => item.id === upsell.id)
    ).slice(0, 2);

    // Payment Proof
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentReceipt, setPaymentReceipt] = useState<File | null>(null);
    const [uploadingReceipt, setUploadingReceipt] = useState(false);
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    // Live Store Config
    useDocumentMeta({
        title: 'Order Now',
        description: 'Order The Essential Cure Premium Natural Hair Oil — fast delivery across Pakistan.',
    });

    const [basePrice, setBasePrice] = useState(1700);
    const [codFee, setCodFee] = useState(100);
    const [jazzcashDiscount, setJazzcashDiscount] = useState(0);
    const [acceptingOrders, setAcceptingOrders] = useState(true);
    const [isSaleActive, setIsSaleActive] = useState(false);
    const [saleMultiplier, setSaleMultiplier] = useState(1);
    const [jazzcashName, setJazzcashName] = useState("");
    const [jazzcashNumber, setJazzcashNumber] = useState("");
    const [bankAccounts, setBankAccounts] = useState<any[]>([]);
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [currentStock, setCurrentStock] = useState<number | null>(null);
    const [lowStockThreshold, setLowStockThreshold] = useState(5);
    const [cancelWindowMins, setCancelWindowMins] = useState(15);
    const [storeClosedMessage, setStoreClosedMessage] = useState("");
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Transfer'>('COD');
    const [bundleDiscountQty2, setBundleDiscountQty2] = useState(10);
    const [bundleDiscountQty3, setBundleDiscountQty3] = useState(15);

    const [viewState, setViewState] = useState<'cart' | 'orders'>('cart');
    const [orders, setOrders] = useState<Order[]>([]);
    const [cancelReason, setCancelReason] = useState("");
    const [showCancelModal, setShowCancelModal] = useState<string | null>(null);
    const [lastOrder, setLastOrder] = useState<Order | null>(null);
    const [whatsappOptIn, setWhatsappOptIn] = useState(true);
    const [cityDeliveryDays, setCityDeliveryDays] = useState<Record<string, string>>({});
    const [cartRecoveryWebhook, setCartRecoveryWebhook] = useState("");
    const abandonedCartSaved = React.useRef(false);
    const orderPlacedRef = React.useRef(false);

    // Coupon State
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState<{ code: string, value: number } | null>(null);
    const [couponLoading, setCouponLoading] = useState(false);

    // Form state - prefill from local profile if it exists
    const [form, setForm] = useState(() => {
        const savedProfile = localStorage.getItem('userProfile');
        if (savedProfile) {
            try {
                return { ...JSON.parse(savedProfile), notes: "" };
            } catch (e) {
                console.error("Failed to parse user profile", e);
            }
        }
        return {
            name: "",
            phone: "",
            city: "",
            address: "",
            notes: "",
        };
    });

    const [loading, setLoading] = useState(false);

    // Feature 2: Checkout Auto-Fill (Auto-save form to localStorage)
    useEffect(() => {
        if (form.name || form.phone || form.city || form.address) {
            const formDataToSave = {
                name: form.name,
                phone: form.phone,
                city: form.city,
                address: form.address
            };
            localStorage.setItem('userProfile', JSON.stringify(formDataToSave));
        }
    }, [form.name, form.phone, form.city, form.address]);

    useEffect(() => {
        const fetchStoreConfig = async () => {
            const { data, error } = await supabase
                .from('store_config')
                .select('*')
                .eq('id', 1)
                .single();

            if (data && !error) {
                setBasePrice(data.product_price);
                setCodFee(data.cod_shipping_fee);
                setJazzcashDiscount(data.jazzcash_discount);
                setAcceptingOrders(data.accepting_orders);
                setIsSaleActive(data.is_sale_active);
                setSaleMultiplier(data.sale_multiplier);
                setJazzcashName(data.jazzcash_name);
                setJazzcashNumber(data.jazzcash_number);
                setWhatsappNumber(data.whatsapp_number);
                setCurrentStock(data.current_stock);
                setLowStockThreshold(data.low_stock_threshold || 5);
                setCancelWindowMins(data.cancellation_window_mins || 15);
                setStoreClosedMessage(data.store_closed_message || "Store is temporarily closed.");
                setBankAccounts(data.bank_accounts || []);
                setBundleDiscountQty2(data.bundle_discount_qty2 ?? 10);
                setBundleDiscountQty3(data.bundle_discount_qty3 ?? 15);
                setCityDeliveryDays(data.city_delivery_days || {});
                setCartRecoveryWebhook(data.cart_recovery_webhook || "");
            }
        };

        fetchStoreConfig();

        const syncOrders = async (localOrders: Order[]) => {
            try {
                const orderIds = localOrders.map(o => o.id);
                const { data, error } = await supabase
                    .from('orders')
                    .select('id, status, cancel_reason')
                    .in('id', orderIds);

                if (data && !error) {
                    const updatedOrders = localOrders.map(localOrder => {
                        const dbOrder = data.find(d => d.id === localOrder.id);
                        if (dbOrder) {
                            return {
                                ...localOrder,
                                status: dbOrder.status as any,
                                cancelReason: dbOrder.cancel_reason || localOrder.cancelReason
                            };
                        }
                        return localOrder;
                    });
                    setOrders(updatedOrders);
                    localStorage.setItem('myOrders', JSON.stringify(updatedOrders));
                }
            } catch (err) {
                console.error("Error syncing orders:", err);
            }
        };

        const savedOrdersStr = localStorage.getItem('myOrders');
        if (savedOrdersStr) {
            try {
                const parsedOrders = JSON.parse(savedOrdersStr);
                setOrders(parsedOrders);
                syncOrders(parsedOrders);
            } catch (e) {
                console.error("Failed to parse orders", e);
            }
        }
    }, [supabase]);

    // Abandoned cart: auto-save when user fills in name+phone
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const updated = { ...form, [e.target.name]: e.target.value };
        setForm(updated);
        // Save to abandoned_carts after name+phone filled
        if (!abandonedCartSaved.current && updated.name && updated.phone) {
            abandonedCartSaved.current = true;
            supabase.from('abandoned_carts').insert([{
                name: updated.name,
                phone: updated.phone,
                city: updated.city || '',
                quantity: totalItems,
                recovered: false,
            }]).then(() => { });
        }
    };

    // Trigger Webhook on Abandon
    useEffect(() => {
        const handleUnload = () => {
            if (cartRecoveryWebhook && form.name && form.phone && !orderPlacedRef.current) {
                const payload = { event: 'abandoned_cart', name: form.name, phone: form.phone, city: form.city, items: totalItems, _timestamp: Date.now() };
                fetch(cartRecoveryWebhook, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                }).catch(() => { });
            }
        };

        window.addEventListener('pagehide', handleUnload);
        return () => {
            window.removeEventListener('pagehide', handleUnload);
            handleUnload(); // Call on React unmount
        };
    }, [cartRecoveryWebhook, form.name, form.phone, form.city, totalItems]);
    const originalUnitPrice = basePrice;
    const currentUnitPrice = isSaleActive ? Math.round(basePrice * saleMultiplier) : basePrice;

    const subtotal = items.length > 0 ? total : currentUnitPrice * Math.max(1, totalItems);
    const currentShippingFee = paymentMethod === 'COD' ? codFee : 0;

    // Apply transfer discount to subtotal if selected
    const discountMultiplier = paymentMethod === 'Transfer' && jazzcashDiscount > 0
        ? (1 - (jazzcashDiscount / 100))
        : 1;
    const discountedSubtotal = Math.round(subtotal * discountMultiplier);

    // Bundle discount: read from store config
    const bundleDiscountPct = totalItems >= 3 ? bundleDiscountQty3 : totalItems >= 2 ? bundleDiscountQty2 : 0;
    const bundleDiscount = bundleDiscountPct > 0 ? Math.round(discountedSubtotal * bundleDiscountPct / 100) : 0;
    const afterBundleSubtotal = discountedSubtotal - bundleDiscount;

    // Referral Logic
    const referralCodeFromStorage = localStorage.getItem('referral_code');
    const referralCode = (referralCodeFromStorage && referralCodeFromStorage !== form.phone) ? referralCodeFromStorage : null;

    // Referral Discount (10% - only if no other coupon applied)
    const referralDiscount = (referralCode && !appliedCoupon) ? Math.round(afterBundleSubtotal * 0.1) : 0;

    // Coupon Discount
    const couponDiscount = appliedCoupon ? Math.round(afterBundleSubtotal * appliedCoupon.value / 100) : 0;
    const finalSubtotal = afterBundleSubtotal - couponDiscount - referralDiscount;

    const totalAmount = finalSubtotal + currentShippingFee;

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        setCouponLoading(true);
        try {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('code', couponCode.trim().toUpperCase())
                .eq('active', true)
                .single();

            if (error || !data) {
                toast.error("Invalid or inactive coupon code.");
            } else {
                // Check usage limit
                if (data.usage_limit !== null && data.usage_count >= data.usage_limit) {
                    toast.error("This coupon has reached its usage limit.");
                } else {
                    setAppliedCoupon({ code: data.code, value: data.value });
                    toast.success(`Coupon Applied: ${data.value}% Off!`);
                }
            }
        } catch (err) {
            toast.error("Error validating coupon.");
        } finally {
            setCouponLoading(false);
        }
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.phone || !form.city || !form.address) {
            toast.error("Please fill in all required fields.");
            return;
        }

        // Feature: Pakistani Phone Number Validation
        const phoneRegex = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;
        const cleanPhone = form.phone.replace(/[^0-9]/g, '');
        // Standardize to 03xx xxxxxxx format for the database
        const standardPhone = cleanPhone.length === 10 ? '0' + cleanPhone : cleanPhone.slice(-11);

        if (!phoneRegex.test(standardPhone)) {
            toast.error("Please enter a valid Pakistani phone number (e.g. 03001234567)");
            return;
        }

        setLoading(true);

        // 0. Double check stock and store status before proceeding
        try {
            const { data: configCheck, error: configError } = await supabase.from('store_config').select('current_stock, accepting_orders, store_closed_message').single();
            if (configError) throw configError;

            if (configCheck) {
                if (configCheck.accepting_orders === false) {
                    toast.error(configCheck.store_closed_message || "We are currently not accepting orders.");
                    setLoading(false);
                    return;
                }
                if (configCheck.current_stock !== null && configCheck.current_stock < totalItems) {
                    toast.error("Not enough units in stock!");
                    setLoading(false);
                    return;
                }
            }
        } catch (e: any) {
            console.error("Validation check failed", e);
            toast.error("Failed to verify store status. Please try again.");
            setLoading(false);
            return;
        }

        const generateRobustId = () => {
            const timePart = Date.now().toString(36).toUpperCase().slice(-5);
            const randPart = Math.random().toString(36).substring(2, 6).toUpperCase();
            return `ORD-${timePart}-${randPart}`;
        };
        const orderId = generateRobustId();

        try {
            const { error } = await supabase
                .from('orders')
                .insert([{
                    id: orderId,
                    customer_name: form.name,
                    customer_phone: standardPhone,
                    customer_city: form.city,
                    customer_address: form.address,
                    customer_notes: form.notes ? `${form.notes}\n[Items: ${items.map(i => `${i.quantity}x ${i.name}`).join(', ')}]${referralCode ? `\n[Referrer: ${referralCode}]` : ''}` : `[Items: ${items.map(i => `${i.quantity}x ${i.name}`).join(', ')}]${referralCode ? `\n[Referrer: ${referralCode}]` : ''}`,
                    items: items,
                    quantity: totalItems,
                    payment_method: paymentMethod,
                    shipping_fee: currentShippingFee,
                    total_amount: totalAmount,
                    status: paymentMethod === 'Transfer' ? 'Pending Payment' : 'Processing',
                    whatsapp_optin: whatsappOptIn,
                }]);

            if (error) throw error;

            // Atomic Stock Decrement via Database RPC
            if (currentStock !== null) {
                const { data: newMainStock, error: stockErr } = await supabase.rpc('decrement_store_stock', { qty: totalItems });
                if (!stockErr && newMainStock !== null) setCurrentStock(newMainStock);

                // Also attempt dynamic products stock decrement
                const upsells = items.filter(u => u.id && u.id !== 1);
                for (const u of upsells) {
                    await supabase.rpc('decrement_product_stock', { p_id: u.id, qty: u.quantity });
                }
            }

            // Increment coupon usage count for non-Transfer (COD) orders
            if (appliedCoupon && paymentMethod !== 'Transfer') {
                await supabase.rpc('redeem_coupon', { p_code: appliedCoupon.code });
            }

            // Mark abandoned cart recovered
            if (form.phone) {
                await supabase.from('abandoned_carts').update({ recovered: true }).eq('phone', form.phone);
            }

            const newOrder: Order = {
                id: orderId,
                date: new Date().toISOString(),
                quantity: totalItems,
                total: totalAmount,
                status: paymentMethod === 'Transfer' ? 'Pending Payment' : 'Processing',
                customerInfo: {
                    name: form.name,
                    phone: form.phone,
                    city: form.city,
                    address: form.address,
                },
                paymentMethod,
                shippingFee: currentShippingFee
            };

            const updatedOrders = [newOrder, ...orders];
            setOrders(updatedOrders);
            localStorage.setItem('myOrders', JSON.stringify(updatedOrders));
            setLastOrder(newOrder);
            orderPlacedRef.current = true;

            // Fire Meta Pixel Purchase event
            trackPurchase(totalAmount, 'PKR');

            clearCart();

            // If paying by Transfer, show the payment modal to upload receipt immediately.
            if (paymentMethod === 'Transfer') {
                setShowPaymentModal(true);
            } else {
                // For COD: redeem coupon immediately upon successful order placement
                if (appliedCoupon) {
                    await supabase.rpc('redeem_coupon', { p_code: appliedCoupon.code });
                }
                setOrderPlaced(true);
                setIsEmpty(true);
                toast.success("Order placed successfully!");

                // Award points: 5 points for every 100 PKR
                const pointsToAward = Math.floor(totalAmount / 100) * 5;
                if (pointsToAward > 0 && standardPhone) {
                    supabase.rpc('award_loyalty_points', { p_phone: standardPhone, p_points: pointsToAward });
                }
            }
        } catch (error: any) {
            console.error("Error placing order:", error);
            toast.error(error?.message || "Failed to place order. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleReceiptUpload = async (e: React.FormEvent) => {
        e.preventDefault();

        if (bankAccounts.length > 0 && !selectedBank) {
            toast.error("Please click to select which Bank/Wallet you transferred to.");
            return;
        }

        if (!paymentReceipt || !lastOrder) return;

        setUploadingReceipt(true);

        try {
            // 1. Upload to Storage
            const fileExt = paymentReceipt.name.split('.').pop();
            const fileName = `${lastOrder.id}-${Math.random()}.${fileExt}`;
            const { error: uploadError } = await supabase.storage
                .from('receipts')
                .upload(fileName, paymentReceipt);

            if (uploadError) {
                console.error("Supabase Storage Error:", uploadError);
                throw new Error(uploadError.message || "Failed to upload image to bucket. Check RLS policies.");
            }

            // 2. Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('receipts')
                .getPublicUrl(fileName);

            // 3. Save to database
            const { error: dbError } = await supabase
                .from('jazzcash_payments')
                .insert([{
                    order_id: lastOrder.id,
                    receipt_url: publicUrl
                }]);

            if (dbError) {
                console.error("Supabase Database Error:", dbError);
                throw new Error("Failed to link receipt to order. Check table structure.");
            }

            // 4. Update the order status to Processing now that it's paid
            await supabase.from('orders').update({ status: 'Processing' }).eq('id', lastOrder.id);

            // 5. If coupon used, increment usage count via RPC (or simple update if RPC not ready)
            if (appliedCoupon) {
                await supabase.rpc('redeem_coupon', { p_code: appliedCoupon.code });
            }

            // Update local state
            const updatedOrders = orders.map(o => o.id === lastOrder.id ? { ...o, status: 'Processing' as const } : o);
            setOrders(updatedOrders);
            localStorage.setItem('myOrders', JSON.stringify(updatedOrders));

            toast.success("Payment receipt uploaded! We will verify it shortly.");

            // Award points for Transfer orders
            const pointsToAward = Math.floor(lastOrder.total / 100) * 5;
            if (pointsToAward > 0 && lastOrder.customerInfo.phone) {
                const stdPhone = lastOrder.customerInfo.phone.replace(/[^0-9]/g, '');
                supabase.rpc('award_loyalty_points', { p_phone: stdPhone, p_points: pointsToAward }).then(() => {
                    console.log(`Awarded ${pointsToAward} points to ${stdPhone}`);
                });
            }

            setShowPaymentModal(false);
            setOrderPlaced(true);
            setIsEmpty(true);
        } catch (error: any) {
            console.error("Upload process error:", error);
            toast.error(error.message || "Failed to upload receipt. Try again.");
        } finally {
            setUploadingReceipt(false);
        }
    };

    const handleRemove = () => {
        setIsEmpty(true);
    };

    const handleCancelOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!showCancelModal || !cancelReason.trim()) return;

        try {
            // Update in Supabase
            const { error } = await supabase
                .from('orders')
                .update({ status: 'Cancelled', cancel_reason: cancelReason })
                .eq('id', showCancelModal);

            if (error) throw error;

            // Update locally
            const updatedOrders = orders.map(o =>
                o.id === showCancelModal ? { ...o, status: 'Cancelled' as const, cancelReason } : o
            );

            setOrders(updatedOrders);
            localStorage.setItem('myOrders', JSON.stringify(updatedOrders));
            setShowCancelModal(null);
            setCancelReason("");
            toast.success("Order cancelled.");
        } catch (error) {
            console.error("Error cancelling order:", error);
            toast.error("Failed to cancel order. Please try again.");
        }
    };

    const OrderCountdown = ({ orderDate }: { orderDate: string }) => {
        const [timeLeft, setTimeLeft] = useState("");
        const [isExpired, setIsExpired] = useState(false);

        useEffect(() => {
            const timer = setInterval(() => {
                const now = new Date().getTime();
                const placed = new Date(orderDate).getTime();
                const limit = cancelWindowMins * 60 * 1000;
                const diff = (placed + limit) - now;

                if (diff <= 0) {
                    setIsExpired(true);
                    clearInterval(timer);
                } else {
                    const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                    const s = Math.floor((diff % (1000 * 60)) / 1000);
                    setTimeLeft(`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
                }
            }, 1000);

            return () => clearInterval(timer);
        }, [orderDate, cancelWindowMins]);

        if (isExpired) return null;
        return <span className="font-mono bg-red-100 text-red-600 px-2 py-0.5 rounded text-xs font-bold animate-pulse">{timeLeft}</span>;
    };

    // Tracking UI helper
    const TrackingProgress = ({ status }: { status: string }) => {
        // Pending Payment acts like Processing visually, but with a warning.
        const effectiveStatus = status === 'Pending Payment' ? 'Processing' : status;
        const steps = ['Processing', 'Confirmed', 'Packed', 'Shipped', 'Delivered'];

        // If cancelled, show a different red timeline
        if (status === 'Cancelled') return null;

        const currentIndex = steps.indexOf(effectiveStatus) === -1 ? 0 : steps.indexOf(effectiveStatus);

        return (
            <div className="mt-8 pt-6 border-t border-border w-full">
                <h4 className="text-sm font-semibold text-foreground mb-4">Tracking Journey</h4>
                <div className="relative flex items-center justify-between w-full">
                    {/* Background Line */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-secondary rounded-full" />
                    {/* Active Line */}
                    <div
                        className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-green-500 rounded-full transition-all duration-500"
                        style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                    />

                    {steps.map((step, index) => {
                        const isCompleted = index <= currentIndex;
                        const isActive = index === currentIndex;
                        let Icon = Clock;
                        if (step === 'Confirmed') Icon = FileCheck;
                        if (step === 'Packed') Icon = Package;
                        if (step === 'Shipped') Icon = Truck;
                        if (step === 'Delivered') Icon = CheckCircle2;

                        return (
                            <div key={step} className="relative z-10 flex flex-col items-center gap-2 group">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-card transition-colors duration-300 ${isCompleted ? (status === 'Pending Payment' && step === 'Processing' ? 'border-amber-500 text-amber-500' : 'border-green-500 text-green-500') : 'border-border text-muted-foreground'} ${isActive ? (status === 'Pending Payment' ? 'shadow-[0_0_10px_rgba(245,158,11,0.3)] bg-amber-50' : 'shadow-[0_0_10px_rgba(34,197,94,0.3)] bg-green-50') : ''}`}>
                                    <Icon size={14} />
                                </div>
                                <span className={`text-[10px] font-semibold absolute -bottom-6 whitespace-nowrap ${isActive ? (status === 'Pending Payment' ? 'text-amber-600' : 'text-green-600') : isCompleted ? 'text-foreground' : 'text-muted-foreground'}`}>
                                    {step}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    // Render Orders View
    if (viewState === 'orders') {
        return (
            <div className="min-h-screen bg-gradient-cream pt-24 pb-12 font-body">
                <div className="container mx-auto px-6 max-w-4xl">
                    <AnimatedSection className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => setViewState('cart')}
                            className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span>Back to Cart</span>
                        </button>
                        <h1 className="font-heading text-3xl font-bold flex items-center gap-3 text-foreground">
                            <Package size={28} className="text-primary" /> My Orders
                        </h1>
                    </AnimatedSection>

                    {orders.filter(order => order.status !== 'Cancelled').length === 0 ? (
                        <AnimatedSection className="glass-card rounded-3xl p-12 text-center shadow-luxury">
                            <Package size={48} className="text-primary/40 mx-auto mb-4" />
                            <h2 className="text-2xl font-bold mb-2 text-foreground">No Active Orders Yet</h2>
                            <p className="text-muted-foreground mb-6">You haven't placed any orders yet, or they have all been cancelled.</p>
                            <button
                                onClick={() => setViewState('cart')}
                                className="inline-flex items-center justify-center gap-2 bg-gradient-gold text-card font-semibold px-8 py-3.5 rounded-full shadow-luxury hover:scale-105 transition-all duration-300"
                            >
                                Start Shopping
                            </button>
                        </AnimatedSection>
                    ) : (
                        <div className="space-y-6">
                            {orders
                                .filter(order => order.status !== 'Cancelled')
                                .map((order) => (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        key={order.id}
                                        className="glass-card rounded-2xl p-6 shadow-sm border border-border"
                                    >
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4 border-b border-border pb-4">
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h3 className="font-bold text-lg text-foreground">{order.id}</h3>
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${order.status === 'Cancelled' ? 'bg-red-100 text-red-600' : order.status === 'Delivered' ? 'bg-green-100 text-green-700' : order.status === 'Pending Payment' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-blue-100 text-blue-700'}`}>
                                                        {order.status === 'Cancelled' ? <XCircle size={14} /> : order.status === 'Delivered' ? <Check size={14} /> : <Clock size={14} />}
                                                        {order.status}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-1">Placed on {new Date(order.date).toLocaleDateString()}</p>
                                            </div>
                                            <div className="text-left md:text-right">
                                                <p className="text-sm text-muted-foreground">Total Amount</p>
                                                <p className="font-bold text-lg text-primary">PKR {order.total}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <h4 className="text-sm font-semibold text-foreground mb-2">Order Details</h4>
                                                <p className="text-sm text-muted-foreground">{order.quantity}x The Essential Cure Hair Oil</p>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-foreground mb-2">Delivery Details</h4>
                                                <p className="text-sm text-muted-foreground">{order.customerInfo.name}</p>
                                                <p className="text-sm text-muted-foreground">{order.customerInfo.phone}</p>
                                                <p className="text-sm text-muted-foreground">{order.customerInfo.address}, {order.customerInfo.city}</p>
                                            </div>
                                        </div>

                                        {/* Visual Tracking */}
                                        {order.status !== 'Cancelled' && <TrackingProgress status={order.status} />}

                                        {/* Unpaid Order Warning */}
                                        {order.status === 'Pending Payment' && (
                                            <div className="mt-6 pt-4 border-t border-border">
                                                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                    <div>
                                                        <h5 className="font-bold text-amber-800 text-sm">Payment Verification Required</h5>
                                                        <p className="text-xs text-amber-700 mt-1">We need a screenshot of your bank/wallet transfer (PKR {order.total}) to begin processing.</p>
                                                    </div>
                                                    <button
                                                        onClick={() => {
                                                            setLastOrder(order);
                                                            setShowPaymentModal(true);
                                                        }}
                                                        className="w-full sm:w-auto whitespace-nowrap bg-amber-500 hover:bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                                    >
                                                        <ArrowUpCircle size={16} /> Upload Receipt
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {/* Return / Refund for Delivered orders */}
                                        {order.status === 'Delivered' && (
                                            <div className="mt-4 pt-4 border-t border-border">
                                                <Link
                                                    to={`/return?id=${order.id}`}
                                                    className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-red-500 transition-colors font-medium"
                                                >
                                                    <RotateCcw size={13} /> Request Return / Refund
                                                </Link>
                                            </div>
                                        )}

                                        {/* Dynamic Cancellation Button */}
                                        {(order.status === 'Processing' || order.status === 'Pending Payment') && (new Date().getTime() - new Date(order.date).getTime() < cancelWindowMins * 60 * 1000) && (
                                            <div className="mt-6 pt-4 border-t border-border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-red-50/30 -mx-6 -mb-6 px-6 pb-6 pt-4 rounded-b-2xl">
                                                <div className="flex flex-col gap-1">
                                                    <p className="text-xs font-semibold text-red-600 flex items-center gap-2">
                                                        Cancel Window Closes In: <OrderCountdown orderDate={order.date} />
                                                    </p>
                                                    <p className="text-[10px] text-muted-foreground">After this timer expires, your order cannot be automatically cancelled.</p>
                                                </div>
                                                <button
                                                    onClick={() => setShowCancelModal(order.id)}
                                                    className="w-full sm:w-auto text-white bg-red-500 hover:bg-red-600 text-sm font-semibold flex items-center justify-center gap-2 transition-colors px-4 py-2 rounded-lg shadow-sm"
                                                >
                                                    <XCircle size={16} /> Cancel Order
                                                </button>
                                            </div>
                                        )}

                                        {order.status === 'Cancelled' && order.cancelReason && (
                                            <div className="mt-4 p-3 bg-red-50/50 rounded-lg border border-red-100">
                                                <p className="text-sm text-red-600"><span className="font-semibold">Cancellation Reason:</span> {order.cancelReason}</p>
                                            </div>
                                        )}
                                    </motion.div>
                                ))}
                        </div>
                    )}

                    {/* Cancel Modal */}
                    <AnimatePresence>
                        {showCancelModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-card max-w-md w-full rounded-2xl p-6 shadow-luxury"
                                >
                                    <h3 className="text-xl font-bold text-foreground mb-2">Cancel Order</h3>
                                    <p className="text-sm text-muted-foreground mb-4">Please provide a reason for cancelling order {showCancelModal}.</p>

                                    <form onSubmit={handleCancelOrder}>
                                        <textarea
                                            required
                                            value={cancelReason}
                                            onChange={(e) => setCancelReason(e.target.value)}
                                            placeholder="Reason for cancellation..."
                                            className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground resize-none mb-4"
                                            rows={3}
                                        />
                                        <div className="flex gap-3 justify-end">
                                            <button
                                                type="button"
                                                onClick={() => setShowCancelModal(null)}
                                                className="px-4 py-2 rounded-xl text-muted-foreground hover:bg-secondary/50 transition-colors font-medium text-sm"
                                            >
                                                Keep Order
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-4 py-2 rounded-xl bg-red-500 text-white font-medium text-sm hover:bg-red-600 transition-colors shadow-md"
                                            >
                                                Confirm Cancellation
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>

                    {/* Transfer Receipt Upload Modal */}
                    <AnimatePresence>
                        {showPaymentModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-card max-w-md w-full rounded-2xl p-6 shadow-luxury border-2 border-primary/20"
                                >
                                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UploadCloud size={32} className="text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-center text-foreground mb-2">Upload Receipt</h3>
                                    <p className="text-sm text-center text-muted-foreground mb-6">
                                        Please send <strong className="text-foreground">PKR {lastOrder?.total || (orders.find(o => o.id === lastOrder?.id)?.total || 0)}</strong> to complete your order.
                                    </p>

                                    <div className="max-h-[30vh] overflow-y-auto mb-6 space-y-3 pr-2 scrollbar-thin">
                                        {bankAccounts.length > 0 ? (
                                            <>
                                                <p className="text-xs text-center text-primary font-bold mb-2 animate-pulse">Select the account you paid to:</p>
                                                {bankAccounts.map((acc, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setSelectedBank(acc.bankName)}
                                                        className={`rounded-xl p-4 border text-left relative overflow-hidden group transition-all cursor-pointer ${selectedBank === acc.bankName ? 'bg-primary/10 border-primary ring-2 ring-primary/30' : 'bg-secondary/50 border-border hover:border-primary/30'}`}
                                                    >
                                                        <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
                                                            {acc.bankName}
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 font-bold">Account Title</p>
                                                        <h4 className="text-sm font-bold text-foreground">{acc.accountTitle || 'Store Admin'}</h4>

                                                        <div className="mt-3">
                                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 font-bold">Account Number</p>
                                                            <p className="text-primary font-mono text-lg font-bold tracking-wider">{acc.accountNumber || '0300-XXXXXXX'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="bg-secondary/50 rounded-xl p-4 border border-border text-center">
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">JazzCash Account</p>
                                                <h4 className="text-lg font-bold text-foreground">{jazzcashName || 'Store Admin'}</h4>
                                                <p className="text-primary font-mono text-xl mt-1 tracking-wider">{jazzcashNumber || '0300-XXXXXXX'}</p>
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleReceiptUpload}>
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-foreground mb-2">Upload Screenshot</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    required
                                                    onChange={(e) => setPaymentReceipt(e.target.files?.[0] || null)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors ${paymentReceipt ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-secondary/30'}`}>
                                                    {paymentReceipt ? (
                                                        <>
                                                            <CheckCircle2 size={24} className="text-green-500 mb-2" />
                                                            <span className="text-sm font-medium text-foreground">{paymentReceipt.name}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UploadCloud size={24} className="text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                                            <span className="text-sm text-muted-foreground">Tap to upload receipt image</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={uploadingReceipt || !paymentReceipt}
                                            className="w-full bg-gradient-gold text-card font-body font-semibold px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                                        >
                                            {uploadingReceipt ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                                            {uploadingReceipt ? "Uploading & Verifying..." : "Submit Receipt"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setShowPaymentModal(false)}
                                            className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            I'll upload later
                                        </button>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        );
    }

    // Order Placed — Success Screen
    if (orderPlaced && lastOrder) {
        return (
            <div className="min-h-screen bg-gradient-cream pt-24 pb-12 font-body flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="glass-card rounded-3xl p-10 max-w-md w-full mx-6 text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    >
                        <CheckCircle2 size={72} className="text-green-500 mx-auto mb-6" />
                    </motion.div>
                    <h2 className="font-heading text-3xl font-bold text-foreground mb-3">Order Placed!</h2>
                    <p className="text-sm text-amber-600 font-semibold mb-2">Order ID: {lastOrder.id}</p>
                    <p className="text-muted-foreground mb-2">Thank you, <strong className="text-foreground">{form.name}</strong>!</p>

                    {lastOrder.status === 'Pending Payment' ? (
                        <p className="text-amber-600 mb-6 bg-amber-50 p-4 rounded-xl border border-amber-100 font-medium text-sm leading-relaxed">
                            We are verifying your payment. Once verified, your order status will automatically change to Processing.
                        </p>
                    ) : (
                        <p className="text-muted-foreground mb-6 leading-relaxed">
                            Your order of <strong className="text-foreground">{lastOrder.quantity} item(s)</strong> has been received.
                            We'll contact you at <strong className="text-foreground">{form.phone}</strong> to confirm delivery.
                        </p>
                    )}

                    <div className="flex flex-col gap-3">
                        {/* WhatsApp Confirmation */}
                        <a
                            href={(() => {
                                const msg = [
                                    '🌿 *THE ESSENTIAL CURE — New Order*',
                                    '━━━━━━━━━━━━━━━━━━━━━',
                                    `🆔 *Order ID:* ${lastOrder?.id}`,
                                    `👤 *Customer:* ${form.name}`,
                                    `📞 *Phone:* ${form.phone}`,
                                    `📦 *Qty:* ${lastOrder?.quantity} item(s)`,
                                    `💰 *Total:* PKR ${lastOrder?.total}`,
                                    `🚚 *Payment:* ${lastOrder?.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Bank Transfer'}`,
                                    '━━━━━━━━━━━━━━━━━━━━━',
                                    `📍 *Address:*`,
                                    `${form.address}`,
                                    `${form.city}`,
                                    '━━━━━━━━━━━━━━━━━━━━━',
                                    'Please confirm my order. Thank you! 🙏',
                                ].join('\n');
                                return `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(msg)}`;
                            })()}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20b558] text-white font-body font-semibold px-8 py-3.5 rounded-full shadow-md hover:scale-105 transition-all duration-300"
                        >
                            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" /><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.553 4.116 1.522 5.849L0 24l6.335-1.652A11.953 11.953 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.946a9.934 9.934 0 01-5.066-1.387l-.361-.216-3.762.98.998-3.654-.235-.374A9.946 9.946 0 012.054 12C2.054 6.492 6.492 2.054 12 2.054S21.946 6.492 21.946 12 17.508 21.946 12 21.946z" /></svg>
                            Confirm Order on WhatsApp
                        </a>
                        <button
                            onClick={() => {
                                setOrderPlaced(false);
                                setViewState('orders');
                            }}
                            className="inline-flex items-center justify-center gap-2 bg-gradient-gold text-card font-body font-semibold px-8 py-3.5 rounded-full shadow-luxury hover:shadow-luxury-lg hover:scale-105 transition-all duration-300"
                        >
                            <Package size={20} /> View My Orders
                        </button>
                        <Link
                            to={`/track?id=${lastOrder?.id}`}
                            className="inline-flex items-center justify-center gap-2 bg-secondary text-foreground font-body font-semibold px-8 py-3.5 rounded-full hover:bg-secondary/80 transition-all duration-300 border border-border"
                        >
                            <Package size={18} /> Track My Order
                        </Link>
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 text-muted-foreground font-body font-medium px-8 py-3.5 rounded-full hover:bg-secondary/50 transition-all duration-300"
                        >
                            Back to Home
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="min-h-screen bg-gradient-cream pt-24 pb-12 font-body flex flex-col items-center justify-center relative">
                <div className="absolute top-24 right-6 sm:top-28 sm:right-12">
                    <button
                        onClick={() => setViewState('orders')}
                        className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm text-sm font-semibold hover:bg-white/80 transition-colors"
                    >
                        <Package size={16} className="text-primary" /> My Orders
                    </button>
                </div>

                <AnimatedSection className="text-center w-full px-6">
                    <div className="glass-card rounded-3xl p-12 max-w-md mx-auto shadow-luxury">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <ShoppingBag size={48} className="text-primary/40" />
                        </div>
                        <h2 className="font-heading text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h2>
                        <p className="text-muted-foreground mb-8 leading-relaxed">
                            Aapne abhi tak koi item add nahi kiya. Hair growth start karne ke liye shop karein!
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center justify-center gap-2 bg-gradient-gold text-card font-body font-semibold px-8 py-4 rounded-full shadow-luxury hover:shadow-luxury-lg hover:scale-105 transition-all duration-300"
                        >
                            Shop Again
                        </Link>
                        <br /><br />
                        <Link
                            to="/"
                            className="inline-flex items-center justify-center gap-2 bg-secondary text-foreground font-body font-semibold px-8 py-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300"
                        >
                            Back Home
                        </Link>
                    </div>
                </AnimatedSection>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gradient-cream pt-32 pb-12 font-body">
                <div className="container mx-auto px-6 max-w-4xl relative">
                    {/* Header */}
                    <AnimatedSection className="flex items-center justify-between mb-8">
                        <Link to="/" className="text-muted-foreground hover:text-foreground flex items-center gap-2 transition-colors">
                            <ArrowLeft size={20} />
                            <span>Continue Shopping</span>
                        </Link>

                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setViewState('orders')}
                                className="flex items-center gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm text-sm font-semibold hover:bg-white/80 transition-colors focus:outline-none"
                            >
                                <Package size={16} className="text-primary" /> My Orders
                            </button>
                            <h1 className="font-heading text-3xl font-bold flex items-center gap-3 text-foreground hidden sm:flex">
                                <ShoppingBag size={28} className="text-primary" /> My Cart
                            </h1>
                        </div>
                    </AnimatedSection>

                    {/* Mobile Cart Title */}
                    <h1 className="font-heading text-3xl font-bold flex items-center gap-3 text-foreground mb-6 sm:hidden">
                        <ShoppingBag size={28} className="text-primary" /> My Cart
                    </h1>

                    {/* Cart Content */}
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Items */}
                        <AnimatedSection delay={0.1} className="lg:col-span-2 space-y-4">
                            {items.map(item => (
                                <div key={item.id} className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 relative">
                                    {/* Product Image */}
                                    <div className="w-44 h-52 sm:w-52 sm:h-60 bg-primary/5 rounded-2xl flex items-center justify-center p-3 shrink-0 overflow-hidden">
                                        <img
                                            src={item.image_url}
                                            alt={item.name}
                                            className="w-full h-full object-contain rounded-xl"
                                            loading="lazy"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = "/hero-product-2.png";
                                            }}
                                        />
                                    </div>

                                    {/* Product Info */}
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-heading text-xl font-bold text-foreground mb-1">{item.name}</h3>
                                        <div className="flex items-center justify-center sm:justify-start gap-3 bg-secondary/30 w-fit rounded-full px-4 py-2 mx-auto sm:mx-0 mt-4">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-foreground hover:text-primary transition-colors">
                                                <Minus size={16} />
                                            </button>
                                            <span className="font-semibold w-6 text-center">{item.quantity}</span>
                                            <button onClick={() => {
                                                if (item.quantity >= item.stock) {
                                                    toast.error("Max stock reached!");
                                                    return;
                                                }
                                                updateQuantity(item.id, item.quantity + 1);
                                            }} className="text-foreground hover:text-primary transition-colors">
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Price & Remove */}
                                    <div className="flex flex-col items-center sm:items-end justify-between h-full gap-4">
                                        <div className="text-right">
                                            {item.sale_price && (
                                                <span className="block text-xs text-muted-foreground line-through opacity-60">PKR {(item.price * item.quantity).toLocaleString()}</span>
                                            )}
                                            <span className="font-bold text-xl text-foreground">PKR {((item.sale_price || item.price) * item.quantity).toLocaleString()}</span>
                                            {item.sale_price && (
                                                <span className="block text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold mt-1 text-center">SALE</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="text-red-400 hover:text-red-500 transition-colors p-2 glass-card rounded-full"
                                            aria-label="Remove item"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* Frequently Bought Together (Upsells in Main Cart) */}
                            {items.length > 0 && availableUpsells.length > 0 && !showForm && (
                                <AnimatedSection delay={0.2} className="mt-8 pt-8 border-t border-border">
                                    <h3 className="font-heading text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                        <PackagePlus size={20} className="text-primary" /> Frequently Bought Together
                                    </h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {availableUpsells.map(product => {
                                            const displayPrice = product.sale_price || product.price;
                                            return (
                                                <div key={product.id} className="glass-card rounded-2xl p-4 flex items-center gap-4 hover:shadow-md transition-shadow">
                                                    <div className="w-20 h-20 bg-primary/5 rounded-xl flex items-center justify-center p-2 shrink-0">
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-full h-full object-contain mix-blend-multiply"
                                                            onError={(e) => {
                                                                const target = e.target as HTMLImageElement;
                                                                target.src = "/hero-product-2.png";
                                                            }}
                                                        />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-bold text-sm text-foreground truncate mb-1">{product.name}</h4>
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <span className="font-bold text-primary text-sm">PKR {displayPrice.toLocaleString()}</span>
                                                            {product.sale_price && (
                                                                <span className="text-xs text-muted-foreground line-through">PKR {product.price.toLocaleString()}</span>
                                                            )}
                                                        </div>
                                                        <button
                                                            onClick={() => addItem(product)}
                                                            className="text-xs font-bold bg-secondary text-foreground hover:bg-primary hover:text-primary-foreground px-4 py-1.5 rounded-full transition-colors flex items-center gap-1.5"
                                                        >
                                                            <Plus size={14} /> Add
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </AnimatedSection>
                            )}

                            {/* Customer Information Form — appears after clicking Proceed */}
                            <AnimatePresence>
                                {showForm && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                        className="overflow-hidden"
                                    >
                                        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 space-y-5">
                                            <h2 className="font-heading text-xl font-bold text-foreground flex items-center gap-2">
                                                <User size={22} className="text-primary" />
                                                Customer Information
                                            </h2>
                                            <p className="text-sm text-muted-foreground -mt-2">Fill in your details to place the order. Cash on delivery.</p>

                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-foreground mb-1 block">Payment Method</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod('COD')}
                                                        className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'COD' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background/50 text-muted-foreground hover:border-primary/50'}`}
                                                    >
                                                        <Banknote size={20} />
                                                        <span className="text-sm font-semibold">Cash on Delivery</span>
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => setPaymentMethod('Transfer')}
                                                        className={`py-3 px-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all ${paymentMethod === 'Transfer' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background/50 text-muted-foreground hover:border-primary/50'}`}
                                                    >
                                                        <CreditCard size={20} />
                                                        <span className="text-sm font-semibold text-center leading-tight">Bank / Wallet<br />Transfer</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Name */}
                                            <div className="space-y-1.5 pt-2 border-t border-border">
                                                <label htmlFor="name" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                                    <User size={14} className="text-primary" /> Full Name
                                                </label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    placeholder="Enter your full name"
                                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                                                />
                                            </div>

                                            {/* Phone */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="phone" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                                    <Phone size={14} className="text-primary" /> Phone Number
                                                </label>
                                                <input
                                                    id="phone"
                                                    name="phone"
                                                    type="tel"
                                                    required
                                                    value={form.phone}
                                                    onChange={handleChange}
                                                    placeholder="03XX-XXXXXXX"
                                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                                                />
                                            </div>

                                            {/* City */}
                                            <div className="space-y-1.5">
                                                <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                                    <MapPin size={14} className="text-primary" /> City
                                                </label>
                                                <CitySelect
                                                    value={form.city}
                                                    onChange={(city) => setForm(f => ({ ...f, city }))}
                                                    cityDeliveryDays={cityDeliveryDays}
                                                />
                                            </div>

                                            {/* Full Address */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="address" className="text-sm font-medium text-foreground flex items-center gap-1.5">
                                                    <Home size={14} className="text-primary" /> Full Address
                                                </label>
                                                <textarea
                                                    id="address"
                                                    name="address"
                                                    required
                                                    value={form.address}
                                                    onChange={handleChange}
                                                    placeholder="House #, Street, Area"
                                                    rows={3}
                                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50 resize-none"
                                                />
                                            </div>

                                            {/* Special Notes (Optional) */}
                                            <div className="space-y-1.5">
                                                <label htmlFor="notes" className="text-sm font-medium text-foreground">
                                                    Special Notes <span className="text-muted-foreground">(optional)</span>
                                                </label>
                                                <input
                                                    id="notes"
                                                    name="notes"
                                                    type="text"
                                                    value={form.notes}
                                                    onChange={handleChange}
                                                    placeholder="Any special instructions for delivery"
                                                    className="w-full px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-foreground placeholder:text-muted-foreground/50"
                                                />
                                            </div>

                                            {/* WhatsApp Marketing Opt-In */}
                                            <label className="flex items-start gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    checked={whatsappOptIn}
                                                    onChange={e => setWhatsappOptIn(e.target.checked)}
                                                    className="mt-0.5 w-4 h-4 accent-primary rounded"
                                                />
                                                <span className="text-xs text-muted-foreground leading-relaxed group-hover:text-foreground transition-colors">
                                                    📲 Yes, send me exclusive deals &amp; restock alerts on WhatsApp. You can opt out anytime.
                                                </span>
                                            </label>

                                            {/* Submit Button */}
                                            <button
                                                type="submit"
                                                disabled={loading}
                                                className="w-full bg-gradient-gold text-card font-body font-semibold px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 shadow-luxury-deep hover:shadow-luxury transition-all duration-300 mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                            >
                                                {loading ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                                                {loading ? "Processing..." : `Place Order — PKR ${totalAmount}`}
                                            </button>

                                            <p className="text-xs text-center text-muted-foreground">
                                                {paymentMethod === 'COD' ? `💳 Cash on Delivery • PKR ${codFee} Shipping Charge` : `💳 Bank/Wallet Transfer • 🚚 Free Shipping${jazzcashDiscount > 0 ? ` & ${jazzcashDiscount}% Off` : ''}`}
                                            </p>
                                        </form>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </AnimatedSection>

                        {/* Summary Sidebar */}
                        <AnimatedSection delay={0.2} className="lg:col-span-1">
                            <div className="glass-card rounded-2xl p-6 sticky top-24">
                                <h2 className="font-heading text-xl font-bold mb-6 text-foreground border-b border-border pb-4">Order Summary</h2>

                                <div className="space-y-4 font-body text-sm mb-6">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Subtotal</span>
                                        <span className={paymentMethod === 'Transfer' && jazzcashDiscount > 0 ? "line-through opacity-70" : "text-foreground"}>PKR {subtotal}</span>
                                    </div>
                                    {paymentMethod === 'Transfer' && jazzcashDiscount > 0 && (
                                        <div className="flex justify-between text-emerald-600 font-medium">
                                            <span>Transfer Discount ({jazzcashDiscount}%)</span>
                                            <span>- PKR {subtotal - discountedSubtotal}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Shipping By <strong className="font-semibold text-foreground">{paymentMethod === 'COD' ? 'COD' : 'Jazzcash'}</strong></span>
                                        <span className={currentShippingFee === 0 ? "text-green-600 font-medium" : "text-foreground font-medium"}>
                                            {currentShippingFee === 0 ? "Free" : `PKR ${currentShippingFee}`}
                                        </span>
                                    </div>
                                    <div className="h-px bg-border my-4" />
                                    <div className="flex justify-between font-bold text-lg text-foreground">
                                        <span>Total</span>
                                        <span className="text-primary">PKR {totalAmount}</span>
                                    </div>

                                    {/* Coupon Input */}
                                    <div className="pt-4 mt-2 border-t border-border border-dashed">
                                        {!appliedCoupon ? (
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={couponCode}
                                                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                                    placeholder="Coupon Code"
                                                    className="flex-1 px-4 py-2 bg-secondary/30 border border-border rounded-xl text-xs font-bold outline-none focus:border-primary transition-all placeholder:text-muted-foreground/50 uppercase"
                                                />
                                                <button
                                                    onClick={handleApplyCoupon}
                                                    disabled={couponLoading || !couponCode.trim()}
                                                    className="bg-primary text-primary-foreground px-4 py-2 rounded-xl text-xs font-bold hover:opacity-90 transition-all disabled:opacity-50"
                                                >
                                                    {couponLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-3 rounded-xl">
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 size={16} className="text-emerald-500" />
                                                    <span className="text-xs font-bold text-emerald-700">Applied: {appliedCoupon.code}</span>
                                                </div>
                                                <button
                                                    onClick={() => setAppliedCoupon(null)}
                                                    className="text-emerald-500 hover:text-emerald-700 p-1"
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Referral Active Badge */}
                                {referralCode && !appliedCoupon && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-4 mb-6 flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-600">
                                                <Sparkles size={16} />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest leading-none mb-1">Referral Credit Active</p>
                                                <p className="text-xs font-medium text-indigo-500/80">10% discount applied automatically.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => {
                                                localStorage.removeItem('referral_code');
                                                window.location.reload();
                                            }}
                                            className="text-indigo-400 hover:text-indigo-600 transition-colors"
                                        >
                                            <XCircle size={16} />
                                        </button>
                                    </motion.div>
                                )}

                                {!showForm ? (
                                    <button
                                        onClick={() => {
                                            setShowForm(true);
                                            trackInitiateCheckout();
                                        }}
                                        disabled={!acceptingOrders || (currentStock !== null && currentStock <= 0)}
                                        className="w-full bg-gradient-gold text-card font-body font-semibold px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 hover:shadow-luxury transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {!acceptingOrders ? (
                                            storeClosedMessage || "Orders Temporarily Paused"
                                        ) : (currentStock !== null && currentStock <= 0) ? (
                                            "Currently Sold Out"
                                        ) : (
                                            <>Proceed <ChevronRight size={18} /></>
                                        )}
                                    </button>
                                ) : (
                                    <div className="text-center text-sm text-primary font-medium flex items-center justify-center gap-2">
                                        <CheckCircle2 size={16} />
                                        Fill the form below to place order
                                    </div>
                                )}

                                <p className="text-xs text-center text-muted-foreground mt-4 leading-relaxed">
                                    Glow begins with this bottle. Thank you!
                                </p>
                            </div>
                        </AnimatedSection>
                    </div>

                    {/* Transfer Receipt Upload Modal */}
                    <AnimatePresence>
                        {showPaymentModal && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="glass-card max-w-md w-full rounded-2xl p-6 shadow-luxury border-2 border-primary/20"
                                >
                                    <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <UploadCloud size={32} className="text-primary" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-center text-foreground mb-2">Upload Receipt</h3>
                                    <p className="text-sm text-center text-muted-foreground mb-6">
                                        Please send <strong className="text-foreground">PKR {lastOrder?.total || totalAmount}</strong> to complete your order.
                                    </p>

                                    <div className="max-h-[30vh] overflow-y-auto mb-6 space-y-3 pr-2 scrollbar-thin">
                                        {bankAccounts.length > 0 ? (
                                            <>
                                                <p className="text-xs text-center text-primary font-bold mb-2 animate-pulse">Select the account you paid to:</p>
                                                {bankAccounts.map((acc, idx) => (
                                                    <div
                                                        key={idx}
                                                        onClick={() => setSelectedBank(acc.bankName)}
                                                        className={`rounded-xl p-4 border text-left relative overflow-hidden group transition-all cursor-pointer ${selectedBank === acc.bankName ? 'bg-primary/10 border-primary ring-2 ring-primary/30' : 'bg-secondary/50 border-border hover:border-primary/30'}`}
                                                    >
                                                        <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[10px] font-bold px-3 py-1.5 rounded-bl-xl uppercase tracking-wider">
                                                            {acc.bankName}
                                                        </div>
                                                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 font-bold">Account Title</p>
                                                        <h4 className="text-sm font-bold text-foreground">{acc.accountTitle || 'Store Admin'}</h4>

                                                        <div className="mt-3">
                                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-0.5 font-bold">Account Number</p>
                                                            <p className="text-primary font-mono text-lg font-bold tracking-wider">{acc.accountNumber || '0300-XXXXXXX'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </>
                                        ) : (
                                            <div className="bg-secondary/50 rounded-xl p-4 border border-border text-center">
                                                <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1 font-semibold">JazzCash Account</p>
                                                <h4 className="text-lg font-bold text-foreground">{jazzcashName || 'Store Admin'}</h4>
                                                <p className="text-primary font-mono text-xl mt-1 tracking-wider">{jazzcashNumber || '0300-XXXXXXX'}</p>
                                            </div>
                                        )}
                                    </div>

                                    <form onSubmit={handleReceiptUpload}>
                                        <div className="mb-6">
                                            <label className="block text-sm font-semibold text-foreground mb-2">Upload Screenshot</label>
                                            <div className="relative group">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    required
                                                    onChange={(e) => setPaymentReceipt(e.target.files?.[0] || null)}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                />
                                                <div className={`w-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 transition-colors ${paymentReceipt ? 'border-primary bg-primary/5' : 'border-border bg-background hover:bg-secondary/30'}`}>
                                                    {paymentReceipt ? (
                                                        <>
                                                            <CheckCircle2 size={24} className="text-green-500 mb-2" />
                                                            <span className="text-sm font-medium text-foreground">{paymentReceipt.name}</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <UploadCloud size={24} className="text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                                                            <span className="text-sm text-muted-foreground">Tap to upload receipt image</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={uploadingReceipt || !paymentReceipt}
                                            className="w-full bg-gradient-gold text-card font-body font-semibold px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                                        >
                                            {uploadingReceipt ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                                            {uploadingReceipt ? "Uploading & Verifying..." : "Submit Receipt"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setShowPaymentModal(false)}
                                            className="w-full mt-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            I'll upload later
                                        </button>
                                    </form>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </>
    );
};

export default Cart;
