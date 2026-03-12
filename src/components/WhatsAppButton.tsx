import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function WhatsAppButton() {
    const [whatsappNumber, setWhatsappNumber] = useState("923000000000");

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await supabase.from('store_config').select('whatsapp_number').single();
                if (data?.whatsapp_number) {
                    setWhatsappNumber(data.whatsapp_number);
                }
            } catch (e) {
                console.error("Failed to fetch WhatsApp number for floating button");
            }
        };
        fetchConfig();
    }, []);

    const handleClick = () => {
        const cleanNumber = whatsappNumber.replace(/\D/g, '').replace(/^0/, '92');
        const message = encodeURIComponent("Hi, I have a question about my order/products.");
        window.open(`https://wa.me/${cleanNumber}?text=${message}`, '_blank');
    };

    return (
        <button
            onClick={handleClick}
            className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-3.5 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 group flex items-center justify-center animate-bounce-slow"
            aria-label="Chat on WhatsApp"
        >
            <div className="absolute inset-0 rounded-full border-2 border-[#25D366] opacity-0 group-hover:animate-ping pointer-events-none" />
            <MessageCircle size={28} className="drop-shadow-sm" fill="currentColor" strokeWidth={1} />
        </button>
    );
}
