import React from 'react';
import RequestForm from '../src/Forms/RequestForm';
import { render, fireEvent, waitForElement} from 'react-testing-library';
const domTestingLib = require('dom-testing-library')
const { queries } = domTestingLib
import * as customQueries from '../src/utils/test-utils'

const mockResponse = (data, status = 200) => jest.fn().mockReturnValue(
  Promise.resolve({
    status: status,
    json: () => Promise.resolve(data)
  })
)
global.fetch = mockResponse();

it('Renders form and submit term', async () => {
  // Arrange
  const defQueries = customQueries.default
  const { getByText, getByTestId } = render(<RequestForm />,
    { queries: { ...queries, ...defQueries }, })
  const form = getByTestId('request-form')
  const input = getByTestId('request-input')
  const button = getByText(/Submit/)

  // Act
  fireEvent.submit(form)

  // Assert
  expect(input.value).toBe('')
  expect(button.innerHTML).toBe('Submit')
  await waitForElement(() => getByText(/This is a required question/));
  expect(getByText(/This is a required question/).textContent).toBe('This is a required question')

  // Act
  fireEvent.change(input, {target: {value: 'Queer'}})

  // Assert
  expect(input.value).toBe('Queer')

  // Act
   await fireEvent.submit(form)
  
   // Assert
  expect(fetch).toHaveBeenCalledWith('/requested/Queer', {
    method: 'POST',
  });
  // Arrange
  const snackbar = await waitForElement(() => getByText(/Your request for Queer was successful/).parentElement)
  const dismissBttn = snackbar.querySelector('button')
  expect(dismissBttn.innerHTML).toBe('Dismiss')

  fireEvent.click(dismissBttn)

  // Act
  try {
    await waitForElement(() => getByText(/Your request for Queer was successful/))
  } catch (e) {
    expect(e.message).toBe('Unable to find the element')
  }
});
