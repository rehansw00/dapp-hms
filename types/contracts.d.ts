declare module '*.json' {
  const value: {
    abi: any[];
    networks: {
      [key: number]: {
        address: string;
      };
    };
  };
  export default value;
}