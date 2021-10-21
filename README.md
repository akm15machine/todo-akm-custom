# todo-akm-custom

This is a express-node based To-Do backend application with its own unique set of features

# TODO

1. Date time updatation with note create/update basis
2. Middlewares
3. JSON Web Tokens
4. Security and speed optimisation
5. Accompanying frontend

# Prerequisites

- VS Code installed (I don't like you if you don't use VS Code already)
- NVM installed and (for windows users) added to global path (normal nvm installation should add it to path automatically)

```
nvm list
```

if you already have node version 16+ then you are good to go, else

```
nvm install latest
```

or

```
nvm install 16.11.1
```

(that was the latest version when I updated this section)

# Instructions

Open a terminal in this ( .) folder and write the commands

```
npm i
code .
```

- Make a cluster in Mongo DB
- Navigate to your Cluster Overview page
- Note the URI (looking like `mongodb+srv://<username>:<password>...` from `Connect > Connect to Application`
- Make a `.env` file in this ( .) directory locally
- Add these variables to the `.env`

```
PORT =
MONGO_URI =
```

## Usage and Licensing

This is just a personal project, commercial usage is disallowed.
