# Buildless

Sample AWS CDK and github action to demonstrate efficient CICD.

[![CI](https://github.com/harshit9715/cdk-dns-api-hello/actions/workflows/CICD.yml/badge.svg)](https://github.com/harshit9715/cdk-dns-api-hello/actions/workflows/CICD.yml)

### Features

- Upload and Download build artifact.
- Muliple data caching (caching 2 sets of node_modules, for backend and frontend).
- Build once and deploy multiple times.
- Infrastructure as Code with AWS CDK.

## Usage for local testing CDK project

Create a new file in the root dir called .env and populate it with the contents of sample env.
```bash

npm i
cdk bootstrap
cdk deploy

```

## Buildless

It simply means build less. Instead of building the UI code separately for each deployment. Build it once with placeholders.
Replace those placeholders with sed and deploy to dev,stage and prod!

### Show me the sed command
```
find . -type f -exec grep -Iq . {} \; -exec sed -i 's/BUILD_STAGE_PH/dev/g' {} +
```

### See it in action.

Raise a PR to main with the change in workflows file ([CICD.yml](./.github/workflows/CICD.yml))
Either change the stage on stage or name (i.e., line 151 or 152) as

```bash
find . -type f -exec grep -Iq . {} \; -exec sed -i 's/BUILD_NAME_PH/<YOUR_NAME_HERE>/g' {} +
```
or
```bash
find . -type f -exec grep -Iq . {} \; -exec sed -i 's/BUILD_STAGE_PH/<ANYTHING_HERE>/g' {} +
```

#### Here are the website URLs

- [Dev](http://build-with-sed-dev.s3-website.ap-south-1.amazonaws.com/)
- [Stage](http://build-with-sed-stg.s3-website.ap-south-1.amazonaws.com/)
- [Prod](http://build-with-sed-prod.s3-website.ap-south-1.amazonaws.com/)

#### Warning

Do not uncomment `cdk deploy`. Repo secrets have read only AWS access. (For security reasons)
