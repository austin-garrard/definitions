import React from 'react';
import 'jest-dom/extend-expect'
import RequestForm from '../src/Forms/RequestForm';
import { render, fireEvent, waitForElement} from 'react-testing-library';

const mockResponse = (data, status = 200) => jest.fn().mockReturnValue(
  Promise.resolve({
    status: status,
    json: () => Promise.resolve(data)
  })
)
global.fetch = mockResponse();

it('Renders form and submit term', async () => {
  // Arrange
  const { getByText, getByTestId, queryByText } = render(<RequestForm />)
  const requestForm = getByTestId('request-form')
  const inputTerm = getByTestId('request-input')
  const submitButton = getByText(/Submit/)
  // Act
  fireEvent.submit(requestForm)

  // Assert
  const inputError = await waitForElement(() => getByText(/This is a required question/));
  expect(inputError).toBeVisible()
  expect(inputError).toHaveClass('errorMessage')
  expect(inputTerm.value).toBe('')
  expect(submitButton).toBeVisible()

  // Act
  fireEvent.change(inputTerm, {target: {value: 'Queer'}})

  // Assert
  expect(inputTerm.value).toBe('Queer')

  // Act
   await fireEvent.submit(requestForm)
  
   // Assert
  expect(fetch).toHaveBeenCalledWith('/requested/Queer', {
    method: 'POST',
  });
  expect(inputTerm.value).toBe('')

  // Arrange
  const snackbar = await waitForElement(() => getByText(/Your request for Queer was successful/).parentElement)
  expect(snackbar).toBeVisible()
  expect(snackbar).toHaveClass('queerSnackbar')
  const snackbarDismissBttn = snackbar.querySelector('button')
  expect(snackbarDismissBttn.innerHTML).toBe('Dismiss')

  // Act
  fireEvent.click(snackbarDismissBttn)

  // Assert
  expect(queryByText(/Your request for Queer was successful/)).not.toBeInTheDocument()
});
