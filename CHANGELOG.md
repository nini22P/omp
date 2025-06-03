## v1.9.4
### Changelog
* Release android PWA apk

### 更新日志
* 发布 android PWA apk


## v1.9.3
### ⚠ Warning
For self-deployed instances, please check [readme.md](https://github.com/nini22P/omp/blob/main/readme.md#running-and-build) before upgrading to add any missing environment variables: `ONEDRIVE_AUTH`, `ONEDRIVE_GME`

### ⚠ 警告
自行部署的在升级前请查看 [readme_cn.md](https://github.com/nini22P/omp/blob/main/readme_cn.md#运行和编译) 添加缺失的环境变量: `ONEDRIVE_AUTH`, `ONEDRIVE_GME`

### Changelog
* Support for VNET (self-deployment required, please refer to [readme.md](https://github.com/nini22P/omp/blob/main/readme.md#running-and-build)) @xiaoman1221
* Change title on playback
* Hide the option to refetch media metadata in the menu when playing a video

### 更新日志
* 支持世纪互联（需自行部署，具体请查看 [readme_cn.md](https://github.com/nini22P/omp/blob/main/readme_cn.md#运行和编译)）@xiaoman1221
* 播放时更改标题
* 播放视频时隐藏菜单中重新获取媒体元数据的选项


## v1.9.2
### Changelog
* Fixed playback control
* Improved album cover color extraction

### 更新日志
* 修复播放控制
* 改进专辑封面颜色提取


## v1.9.1
### Changelog
* Same time lyrics highlighting to support translated text
* Fixed the volume slider triggering swipe gestures

### 更新日志
* 相同时间的歌词高亮显示，以支持翻译文本
* 修复音量滑条触发滑动手势的问题


## v1.9.0
### Changelog
* Support for embedded lyrics in audio files
* Added button tooltips
* Added version display

### 更新日志
* 支持音频文件内嵌歌词
* 添加按钮提示
* 添加版本显示


## v1.8.1
### Changelog
* Added the ability to play multiple discs using the play all button
```
- Folder examples, starting with disc and disk, case insensitive
  - Disc1
  - Disc 2
  - Disk3
  - Disk 4
```
* Improved theme color extraction
* Improved video player style
* Fixed some files not displaying

### 更新日志
* 可使用全部播放按钮多碟播放
```
- 文件夹样例，disc 和 disk 开头，不区分大小写
  - Disc1
  - Disc 2
  - Disk3
  - Disk 4
```
* 改进主题颜色提取
* 改进视频播放器样式
* 修复部分文件未显示


## v1.8.0
### Changelog
* Multi-select list support
* Improve the file search

### 更新日志
* 列表支持多选操作
* 改进文件搜索


## v1.7.4
### Changelog
* fix clear play queue on change  current account
* fix language display issue

### 更新日志
* 修复选择当前账户时清空播放队列的问题
* 修复语言显示的问题


## v1.7.3
### Changelog
* Supports multiple accounts

### 更新日志
* 支持多账户


## v1.7.2
### Changelog
* Add more menu options

### 更新日志
* 添加更多菜单选项


## v1.7.0
### Changelog
* add playback rate menu
* i18n migration to lingui

### 更新日志
* 添加播放速度菜单
* i18n 迁移到 lingui


## v1.6.4
### Changelog
* add volume control

### 更新日志
* 添加音量控制


## v1.6.2
###  Changelog

- Fix playlist display bug

###  更新日志
- 修复播放列表显示问题


## v1.6.1
### Changelog
- Fix float action button display bug

### 更新日志
- 修复浮动按钮显示问题


## v1.6.0
### Changelog
- Ability to search in the current file list 
- Improved storage size of the local metadata cache (recommend clearing the local metadata cache once)

### 更新日志
- 能够在当前文件列表搜索
- 优化本地元数据缓存的存储占用（建议清除一次本地元数据缓存）


## v1.5.4
### Changelog

- Improvement of audio playback interface opening animation

### 更新日志

- 改进音频播放界面打开时的动画


## v1.5.2
### Changelog

- Improved user experience
- Fix known bugs

### 更新日志

- 改进用户体验
- 修复已知 bug


## v1.5.1
###   Changelog
- Now you don't need to log in to get to the main screen
- Improved theme color extraction

###   更新日志

- 现在无需登录即可进入主界面
- 改进主题色提取


## v1.5.0
### Changelog

- New UI interface
- Possibility to generate theme colors using album cover
- @MakinoharaShoko has provided a new icon

### 更新日志

- 新的 UI 界面
- 可以从专辑封面生成主题色
- @MakinoharaShoko 提供了新的图标


## v1.4.2
### Features

- Add multi-column lists and grids to files
- Add HD Thumbnails option
- Image Viewer Improvements


### 特性

- 文件添加多列列表和网格
- 添加高清缩略图选项
- 改进图像查看器


## v1.4.1
### Improved

- Improved list performance

### 改进

- 改进了列表的性能


## v1.4.0
### Features

- Support for viewing images
- Add thumbnails to file list
- Add sorting to file list

### 特性

- 支持查看图片
- 文件列表添加缩略图
- 文件列表添加排序


## v1.3.1
### Fix

- Accidental playback after clicking on another file while paused

---

### 修复

- 暂停时点击其他文件后意外播放


## v1.3.0
### Features

- Ability to hide the title bar on the desktop
- Add local metadata cache
- Improved display of audio playback interface, playlists and play queues

---

### 特性
- 桌面端可隐藏标题栏
- 添加本地元数据缓存
- 改进音频播放界面、播放列表和播放队列的显示


## v1.2.0
### ⚠ Change

- Migration to webpack
- Changed client ID

#### How to retrieve previous data

This update has changed the client ID, you need to re-authorize, if you are a user of the old version, it will create new data in the new folder.
First close OMP, then open ``Applications`` folder in OneDrive, find ``OMP 1`` folder, delete all files in it, then find ``OMP`` folder, move all files in it to ``OMP 1`` folder, delete ``OMP`` folder, and lastly rename ``OMP 1`` folder to ``OMP``.

---

### ⚠ 变更

- 迁移到 webpack
- 更改了客户端 ID

#### 如何找回之前的数据

本次更新更换了客户端 ID，需重新授权，如果是旧版本用户使用时会在新文件夹中创建新数据。
首先关闭 OMP，然后打开 OneDrive 中的  `应用` 文件夹，找到 `OMP 1` 文件夹，删除里面的全部文件，然后找到 `OMP` 文件夹，将里面的全部文件移动到 `OMP 1` 文件夹，删除 `OMP` 文件夹，最后将 `OMP 1` 文件夹重命名为 `OMP`。


## v1.1.0
### Change

* Move account logout to settings page

### 变更

* 账户注销移动到设置页


## v1.0.0
### Features

- OneDrive Files View
-  Music Playback
-  Music Metadata
-  Video Playback
-  Play Queue
-  Dark Mode
-  Media Session
-  PWA
-  History Sync
-  Playlists Sync

---

### 特性

- OneDrive 文件查看
-  音乐播放
-  音乐元数据
-  视频播放
-  播放队列
-  黑暗模式
-  Media Session
-  PWA
-  播放历史同步
-  播放列表同步