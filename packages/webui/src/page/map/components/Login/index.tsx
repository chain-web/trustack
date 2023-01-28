// import { Button, Input, message, Modal, Spin } from 'antd';
// import React, { useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { ReduxStoreState, useAction } from '../../../../store';
// import { homeActions } from '../../../../store/home';
// import './index.less';
// let interval: NodeJS.Timeout;

// export default function Login(props) {
//   const { login, sendSms } = useAction(homeActions);
//   const { did } = useSelector((state: ReduxStoreState) => state.home);
//   const [phone, setphone] = useState('');
//   const [phoneError, setphoneError] = useState(true);
//   const [lastTime, setlastTime] = useState(60);
//   const [smsCode, setsmsCode] = useState<string>();
//   const [loading, setloading] = useState(false);
//   useEffect(() => {
//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   useEffect(() => {
//     if (lastTime < 60) {
//       if (lastTime === 0) {
//         setlastTime(60);
//         return;
//       }
//       setTimeout(() => {
//         setlastTime(lastTime - 1);
//       }, 1000);
//     }
//   }, [lastTime]);

//   const getSmscode = () => {
//     setloading(true);
//     sendSms({ phone }).then((res) => {
//       setloading(false);
//       if (res) {
//         setlastTime(59);
//       } else {
//         setlastTime(60);
//       }
//     });
//   };

//   const toLogin = () => {
//     if (phoneError || !smsCode) {
//       return;
//     }
//     setloading(true);
//     login({
//       phone: phone.replace(/\s/g, ''),
//       smsCode,
//     }).then((res) => {
//       setloading(false);
//     });
//   };
//   return (
//     <Modal closable={false} footer={null} visible={!(did?.length === 48)}>
//       <Spin spinning={loading} wrapperClassName="login-wrapper">
//         <div className="login-content">
//           <Input
//             type="phone"
//             placeholder="手机号"
//             onChange={(e) => {
//               setphone(e.target.value);
//               if (e.target.value.replace(/\s/g, '').length !== 11) {
//                 setphoneError(true);
//                 return;
//               }
//               setphoneError(false);
//             }}
//             value={phone}
//           ></Input>
//           <div className="smscode-line">
//             <Input
//               placeholder="验证码"
//               onChange={(e) => {
//                 setsmsCode(e.target.value);
//               }}
//               value={smsCode}
//             ></Input>
//             <Button
//               disabled={(lastTime > 0 && lastTime < 60) || phoneError}
//               onClick={getSmscode}
//             >
//               {lastTime !== 60 ? lastTime : '获取验证码'}
//             </Button>
//           </div>

//           <div className="login-go">
//             <Button onClick={toLogin} type="primary">
//               登陆
//             </Button>
//           </div>
//         </div>
//       </Spin>
//     </Modal>
//   );
// }

export default () => {};
