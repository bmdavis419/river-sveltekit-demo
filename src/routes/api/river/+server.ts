import { riverEndpointHandler } from '@davis7dotsh/river-adapter-sveltekit';
import { myRiverRouter } from '$lib/river/router';

export const { GET, POST } = riverEndpointHandler(myRiverRouter);
