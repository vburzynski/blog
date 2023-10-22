# Migrate to Typescript

- https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/#migrating-to-typescript

```shell
# Install Dependencies
npm i --save-dev @types/node @types/react @types/react-dom typescript 

# Rename gatsby-*.js to gatsby-*.ts
# did this manually

# Rename JSX to TSX
find ./src -name "*.jsx" -exec rename 's/\.jsx$/.tsx/' '{}' +
```
