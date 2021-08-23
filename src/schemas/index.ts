import { CustomValueType, Schema } from '../types';

const schema1: Schema = {
  id: { type: CustomValueType.UUID },
  createdAt: { type: CustomValueType.TIMESTAMP },
  visionResponse: { type: CustomValueType.UUID, value: 'carla1he' },
  numAr: {
    type: 'array',
    of: CustomValueType.INT,
    dimensions: 4,
    lengths: [3, 2, 2, 2],
  },
  predeterminedValue: { type: CustomValueType.INT, value: 123 },
};

const schema2: Schema = {
  id: { type: CustomValueType.UUID },
  createdAt: { type: CustomValueType.TIMESTAMP },
  visionResponse: { type: CustomValueType.UUID },
};

export const schemas: { [key: string]: Schema } = {
  schema1,
  schema2,
};
