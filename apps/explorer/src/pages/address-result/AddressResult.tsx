// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { useParams } from 'react-router-dom';

import { ErrorBoundary } from '../../components/error-boundary/ErrorBoundary';
import OwnedObjects from '../../components/ownedobjects/OwnedObjects';
import TxForID from '../../components/transaction-card/TxForID';

import { Banner } from '~/ui/Banner';
import { Heading } from '~/ui/Heading';
import { PageHeader } from '~/ui/PageHeader';

type DataType = {
    id: string;
    objects: ResponseType;
    loadState?: 'loaded' | 'pending' | 'fail';
};

type ResponseType = {
    objectId: string;
}[];

function instanceOfDataType(object: any): object is DataType {
    return object !== undefined && ['id', 'objects'].every((x) => x in object);
}

function AddressResult() {
    const { id: addressId } = useParams();

    return (
        <div className="space-y-10">
            <PageHeader type="Address" title={addressId!} />
            <Heading variant="heading4/semibold">Owned Objects</Heading>
            <div>
                <ErrorBoundary>
                    <OwnedObjects id={addressId!} byAddress />
                </ErrorBoundary>
                <Heading variant="heading4/semibold">Transactions</Heading>
                <ErrorBoundary>
                    <div className="mt-6">
                        <TxForID id={addressId!} category="address" />
                    </div>
                </ErrorBoundary>
            </div>
        </div>
    );
}

export default AddressResult;
export { instanceOfDataType };
