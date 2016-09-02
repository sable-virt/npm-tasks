# npm-tasks

power-up npm scripts for task runner.

## Required

Node.js =< 5.0

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

create `task.conf.js`

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
        "build": "tasks build:*",
        "build:task1": "tasks sass",
        "build:task2": "npm-tasks sass"
    }
}
```

You can use wildcard. ex `tasks build:*` -> `tasks build:tasks1 & tasks build:tasks2`

※ `tasks` is `npm-tasks` alias.

```
npm run sass
```

※ `npm run sass` -> `tasks sass` -> `node-sass /path/to/sass --output /dest/to/sass`

## Sync Tasks

```
{
    ...
    scripts: {
        "build": "tasks sass postcss",
        "sass": "tasks sass",
        "postcsss": "tasks postcss"
    }
}
```
