// A lightweight wrapper around the Facebook Pixel window object
// This ensures the app doesn't crash if adblockers block the fbq script.

declare global {
    interface Window {
        fbq: any;
    }
}

export const trackPageView = () => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'PageView');
    }
};

export const trackAddToCart = () => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'AddToCart');
    }
};

export const trackInitiateCheckout = () => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout');
    }
};

export const trackPurchase = (value: number, currency: string = 'PKR') => {
    if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Purchase', {
            value: value,
            currency: currency,
        });
    }
};
