export interface Message<T extends string> {
  id?: number;
  type: T;
}

export interface ResultMessage<T extends string> extends Message<T> {
  originalType: string;
}

export const OK_TYPE = "ok";
export type Ok = ResultMessage<typeof OK_TYPE>;

export const ERR_TYPE = "err";
export interface Err extends ResultMessage<typeof ERR_TYPE> {
  error: string;
}

export type Result = Ok | Err;

export function result<T extends string>(
  original: Message<T>,
  error?: string
): Result {
  const { id, type: originalType } = original;

  if (error) {
    return {
      id,
      type: ERR_TYPE,
      originalType,
      error,
    };
  }

  return { id, type: OK_TYPE, originalType };
}

export const LOADING_TYPE = "loading";

export const OFFSCREEN_TYPE = "offscreen";
export interface Offscreen extends Message<typeof OFFSCREEN_TYPE> {
  canvas: OffscreenCanvas;
}

export const EXECUTE_TYPE = "execute";
export interface Execute extends Message<typeof EXECUTE_TYPE> {
  code: string;
  shouldInit?: boolean;
}

export const INIT_TYPE = "init";
export type Init = Message<typeof INIT_TYPE>;

export const KEY_TYPE = "key";
export interface Key extends Message<typeof KEY_TYPE> {
  n: number;
  isDown: boolean;
}

export const ENC_TYPE = "enc";
export interface Enc extends Message<typeof ENC_TYPE> {
  n: number;
  d: number;
}

export const RESTART_TYPE = "restart";
export type Restart = Message<typeof RESTART_TYPE>;

export const RESET_TYPE = "reset";
export type Reset = Message<typeof RESET_TYPE>;

export type MatronMainMessage = Result;

export type MatronWorkerMessage =
  | Offscreen
  | Execute
  | Init
  | Key
  | Enc
  | Restart
  | Reset;
