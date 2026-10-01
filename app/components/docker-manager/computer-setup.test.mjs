import assert from 'node:assert/strict';
import {test} from 'node:test';
import {setupChoices,localSetupSteps} from './computer-setup.js';

test('new guided setup does not inherit file or command defaults',()=> {
  const choices=setupChoices({configured:false,scopes:{files:true,file_write:true,code_execution:true}});
  assert.deepEqual(choices,{browser:false,computer_use:false,files:false,file_write:false,code_execution:false});
});
test('existing permissions are preserved independently',()=> {
  assert.deepEqual(setupChoices({configured:true,scopes:{files:true,file_write:false,browser:true}}),
    {browser:true,computer_use:false,files:true,file_write:false,code_execution:false});
});
test('saved access never masquerades as runtime readiness',()=> {
  const steps=localSetupSteps({hostAccess:{connected:true,config:{configured:true,masterEnabled:false,scopes:{browser:true}},gateway:{status:{browser:{status:'ready'}}}}});
  assert.equal(steps[1].state,'action_on_computer');
  assert.equal(steps[1].action,'choose_access');
});
