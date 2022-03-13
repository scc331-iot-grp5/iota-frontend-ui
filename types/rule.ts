import { Sensors } from './device';

export type EventDefinition =
  | { type: 'reportIncident'; severity: number }
  | { type: 'triggerAlert' }
  | { type: 'sendMessage'; message: string };

export const Comparators = [
  'equals',
  'lessThan',
  'greaterThan',
  'lessThanEqual',
  'greaterThanEqual',
  'in',
] as const;

export const ComparatorSymbols: Record<typeof Comparators[number], string> = {
  equals: '==',
  lessThan: '<',
  greaterThan: '>',
  lessThanEqual: '<=',
  greaterThanEqual: '>=',
  in: 'in',
} as const;

export type Condition = {
  /** Which microbit sensor to read */
  fact: typeof Sensors[number];

  /** What's being compared against */
  value: string;

  /** how to compare the value */
  operator: typeof Comparators[number];
} & (
  | {
      /** ID of the Microbit Type this rule affects */
      microbitGroup: number;
      microbitID?: never;
    }
  | {
      /** ID of the Microbit this rule affects */
      microbitID: number;
      microbitGroup?: never;
    }
  | { microbitID?: never; microbitGroup?: never }
);

export interface Body {
  /**
   * Zone Id
   */
  zone?: number;

  conditions: Condition[];
  events: EventDefinition[];
}

export interface Rule {
  id: number;
  name: string;

  created_by: number;
  body: Body;
}

export interface Event {
  id: number;
  created_at: string; // ISO8601
  rule: number; // Refers to rule by ID
  severity: number;

  involves: { device_id: number; reading_id: number }[]; // List of microbits by ID
}
