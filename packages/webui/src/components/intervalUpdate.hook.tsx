import { useEffect, useState } from 'react';

export function useIntervalUpdate(time: number) {
  const [now, setNow] = useState(Date.now());
  const [id, setId] = useState(0);

  useEffect(() => {
    setId(
      setInterval(() => {
        setNow(Date.now());
      }, time),
    );
    return () => {
      clearInterval(id);
    };
  }, []);

  return now;
}
