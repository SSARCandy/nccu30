var cp = require('child_process');
var path = require('path');
var working_path = path.resolve(__dirname, './');

var out = str => {
	console.log(str);
};

var job = (str, options) => {
	if (options == null) {
		options = {
			cwd: working_path
		};
	} else {
		if (options.cwd == null) {
			options.cwd = working_path;
		}
	}

	var output = cp.execSync(str, options).toString();

	return output;
};

working_path = '/Users/ssarcandy/Documents/GitHub/nccu30';

out('[1] update code from github');
job('git pull');
out('');

out('[2] pm2 restart app');
job('pm2 restart app.js');
out('');

