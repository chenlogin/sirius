import * as extPlugin from 'client_plugin';

export interface CallExternalResult {
    existing: boolean;
}
export type CallExternalResultWithCallback<T> = {
    existing: false;
} | {
        existing: true;
        result: T;
    };

/**
 * 检查external上是否有指定方法
 *
 * @author 
 * @export
 * @param {string} method       方法名称
 * @returns {Promise<boolean>}
 */
export function hasExternal(method: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        extPlugin.check_external(method, (exists: boolean) => {
            resolve(exists);
        });
    });
}
/**
 * 调用外部接口（args形式），无回调
 *
 * @author 
 * @export
 * @param {string} method
 * @param {Array<{}>} [args]
 * @returns {Promise<void>}
 */
export async function callExternalWithArgs(method: string, args?: Array<{}>): Promise<CallExternalResult>;
/**
 * 调用外部接口（args形式），有回调
 *
 * @author 
 * @export
 * @template TResult
 * @param {string} method
 * @param {true} hasCallback
 * @param {Array<{}>} [args]
 * @returns {Promise<TResult>}
 */
export async function callExternalWithArgs<TResult>(method: string, hasCallback: true, args?: Array<{}>): Promise<CallExternalResultWithCallback<TResult>>;
export async function callExternalWithArgs<TResult>(
    method: string,
    arg0?: true | Array<{}>,
    arg1?: Array<{}>,
): Promise<CallExternalResult | CallExternalResultWithCallback<TResult>> {
    let hasCallback: boolean;
    let args: Array<{}>;
    if (typeof arg0 === 'boolean') {
        hasCallback = arg0;
        args = arg1 || [];
    } else {
        hasCallback = false;
        args = arg0 || [];
    }

    if (hasCallback) {
        // 有回调的，plugin会检查是否存在，如果方法不存在，会回调NOT_EXIST
        return new Promise<CallExternalResultWithCallback<TResult>>((resolve, reject) => {
            extPlugin.do_external(method, ...args, (result: any, error: any) => {
                // 不存在
                if (result == null) {
                    resolve({ existing: false });
                } else {
                    resolve({ existing: true, result: result as TResult });
                }
            });
        });
    } else {
        // 没有回调的需要自己检查一下是否存在
        const has: boolean = await hasExternal(method);
        if (!has) {
            return { existing: false };
        }

        extPlugin.do_external(method, ...args);

        return { existing: true };
    }
}
