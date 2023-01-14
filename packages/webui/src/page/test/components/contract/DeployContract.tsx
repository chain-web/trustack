import { Button, message } from 'antd';
import { useActor } from '@xstate/react';
import { skService } from '../../../../state/sk.state';
import { Account, Transaction } from 'sk-chain';

export const DeployContract = (_CodeClass: any, contractCode: Uint8Array) => {
  return function DeployContractComp(props: {
    onSuccess?: (trans: Transaction) => void;
  }) {
    const [{ context }] = useActor(skService);

    return (
      <div style={{}}>
        <Button
          disabled={!context.chain.started}
          onClick={() => {
            skService.state.context.chain.sk
              .deploy({ payload: contractCode })
              .then(({ trans }) => {
                props.onSuccess && props.onSuccess(trans!);
                message.info(
                  'deploy trans send, contract address: ' +
                    trans?.recipient.did,
                );
              });
          }}
        >
          deploy
        </Button>
      </div>
    );
  };
};
