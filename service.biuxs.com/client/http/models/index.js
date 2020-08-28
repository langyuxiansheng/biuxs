import system from './system';
import common from './common';
import website from './website';
import books from './books';
import crawlers from './crawlers';
export default {
    ...system,
    ...common,
    ...website,
    ...books,
    ...crawlers
};
