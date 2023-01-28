import { Button } from 'antd';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DeployContract = (_CodeClass: any, _contractCode: Uint8Array) => {
  return function DeployContractComp(_props: {
    onSuccess?: (trans: object) => void;
  }) {
    // const [{ context }] = useActor(skService);

    return (
      <div style={{}}>
        <Button
          // disabled={!context.chain.started}
          onClick={() => {
            // skService.state.context.chain.sk
            //   .deploy({ payload: contractCode })
            //   .then(({ trans }) => {
            //     props.onSuccess && props.onSuccess(trans!);
            //     message.info(
            //       'deploy trans send, contract address: ' +
            //         trans?.recipient.did,
            //     );
            //   });
          }}
        >
          deploy
        </Button>
      </div>
    );
  };
};
