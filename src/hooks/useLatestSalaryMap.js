import { useMemo } from 'react';

/**
 * Retorna un mapa { [userId]: salarioMásReciente }
 */
const useLatestSalaryMap = (salaries = []) => {
  return useMemo(() => {
    const map = {};

    salaries.forEach(s => {
      if (!s?.userId) return;

      const current = map[s.userId];

      if (
        !current ||
        new Date(s.effectiveDate) > new Date(current.effectiveDate)
      ) {
        map[s.userId] = s;
      }
    });

    return map;
  }, [salaries]);
};

export default useLatestSalaryMap;
