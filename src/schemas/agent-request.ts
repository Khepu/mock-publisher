import { from, map, range, reduce, tap } from 'rxjs';
import { v4 } from 'uuid';
import { randomFloat, randomNum, randomString } from '../utils/helpers';
import {
  CustomValueType,
  GeneratedValue,
  GeneratedValueArray,
  Schema,
} from '../utils/util-types';

export const agentRequestSchema: Schema = {
  id: { type: CustomValueType.UUID },
  createdAt: { type: CustomValueType.TIMESTAMP },
  visionResponse: { type: CustomValueType.UUID, value: 'carla1he' },
  numAr: {
    type: 'array',
    of: CustomValueType.INT,
    dimensions: 2,
    lengths: [2, 3],
  },
  predeterminedValue: { type: CustomValueType.INT, value: 123 },
};
