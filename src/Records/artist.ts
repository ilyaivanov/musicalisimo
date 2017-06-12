import * as Immutable from 'immutable';
import {v4} from 'uuid';

interface Params {
  text: string;
  type: string;
  isHidden?: boolean;
}
interface PersonParams extends Params {
  id: string;
}

function Record<T>(props: T) {
  return Immutable.Record(props);
}

const defaultArtist: PersonParams = {text: '', type: '', id: '', isHidden: false};
export class MyNode extends Record<PersonParams>(defaultArtist) implements PersonParams {
  id: string;
  text: string;
  type: string;

  constructor(props: PersonParams) {
    super(props);
  }

  with(values: Partial<PersonParams>) {
    return this.merge(values) as this;
  }
}

export const createNode = (props: Params) => new MyNode({...props, id: v4()});