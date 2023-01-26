<h1 align="center" style="color:#1b4c17">
  <img src="./assets/sarif-codeclimate.png" width="200">
  <br>
  <br>
  Sarif-<span style="color:#ffb72e">CodeClimate</span> 
</h1>

This project aims to convert a SARIF output file from a linter to a CodeClimate output file.
It could be use inside GitLab to display to the user the result of the linter inside the MR.
It was first created to be used in the [`mega_linter`](https://r2devops.io/_/r2devops-bot/mega_linter) job hosted on [r2devops.io](r2devops.io).

## Installation

```bash
# npm
npm i -g sarif-codeclimate@latest

# yarn 
yarn global add sarif-codeclimate@latest

```
*You can update latest tag by a specific version tag*

## Usage

You can use this tool in two ways:

### 1. Using the CLI



```bash
sarif-codeclimate --input <path to sarif file> --output <path to codeclimate file>
```
*👉 You can also use the short version of the arguments `-i` and `-o`*.
Output file is optional, if you don't specify it, the output will be printed in the console.


### 2. Importing the module in your code

Here is an example of how to read a SARIF file and convert it to a CodeClimate file:


```javascript
const { convert } = require('sarif-codeclimate/out/lib/converter');
const fs = require('fs');
const {
  parseResult: {
    data,
  }
} = convert("megalinter-report.sarif");
fs.writeFileSync('codeclimate-result.json', JSON.stringify(data, null, 4));


```

## Contributing

Are you missing something or want to contribute? Feel free to open an [issue](https://github.com/GridexX/sarif-codeclimate/issues) or create a [pull request](https://github.com/GridexX/sarif-codeclimate/pulls)

## License
MIT 

## Author
GridexX, a french DevOps working for [R2DevOps](https://r2devops.io), with help of [nvuillam](https://github.com/nvuillam/nvuillam).