// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import { toMatchImageSnapshot } from "jest-image-snapshot";
import { server } from "./server";

expect.extend({ toMatchImageSnapshot });

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
