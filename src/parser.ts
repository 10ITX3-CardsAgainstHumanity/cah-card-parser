const createReadStream = require('fs').createReadStream;
const superagent = require('superagent');
const throttle = require('superagent-throttle');
const readLine = require('readline');
const chalk = require('chalk');
const argv = require('yargs')
    .env('apikey')
    .option('k', {alias: 'apikey', demandOption: true})
    .option('u', {alias: 'url', demandOption: true})
    .option('w', {alias: 'whiteCards'})
    .option('b', {alias: 'blackCards'})
    .help()
    .argv;

const log = console.log;
const error = console.error;

if (argv.whiteCards) {
    const rlWC = readLine.createInterface({
        input: createReadStream(argv.whiteCards)
    });

    const limiter = new throttle({
        active: true,
        rate: 10,
        ratePer: 1000,
        concurrent: 10
    });

    rlWC.on('line', (line: string) => {
        superagent
            .post(argv.url)
            .use(limiter.plugin())
            .set('X-Apikey', argv.apikey)
            .send({ text: line, type: 'answer' })
            .end((err: any, res: any) => {
                if (err) return error(chalk.red(`CODE: ${err.code} | Could not upload line: ${line}`));
                log(chalk.green(`Uploaded line: ${res.text}`));
            });
    });

    rlWC.on('end', () => {
        log(chalk.blue('EOF - Exiting'));
    })
}

if (argv.blackCards) {
    const rlBC = readLine.createInterface({
        input: createReadStream(argv.blackCards)
    });

    const limiter = new throttle({
        active: true,
        rate: 10,
        ratePer: 5000,
        concurrent: 10
    });

    rlBC.on('line', (line: string) => {
        superagent
            .post(argv.url)
            .use(limiter.plugin())
            .set('X-Apikey', argv.apikey)
            .send({ text: line, type: 'question' })
            .end((err: any, res: any) => {
                if (err) return error(chalk.red(`CODE: ${err.code} | Could not upload line: ${line}`));
                log(chalk.green(`Uploaded line: ${res.text}`));
            });
    });

    rlBC.on('end', () => {
        log(chalk.blue('EOF - Exiting'));
    })
}
