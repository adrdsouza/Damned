import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv-flow';

dotenv.config({ silent: true });
const config: CodegenConfig = {
  schema: 'https://admin.damneddesigns.com/graphql',
  documents: ['graphql/**/*.graphql'],
  verbose: true,
  overwrite: true,
  generates: {
    'graphql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        namingConvention: 'keep',
      },
    },
  },
};
export default config;
