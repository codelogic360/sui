// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { ArrowLeft16 } from '@mysten/icons';
import { useNavigate } from 'react-router-dom';

import { Button } from './ButtonUI';
import { Heading } from './heading';

export type PageTitleProps = {
    title?: string;
    back?: boolean | string | (() => void);
};

function PageTitle({ title = '', back }: PageTitleProps) {
    const navigate = useNavigate();
    const backOnClick =
        back && typeof back !== 'string'
            ? () => {
                  if (typeof back === 'function') {
                      back();
                      return;
                  }
                  navigate(-1);
              }
            : undefined;
    return (
        <div className="flex items-center relative gap-5">
            {back ? (
                <Button
                    to={typeof back === 'string' ? back : undefined}
                    onClick={backOnClick}
                    size="tiny"
                    text={<ArrowLeft16 className="text-xs" />}
                    variant="plain"
                />
            ) : null}
            <div className="flex items-center justify-center flex-1 overflow-hidden">
                <Heading variant="heading6" color="gray-90" truncate>
                    {title}
                </Heading>
            </div>
            {back ? <div className="basis-7.5" /> : null}
        </div>
    );
}

export default PageTitle;
