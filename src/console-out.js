'use strict';

const chalk = require('chalk');
const nodePlop = require('node-plop');
const fs = require('fs');

const defaultChoosingMessage = chalk.blue('[PLOP]') + ' Please choose a generator.';

module.exports = (function () {

	function chooseOptionFromList(plopList, message) {
		const plop = nodePlop();
		const generator = plop.setGenerator('choose', {
			prompts: [{
				type: 'list',
				name: 'generator',
				message: message || defaultChoosingMessage,
				choices: plopList.map(function (p) {
					return {
						name: p.name + chalk.gray(!!p.description ? ' - ' + p.description : ''),
						value: p.name
					};
				})
			}]
		});
		return generator.runPrompts().then(results => results.generator);
	}

	function displayHelpScreen() {
		console.log([
			'',
			chalk.bold('Usage:'),
			'  $ plop                 ' + chalk.dim('Select from a list of available generators'),
			'  $ plop <name>          ' + chalk.dim('Run a generator registered under that name'),
			'  $ plop <name> [input]  ' + chalk.dim('Run the generator with input data to bypass prompts'),
			'',
			chalk.bold('Options:'),
			'  -h, --help             ' + chalk.dim('Show this help display'),
			'  -t, --show-type-names  ' + chalk.dim('Show type names instead of abbreviations'),
			'  -i, --init             ' + chalk.dim('Generate a basic plopfile.js'),
			'  -v, --version          ' + chalk.dim('Print current version'),
			'  -f, --force            ' + chalk.dim('Run the generator forcefully'),
			'  --plopfile             ' + chalk.dim('Path to the plopfile'),
			'  --completion           ' + chalk.dim('Method to handle bash/zsh/whatever completions'),
			'  --cwd                  ' + chalk.dim('Directory from which relative paths are calculated against'),
			'  --require              ' + chalk.dim('String or array of modules to require before running plop'),
			'',
			chalk.bold('Examples:'),
			'  $ ' + chalk.blue('plop'),
			'  $ ' + chalk.blue('plop component'),
			'  $ ' + chalk.blue('plop component "name of component"'),
			'',
		].join('\n'));
	}

	function createInitPlopfile(cwd, callback){
		var initString = 'module.exports = function (plop) {\n\n' +
			'\tplop.setGenerator(\'basics\', {\n' +
			'\t\tdescription: \'this is a skeleton plopfile\',\n' +
			'\t\tprompts: [],\n' +
			'\t\tactions: []\n' +
			'\t});\n\n' +
			'};';

		fs.writeFile(cwd + '/plopfile.js', initString, callback);
	}

	const typeDisplay = {
		'function': chalk.yellow('->'),
		'add': chalk.green('++'),
		'addMany': chalk.green('+!'),
		'modify': `${chalk.green('+')}${chalk.red('-')}`,
		'append': chalk.green('_+')
	};
	const typeMap = (name, noMap) => {
		const dimType = chalk.dim(name);
		return (noMap ? dimType : typeDisplay[name] || dimType);
	};

	return {
		chooseOptionFromList,
		displayHelpScreen,
		createInitPlopfile,
		typeMap
	};
})();
