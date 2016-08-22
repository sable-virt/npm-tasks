# npm-tasks

power-up npm scripts for task runner.

## Install

Local Install

```
npm i npm-tasks --save-dev
```

Global Install

```
npm i npm-tasks -g
```

## Usage

create runner.conf.js

```
module.exports = {
    config: {
        sassSrc: "/path/to/sass",
        destSass: "/dest/to/sass"
    },
    task: {
        "sass": "node-sass ${sassSrc} --output ${destSass}"
    }
};
```

- config: Variables in task command. Replacing `${key}` by value.
- task: Task command. npm-tasks adds node_modules/.bin to the PATH provided to scripts.

## Example

package.json
```
{
    ...
    scripts: {
        "sass": "tasks sass",
        "sass2": "npm-tasks sass"
    }
}
```

※ `tasks` is `npm-tasks` alias.

```
npm run sass
```

※ `npm run sass` -> `tasks sass` -> `node-sass /path/to/sass --output /dest/to/sass`