// import { Button, Input } from 'antd';
// import React, { useEffect } from 'react';

// import { accounts } from './accounts';
// import Devtool from './components/devtool';
// import Transaction from './components/transaction';
// import NodeStatus from './components/nodeStatus';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import ChangeI18n from '../../config/i18n/i18nSelect';
import { chainState } from '../../state/sk';
import './index.scss';
import Devtool from './components/devtool';
import Login from './components/login';
import { lanKeys } from './index.i18n';
// import { useIntervalUpdate } from '../../components/intervalUpdate.hook';
// import { historyAction } from '../../utils/history';
// import RepoStatus from './components/repoStatus';
// import StateRootStatus from './components/stateRootStatus';
// import BlockStatus from './components/blockStatus';
// import TransactionStatus from './components/transactionStatus';
// import Login from './components/login';

export default function TestPage() {
  const started = false;
  const [t] = useTranslation();
  const start = chainState.getSnapshot().matches('START');
  // const time = useIntervalUpdate(1000)
  // const { chain } = current.context;
  // useEffect(() => {
  //   // 方便调试，自动启动节点
  //   const autoStart = +historyAction.pullHashParam('autoStart');
  //   const forceReady = historyAction.pullHashParam('forceReady') === 'true';
  //   if (!isNaN(autoStart) && accounts[autoStart]) {
  //     setTimeout(() => {
  //       skService.send(SkNodeEventType.START_CHAIN, accounts[autoStart]);
  //     }, 4000);
  //   }

  //   // 如果是新链，forceReady强制节点为ready状态启动
  //   skService.send(SkNodeEventType.CONFIG_CHAIN, {
  //     forceReady,
  //   });
  // }, []);

  // const [priv, setpriv] = useState('');
  return (
    <div className="test-box">
      <ChangeI18n />
      <div className="home-start-node">
        {!started && (
          <div>
            <Login />
          </div>
        )}
        <div className="home-node-status">
          {start && (
            <Button type="default" loading={true}>
              {t(lanKeys.starting)}
            </Button>
          )}
          {/* {started && <p>{chain.sk.db.cache.get(skCacheKeys.accountId)}</p>}
          {started && <Button type="ghost">{t(lanKeys.started)}</Button>}
          {started && <NodeStatus />}
          {started && <RepoStatus />}
          {started && <StateRootStatus />}
          {started && <BlockStatus />}
          {started && <TransactionStatus />} */}
        </div>
      </div>
      {/* {<Transaction />} */}
      {<Devtool />}
    </div>
  );
}
