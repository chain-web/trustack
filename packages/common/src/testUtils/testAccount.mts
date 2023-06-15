import type { DidJson } from '../interface/did.mjs';

export const testAccounts: DidJson[] = [
  {
    id: '12D3KooWL8qb3L8nKPjDtQmJU8jge5Qspsn6YLSBei9MsbTjJDr8',
    privKey:
      'CAESQOu2tC61UCD6utWQpWndm8HSVWxi88P7cP29ydv6iHaOmVBTlFvfBXPpjZJeFi/Ult6HUOcVd9OOkyDg5TDibdk=',
  },
  {
    id: '12D3KooWL1NF6fdTJ9cucEuwvuX8V8KtpJZZnUE4umdLBuK15eUZ',
    privKey:
      'CAESQH+DR5TwHgEeKT/y/C8q3ixRVLOmIVeokvSmhZObWvrVl2ZX0c+MNcSLKy51EIwvS8y8gcVbIxmp0sJlztYRA1I=',
  },
  {
    id: '12D3KooWHdhPrGCqsjD8j6yiHfumdzxfRxyYNPxJKN99RfgtoRuq',
    privKey:
      'CAESQI/1ln/U9+4X+ovu4pb25U3jousyHSsR9YgXWi2/54DUdCHYam0uBGfydH5OZY1b70ihgEcYUKZTY5XkhtTEFZg=',
    pubKey: 'CAESIHQh2GptLgRn8nR+TmWNW+9IoYBHGFCmU2OV5IbUxBWY',
  },
  {
    id: '12D3KooWE4cb6m9DWsdsQh1gV8BzRdMhQkgeQcyGidDsug5uUoRz',
    privKey:
      'CAESQJuIaXd+gDMgfLaBJxXehmFqsAx2zGpPu2qdVBOJQtoMPxUvBprLeqShXIbZwVQ4QQJilXTqCqUcXCzsfPvHCdk=',
    pubKey: 'CAESID8VLwaay3qkoVyG2cFUOEECYpV06gqlHFws7Hz7xwnZ',
  },
  {
    id: '12D3KooWJHQ8kvM97Fz7i5CN3chfeRSrG51soNayhGHSeaqdDT5v',
    privKey:
      'CAESQAXiGJ17LnMgZrFCaMOoil1i289FG0drAFR5WrzSn2fffcpmYl6JkHXPcrjD2AcyLrHxiffG/4VntnY2wGwWnKU=',
    pubKey: 'CAESIH3KZmJeiZB1z3K4w9gHMi6x8Yn3xv+FZ7Z2NsBsFpyl',
  },
  {
    id: '12D3KooWHEo1RWNuvWhPEgwQqL6JWdYfbNEBYgDCXsMXe4WxMMhb',
    privKey:
      'CAESQAz9mtxz9FdqkvES/LPOwTLWGCV/qdLFBIqkwXfbuCV9bkPVcoDrLN2eA6PwG8NVkWUrzTlxFd3aZlU4TWgxgfI=',
    pubKey: 'CAESIG5D1XKA6yzdngOj8BvDVZFlK805cRXd2mZVOE1oMYHy',
  },
  {
    id: '12D3KooWFRKRePch8fE5jiwT5tk34Sd6bc4pqtkzJCwsFn3cKsRs',
    privKey:
      'CAESQKEW67PNxYt5tKHyi+UgAY8uYJ4CD5H41YIy7ZJiSxdDUz6pTRNkuALasw2jiu/wtcgZUATDRygnIcsh+tY3YCo=',
    pubKey: 'CAESIFM+qU0TZLgC2rMNo4rv8LXIGVAEw0coJyHLIfrWN2Aq',
  },
  {
    id: '12D3KooWFofaJAEV6GGHKCZuwySNATffLBmLuPTAB4UVKRMxKxUX',
    privKey:
      'CAESQEWKrYJNWe5clNQZYxQn07RaPgIdyz/Pzc6pexK2Gf/3WPg4y7ItnHqKnX2IhhpxvwA9Y/TNwG4hVChGBH0yp7g=',
    pubKey: 'CAESIFj4OMuyLZx6ip19iIYacb8APWP0zcBuIVQoRgR9Mqe4',
  },
  {
    id: '12D3KooWSWNLai34t2Xqvy3uC2USY4ovz4tLBoXt4bobJDgfUDvm',
    privKey:
      'CAESQJlrmye7ZErZfeugomhCfWDRk3IJQHjh0AodwO0nNCoc9/pqOznzDdQvGdPc0vLHH0Tul95AXpzklc7NvnSIA1Y=',
    pubKey: 'CAESIPf6ajs58w3ULxnT3NLyxx9E7pfeQF6c5JXOzb50iANW',
  },
];

export const testRelayAccounts: ({
  tcpPort: number;
  wsPort: number;
} & DidJson)[] = [
  {
    id: '12D3KooWNGzeLjNkY2JCVbU9C8NnyKSpoqXVXiLsYUsZ5QxVSbaK',
    privKey:
      'CAESQGMEqbZ+N95KgXKmHvhTxw9tBZ9+CCEiRukL+l4o8ESLuR6WZKxGoLr8EaG8OKXtG2ObrsjnFWmTpSLsOVaDGRw=',
    pubKey: 'CAESILkelmSsRqC6/BGhvDil7Rtjm67I5xVpk6Ui7DlWgxkc',
    tcpPort: 8689,
    wsPort: 8690,
  },
  {
    id: '12D3KooWLptEML9ro4hsTDrPFoiZVqiERCXkSRV2gPqTwabZDhM5',
    privKey:
      'CAESQPunI5eCrrcTq/mXygrSme1cjNifVB4qqy3eGEALnpldo5KMMGzARMrhGw+1xZDxcj+axe+VdRbFYBOJhcjV7Iw=',
    pubKey: 'CAESIKOSjDBswETK4RsPtcWQ8XI/msXvlXUWxWATiYXI1eyM',
    tcpPort: 9689,
    wsPort: 9690,
  },
];
