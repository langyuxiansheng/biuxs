<template>
    <div class="app-my-bookmark">
        <div class="bookmark-header">
            <span class="add-folder" @click="showDialog ({ type:'addFolder' })">
                <i class="iconfont iconwenjianjiaicon" title="添加分类" />
                添加分类
            </span>
            <span class="add-link" @click="showDialog ({ type:'addBookmark' })">
                <i class="iconfont iconxinjianbiaoqian" title="添加书签" />
                添加书签
            </span>
        </div>
        <div class="bookmarks-tabs">
            <ul class="tabs">
                <draggable v-if="folders && folders.length" v-model="folders" @change="handleDraggableFolderChange">
                    <template v-for="item in folders">
                        <li :key="item.folderId" title="可拖拽排序" :class="{'tab-active':tab && tab.folderId == item.folderId}" @click="handleTabClick(item)">
                            <span class="tab-title">{{ item.name }}</span>
                            <div class="btns">
                                <i class="iconfont iconbianji" title="编辑" @click="showDialog ({ type:'updateFolder', data:item })" />
                                <i class="iconfont iconshanchu" title="删除" @click="handleFolderDel(item)" />
                            </div>
                        </li>
                    </template>
                </draggable>
                <div v-else class="tabs-nodata">
                    <span>您暂无分类数据</span>
                </div>
            </ul>
            <div class="bookmarks-content">
                <ul v-if="foldeLinks && foldeLinks.length" class="app-links app-flex">
                    <draggable v-model="foldeLinks" @change="handleDraggableBookmarkLinkChange">
                        <template v-for="(item,k) in foldeLinks">
                            <li :key="k" class="link" title="可拖拽排序" @mouseleave="handleHover(item,0)">
                                <a :href="item.url" target="_blink" :title="item.title" rel="nofollow">
                                    <img v-if="item.logo" class="link-img-icon" :src="item.logo" :alt="item.title">
                                    <img v-else class="link-img-icon" :src="require('@/assets/images/link-default.png')" :alt="item.title">
                                    <span class="link-label">{{ item.title }}</span>
                                </a>
                                <span class="link-fill" @mouseenter="handleHover(item,1)">
                                    <i class="iconfont iconarrLeft-fill" :class="{'is-transform':hoverItem && hoverItem.item.bookmarkId == item.bookmarkId && hoverItem.T}" />
                                </span>
                                <ul v-show="hoverItem && hoverItem.item.bookmarkId == item.bookmarkId && hoverItem.T" class="select-ul">
                                    <li @click="showDialog ({ type:'updateBookmark',data:item })">
                                        <span>编辑</span>
                                        <i class="iconfont iconbianji" title="编辑" />
                                    </li>
                                    <li @click="handleBookmarkDel(item)">
                                        <span>删除</span>
                                        <i class="iconfont iconshanchu" title="删除" @click="handleDel(items)" />
                                    </li>
                                </ul>
                            </li>
                        </template>
                    </draggable>
                </ul>
                <div v-else class="tips-nodata">
                    <div>
                        <i class="iconfont iconwushuju" />
                        <p>您此分类下暂无书签</p>
                    </div>
                </div>
            </div>
        </div>
        <folder-form ref="FolderForm" @refresh="refresh" />
        <bookmark-form ref="BookmarkForm" @refresh="getFolderLink" />
    </div>
