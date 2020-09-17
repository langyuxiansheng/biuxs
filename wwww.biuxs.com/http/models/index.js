import common from './common';
import website from './website';
import member from './member';
import crawlers from './crawlers';
import homeM from './home.m';
export default {
    ...common,
    ...website,
    ...member,
    ...crawlers,
    ...homeM
};
