import 'wasi';

import { CommandLine, Console, Process } from 'as-wasi';

const cli = new CommandLine();

/*
class Command {
  fn: () => void;
  constructor(fn: () => void) {
    this.fn = fn;
  }
  execute(): void {
    this.fn();
  }
}
*/
type Command = (this: Program) => void;

class Program {
  private _name: string;
  private _description: string;
  private _version: string;
  private _options: Map<string, string>;
  private _commands: Map<string, Command>;

  constructor() {
    this._name = '[unnamed]';
    this._description = '';
    this._version = '';
    this._options = new Map<string, string>();

    this._commands = new Map<string, Command>();
    this._commands.set('version', this.__version);
    this._commands.set('help', this.__help);
  }

  __version(): void {
    Console.log(this._version);
    Process.exit(0);
  }
  __help(): void {
    Console.log(this._name);
    Console.log(this._description + '\n');
    Console.log('Usage: help [options]');
    const commands = this._commands.keys();
    commands.forEach((value) => {
      Console.log('  --' + value + '  thing');
    });
    Process.exit(2);
  }

  name(name: string): this {
    this._name = name;
    return this;
  }
  version(version: string): this {
    this._version = version;
    return this;
  }

  description(description: string): this {
    this._description = description;
    return this;
  }

  option(opt: string, desc: string): this {
    this._options.set(opt, desc);
    return this;
  }

  command(name: string, action: Command): this {
    this._commands.set(name, action);
    return this;
  }

  execute(name: string): void {
    if (this._commands.has(name)) {
      const command = this._commands.get(name);
      command.call(this);
    } else {
      Console.log('[ERROR] The command "' + name + '" is not available.');
    }
  }
}

export const program = new Program();
