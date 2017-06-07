export const addLetterToSearch = (letter: string) =>
  ({type: 'add_to_filter', letter});


export const dismissSearch = () =>
  ({type: 'dismiss_filter'});

