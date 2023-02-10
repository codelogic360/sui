// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Account24, ArrowUpRight12, Domain24, Version24 } from '@mysten/icons';
import { useNavigate } from 'react-router-dom';
import Browser from 'webextension-polyfill';

import LoadingIndicator from '../../loading/LoadingIndicator';
import MenuListItem from './MenuListItem';
import { API_ENV_TO_INFO } from '_app/ApiProvider';
import { Button } from '_app/shared/ButtonUI';
import FaucetRequestButton from '_app/shared/faucet/request-button';
import { lockWallet } from '_app/wallet/actions';
import ExternalLink from '_components/external-link';
import { useNextMenuUrl } from '_components/menu/hooks';
import { useAppDispatch, useAppSelector, useMiddleEllipsis } from '_hooks';
import { ToS_LINK } from '_src/shared/constants';
import { useAutoLockInterval } from '_src/ui/app/hooks/useAutoLockInterval';
import PageTitle from '_src/ui/app/shared/PageTitle';
import { Text } from '_src/ui/app/shared/text';
import { useCallback, useState } from 'react';
import { logout } from '_src/ui/app/redux/slices/account';

function MenuList() {
    const accountUrl = useNextMenuUrl(true, '/account');
    const networkUrl = useNextMenuUrl(true, '/network');
    const autoLockUrl = useNextMenuUrl(true, '/auto-lock');
    const address = useAppSelector(({ account }) => account.address);
    const shortenAddress = useMiddleEllipsis(address);
    const apiEnv = useAppSelector((state) => state.app.apiEnv);
    const networkName = API_ENV_TO_INFO[apiEnv].name;
    const autoLockInterval = useAutoLockInterval();
    const version = Browser.runtime.getManifest().version;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [logoutInProgress, setLogoutInProgress] = useState(false);
    const handleLogout = useCallback(async () => {
        setLogoutInProgress(true);
        try {
            await dispatch(logout());
            window.location.reload();
        } finally {
            setLogoutInProgress(false);
        }
    }, [dispatch]);

    return (
        <>
            <PageTitle title="Wallet Settings" />
            <div className="flex flex-col divide-y divide-x-0 divide-solid divide-gray-45 mt-1.5">
                <MenuListItem
                    to={accountUrl}
                    icon={<Account24 />}
                    title="Account"
                    subtitle={shortenAddress}
                />
                <MenuListItem
                    to={networkUrl}
                    icon={<Domain24 />}
                    title="Network"
                    subtitle={networkName}
                />
                <MenuListItem
                    to={autoLockUrl}
                    icon={<Version24 />}
                    title="Auto-lock"
                    subtitle={
                        autoLockInterval ? (
                            `${autoLockInterval} min`
                        ) : (
                            <LoadingIndicator />
                        )
                    }
                />
            </div>
            <div className="flex flex-col items-stretch px-2.5">
                <FaucetRequestButton
                    mode="secondary"
                    trackEventSource="settings"
                />
            </div>
            <div className="flex-1" />
            <div className="flex flex-nowrap flex-row items-stretch px-2.5 gap-3">
                <div className="flex-1 flex flex-col">
                    <Button
                        variant="outline"
                        size="narrow"
                        onClick={async () => {
                            try {
                                await dispatch(lockWallet()).unwrap();
                                navigate('/locked', { replace: true });
                            } catch (e) {
                                // Do nothing
                            }
                        }}
                        text="Lock Wallet"
                    />
                </div>
                <div className="flex-1 flex flex-col">
                    <Button
                        variant="outlineWarning"
                        text="Logout"
                        size="narrow"
                    />
                </div>
            </div>
            <div className="px-2.5 flex flex-col items-center justify-center no-underline gap-3.75 mt-1.25">
                <ExternalLink href={ToS_LINK} showIcon={false}>
                    <div className="flex items-center gap-1">
                        <Text color="steel-dark">Terms of Service</Text>
                        <ArrowUpRight12 className="text-xs text-steel" />
                    </div>
                </ExternalLink>
                <Text color="steel">Wallet Version v{version}</Text>
            </div>
        </>
    );
}

export default MenuList;
