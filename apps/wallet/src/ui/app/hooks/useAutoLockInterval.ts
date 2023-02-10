import { useEffect, useState } from 'react';
import Browser from 'webextension-polyfill';

import {
    AUTO_LOCK_TIMER_DEFAULT_INTERVAL_MINUTES,
    AUTO_LOCK_TIMER_STORAGE_KEY,
} from '_src/shared/constants';

export function useAutoLockInterval() {
    const [interval, setInterval] = useState<number | null>(null);
    useEffect(() => {
        Browser.storage.local
            .get({
                [AUTO_LOCK_TIMER_STORAGE_KEY]:
                    AUTO_LOCK_TIMER_DEFAULT_INTERVAL_MINUTES,
            })
            .then(({ [AUTO_LOCK_TIMER_STORAGE_KEY]: storedTimer }) =>
                setInterval(storedTimer)
            );
        const changesCallback = (changes: Browser.Storage.StorageChange) => {
            console.log({ changes });
            setInterval(interval);
        };
        Browser.storage.local.onChanged.addListener(changesCallback);
        return () => {
            Browser.storage.local.onChanged.removeListener(changesCallback);
        };
    }, []);
    return interval;
}
