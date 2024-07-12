const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function createDirectory(dirPath) {
  try {
    await fs.promises.mkdir(dirPath, { recursive: true });
    console.log(`Directory created: ${dirPath}`);
  } catch (error) {
    console.error(`Error creating directory: ${dirPath}`, error);
  }
}

async function createFile(filePath, content) {
  try {
    await fs.promises.writeFile(filePath, content, 'utf8');
    console.log(`File created: ${filePath}`);
  } catch (error) {
    console.error(`Error creating file: ${filePath}`, error);
  }
}

async function generateFiles() {
  const basePath = './lib';
  const domainPath = path.join(basePath, 'domain');
  const infrastructurePath = path.join(basePath, 'infrastructure');

  await createDirectory(domainPath);
  await createDirectory(infrastructurePath);

  const useCaseName = await askQuestion('Enter the name of the use case: ');
  const modelName = await askQuestion('Enter the name of the model: ');

  const useCasePath = path.join(domainPath, 'usecases', useCaseName);
  await createDirectory(useCasePath);

  const useCaseFile = path.join(useCasePath, `${useCaseName}.usecase.ts`);
  const useCaseContent = `import { Injectable } from '@angular/core';
import { IBaseUsecase } from '@bancolombia/core-utils-widgets-web';
import { Observable } from 'rxjs';
import { ${modelName}Gateway } from '../../models/${modelName}/${modelName}.gateway';

@Injectable()
export class ${useCaseName}UseCase implements IBaseUsecase<any> {
  constructor(private ${modelName.toLowerCase()}Gateway: ${modelName}Gateway) { }

  invoke(data: any): Observable<any> {
    // Implement the use case logic here
    // Use the ${modelName}Gateway to interact with the infrastructure layer
    // Return an observable with the result
  }
}
`;
  await createFile(useCaseFile, useCaseContent);

  const useCaseTestFile = path.join(useCasePath, `${useCaseName}.usecase.spec.ts`);
  const useCaseTestContent = `import { TestBed } from '@angular/core/testing';
import { ${useCaseName}UseCase } from './${useCaseName}.usecase';
import { ${modelName}Gateway } from '../../models/${modelName}/${modelName}.gateway';

describe('${useCaseName}UseCase', () => {
  let useCase: ${useCaseName}UseCase;
  let ${modelName.toLowerCase()}Gateway: jasmine.SpyObj<${modelName}Gateway>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('${modelName}Gateway', ['methodName']);

    TestBed.configureTestingModule({
      providers: [
        ${useCaseName}UseCase,
        { provide: ${modelName}Gateway, useValue: spy }
      ]
    });

    useCase = TestBed.inject(${useCaseName}UseCase);
    ${modelName.toLowerCase()}Gateway = TestBed.inject(${modelName}Gateway) as jasmine.SpyObj<${modelName}Gateway>;
  });

  it('should be created', () => {
    expect(useCase).toBeTruthy();
  });

  // Add more test cases for the use case
});
`;
  await createFile(useCaseTestFile, useCaseTestContent);

  const modelPath = path.join(domainPath, 'models', modelName);
  await createDirectory(modelPath);

  const modelFile = path.join(modelPath, `${modelName}.model.ts`);
  const modelContent = `export interface ${modelName} {
  // Define the properties of the model here
}
`;
  await createFile(modelFile, modelContent);

  const gatewayFile = path.join(modelPath, `${modelName}.gateway.ts`);
  const gatewayContent = `import { BaseService } from '@bancolombia/core-utils-widgets-web';
import { Observable } from 'rxjs';

export abstract class ${modelName}Gateway extends BaseService {
  // Define the abstract methods for the gateway here
  // These methods will be implemented in the infrastructure layer
}
`;
  await createFile(gatewayFile, gatewayContent);

  const serviceBasePath = path.join(infrastructurePath, 'driven-adapter', modelName.toLowerCase());
  await createDirectory(serviceBasePath);

  const serviceConfigFile = path.join(serviceBasePath, `${modelName.toLowerCase()}.service.configuration.ts`);
  const serviceConfigContent = `export const ${modelName.toUpperCase()}_SERVICE_ENDPOINTS: string[] = [
  // Define the endpoints for the service here
];

export enum ${modelName}ServiceEntries {
  // Define the service entries here
}

export type ${modelName}ServiceEndpointsConfig = {
  [entry in ${modelName}ServiceEntries]: string;
};
`;
  await createFile(serviceConfigFile, serviceConfigContent);

  const serviceFile = path.join(serviceBasePath, `${modelName.toLowerCase()}.service.ts`);
  const serviceContent = `import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { HTTP_METHODS, IEndpointsModel, Identifier } from '@bancolombia/core-utils-widgets-web';
import { Observable } from 'rxjs';
import { ENDPOINTS_CONFIG } from '../../../filterable-table-widget.configuration';
import { ${modelName}Gateway } from '../../../domain/models/${modelName.toLowerCase()}/${modelName.toLowerCase()}.gateway';
import { ${modelName}Mapper } from '../../mappers/${modelName.toLowerCase()}/${modelName.toLowerCase()}.mapper';
import { ${modelName}ServiceEntries } from './${modelName.toLowerCase()}.service.configuration';

@Injectable()
@Identifier('${modelName}Service')
export class ${modelName}Service extends ${modelName}Gateway {
  constructor(
    public override http: HttpClient,
    @Inject(ENDPOINTS_CONFIG) private endpoints: IEndpointsModel,
    private ${modelName.toLowerCase()}Mapper: ${modelName}Mapper,
  ) {
    super(http);
  }

  // Implement the methods defined in the ${modelName}Gateway here
  // Use the ${modelName}Mapper to map the data from the API to the domain model
}
`;
  await createFile(serviceFile, serviceContent);

  const mapperPath = path.join(infrastructurePath, 'mappers', modelName.toLowerCase());
  await createDirectory(mapperPath);

  const mapperFile = path.join(mapperPath, `${modelName.toLowerCase()}.mapper.ts`);
  const mapperContent = `import { Injectable } from '@angular/core';
import { IBaseMapper, PropertyNotDefined } from '@bancolombia/core-utils-widgets-web';

@Injectable()
export class ${modelName}Mapper implements IBaseMapper<any> {
  fromMap(obj: any): any {
    try {
      // Implement the mapping logic here
      // Map the data from the API to the domain model
    } catch (error) {
      if (error instanceof PropertyNotDefined) {
        throw error;
      }
    }
    return null;
  }
}
`;
  await createFile(mapperFile, mapperContent);

  console.log('Files generated successfully!');
}

generateFiles().then(() => {
  rl.close();
}).catch((error) => {
  console.error('Error generating files:', error);
  rl.close();
});