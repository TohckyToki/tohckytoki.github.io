---
title: 使用GtiHub Pages搭建个人博客
date: 2019-11-27
author: YuengFu
category:
  - Blog
tag:
  - VuePress
  - Github Pages
---
## 写在前面
首先，本文是在通过其他博客的文章进行搭建实践，过程中总结出来的经验。

[这篇文章](https://fyz1994.github.io/notes/tool/tools/Vuepress%20%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2%E5%85%A8%E6%94%BB%E7%95%A5.html)就是参考过的教程，在此表示对写作这篇教程作者的感谢。

## 写作理由
通过Github pages功能搭建个人博客的教程有很多，但是我看了好多教程，基本都是告诉读者怎么搭建，搭建原理什么的都没有写，也可能是有这种教程但是我没有发现。

但是不管怎么说，对于一个想要知道为什么的人来说，我认为我还是应该写一篇教程的。

## 本文适合的读者

有一定编程经验，不满足于只是搭建起来博客，想要更好的运用Github Pages的人。

本文在[后续部分](#完全操作流程)提供单纯的搭建流程，适合不想了解原理，只想快速搭建博客的读者。

## 关于Github pages

使用Github pages搭建起来的网站域名有以下两种
- Github用户名.github.io (以下称作个人主页)
- Github用户名.github.io/仓库名 (以下称作仓库页)

对于第一种个人主页，用户需要在自己的仓库里新建一个名为**Github用户名.github.io**的仓库，或者把其他仓库改名成上述的名字

这样网站就已经建好一半了，剩下的就是把一个以index.html页面为入口的网站传到仓库的master分支(branch)里，网站就可以正常浏览了。

在这里需要注意两点
1. 即使成功提交，网站可能也不会实时刷新，需要等待一段时间，或是多提交几次代码，再等待。这里可以直接提交空白，具体命令为
```sh
git commit --allow-empty -m 提交时的注释
git push
```
2. 关于branch，看过一些其他人的文章，可能在以前个人主页的branch还没有被锁定为master，但是在我开始使用的时候，个人主页的branch已经必须是master了，这一点在我刚开始搭建的时候把我困住了好久。

对于第二种仓库页，可以对任何现有仓库进行使用，要求只有一点，在名为gh-pages的branch里上传想要在网站上显示的内容，入口同样是index.html

基本上，明白上面这一点之后，一般程序员朋友应该就已经可以搭建出自己的博客了。

## 关于静态页面生成

Github Pages默认使用的是一种叫做Jekyll的生成器，[这里](https://jekyllrb.com/)是Jekyll的官网，由于我使用的是VuePress，对于这种生成器不是很熟，所以如果对这种生成器感兴趣的读者可以自行查看官网进行尝试。

如果不使用官方默认的Jekyll生成器，需要在仓库的根目录放置一个名为.nojekyll的文件，文件内容可以为空。

其他生成器的话，这里推荐[VuePress](https://vuepress.vuejs.org/zh/)或者[Hexo](https://hexo.io/zh-cn/),具体操作可以查看官方说明，需要注意最后上传到Github上的必须是编译后的html文件。

## 关于branch
针对一般的仓库页来说，可以使用[gh-pages](https://www.npmjs.com/package/gh-pages)这个工具直接进行提交，而对于个人主页来说，则只需要默认提交就可以了。

## 关于自动编译提交
如果只是手动管理的话，基本就是每次写完了文章，然后使用生成器生成，再把生成后的html文件上传到Github。中间要是想要同时管理源代码，还需要把源代码重新上传一次Github。

那么怎么能做到把源代码上传到Github之后，让Github自动编译源码，再重新把编译后的文件自动上传到Github呢？

这里就要使用到Github附带的Action功能了，由于Action功能现在只免费提供给公开的仓库，所以以下方法对于私有仓库不试用。

如果是一般的仓库页，请参照[这里](https://fyz1994.github.io/notes/tool/tools/Vuepress%20%E6%90%AD%E5%BB%BA%E5%8D%9A%E5%AE%A2%E5%85%A8%E6%94%BB%E7%95%A5.html#github-actions-%E8%87%AA%E5%8A%A8%E6%9E%84%E5%BB%BA-%E9%83%A8%E7%BD%B2)的教程。

针对个人主页来说，由于master branch已经被用来显示界面了，所以如果想要同时管理源代码的话就需要重新新建branch。

这里以我自己的博客为例，我是新建了一个名为src的branch用来存放源码。并且将src设置为了默认的branch（这一点很重要，新建Action脚本默认是存放在默认branch下面的）。

脚本内容如下
``` sh
name: Node CI

on:
  push:
    branches: 
      - src
    paths: 
      - 'docs/**'

jobs:
  build:

    runs-on: ubuntu-latest

    steps:
    - uses: actions/checkout@master
    - run: npm ci
    - run: npm run build
    - name: Change to master
      run: 
        git add -- docs/.vuepress/dist/* &&
        git stash push  &&
        git fetch &&
        git checkout master
    - name: Delete All
      run: 
        Get-ChildItem -Path "./" -Recurse -Directory |
        ForEach-Object -Process {
          Remove-Item -Path $_.FullName -Recurse -Force
        };
        Get-ChildItem -Path "./" -Recurse -File |
        ForEach-Object -Process {
          Remove-Item -Path $_.FullName -Force
        };
      shell: pwsh
    - name: Restore nojekyll
      run: 
        git checkout -q -- .nojekyll  &&
        git stash pop
    - name: Correct directory
      run: 
        Get-ChildItem -Path "docs/.vuepress/dist" -Recurse -Directory |
        ForEach-Object -Process {
          $Path = ("./" + [regex]::Replace($_.FullName, "^.*dist/", ""))
          if(!(Test-Path $Path)) {
            New-Item -Path $Path -ItemType Directory -Force
          }
        };
        Get-ChildItem -Path "docs/.vuepress/dist" -Recurse -File |
        ForEach-Object -Process {
          Move-Item $_.FullName  ("./" + [regex]::Replace($_.FullName, "^.*dist/", "")) -Force 
        };
        Remove-Item -Path "docs" -Recurse -Force;
      shell: pwsh
    - name: Config & Commit
      run:
        git config --local user.email "action@github.com" &&
        git config --local user.name "GitHub Action" &&
        git add -- ./ &&
        git commit -m Updated &&
        git pull
    - name: Push changes
      uses: ad-m/github-push-action@master
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
```
这个脚本从上到下大概的意思就是，让Action监视我的src branch上的docs下的所有文件，在这个目录下一旦有文件更新便调用这个Action。

runs-on代表的是操作要在什么系统执行，steps里是具体执行的命令。

npm ci这个命令是安装package.json这个文件里的依赖包，这里我的项目中主要依赖了vuepress。

npm run build这个命令是执行package.json里的名为build的操作，这里附上我的package.json文件
``` json
{
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  },
  "devDependencies": {
    "vuepress": "^1.2.0"
  }
}

```
接下来一直到Config & Commit为止的操作基本都是把编译后src branch的文件夹移动到master branch里。

再然后的操作就是提交代码到master branch里，这里使用了官方提供的github-push-action。具体使用方法可以参考[这里](https://github.com/ad-m/github-push-action)

另外，如果想要编写其他Action，请参照Github提供的[官方文档](https://help.github.com/cn/actions/automating-your-workflow-with-github-actions/about-github-actions)。

如果只是单纯使用跟我一样的Workflow脚本，应该可以做到向src branch提交源代码，Github自动把编译后的文件上传到master branch里。

## 完全操作流程
### Windows
1. 首先对于完全没有使用过Github的读者，需要先在Github上进行[注册](https://github.com/join?source=header-home)
2. 注册登录后，[新建仓库](https://github.com/new),命名为**用户名.github.io**，选择public仓库，完成新建。
3. 安装[Node.js](https://nodejs.org/zh-cn/)
4. 安装[Git](https://git-scm.com/)
5. 在合适的地方新建一个文件夹，路径不要有中文
6. 打开开始菜单，拉动到Windows Powershell，打开
7. 复制以下代码，把其中需要修改的用户名和邮箱密码更改完之后，粘贴到Powershell里，执行
``` sh
cd 新建的文件夹路径;
git config --global user.name "用户名";
git config --global user.email "注册Github用的邮箱";
git clone https://github.com/用户名/用户名.github.io.git;
cd 用户名.github.io;
git commit --allow-empty -m init;
git push https://用户名:密码@github.com/用户名/用户名.github.io.git;
git checkout -b src;
git commit --allow-empty -m init;
git push https://用户名:密码@github.com/用户名/用户名.github.io.git;

npm config set registry https://registry.npm.taobao.org;
'{
  "scripts": {
    "dev": "vuepress dev docs",
    "build": "vuepress build docs"
  }
}' |  Out-File -Encoding "ascii" package.json;

npm i vuepress --dev;
mkdir docs;
"node_modules" | Out-File -Encoding "ascii" .gitignore;
"# Hello VuePress!" | Out-File -Encoding "UTF8" docs/README.md;
git add -- ./;
git commit -m init;
git push https://用户名:密码@github.com/用户名/用户名.github.io.git;

npm run build;
git add -- docs/.vuepress/dist/*;
git stash push;
git checkout master;

Get-ChildItem -Path "./" -Recurse -Directory |
ForEach-Object -Process {
  Remove-Item -Path $_.FullName -Recurse -Force
};
Get-ChildItem -Path "./" -Recurse -File |
ForEach-Object -Process {
  Remove-Item -Path $_.FullName -Force
};

"node_modules" | Out-File -Encoding "ascii" .gitignore;
"" | Out-File -Encoding "ascii" .nojekyll;
git stash pop;

Get-ChildItem -Path "docs/.vuepress/dist" -Recurse -Directory |
ForEach-Object -Process {
  $Path = (".\\" + [regex]::Replace($_.FullName, "^.*dist\\", ""))
  if(!(Test-Path $Path)) {
    New-Item -Path $Path -ItemType Directory -Force
  }
};
Get-ChildItem -Path "docs/.vuepress/dist" -Recurse -File |
ForEach-Object -Process {
  Move-Item $_.FullName  (".\\" + [regex]::Replace($_.FullName, "^.*dist\\", "")) -Force 
};
Remove-Item -Path "docs" -Recurse -Force;

git add -- ./;
git commit -m Updated;
git push https://用户名:密码@github.com/用户名/用户名.github.io.git;
```
8. 以上全部执行完毕，打开**用户名.github.io**应该就能看到个人博客了。
9. 如果想要详细配置博客，可以查看[这个网站](https://vuepress.vuejs.org/zh/theme/default-theme-config.html)
10. 向Github上传代码网上搜索Github客户端进行使用
11. 想要以后不用每次都手动编译文章生成网页，请参考[这里](#关于自动编译提交)