// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useCallback, useState } from 'react';

import AutoLockTimerSelector from './auto-lock-timer-selector';
import AccountAddress from '_components/account-address';
import Icon, { SuiIcons } from '_components/icon';
import LoadingIndicator from '_components/loading/LoadingIndicator';
import Layout from '_components/menu/content/layout';
import { useNextMenuUrl } from '_components/menu/hooks';
import { useAppDispatch } from '_hooks';
import { logout } from '_redux/slices/account';

import st from './Account.module.scss';

function Account() {
    const backUrl = useNextMenuUrl(true, '/');
    return (
        <Layout title="Account" backUrl={backUrl} isSettings>
            <div className={st.content}>
                <div className={st.itemGroup}>
                    <label className={st.itemTitle}>Address</label>
                    <AccountAddress
                        mode="faded"
                        shorten={true}
                        showLink={false}
                        copyable
                    />
                </div>
                <div className={st.itemGroup}>
                    <label className={st.itemTitle}>
                        Auto-lock timer (minutes)
                    </label>
                    <div className={st.itemDesc}>
                        Set the idle time in minutes before Sui Wallet locks
                        itself.
                    </div>
                    <AutoLockTimerSelector />
                </div>
            </div>
        </Layout>
    );
}

export default Account;
