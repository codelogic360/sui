// Copyright (c) Mysten Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

import { Field, Formik, Form } from 'formik';
import * as Yup from 'yup';

import Button from '_app/shared/button';
import InputWithAction from '_app/shared/input-with-action';
import { setKeyringLockTimeout } from '_app/wallet/actions';
import Alert from '_components/alert';
import Loading from '_components/loading';
import { useAppDispatch } from '_hooks';
import {
    AUTO_LOCK_TIMER_MIN_MINUTES,
    AUTO_LOCK_TIMER_MAX_MINUTES,
} from '_src/shared/constants';
import { useAutoLockInterval } from '_src/ui/app/hooks/useAutoLockInterval';

import st from './AutoLockTimerSelector.module.scss';

const validation = Yup.object({
    timer: Yup.number()
        .integer()
        .required()
        .min(AUTO_LOCK_TIMER_MIN_MINUTES)
        .max(AUTO_LOCK_TIMER_MAX_MINUTES)
        .label('Auto-lock timer'),
});

export default function AutoLockTimerSelector() {
    const dispatch = useAppDispatch();
    const autoLockInterval = useAutoLockInterval();
    return (
        <Loading loading={autoLockInterval === null}>
            <Formik
                initialValues={{ timer: autoLockInterval }}
                validationSchema={validation}
                onSubmit={async ({ timer }) => {
                    if (timer !== null) {
                        try {
                            await dispatch(
                                setKeyringLockTimeout({ timeout: timer })
                            ).unwrap();
                        } catch (e) {
                            // log it?
                        }
                    }
                }}
                enableReinitialize={true}
            >
                {({ dirty, isSubmitting, isValid, touched, errors }) => (
                    <Form>
                        <Field
                            component={InputWithAction}
                            name="timer"
                            min={AUTO_LOCK_TIMER_MIN_MINUTES}
                            max={AUTO_LOCK_TIMER_MAX_MINUTES}
                            step="1"
                            disabled={isSubmitting}
                        >
                            <Button
                                type="submit"
                                disabled={!dirty || isSubmitting || !isValid}
                                size="mini"
                                className={st.action}
                            >
                                Save
                            </Button>
                        </Field>
                        {touched.timer && errors.timer ? (
                            <Alert className={st.error}>{errors.timer}</Alert>
                        ) : null}
                    </Form>
                )}
            </Formik>
        </Loading>
    );
}
