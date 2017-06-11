import * as Immutable from 'immutable';

interface PersonParams {
  firstName: string;
  lastName: string;
}

function Record<T>(props: T) {
  return Immutable.Record(props);
}

export class Person extends Record<PersonParams>({firstName: '', lastName: ''}) {
  constructor(props: PersonParams) {
    super(props);
  }

  with(values: Partial<PersonParams>) {
    return this.merge(values) as this;
  }
}

