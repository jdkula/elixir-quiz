import ReactGA from 'react-ga';

declare global {
    interface Window {
        _GA_ENABLED?: boolean;
    }
}

const analyticsEnabled = process.env.NEXT_PUBLIC_USE_ANALYTICS === 'true' && typeof window !== 'undefined';
const analyticsInitialized = () => analyticsEnabled && window._GA_ENABLED;

export const initGA = (): void => {
    if (analyticsEnabled && !analyticsInitialized()) {
        ReactGA.initialize(process.env.NEXT_PUBLIC_ANALYTICS_ID as string, {
            gaAddress: '/collator.js',
        });
        window._GA_ENABLED = true;
    }
};

export const logPageView = (): void => {
    if (analyticsInitialized()) {
        ReactGA.set({ page: window.location.pathname });
        ReactGA.pageview(window.location.pathname);
    }
};

export const logModal = (modalName: string): void => {
    if (analyticsInitialized()) {
        ReactGA.modalview(modalName);
    }
};

export const logInteraction = (ev: ReactGA.EventArgs): void => {
    if (analyticsInitialized()) {
        ReactGA.event(ev);
    }
};
