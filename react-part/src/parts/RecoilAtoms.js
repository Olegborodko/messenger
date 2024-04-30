import { atom } from 'recoil';

export const stateAtoms = atom({
    key: 'cState',
    default: {
        transcriptionState: '',
        // key2: true,
        // key3: [],
    },
});