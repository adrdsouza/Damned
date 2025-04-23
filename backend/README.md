# Damned Designs Backend

## Running the Server

There are two ways to run the server:

### 1. Using the Automated Build Script (Recommended)

Simply run the build script:

```bash
./build-and-start.sh
```

This script handles:
- Building the Medusa application
- Installing server dependencies
- Copying environment variables
- Setting production environment
- Starting the server

### 2. Manual Process

If you need to run the commands individually:

```bash
npm run build
cd .medusa/server && npm install
cp ../../.env .env.production
export NODE_ENV=production
npm run start
```

**Important**: Don't run with npx as it will delete images.

## System Requirements

- Node.js 20.x or later
- PostgreSQL database
## Compatibility

This starter is compatible with versions >= 2 of `@medusajs/medusa`. 

## Getting Started

Visit the [Quickstart Guide](https://docs.medusajs.com/learn/installation) to set up a server.

Visit the [Docs](https://docs.medusajs.com/learn/installation#get-started) to learn more about our system requirements.

## What is Medusa

Medusa is a set of commerce modules and tools that allow you to build rich, reliable, and performant commerce applications without reinventing core commerce logic. The modules can be customized and used to build advanced ecommerce stores, marketplaces, or any product that needs foundational commerce primitives. All modules are open-source and freely available on npm.

Learn more about [Medusa’s architecture](https://docs.medusajs.com/learn/introduction/architecture) and [commerce modules](https://docs.medusajs.com/learn/fundamentals/modules/commerce-modules) in the Docs.

## Community & Contributions

The community and core team are available in [GitHub Discussions](https://github.com/medusajs/medusa/discussions), where you can ask for support, discuss roadmap, and share ideas.

Join our [Discord server](https://discord.com/invite/medusajs) to meet other community members.

## Other channels

- [GitHub Issues](https://github.com/medusajs/medusa/issues)
- [Twitter](https://twitter.com/medusajs)
- [LinkedIn](https://www.linkedin.com/company/medusajs)
- [Medusa Blog](https://medusajs.com/blog/)
