export const clearIndexeddb = (): Promise<void> | undefined => {
  // firefox do not have indexedDB.databases
  if (indexedDB.databases) {
    return indexedDB.databases().then((res) => {
      res.forEach((ele) => {
        indexedDB.deleteDatabase(ele.name as string);
      });
    });
  }
};
