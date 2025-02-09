import type { IChange } from '../../types/article.js';

/**
 * @param oldObj
 * @param newObj
 */
// eslint-disable-next-line import/prefer-default-export
export const compareObjects = (oldObj: Record<string, unknown>, newObj: Record<string, unknown>): IChange[] => {
  const changes: IChange[] = [];

  // Lista kluczowych pól, które chcemy porównywać
  const fieldsToCompare = [
    'title',
    'clientDescription',
    'employeeDescription',
    'tags',
    'isVerified',
    'isTrashed',
    'product',
  ];

  // Przechodzimy po wszystkich kluczach w obiekcie
  for (const key of fieldsToCompare) {
    if (Object.keys(oldObj).includes(key)) {
      const oldValue = oldObj[key];
      const newValue = newObj[key];

      // Jeśli wartość się zmieniła, generujemy zmianę
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        changes.push({
          field: key, // Pole zmienione
          oldValue: JSON.stringify(oldValue), // Stara wartość
          newValue: JSON.stringify(newValue), // Nowa wartość
        });
      }
    }
  }

  return changes;
};
