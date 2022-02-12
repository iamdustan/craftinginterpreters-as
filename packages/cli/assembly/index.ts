import { program } from './program';

program
  .name('jlox-as cli')
  .version('0.0.1')
  .description('Hopefully a cli tool for Crafting Interpreters')
  .command('run', function () {
    Console.log('running a thing woot');
  });

program.execute('run');
