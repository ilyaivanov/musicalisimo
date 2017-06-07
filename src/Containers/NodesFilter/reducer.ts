export default function reducer(term: string = '', action: any) {
  if (action.type === 'add_to_filter') {
    return term + action.letter;
  }
  if (action.type === 'dismiss_filter') {
    return '';
  }
  return term;
}