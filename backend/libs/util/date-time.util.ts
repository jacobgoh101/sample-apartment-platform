import { Duration } from 'luxon';

export class DATE_TIME {
  static Duration = Duration;

  static ONE_HOUR_IN_MILLISECONDS = Duration.fromObject({ hour: 1 }).as(
    'millisecond',
  );

  static ONE_DAY_IN_MILLISECONDS = Duration.fromObject({ day: 1 }).as(
    'millisecond',
  );
}
