import { loadStripe } from '@stripe/stripe-js';

export default defineNuxtPlugin(nuxtApp => {
  const stripe = loadStripe('pk_test_51Of7npG9ShixL1TJk1jmLIKLcp1PO8aNhNfcjEsGn3XIdXlARd6ty3t4HYJDC66KGljPAUlphT0Whghe9rmgJXK700YPE7Fi9u');
  nuxtApp.provide('stripe', stripe);
});