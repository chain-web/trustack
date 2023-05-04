import React, { useState } from 'react';
import './index.scss';
import { useTranslation } from 'react-i18next';
import { Button } from 'antd';
import type { DidJson } from 'skchain';
import { genetateDid, localCache, skCacheKeys } from 'skchain';
import { lanKeys } from './index.i18n';

enum LoginType {
  None,
  PrivateKey,
  DIDFile,
  CreateDID,
}

export default function Login() {
  const [t] = useTranslation();
  const [loginType, setLoginType] = useState(LoginType.PrivateKey);
  const [did, setdid] = useState(localCache.get(skCacheKeys.accountId) || '');
  const [privKey, setprivKey] = useState(
    localCache.get(skCacheKeys.accountPrivKey) || '',
  );

  const downloadDIDFile = (did: DidJson) => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(did)], {
      type: 'text/json',
    });
    element.href = URL.createObjectURL(file);
    element.download = `${did.id}.json`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="login-box">
      <h3>Login SK</h3>
      <div>
        <Button
          onClick={() => {
            setLoginType(LoginType.PrivateKey);
          }}
        >
          use DID and PrivKey
        </Button>
        <Button
          onClick={() => {
            setLoginType(LoginType.DIDFile);
          }}
        >
          load DID file
        </Button>
        <Button
          onClick={async () => {
            setLoginType(LoginType.CreateDID);
            const didData = await genetateDid();
            setdid(didData.id);
            setprivKey(didData.privKey);
          }}
        >
          create DID
        </Button>
      </div>

      <div>
        {loginType === LoginType.PrivateKey && (
          <div>
            <div>
              <input
                type="text"
                // placeholder={t(lanKeys.did)}
                value={did}
                onChange={(e) => {
                  setdid(e.target.value);
                }}
              />
            </div>
            <div>
              <input
                type="text"
                // placeholder={t(lanKeys.privKey)}
                value={privKey}
                onChange={(e) => {
                  setprivKey(e.target.value);
                }}
              />
            </div>
          </div>
        )}
        {loginType === LoginType.DIDFile && (
          <div>
            <input
              type="file"
              onChange={(e) => {
                const file = e?.target?.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    const did = JSON.parse(
                      (e.target?.result as string) || '{}',
                    );
                    // console.log(did);
                    setdid(did.id);
                    setprivKey(did.privKey);
                  };
                  reader.readAsText(file);
                }
                e.target.value = '';
              }}
            />
          </div>
        )}
      </div>
      {did && privKey && (
        <div>
          <div>
            {t(lanKeys.did)}: {did}
          </div>
          <div>
            {t(lanKeys.privKey)}: {privKey}
          </div>

          {loginType !== LoginType.DIDFile && (
            <div>
              <Button
                onClick={() => {
                  downloadDIDFile({
                    id: did,
                    privKey,
                  });
                }}
              >
                download did file
              </Button>
            </div>
          )}
          <div>
            <Button
              id="login-login-btn"
              onClick={() => {
                // skService.send(SkNodeEventType.START_CHAIN, {
                //   id: did,
                //   privKey,
                // });
              }}
            >
              {t(lanKeys.login)}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
