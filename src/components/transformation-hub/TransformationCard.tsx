import { motion } from "framer-motion";
import { CheckCircle, ShoppingCart, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cartStore";

export interface Transformation {
    id: string | number;
    customerName: string;
    concern: "Hair Fall" | "Scalp Health" | "Shine" | "Growth";
    beforeImage: string;
    afterImage: string;
    duration: string;
    reviewLink?: string;
    product: {
        id: number;
        name: string;
        price: number;
        image_url: string;
        stock: number;
    };
}

interface TransformationCardProps {
    transformation: Transformation;
    delay?: number;
}

const TransformationCard = ({ transformation, delay = 0 }: TransformationCardProps) => {
    const { addItem, openCart } = useCartStore();

    const handleAddToCart = () => {
        addItem(transformation.product);
        toast.success(`Added ${transformation.product.name} to cart!`);
        openCart();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            className="glass-card rounded-[2rem] overflow-hidden border border-white/20 group hover:shadow-premium transition-all duration-500"
        >
            {/* Before/After Images */}
            <div className="relative grid grid-cols-2 gap-px bg-white/10">
                <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                        src={transformation.beforeImage}
                        alt="Before"
                        className="w-full h-full object-cover grayscale-[20%]"
                    />
                    <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
                        Before
                    </div>
                </div>
                <div className="relative aspect-[4/5] overflow-hidden">
                    <img
                        src={transformation.afterImage}
                        alt="After"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-primary/80 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
                        After
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="font-heading text-lg font-bold text-foreground">{transformation.customerName}</h3>
                        <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                            Result after {transformation.duration}
                        </p>
                    </div>
                    <a
                        href={transformation.reviewLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-green-500/20 transition-colors border border-green-500/20"
                    >
                        <CheckCircle size={12} /> Verified
                    </a>
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full border border-primary/20">
                        {transformation.concern}
                    </span>
                </div>

                <button
                    onClick={handleAddToCart}
                    className="w-full bg-primary text-primary-foreground py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold uppercase tracking-widest text-xs hover:shadow-gold hover:-translate-y-0.5 transition-all active:scale-95 group/btn"
                >
                    <ShoppingCart size={16} className="group-hover/btn:scale-110 transition-transform" />
                    Get the Result
                </button>
            </div>
        </motion.div>
    );
};

export default TransformationCard;
