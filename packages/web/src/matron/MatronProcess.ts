export interface MatronProcess {
  setCanvas(canvas: HTMLCanvasElement): Promise<void>;
  execute(code: string, shouldInit?: boolean): Promise<void>;
  init(): Promise<void>;
  key(n: number, isDown: boolean): Promise<void>;
  enc(n: number, d: number): Promise<void>;
  animate(enabled: boolean): Promise<void>;
  shutdown(): void;
}
