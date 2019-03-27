import React from 'react';
import renderer from "react-test-renderer";
import Form from './FormComponent';

test('termRequest?', () => {
  const component = renderer.create(<Form title="Request a Term" inputs={[{labelInput:'What term do you want defined?', isRequired:true}]} />);
  const jsonForm = component.toJSON();
  expect(jsonForm).toMatchSnapshot();
});