import { Button, Input, Select } from 'antd';
import Form, { useForm } from 'antd/lib/form/Form';
import FormItem from 'antd/lib/form/FormItem';
import React from 'react';
import { Address } from 'sk-chain';
import BigNumber from 'bignumber.js';
import { useActor } from '@xstate/react';
import { accounts } from '../../accounts';
import { skService } from '../../../../state/sk.state';
import { TRANS_AMOUNT, TRANS_TO } from './config';
import './index.scss';

export default function Transaction() {
  const [current] = useActor(skService);
  const [form] = useForm();
  return (
    <div className="trans-box">
      <h3>Trasnaction</h3>
      <Form form={form}>
        <FormItem label="to" name={TRANS_TO}>
          <Select>
            {accounts.map((ele) => {
              return (
                <Select.Option key={ele.id} value={ele.id}>
                  {ele.id}
                </Select.Option>
              );
            })}
          </Select>
        </FormItem>
        <FormItem label="to" name={TRANS_TO}>
          <Input className="trans-trans-to-ipt" />
        </FormItem>
        <FormItem label="amount" name={TRANS_AMOUNT}>
          <Input type="number" />
        </FormItem>
        <Button
          onClick={() => {
            form.validateFields();
            current.context.chain.sk.transaction({
              amount: new BigNumber(form.getFieldValue(TRANS_AMOUNT)),
              recipient: new Address(form.getFieldValue(TRANS_TO)),
            });
          }}
        >
          trans
        </Button>
      </Form>
    </div>
  );
}
