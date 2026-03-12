import { useEffect } from 'react';

interface DocumentMetaOptions {
    title: string;
    description?: string;
    ogImage?: string;
    ogType?: string;
    jsonLd?: object;
}

const BASE_TITLE = 'The Essential Cure';

export const useDocumentMeta = ({ title, description, ogImage, ogType, jsonLd }: DocumentMetaOptions) => {
    useEffect(() => {
        // Update document title
        document.title = `${title} | ${BASE_TITLE}`;

        // Update meta description
        if (description) {
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
                metaDesc = document.createElement('meta');
                metaDesc.setAttribute('name', 'description');
                document.head.appendChild(metaDesc);
            }
            metaDesc.setAttribute('content', description);
        }

        // Update Open Graph tags
        const updateMetaTag = (property: string, content: string, attr = 'property') => {
            let el = document.querySelector(`meta[${attr}="${property}"]`);
            if (!el) {
                el = document.createElement('meta');
                el.setAttribute(attr, property);
                document.head.appendChild(el);
            }
            el.setAttribute('content', content);
        };

        if (title) updateMetaTag('og:title', `${title} | ${BASE_TITLE}`);
        if (description) updateMetaTag('og:description', description);
        if (ogImage) updateMetaTag('og:image', ogImage);
        updateMetaTag('og:type', ogType || 'website');

        // JSON-LD injection
        let script = document.querySelector('script[type="application/ld+json"]#dynamic-ld');
        if (jsonLd) {
            if (!script) {
                script = document.createElement('script');
                script.setAttribute('type', 'application/ld+json');
                script.setAttribute('id', 'dynamic-ld');
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(jsonLd);
        } else if (script) {
            script.remove();
        }

        // Cleanup: restore defaults on unmount
        return () => {
            document.title = `${BASE_TITLE} — Premium Natural Hair Oil`;
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                metaDesc.setAttribute(
                    'content',
                    "Revive your hair naturally with The Essential Cure's 100% natural hair oil. Reduces hair fall, promotes growth, and adds natural shine."
                );
            }
        };
    }, [title, description, jsonLd]);
};

export default useDocumentMeta;
