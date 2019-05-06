import {HelloWorldService} from '../../src/services/hello-world.service';
import {ApiServer} from '../../src/server';
import {buildApiServer} from '../helper';

describe('Hello World service', () =>{

  let app: ApiServer;
  let service: HelloWorldService;
  beforeAll(() => {
    app = buildApiServer();

    service = app.get(HelloWorldService);
  });

  test('canary test verifies test infrastructure', () => {
    expect(service).not.toBeUndefined();
  });

  describe('Given greeting()', () => {
    describe('when "Juan" provided', () => {
      const name = 'Juan';
      test('then return "Hello, Juan!"', async () => {
        expect(await service.greeting(name)).toEqual(`Hello, ${name}!`);
      });
    });

    describe('when no name provided', () => {
      test('then return "Hello, World!"', async () => {
        expect(await service.greeting()).toEqual('Hello, World!');
      });
    })
  });

});
