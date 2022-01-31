export interface RunesApiBridge {
  connect(host: string, port: number): void;
  eval(statement: string): void;
}
