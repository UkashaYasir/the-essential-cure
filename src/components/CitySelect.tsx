import { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Search, Clock } from 'lucide-react';

// Major Pakistani cities with default delivery days
export const PK_CITIES: { name: string; days: string }[] = [
    { name: 'Lahore', days: '1-2' },
    { name: 'Karachi', days: '2-3' },
    { name: 'Islamabad', days: '1-2' },
    { name: 'Rawalpindi', days: '1-2' },
    { name: 'Faisalabad', days: '1-2' },
    { name: 'Multan', days: '2-3' },
    { name: 'Gujranwala', days: '1-2' },
    { name: 'Peshawar', days: '2-3' },
    { name: 'Quetta', days: '4-5' },
    { name: 'Sialkot', days: '1-2' },
    { name: 'Hyderabad', days: '2-3' },
    { name: 'Bahawalpur', days: '2-3' },
    { name: 'Sargodha', days: '2-3' },
    { name: 'Sukkur', days: '3-4' },
    { name: 'Larkana', days: '3-4' },
    { name: 'Sheikhupura', days: '1-2' },
    { name: 'Chiniot', days: '2-3' },
    { name: 'Jhang', days: '2-3' },
    { name: 'Rahim Yar Khan', days: '2-3' },
    { name: 'Gujrat', days: '1-2' },
    { name: 'Kasur', days: '1-2' },
    { name: 'Okara', days: '2-3' },
    { name: 'Narowal', days: '2-3' },
    { name: 'Hafizabad', days: '2-3' },
    { name: 'Jhelum', days: '2-3' },
    { name: 'Khanewal', days: '2-3' },
    { name: 'Sahiwal', days: '2-3' },
    { name: 'Vehari', days: '2-3' },
    { name: 'Abbottabad', days: '2-3' },
    { name: 'Mardan', days: '3-4' },
    { name: 'Mingora', days: '3-4' },
    { name: 'Nowshera', days: '2-3' },
    { name: 'Muzaffarabad', days: '3-4' },
    { name: 'Mirpur (AJK)', days: '3-5' },
    { name: 'Kotli', days: '4-5' },
    { name: 'Attock', days: '2-3' },
    { name: 'Chakwal', days: '2-3' },
    { name: 'Haripur', days: '2-3' },
    { name: 'Mansehra', days: '3-4' },
    { name: 'Kohat', days: '3-4' },
    { name: 'Bannu', days: '3-5' },
    { name: 'D.I. Khan', days: '3-5' },
    { name: 'Dera Ghazi Khan', days: '3-4' },
    { name: 'Muzaffargarh', days: '3-4' },
    { name: 'Lodhran', days: '2-3' },
    { name: 'Pakpattan', days: '2-3' },
    { name: 'Nankana Sahib', days: '1-2' },
    { name: 'Wazirabad', days: '1-2' },
    { name: 'Kamalia', days: '2-3' },
    { name: 'Khushab', days: '2-3' },
    { name: 'Mianwali', days: '2-3' },
    { name: 'Bhakkar', days: '2-3' },
    { name: 'Layyah', days: '3-4' },
    { name: 'Toba Tek Singh', days: '2-3' },
    { name: 'Mandi Bahauddin', days: '2-3' },
    { name: 'Daska', days: '1-2' },
    { name: 'Sambrial', days: '1-2' },
    { name: 'Thatta', days: '3-4' },
    { name: 'Jacobabad', days: '4-5' },
    { name: 'Shikarpur', days: '4-5' },
    { name: 'Nawabshah', days: '3-4' },
    { name: 'Mirpurkhas', days: '3-4' },
    { name: 'Khairpur', days: '3-5' },
    { name: 'Sehwan', days: '4-5' },
    { name: 'Turbat', days: '5-7' },
    { name: 'Gwadar', days: '5-7' },
    { name: 'Khuzdar', days: '5-6' },
    { name: 'Hub', days: '3-5' },
    { name: 'Nushki', days: '5-7' },
    { name: 'Gilgit', days: '5-7' },
    { name: 'Skardu', days: '6-8' },
    { name: 'Chilas', days: '6-8' },
];

interface CitySelectProps {
    value: string;
    onChange: (city: string) => void;
    cityDeliveryDays?: Record<string, string>; // from store_config
    className?: string;
    placeholder?: string;
}

const CitySelect = ({ value, onChange, cityDeliveryDays = {}, className = '', placeholder = 'Select your city' }: CitySelectProps) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const ref = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        if (open && searchRef.current) searchRef.current.focus();
    }, [open]);

    const filtered = PK_CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

    const getDeliveryDays = (city: string): string => {
        if (cityDeliveryDays[city]) return cityDeliveryDays[city];
        const found = PK_CITIES.find(c => c.name === city);
        return found ? found.days : '3-5';
    };

    const selectedDays = value ? getDeliveryDays(value) : null;

    return (
        <div ref={ref} className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-background/60 border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-left"
            >
                <MapPin size={16} className="text-primary flex-shrink-0" />
                <span className={`flex-1 text-sm ${value ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                    {value || placeholder}
                </span>
                {selectedDays && (
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <Clock size={9} /> {selectedDays} days
                    </span>
                )}
                <ChevronDown size={14} className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
            </button>

            {open && (
                <div className="absolute z-50 w-full mt-1.5 bg-card border border-border rounded-xl shadow-xl overflow-hidden">
                    <div className="p-2 border-b border-border">
                        <div className="relative">
                            <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search city..."
                                className="w-full pl-7 pr-3 py-1.5 text-sm bg-background border border-border rounded-lg outline-none focus:border-primary"
                            />
                        </div>
                    </div>
                    <div className="max-h-52 overflow-y-auto">
                        {filtered.length === 0 ? (
                            <p className="text-center text-sm text-muted-foreground py-4">No city found</p>
                        ) : (
                            filtered.map(city => {
                                const days = getDeliveryDays(city.name);
                                return (
                                    <button
                                        key={city.name}
                                        type="button"
                                        onClick={() => { onChange(city.name); setOpen(false); setSearch(''); }}
                                        className={`w-full flex items-center justify-between px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors text-left ${city.name === value ? 'bg-primary/10 text-primary font-semibold' : 'text-foreground'}`}
                                    >
                                        <span>{city.name}</span>
                                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                                            <Clock size={9} /> {days} days
                                        </span>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CitySelect;
