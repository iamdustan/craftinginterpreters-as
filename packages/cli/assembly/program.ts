import { CommandLine } from './forks/CommandLine';

export const cli = new CommandLine();
export type CommandAction = (this: Command, options: Set<string>) => void;

class Command {
  _program: Program;
  _name: string;
  _description: string;
  _action: CommandAction;
  _options: Map<string, string>;

  constructor(name: string) {
    this._program = program;
    this._name = name;
    this._description = '';
    this._options = new Map();
    this._action = (_options: Set<string>) => {};

    this.option('--help', 'Print help');
  }
  help(): void {
    console.log(this._program._name + ' ' + this._name + ': help');
    console.log(this._description);

    const length = 8;
    const options = this._options.keys();
    for (let i = 0, k = options.length; i < k; i++) {
      const option = options[i];
      const description = this._options.get(option);
      const optName = option.padEnd(length, ' ');
      console.log('  ' + optName + ' ' + description);
    }
  }

  setProgram(program: Program): this {
    this._program = program;
    return this;
  }
  description(description: string): this {
    this._description = description;
    return this;
  }
  // currently we only support boolean options. They are present or they are
  // not.
  option(key: string, description: string | null): this {
    if (description) {
      this._options.set(key, description);
    } else {
      this._options.set(key, '');
    }
    return this;
  }
  action(action: CommandAction): this {
    this._action = action;
    return this;
  }
  execute(opts: Set<string>): void {
    if (opts.has('help')) {
      this.help();
    } else {
      this._action.call(this, opts);
    }
  }
}

class Program {
  _name: string;
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
      console.log('do a thing');
    } else {
      const options: Set<string> = args.reduce((acc, cur) => {
        if (cur.startsWith('--')) {
          acc.add(cur.slice(2));
        }
        return acc;
      }, new Set<string>());
      this.execute(commandName, options);
    }
    return this;
  }

  execute(name: string, opts: Set<string>): void {
    if (this._commands.has(name)) {
      const command = this._commands.get(name);
      command.execute(opts);
    } else {
      console.log('[ERROR] The command "' + name + '" is not available.');
    }
  }
}

export const program = new Program();

program
  .command('help')
  .description('Print help text')
  .action(function help(this: Command) {
    const program = (this as Command)._program;
    console.log(program._name);
    console.log(program._description + '\n');
    console.log('Usage: help [options]');
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
      console.log('  ' + value.padStart(length, ' ') + '  ' + description);
    }
    process.exit(2);
  });

program
  .command('version')
  .description('Print program version')
  .action(() => {
    const program = (this as Command)._program;
    console.log(program._version);
    process.exit(0);
  });
