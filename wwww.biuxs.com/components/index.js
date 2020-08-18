/**
 * 同一导出自定义的全局组件
 */

import PictureScroll from './PictureScroll';
import AppCardContainer from './AppCardContainer';
import AppSearch from './AppSearch';
import AppNavBar from './AppNavBar';
import AppFooter from './AppFooter';
import AppTopBar from './AppTopBar';
import AppDialog from './AppDialog';
import AppBreadcrumb from './AppBreadcrumb';
import AppForm from './AppForm';
export default {
    PictureScroll,
    AppCardContainer,
    AppSearch,
    AppNavBar,
    AppFooter,
    AppTopBar,
    AppDialog,
    AppBreadcrumb,
    ...AppForm
};
