# 学术页面
**学术页面是一个基于GitHub Pages的模板，适用于个人和专业作品集导向的网站。**

![学术页面模板示例](images/homepage.png "学术页面模板示例")

# 入门指南

1. 如果没有GitHub账户，请先注册并确认电子邮件（必需！）
1. 点击右上角的"使用此模板"按钮。
1. 在"新建仓库"页面，将仓库名称设置为"[你的GitHub用户名].github.io"，这将是你的网站URL。
1. 进行全站配置并添加你的内容。
1. 将任何文件（如PDF、.zip文件等）上传到`files/`目录。它们将出现在https://[你的GitHub用户名].github.io/files/example.pdf。
1. 在仓库设置的"GitHub Pages"部分查看状态。
1. （可选）使用`markdown_generator`文件夹中的Jupyter notebooks或python脚本从TSV文件生成出版物和演讲的markdown文件。

更多信息请访问 https://academicpages.github.io/

## 本地运行

在最初开发网站时，能够在推送到GitHub之前在本地预览更改非常有用。要在本地工作，你需要：

1. 克隆仓库并按照上述步骤进行更新。
1. 确保已安装ruby-dev、bundler和nodejs
    
    在大多数Linux发行版和[Windows子系统Linux](https://learn.microsoft.com/zh-cn/windows/wsl/about)上，命令是：
    ```bash
    sudo apt install ruby-dev ruby-bundler nodejs
    ```
    如果看到错误`无法定位包ruby-bundler`、`无法定位包nodejs`，请运行以下命令：
    ```bash
    sudo apt update && sudo apt upgrade -y
    ```
    然后再次尝试运行`sudo apt install ruby-dev ruby-bundler nodejs`。

    在MacOS上的命令是：
    ```bash
    brew install ruby
    brew install node
    gem install bundler
    ```
1. 运行`bundle install`安装ruby依赖项。如果遇到错误，删除Gemfile.lock并重试。

    如果看到文件权限错误，如`Fetching bundler-2.6.3.gem ERROR:  While executing gem (Gem::FilePermissionError) You don't have write permissions for the /var/lib/gems/3.2.0 directory.`或`Bundler::PermissionError: There was an error while trying to write to /usr/local/bin.`
    本地安装Gems（推荐）：
    ```bash
    bundle config set --local path 'vendor/bundle'
    ```
    然后再次尝试运行`bundle install`。如果成功，你应该会看到一个名为`vendor`的文件夹，打开`.gitignore`并将`vendor`添加进去。

1. 运行`jekyll serve -l -H localhost`生成HTML并从`localhost:4000`提供服务，本地服务器会在更改时自动重建并刷新页面。
    你也可以尝试`bundle exec jekyll serve -l -H localhost`，以确保jekyll使用你本地机器上的特定依赖项。

如果你在Linux上运行，可能需要先安装一些额外的依赖项才能本地运行：`sudo apt install build-essential gcc make`

## 使用Docker

在不同的操作系统上工作，或者只是想避免安装依赖项？如果你已经安装了[Docker](https://www.docker.com/)，你可以使用提供的`Dockerfile`构建一个容器来为你运行网站。

你可以通过在仓库中运行以下命令来构建和执行容器：

```bash
docker compose up
```

现在你应该能够从`localhost:4000`访问网站了。

# 维护

模板的错误报告和功能请求应[通过GitHub提交](https://github.com/academicpages/academicpages.github.io/issues/new/choose)。关于如何设置模板样式的问题，请随时在GitHub上[发起新讨论](https://github.com/academicpages/academicpages.github.io/discussions)。

该仓库由[Stuart Geiger](https://github.com/staeiou)从[Minimal Mistakes Jekyll主题](https://mmistakes.github.io/minimal-mistakes/)fork（然后分离），该主题© 2016 Michael Rose，并在MIT许可证下发布（见LICENSE.md）。目前由[Robert Zupko](https://github.com/rjzupkoii)维护，欢迎更多维护者加入。

## 错误修复和增强

如果你有想要作为pull request提交的错误修复和增强，你需要[fork](https://docs.github.com/zh-cn/pull-requests/collaborating-with-pull-requests/working-with-forks/fork-a-repo)该仓库，而不是将其作为模板使用。这也允许你将模板的副本[同步](https://docs.github.com/zh-cn/pull-requests/collaborating-with-pull-requests/working-with-forks/syncing-a-fork)到你的fork。

不幸的是，像学术页面这样的模板主题存在一个后勤问题，这使得获取核心主题的错误修复和更新变得有点棘手。如果你使用此模板并自定义它，在尝试同步时可能会遇到合并冲突。如果你想保存你的各种.yml配置文件和markdown文件，你可以删除仓库并重新fork。或者你可以手动打补丁。

1

---
<div align="center">
    
![pages-build-deployment](https://github.com/academicpages/academicpages.github.io/actions/workflows/pages/pages-build-deployment/badge.svg)
[![GitHub contributors](https://img.shields.io/github/contributors/academicpages/academicpages.github.io.svg)](https://github.com/academicpages/academicpages.github.io/graphs/contributors)
[![GitHub release](https://img.shields.io/github/v/release/academicpages/academicpages.github.io)](https://github.com/academicpages/academicpages.github.io/releases/latest)
[![GitHub license](https://img.shields.io/github/license/academicpages/academicpages.github.io?color=blue)](https://github.com/academicpages/academicpages.github.io/blob/master/LICENSE)

[![GitHub stars](https://img.shields.io/github/stars/academicpages/academicpages.github.io)](https://github.com/academicpages/academicpages.github.io)
[![GitHub forks](https://img.shields.io/github/forks/academicpages/academicpages.github.io)](https://github.com/academicpages/academicpages.github.io/fork)
</div>
