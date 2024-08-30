# Vite + React + TypeScript Project

This project is a starter template using [Vite](https://vitejs.dev/), [React](https://reactjs.org/), and [TypeScript](https://www.typescriptlang.org/) with [pnpm](https://pnpm.io/).

## Preview Link
If you can't run the deployment server locally, you can access the project through this preview link, [Preview Link](https://wayanpande.github.io/jobseeker-todo-list/).

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Install Node.js from [nodejs.org](https://nodejs.org/en/download/)
- **pnpm**: Install pnpm globally by running the following command:
  ```bash
  npm install -g pnpm
  ```

## Installation
  1. Clone this repository to your local machine:
  ```bash
  git clone https://github.com/WayanPande/jobseeker-todo-list.git
  cd jobseeker-todo-list
  ```
  2. Install dependencies using pnpm:
   ```bash
   pnpm install
  ```

## Running the Project Locally
To start the development server, run the following command:
```bash
pnpm dev
```
This will launch the Vite development server and your project will be available at [http://localhost:5173](http://localhost:5173) by default.

## Building the Project
To create a production build, use the following command:
```bash
pnpm build
```

And you will see the generated file in `dist` that ready to be served.

## Previewing the Build
To preview the build locally, use the following command after building:
```bash
pnpm serve
```

This will start a local server to preview the production build at [http://localhost:4173](http://localhost:4173).

