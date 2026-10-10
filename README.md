# Babel Transform Pipeline
A nodejs project utilizing babeljs to apply various transforms onto a codebase.\
I've Implemented a single transform at the time of writing, which its details can be seen [here](#Identifier-Normalizer).\
I've also written a logger class, so I can isolate and increase the logging level on specific sections of code which can be seen [here](#logger).

## Current Transforms

<details>
  <Summary>Identifier Normalizer</Summary>
  <a name="Identifier-Normalizer"></a>
  
  ### Description
  A transform pass to normalize the variable names across the codebase.\
  It doesn't attempt to figure out what the variable is being used for, it just 'corrects' the name.\
  It does, however, safely check to see if the variable name will overlap with any variables in the current scope
  
  ### Default Settings
  |Setting|Default|What its for|
  |----|----|----|
  |IndentLevel|2|Indented spacing (measured in 4 spaces)|
  |LogLevel|DEBUG|Log level cut off|
  |LengthCutoff|4|Minimum length for identifier change|
  |Variables|camelCase|Naming convention for Variables|
  |Functions|camelCase|Naming convention for Functions|
  |Classes|PascalCase|Naming convention for Classes|

  ### Available types
  - camelCase
  - PascalCase
  - snake_case
  - SCREAM_SNAKE_CASE
  
</details>

## Logger
This project uses its own logger which I think is useful for this application.

Here's an example of the structure of the log message.
```
[Logger Name] [Log Level] [function() file line:column] message
```
Here is an example from this project.
```
[Pipeline] [DEBUG] [performPass() pipeline.js 21:13] Processing Identifier Normalizer
```

<details>
  <Summary>Details</Summary>
  
  The logger is initialized with the following:
  
  |Variable|Type|Required|default|
  |---|---|---|---|
  |Name|`String`|`true`|`undefined`|
  |Log Level|`Logger.logLevel`|`false`|`Logger.logLevel.DEBUG`|
  |Function names flag|`Boolean`|`false`|`true`|
  
  The name is just so you know what logger is making the log.\
  The level is for severity.\
  the function name flag is to prevent logs like the following:
  ```
  [Identifier Normalizer] [DEBUG] [VariableDeclarator|FunctionDeclaration|ClassDeclaration() identifierNormalizer.js 112:26] Replacing (PascalCase1) with (pascalCase1)
  ```
  which should become the following when its set to true.
  ```
  [Identifier Normalizer] [DEBUG] [identifierNormalizer.js 112:26] Replacing (PascalCase1) with (pascalCase1)
  ```
  Here's an example of the logger
  ```JavaScript
  import { Logger } from "./logger.js";
  const log = new Logger("Logger Example", Logger.logLevel.VERBOSE);
  log.verbose("This is verbose at the default log level (console.log)");
  log.debug("This is debug at the debug log level (console.debug)");
  log.warn("This is a warning, at the warn log level (console.warn)");
  log.error("This is an error, at the error log level (console.error)");
  /* output
  [Logger Example] [VERBOSE] [showcase.js 3:5] This is verbose at the default log level (console.log)
  [Logger Example] [DEBUG] [showcase.js 4:5] This is debug at the debug log level (console.debug)
  [Logger Example] [WARN] [showcase.js 5:5] This is a warning, at the warn log level (console.warn)
  [Logger Example] [ERROR] [showcase.js 6:5] This is an error, at the error log level (console.error)
  */
  ```
  If you decrease the log level of the logger, it simply wont show those log messages
  ```JavaScript
  ...
  const log = new Logger("Logger Example", Logger.logLevel.WARN);
  ...
  /* output
  [Logger Example] [WARN] [showcase.js 5:5] This is a warning, at the warn log level (console.warn)
  [Logger Example] [ERROR] [showcase.js 6:5] This is an error, at the error log level (console.error)
  */
  ```
</details>
