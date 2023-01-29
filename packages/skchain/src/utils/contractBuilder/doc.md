#### 把智能合约代码，编译成 cwjsr 可以执行的 js 字符串

- 把从 sk-chain import 进来的变量替换成全局变量，类型直接写在了 TS 代码里面，方法替换为从**sk**这个全局变量里拿，**sk**是在 cwjsr 运行时注入的
- 把 class extends 删除，在 TS 代码里 extends 只是为了能使用 BaseContract 的类型定义
- 把 super()替换为向当前 class 注入 BaseContract 的属性
- 把 export 等模块相关的代码剔除
- 把 js code string 生成 Uint8Array 数据，写入文件
