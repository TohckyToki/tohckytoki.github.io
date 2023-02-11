---
title: 使用asp.net开发调试中浏览器提示不安全的https连接
date: 2023-02-10
author: YuengFu
category:
  - Blog
tag:
  - dotnet
  - https
---

## 问题原因

开发证书未安装或者失效

## 解决方法

在控制终端运行下面命令

```shell
dotnet dev-certs https --clean
dotnet dev-certs https --trust
```
