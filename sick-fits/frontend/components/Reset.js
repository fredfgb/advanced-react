import React from 'react';
import { gql, useMutation } from '@apollo/client';
import Link from 'next/link';
import Form from './styles/Form';
import useForm from '../lib/useForm';
import { CURRENT_USER_QUERY } from './User';
import Error from './ErrorMessage';

const RESET_MUTATION = gql`
  mutation RESET_MUTATION(
    $email: String!
    $password: String!
    $token: String!
  ) {
    redeemUserPasswordResetToken(
      email: $email
      token: $token
      password: $password
    ) {
      code
      message
    }
  }
`;

export default function Reset({ token }) {
  const { inputs, handleChange, resetForm } = useForm({
    email: '',
    password: '',
    token,
  });
  const [reset, { data, loading, error }] = useMutation(RESET_MUTATION, {
    variables: inputs,
  });

  async function handleSubmit(e) {
    e.preventDefault();
    console.log(inputs);
    await reset().catch(console.error);
    resetForm();
    // send the email and password to the graphql
  }
  const succesfullError = data?.redeemUserPasswordResetToken?.code
    ? data?.redeemUserPasswordResetToken
    : undefined;
  return (
    <Form method="POST" onSubmit={handleSubmit}>
      <h2>Request your Password</h2>
      <Error error={error || succesfullError} />
      <fieldset disabled={loading} aria-busy={loading}>
        {data?.redeemUserPasswordResetToken === null ? (
          <p>
            Success! You can now <Link href="/signin">sign in!</Link>{' '}
          </p>
        ) : (
          <>
            <label htmlFor="email">
              Email
              <input
                type="email"
                name="email"
                placeholder="Your Email Address"
                autoComplete="email"
                value={inputs.email}
                onChange={handleChange}
              />
            </label>
            <label htmlFor="password">
              Password
              <input
                type="password"
                name="password"
                placeholder="Password"
                autoComplete="password"
                value={inputs.password}
                onChange={handleChange}
              />
            </label>
            <button type="submit">Request reset</button>
          </>
        )}
      </fieldset>
    </Form>
  );
}