</template>
<script>
import draggable from 'vuedraggable';
import { getUserBookmarkFolders, delUserBookmarkFolderByIds, getUserFolderBookmarkLinks, delUserBookmarkLinkByIds, userSortBookmarkFolder, userSortBookmarkLink } from '@/http';
import FolderForm from './FolderForm';
import BookmarkForm from './BookmarkForm';
export default {
    name: 'MyBookmark',
    components: { FolderForm, BookmarkForm, draggable },
    data() {
        return {
            tab: null,
            hoverItem: null,
            folders: [],
            foldeLinks: []
        };
    },
    created() {
        this.init(1);
    },
    methods: {

        async init(T) {
            try {
                const { code, data } = await this.$axios[getUserBookmarkFolders.method](getUserBookmarkFolders.url);
                if (code == 200) {
                    this.folders = data || [];
                    if (T && this.folders.length) {
                        this.handleTabClick(this.folders.length && this.folders[0]);
                    }
                }
            } catch (error) {
                console.error(`初始化出错:`, error);
            }
        },

        /**
         * 获取文件夹下的链接
         */
        async getFolderLink({ folderId }) {
            try {
                const { code, data } = await this.$axios[getUserFolderBookmarkLinks.method](getUserFolderBookmarkLinks.url, {
                    params: { folderId }
                });
                if (code == 200) {
                    this.foldeLinks = data || [];
                }
            } catch (error) {
                console.error(`初始化出错:`, error);
            }
        },

        /**
	     * 弹出层控制
	     */
        showDialog ({ type, data }) {
            switch (type) {
            case 'addFolder':
                this.$refs.FolderForm.init({ type, title: '添加分类' }); break;
            case 'updateFolder':
                this.$refs.FolderForm.init({ type, title: '编辑分类', data }); break;
            case 'addBookmark':
                this.$refs.BookmarkForm.init({ type, title: '添加书签链接', folders: this.folders, tab: this.tab }); break;
            case 'updateBookmark':
                this.$refs.BookmarkForm.init({ type, title: '编辑书签链接', folders: this.folders, data }); break;
            }
        },

        /**
         * 删除文件夹
         */
        handleFolderDel({ name, folderId }) {
            this.$dialog.confirm({
                title: this.$biuxs.DIALOG_CONFIRM_TITLE,
                body: `您确定要删除【${name}】吗?`
            }).then(async(dialog) => {
                dialog.loading(true);
                const { code } = await this.$axios[delUserBookmarkFolderByIds.method](delUserBookmarkFolderByIds.url, {
                    data: { ids: [folderId], isDelete: true }
                });
                if (code == 200) {
                    this.$message.success('删除成功');
                    dialog.close();
                    this.init();
                }
                dialog.loading(false);
            }).catch(() => { });
        },

        /**
         * 删除书签
         */
        handleBookmarkDel({ title, folderId, bookmarkId }) {
            this.$dialog.confirm({
                title: this.$biuxs.DIALOG_CONFIRM_TITLE,
                body: `您确定要删除【${title}】吗?`
            }).then(async(dialog) => {
                dialog.loading(true);
                const { code } = await this.$axios[delUserBookmarkLinkByIds.method](delUserBookmarkLinkByIds.url, {
                    data: { ids: [bookmarkId], isDelete: true }
                });
                if (code == 200) {
                    this.$message.success('删除成功');
                    dialog.close();
                    this.getFolderLink({ folderId });
                }
                dialog.loading(false);
            }).catch(() => { });
        },

        /**
         * 标签页切换
         */
        handleTabClick(item) {
            this.tab = item;
            this.getFolderLink(item);
        },

        /**
         * 处理hover
         */
        handleHover(item, T) {
            this.hoverItem = { item, T };
        },

        /**
         * 刷新回调
         */
        refresh() {
            this.init();
        },

        /**
         * 文件夹拖拽排序
         */
        async handleDraggableFolderChange(e) {
            try {
                const list = this.folders;
                const sorts = list.map(({ name, userId, folderId, sort }, index) => {
                    sort = index + 1;
                    return { name, userId, folderId, sort };
                });
                const { code } = await this.$axios[userSortBookmarkFolder.method](userSortBookmarkFolder.url, { sorts });
                if (code == 200) {
                    this.$message.success('排序成功');
                    this.init();
                }
            } catch (error) {
                console.log(`文件夹拖拽排序出错:`, error);
            }
        },

        /**
         * 书签拖拽排序
         */
        async handleDraggableBookmarkLinkChange(e) {
            try {
                const list = this.foldeLinks;
                const sorts = list.map(({ name, userId, folderId, bookmarkId, sort }, index) => {
                    sort = index + 1;
                    return { name, userId, folderId, bookmarkId, sort };
                });
                const { code } = await this.$axios[userSortBookmarkLink.method](userSortBookmarkLink.url, { sorts });
                if (code == 200) {
                    this.$message.success('排序成功');
                    this.init();
                }
            } catch (error) {
                console.log(`文件夹拖拽排序出错:`, error);
            }
        },

        /**
         * 处理文件夹的操作
         */
        handleFolder() {
            this.$dialog.prompt({
                title: '添加分类'
            }, {
                customClass: 'app-dg-input-container',
                placeholder: '请输入分类名称'
            }).then(async(dialog) => {
                console.log(dialog.data);
                if (dialog.data) {
                    // const { code } = await this.$axios[userAddBookmarkFolder.method](userAddBookmarkFolder.url, {});
                    // if (code == 200) {
                    //     this.user = null;
                    //     this.$message.success('创建成功');
                    //     dialog.close();
                    // }
                }
            }).catch(() => {
                // Triggered when dialog is dismissed by user
                console.log('Prompt dismissed');
            });
        }
    }
};
</script>

<style lang="less" scoped>
@import url('~@/assets/styles/common/constant');
.app-my-bookmark{
    .bookmark-header{
        padding: 10px;
        background: #dcf6ff;
        margin-bottom: 10px;
        border-radius: 4px;
        .add-folder,
        .add-link{
            margin-right: 20px;
            cursor: pointer;
            transition: color .2s ease-in;
            &:hover{
                color: @app-theme-color;
            }
        }
    }
    .bookmarks-tabs{
        display: flex;
        min-height: 500px;
        .tabs-nodata{
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: @app-theme-color;
        }
        .tabs{
            margin: 0;
            min-width: 200px;
            background: #fbfbfb;
            div{
                padding: 10px;
                li{
                    padding: 14px 20px;
                    transition: all .2s ease-in;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 44px;
                    border-radius: 4px;
                    .tab-title{
                        flex: 1;
                    }
                    .btns{
                        display: none;
                        align-items: center;
                        justify-content: center;
                        padding: 0;
                        .iconfont{
                            margin: 0 6px;
                            transition: color .2s ease-in;
                            &:hover{
                                color: #f00;
                            }
                        }
                    }
                    &:hover .btns{
                        display: flex;
                    }
                }
                .tab-active{
                    color:#fff;
                    background-color: @app-theme-color;
                }
            }
        }
        .bookmarks-content{
            margin-left: 10px;
            flex: 1;
            background: #fbfbfb;
            padding: 10px;
            .tips-nodata{
                height: 100%;
                font-size: 16px;
                color: @app-theme-color;
                display: flex;
                align-items: center;
                justify-content: center;
                text-align: center;
                .iconfont{
                    font-size: 84px;
                }
                p{
                    margin-top: 20px;

                }
            }
            .app-links{
                div{
                    width: 100%;
                    display: flex;
                    align-items: center;
                }
                .link{
                    min-width: calc(100% / 6);
                }
            }
        }
    }
}
</style>
