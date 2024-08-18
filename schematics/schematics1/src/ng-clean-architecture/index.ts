import { strings } from '@angular-devkit/core';
import { Rule, SchematicContext, Tree, apply, mergeWith, move, template, url } from '@angular-devkit/schematics';
import { Schema as MySchema } from './schema';

export function ngCleanArchitecture(options: MySchema): Rule {
  return (tree: Tree, _context: SchematicContext) => {
    const sourceTemplates = url('./files');
    const sourceParametrizedTemplates = apply(sourceTemplates, [
      template({
        ...options,
        ...strings,
      }),
      move(options.path),
    ]);

    return mergeWith(sourceParametrizedTemplates)(tree, _context);
  };
}
