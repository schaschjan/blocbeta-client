import Dexie from 'dexie';

const db = new Dexie('blocbeta');
db.version(1)
    .stores({locations: '++id'})
    .stores({grades: '++id'})
    .stores({holdStyles: '++id'})
    .stores({walls: '++id'})
    .stores({tags: '++id'})
    .stores({setters: '++id'});

export default db;