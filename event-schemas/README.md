Path:

`event-schemas/domain/[be|cud]/event-name/version.json`

Base event:

```json5
{
  $schema: 'https://json-schema.org/draft/2019-09/schema',
  title: 'Auth.UserRoleChanged.v1',
  description: 'json schema for auth user role change event (version 1)',
  type: 'object',

  definitions: {
    eventData: {
      type: 'object',
      properties: {
        // Data
      },
      required: [],
    },
  },

  properties: {
    eventId: {
      type: 'string',
      format: 'uuid',
    },
    eventVersion: {
      type: 'number',
      enum: [1],
    },
    eventTime: {
      type: 'string',
      pattern: '^[0-9]+$',
    },
    eventName: {
      type: 'string',
    },
    producer: {
      type: 'string',
    },

    data: {
      $ref: '#/definitions/eventData',
    },
  },
  required: [
    'eventId',
    'eventVersion',
    'eventTime',
    'eventName',
    'producer',
    'data',
  ],
}
```
