// Lifted from https://github.com/jedisct1/as-wasi/blob/21d056aff8ee4d364b664c0b4a54e2efa434ca73/assembly/as-wasi.ts
import {
  args_get,
  args_sizes_get,
  errno,
} from '@assemblyscript/wasi-shim/assembly/bindings/wasi_snapshot_preview1.ts';

type aisize = i32;

export class CommandLine {
  args: string[];

  constructor() {
    this.args = [];
    let count_and_size = memory.data(16);
    let ret = args_sizes_get(count_and_size, count_and_size + 4);
    if (ret !== errno.SUCCESS) {
      process.exit(0);
      // abort();
    }
    let count = load<usize>(count_and_size, 0);
    let size = load<usize>(count_and_size, sizeof<usize>());
    let env_ptrs = changetype<usize>(
      new ArrayBuffer(((count as aisize) + 1) * sizeof<usize>())
    );
    let buf = changetype<usize>(new ArrayBuffer(size as aisize));
    if (args_get(env_ptrs, buf) !== errno.SUCCESS) {
      process.exit(0);
      // abort();
    }
    for (let i: usize = 0; i < count; i++) {
      let env_ptr = load<usize>(env_ptrs + i * sizeof<usize>());
      let arg = StringUtils.fromCString(env_ptr);
      this.args.push(arg);
    }
  }

  /**
   * Return all the command-line arguments
   */
  @inline
  static get all(): Array<string> {
    return new CommandLine().args;
  }

  /**
   * Return all the command-line arguments
   */
  @inline
  all(): Array<string> {
    return this.args;
  }

  /**
   * Return the i-th command-ine argument
   * @param i index
   */
  get(index: usize): string | null {
    let args = this.args;
    let args_len: usize = args[0].length;
    if (index < args_len) {
      return unchecked(args[index as aisize]);
    }
    return null;
  }
}

class StringUtils {
  /**
   * Returns a native string from a zero-terminated C string
   * @param cstring
   * @returns native string
   */
  @inline
  static fromCString(cstring: usize): string {
    let size = 0;
    while (load<u8>(cstring + size) !== 0) {
      size++;
    }
    return String.UTF8.decodeUnsafe(cstring, size);
  }
}
