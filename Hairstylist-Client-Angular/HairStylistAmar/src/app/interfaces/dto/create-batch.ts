import { Batch } from '../Batch';

export type CreateBatchDto =
  Omit<Batch, 'batchId'>;
