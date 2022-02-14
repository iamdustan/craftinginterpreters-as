import 'wasi';

import { CommandLine, Console, Process } from 'as-wasi';

export const cli = new CommandLine();
export type CommandAction = (this: Command) => void;

class Command {
  _program: Program;
  _name: string;
  _description: string;
  _action: CommandAction;
  constructor(name: string) {
    this._program = program;
    this._name = name;
    this._description = '';
    this._action = () => {};
  }
  setProgram(program: Program): this {
    this._program = program;
    return this;
  }
  description(description: string): this {
    this._description = description;
    return this;
  }
  action(action: CommandAction): this {
    this._action = action;
    return this;
  }
  execute(): void {
    this._action.call(this);
  }
}

class Program {
  private _name: string;
  private _description: string;
  _version: string;
  private _options: Map<string, string>;
  private _commands: Map<string, Command>;

  constructor() {
    this._name = '[unnamed]';
    this._description = '';
    this._version = '';
    this._options = new Map<string, string>();

    this._commands = new Map<string, Command>();
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

  command(name: string): Command {
    const command = new Command(name);
    command.setProgram(this);
    this._commands.set(name, command);
    return command;
  }

  parse(argv: Array<string>): this {
    const args = argv.slice(1);
    // naively assume the first argument is the command and the trailing
    // arguments are options
    const commandName = args[0];
    if (commandName.startsWith('-')) {
      // actually we have a built in option like --help or --version. look it up.
      Console.log('do a thing');
    } else {
      this.execute(commandName);
    }
    return this;
  }

  execute(name: string): void {
    if (this._commands.has(name)) {
      const command = this._commands.get(name);
      command.execute();
    } else {
      Console.log('[ERROR] The command "' + name + '" is not available.');
    }
  }
}

export const program = new Program();

program
  .command('help')
  .description('Print help text')
  .action(function help(this: Command) {
    const program = (this as Command)._program;
    Console.log(program._name);
    Console.log(program._description + '\n');
    Console.log('Usage: help [options]');
    const commands = program._commands.keys();
    let length = 0;
    for (let i = 0, k = commands.length; i < k; i++) {
      const value = commands[i];
      if (value.length > length) {
        length = value.length;
      }
    }

    for (let i = 0, k = commands.length; i < k; i++) {
      const value = commands[i];
      const command = value;
      const description = program._commands.get(command)._description;
      Console.log('  ' + value.padStart(length, ' ') + '  ' + description);
    }
    Process.exit(2);
  });

program
  .command('version')
  .description('Print program version')
  .action(() => {
    const program = (this as Command)._program;
    Console.log(program._version);
    Process.exit(0);
  });
